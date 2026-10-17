/**
 * MOCK BACKEND — runs entirely in the browser (localStorage + in-memory pub/sub).
 *
 * Every function is async and mirrors what a real backend call looks like, so
 * swapping in Firebase later means replacing the bodies here — not the callers.
 * See FIREBASE.md for the exact mapping (Auth, Firestore, custom reset handler).
 */
import type { Account, Booking, Inquiry, Message, Role, Thread } from "./types";

type Creds = { password?: string; pin?: string };
type Reset = { email: string; expires: number };

type DB = {
  accounts: Account[];
  creds: Record<string, Creds>;
  bookings: Booking[];
  inquiries: Inquiry[];
  messages: Message[];
  resets: Record<string, Reset>;
  sessionId: string | null;
};

const KEY = "codecraft:v1";

/** DEMO owner credentials — replace with a real Firebase account before launch. */
export const DEMO_OWNER = { email: "hello@codecraftsolutions.com", password: "owner1234" };

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
const now = () => Date.now();
const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
function emptyDB(): DB {
  return {
    accounts: [],
    creds: {},
    bookings: [],
    inquiries: [],
    messages: [],
    resets: {},
    sessionId: null,
  };
}

function load(): DB {
  if (typeof window === "undefined") return emptyDB();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed(emptyDB());
    return JSON.parse(raw) as DB;
  } catch {
    return emptyDB();
  }
}

function save(db: DB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(db));
}

/** Seed a demo owner, one demo client and a short conversation so the app is
 *  immediately explorable. Safe to remove once real data exists. */
function seed(db: DB): DB {
  const ownerId = uid();
  db.accounts.push({
    id: ownerId,
    name: "Sasen",
    email: DEMO_OWNER.email,
    role: "owner",
    source: "granted",
    createdAt: now(),
  });
  db.creds[ownerId] = { password: DEMO_OWNER.password };

  const clientId = uid();
  db.accounts.push({
    id: clientId,
    name: "Demo Client",
    email: "demo@client.com",
    role: "client",
    source: "granted",
    createdAt: now(),
  });
  db.creds[clientId] = { pin: "2468" };
  db.messages.push(
    {
      id: uid(),
      threadId: clientId,
      from: "client",
      text: "Hi Sasen — excited to get started on the new app.",
      createdAt: now() - 1000 * 60 * 60,
    },
    {
      id: uid(),
      threadId: clientId,
      from: "owner",
      text: "Likewise! I've blocked out time this week. I'll share a first foundation build soon.",
      createdAt: now() - 1000 * 60 * 58,
    },
  );

  save(db);
  return db;
}

// ---------------------------------------------------------------------------
// Pub/sub
// ---------------------------------------------------------------------------
type Listener = () => void;
const authListeners = new Set<Listener>();
const messageListeners = new Set<Listener>();
function emit(set: Set<Listener>) {
  set.forEach((l) => l());
}

function publicAccount(a: Account): Account {
  return { ...a };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function getCurrentAccount(): Promise<Account | null> {
  const db = load();
  if (!db.sessionId) return null;
  const acc = db.accounts.find((a) => a.id === db.sessionId);
  return acc ? publicAccount(acc) : null;
}

export function onAuthChange(cb: Listener): () => void {
  authListeners.add(cb);
  return () => authListeners.delete(cb);
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<Account> {
  await delay();
  const db = load();
  const email = input.email.trim().toLowerCase();
  if (db.accounts.some((a) => a.email.toLowerCase() === email)) {
    throw new Error("An account with that email already exists. Try logging in instead.");
  }
  const account: Account = {
    id: uid(),
    name: input.name.trim(),
    email,
    role: "client",
    source: "booking",
    createdAt: now(),
  };
  db.accounts.push(account);
  db.creds[account.id] = { password: input.password };
  db.sessionId = account.id;
  save(db);
  emit(authListeners);
  return publicAccount(account);
}

export async function signIn(input: { email: string; password: string }): Promise<Account> {
  await delay();
  const db = load();
  const email = input.email.trim().toLowerCase();
  const acc = db.accounts.find((a) => a.email.toLowerCase() === email);
  if (!acc || db.creds[acc.id]?.password !== input.password) {
    throw new Error("Email or password is incorrect.");
  }
  db.sessionId = acc.id;
  save(db);
  emit(authListeners);
  return publicAccount(acc);
}

/** Email + name + PIN — for clients you granted access to manually. */
export async function signInWithPin(input: {
  email: string;
  name: string;
  pin: string;
}): Promise<Account> {
  await delay();
  const db = load();
  const email = input.email.trim().toLowerCase();
  const acc = db.accounts.find(
    (a) => a.email.toLowerCase() === email && a.source === "granted" && a.role === "client",
  );
  if (!acc) throw new Error("No access found for that email. Ask Sasen to add you.");
  if (norm(acc.name) !== norm(input.name)) throw new Error("That name doesn't match our records.");
  if (db.creds[acc.id]?.pin !== input.pin.trim()) throw new Error("That PIN is incorrect.");
  db.sessionId = acc.id;
  save(db);
  emit(authListeners);
  return publicAccount(acc);
}

export async function signOut(): Promise<void> {
  const db = load();
  db.sessionId = null;
  save(db);
  emit(authListeners);
}

// ---------------------------------------------------------------------------
// Password reset — mirrors Firebase's oobCode flow so the custom /auth/action
// page works the same once wired. Here we return the code so it's testable.
// ---------------------------------------------------------------------------
export async function requestPasswordReset(emailInput: string): Promise<{ code: string | null }> {
  await delay();
  const db = load();
  const email = emailInput.trim().toLowerCase();
  const acc = db.accounts.find((a) => a.email.toLowerCase() === email && db.creds[a.id]?.password);
  // Always resolve (don't reveal whether an email exists), but only mint a code
  // for real password accounts.
  if (!acc) return { code: null };
  const code = uid().slice(0, 8);
  db.resets[code] = { email, expires: now() + 1000 * 60 * 30 };
  save(db);
  return { code };
}

export async function verifyResetCode(code: string): Promise<string> {
  await delay(120);
  const db = load();
  const r = db.resets[code];
  if (!r || r.expires < now()) throw new Error("This reset link is invalid or has expired.");
  return r.email;
}

export async function confirmPasswordReset(code: string, newPassword: string): Promise<void> {
  await delay();
  const db = load();
  const r = db.resets[code];
  if (!r || r.expires < now()) throw new Error("This reset link is invalid or has expired.");
  const acc = db.accounts.find((a) => a.email.toLowerCase() === r.email);
  if (!acc) throw new Error("Account not found.");
  db.creds[acc.id] = { ...db.creds[acc.id], password: newPassword };
  delete db.resets[code];
  save(db);
}

// ---------------------------------------------------------------------------
// Bookings + inquiries
// ---------------------------------------------------------------------------
export async function createBooking(input: {
  name: string;
  email: string;
  password: string;
  service: string;
  budget: string;
  message: string;
}): Promise<Account> {
  const account = await signUp({
    name: input.name,
    email: input.email,
    password: input.password,
  });
  const db = load();
  db.bookings.push({
    id: uid(),
    accountId: account.id,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    service: input.service,
    budget: input.budget,
    message: input.message,
    status: "new",
    createdAt: now(),
  });
  save(db);
  return account;
}

export async function listBookings(): Promise<Booking[]> {
  const db = load();
  return [...db.bookings].sort((a, b) => b.createdAt - a.createdAt);
}

export async function createInquiry(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await delay();
  const db = load();
  db.inquiries.push({
    id: uid(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
    createdAt: now(),
  });
  save(db);
}

export async function listInquiries(): Promise<Inquiry[]> {
  const db = load();
  return [...db.inquiries].sort((a, b) => b.createdAt - a.createdAt);
}

// ---------------------------------------------------------------------------
// Clients (owner)
// ---------------------------------------------------------------------------
export async function listClients(): Promise<Account[]> {
  const db = load();
  return db.accounts
    .filter((a) => a.role === "client")
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(publicAccount);
}

export async function grantClient(input: {
  name: string;
  email: string;
  pin: string;
}): Promise<Account> {
  await delay();
  const db = load();
  const email = input.email.trim().toLowerCase();
  if (db.accounts.some((a) => a.email.toLowerCase() === email)) {
    throw new Error("An account with that email already exists.");
  }
  const account: Account = {
    id: uid(),
    name: input.name.trim(),
    email,
    role: "client",
    source: "granted",
    createdAt: now(),
  };
  db.accounts.push(account);
  db.creds[account.id] = { pin: input.pin.trim() };
  save(db);
  return publicAccount(account);
}

export async function updateClientPin(accountId: string, pin: string): Promise<void> {
  await delay(150);
  const db = load();
  db.creds[accountId] = { ...db.creds[accountId], pin: pin.trim() };
  save(db);
}

export async function revokeClient(accountId: string): Promise<void> {
  await delay(150);
  const db = load();
  db.accounts = db.accounts.filter((a) => a.id !== accountId);
  delete db.creds[accountId];
  db.messages = db.messages.filter((m) => m.threadId !== accountId);
  db.bookings = db.bookings.filter((b) => b.accountId !== accountId);
  if (db.sessionId === accountId) db.sessionId = null;
  save(db);
  emit(messageListeners);
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export async function getMessages(threadId: string): Promise<Message[]> {
  const db = load();
  return db.messages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function sendMessage(threadId: string, from: Role, text: string): Promise<Message> {
  const db = load();
  const message: Message = {
    id: uid(),
    threadId,
    from,
    text: text.trim(),
    createdAt: now(),
  };
  db.messages.push(message);
  save(db);
  emit(messageListeners);
  return message;
}

export function onMessages(cb: Listener): () => void {
  messageListeners.add(cb);
  return () => messageListeners.delete(cb);
}

export async function listThreads(): Promise<Thread[]> {
  const db = load();
  const clients = db.accounts.filter((a) => a.role === "client");
  return clients
    .map((client) => {
      const msgs = db.messages
        .filter((m) => m.threadId === client.id)
        .sort((a, b) => a.createdAt - b.createdAt);
      return { client: publicAccount(client), lastMessage: msgs.at(-1), unread: 0 };
    })
    .sort((a, b) => (b.lastMessage?.createdAt ?? 0) - (a.lastMessage?.createdAt ?? 0));
}
