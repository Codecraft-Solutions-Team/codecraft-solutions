"use client";

import { useEffect, useState } from "react";
import {
  Inbox as InboxIcon,
  Users,
  CalendarCheck,
  MailOpen,
  Plus,
  Trash2,
  KeyRound,
} from "lucide-react";
import type { Account, Booking, Inquiry, Thread } from "@/lib/data/types";
import {
  listThreads,
  listClients,
  listBookings,
  listInquiries,
  grantClient,
  revokeClient,
  updateClientPin,
  onMessages,
} from "@/lib/data/backend";
import { useAuth } from "@/lib/data/auth";
import { RequireRole } from "@/components/app/RequireRole";
import { Container } from "@/components/ui/Container";
import { Chat } from "@/components/app/Chat";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Tab = "inbox" | "clients" | "bookings" | "inquiries";

const tabs: { id: Tab; label: string; icon: typeof InboxIcon }[] = [
  { id: "inbox", label: "Inbox", icon: InboxIcon },
  { id: "clients", label: "Clients", icon: Users },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "inquiries", label: "Inquiries", icon: MailOpen },
];

export default function OwnerPage() {
  return (
    <RequireRole role="owner">
      <OwnerPanel />
    </RequireRole>
  );
}

function OwnerPanel() {
  const [tab, setTab] = useState<Tab>("inbox");
  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-1.5">
        <span className="eyebrow">Owner panel</span>
        <h1 className="text-3xl font-semibold">Your control room</h1>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors",
              tab === t.id
                ? "bg-[var(--brand-gradient)] text-white ring-transparent"
                : "bg-surface text-muted ring-line-strong hover:text-fg",
            )}
          >
            <Icon icon={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === "inbox" && <InboxView />}
        {tab === "clients" && <ClientsView />}
        {tab === "bookings" && <BookingsView />}
        {tab === "inquiries" && <InquiriesView />}
      </div>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */
/* Inbox                                                                       */
/* -------------------------------------------------------------------------- */
function InboxView() {
  const { account } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () =>
      listThreads().then((t) => {
        if (!active) return;
        setThreads(t);
        setActiveId((cur) => cur ?? t[0]?.client.id ?? null);
      });
    refresh();
    const unsub = onMessages(refresh);
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const activeThread = threads.find((t) => t.client.id === activeId) ?? null;

  if (threads.length === 0) {
    return <EmptyCard icon={InboxIcon} title="No conversations yet" body="Client chats appear here once someone books or you add them." />;
  }

  return (
    <div className="grid gap-5 md:grid-cols-[300px_1fr]">
      <div className="surface flex max-h-[64vh] flex-col overflow-y-auto p-2">
        {threads.map((t) => (
          <button
            key={t.client.id}
            onClick={() => setActiveId(t.client.id)}
            className={cn(
              "flex flex-col gap-1 rounded-xl px-3.5 py-3 text-left transition-colors",
              activeId === t.client.id ? "bg-surface-2 ring-1 ring-line-strong" : "hover:bg-surface-2/60",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{t.client.name}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-wide", t.client.source === "booking" ? "bg-brand-blue/15 text-brand-blue" : "bg-brand-violet/15 text-brand-violet")}>
                {t.client.source}
              </span>
            </div>
            <span className="truncate text-xs text-muted">
              {t.lastMessage ? `${t.lastMessage.from === "owner" ? "You: " : ""}${t.lastMessage.text}` : "No messages yet"}
            </span>
          </button>
        ))}
      </div>

      <div className="surface flex h-[64vh] flex-col p-5">
        {activeThread && account ? (
          <>
            <div className="mb-3 border-b border-line pb-3">
              <p className="font-medium">{activeThread.client.name}</p>
              <p className="text-xs text-muted">{activeThread.client.email}</p>
            </div>
            <Chat
              threadId={activeThread.client.id}
              role="owner"
              peerName={activeThread.client.name.split(" ")[0]}
            />
          </>
        ) : (
          <div className="grid h-full place-items-center text-sm text-faint">Select a conversation</div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Clients                                                                     */
/* -------------------------------------------------------------------------- */
function ClientsView() {
  const [clients, setClients] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => listClients().then(setClients);
  useEffect(() => {
    refresh();
  }, []);

  const onAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setError(null);
    setOk(null);
    setBusy(true);
    grantClient({
      name: String(f.get("name")),
      email: String(f.get("email")),
      pin: String(f.get("pin")),
    })
      .then((acc) => {
        setOk(`${acc.name} can now sign in with their email, name and PIN.`);
        form.reset();
        refresh();
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not add client."))
      .finally(() => setBusy(false));
  };

  const onRevoke = (id: string) => {
    revokeClient(id).then(refresh);
  };

  const onChangePin = (id: string) => {
    const pin = window.prompt("New PIN for this client?");
    if (pin && pin.trim()) updateClientPin(id, pin.trim());
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <div className="surface h-fit p-6">
        <h2 className="text-lg font-semibold">Add a client</h2>
        <p className="mt-1 text-sm text-muted">
          For people who didn&apos;t book here. Give them the PIN privately — they sign in with email,
          name and PIN.
        </p>
        {error && <div className="mt-4"><Alert tone="error">{error}</Alert></div>}
        {ok && <div className="mt-4"><Alert tone="success">{ok}</Alert></div>}
        <form onSubmit={onAdd} className="mt-5 flex flex-col gap-4">
          <Field label="Client name" htmlFor="c-name">
            <Input id="c-name" name="name" required placeholder="Jane Doe" />
          </Field>
          <Field label="Email" htmlFor="c-email">
            <Input id="c-email" name="email" type="email" required placeholder="jane@email.com" />
          </Field>
          <Field label="PIN" htmlFor="c-pin" hint="4+ characters. You'll share this with them.">
            <Input id="c-pin" name="pin" required placeholder="e.g. 4821" />
          </Field>
          <Button type="submit" disabled={busy} iconLeft={Plus}>
            {busy ? "Adding…" : "Add client"}
          </Button>
        </form>
      </div>

      <div className="surface p-2">
        {clients.length === 0 ? (
          <div className="grid h-40 place-items-center text-sm text-faint">No clients yet.</div>
        ) : (
          <ul className="divide-y divide-line">
            {clients.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-sm text-muted">{c.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("hidden rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-wide sm:inline", c.source === "booking" ? "bg-brand-blue/15 text-brand-blue" : "bg-brand-violet/15 text-brand-violet")}>
                    {c.source}
                  </span>
                  {c.source === "granted" && (
                    <button onClick={() => onChangePin(c.id)} aria-label="Change PIN" className="grid size-9 place-items-center rounded-lg text-muted ring-1 ring-line-strong hover:text-fg">
                      <Icon icon={KeyRound} size={16} />
                    </button>
                  )}
                  <button onClick={() => onRevoke(c.id)} aria-label="Revoke access" className="grid size-9 place-items-center rounded-lg text-muted ring-1 ring-line-strong hover:text-danger">
                    <Icon icon={Trash2} size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bookings + Inquiries                                                        */
/* -------------------------------------------------------------------------- */
function BookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    listBookings().then(setBookings);
  }, []);

  if (bookings.length === 0) {
    return <EmptyCard icon={CalendarCheck} title="No bookings yet" body="Projects booked through the site land here." />;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bookings.map((b) => (
        <article key={b.id} className="surface p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{b.name}</h3>
              <p className="text-sm text-muted">{b.email}</p>
            </div>
            <span className="rounded-full bg-brand-blue/15 px-3 py-1 text-xs text-brand-blue">{b.budget}</span>
          </div>
          <p className="mt-3 text-sm"><span className="text-faint">Service:</span> {b.service}</p>
          <p className="mt-3 rounded-lg bg-bg-soft p-3 text-sm leading-relaxed text-muted">{b.message}</p>
          <p className="mt-3 text-xs text-faint">{new Date(b.createdAt).toLocaleDateString()}</p>
        </article>
      ))}
    </div>
  );
}

function InquiriesView() {
  const [items, setItems] = useState<Inquiry[]>([]);
  useEffect(() => {
    listInquiries().then(setItems);
  }, []);

  if (items.length === 0) {
    return <EmptyCard icon={MailOpen} title="No messages yet" body="Contact-form messages from the site appear here." />;
  }
  return (
    <div className="flex flex-col gap-4">
      {items.map((i) => (
        <article key={i.id} className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">{i.name}</h3>
              <a href={`mailto:${i.email}`} className="text-sm text-brand-blue hover:text-brand-violet">{i.email}</a>
            </div>
            <p className="text-xs text-faint">{new Date(i.createdAt).toLocaleDateString()}</p>
          </div>
          <p className="mt-3 leading-relaxed text-muted">{i.message}</p>
        </article>
      ))}
    </div>
  );
}

function EmptyCard({ icon, title, body }: { icon: typeof InboxIcon; title: string; body: string }) {
  return (
    <div className="surface grid place-items-center px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-surface-2 text-brand-blue ring-1 ring-line-strong">
        <Icon icon={icon} size={22} />
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
    </div>
  );
}
