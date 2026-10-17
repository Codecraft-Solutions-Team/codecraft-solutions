# Connecting Firebase (when you're ready)

The whole app currently runs on a **mock backend** in `src/lib/data/backend.ts` — it
behaves like a real backend (async calls, auth, realtime chat) but stores everything
in the browser's `localStorage`. Nothing here needs Firebase to work or be demoed.

When you want it live, you only change **one file's bodies** (`backend.ts`) plus add a
small Firebase init file. Every page already calls through that interface, so no screens
get rewritten.

> Recommendation stands: **Firebase** fits this app well — its realtime database is
> exactly what the chat needs, and Auth + Firestore + Hosting live in one console.

---

## 1. Create the project

1. Go to <https://console.firebase.google.com> → **Add project**.
2. In the project, **Build → Authentication → Get started → Email/Password → Enable**.
3. **Build → Firestore Database → Create database** (start in production mode).
4. **Project settings → Your apps → Web (`</>`)** → register an app → copy the config.

## 2. Add the SDK + config

```bash
npm install firebase
```

Create `.env.local` (never commit it):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Create `src/lib/firebase.ts`:

```ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps()[0] ?? initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 3. Data model (Firestore)

| Mock concept            | Firestore                                                        |
| ----------------------- | --------------------------------------------------------------- |
| `accounts`              | Firebase Auth users + a `users/{uid}` doc (`name, role, source`) |
| `bookings`              | `bookings/{id}`                                                  |
| `inquiries`             | `inquiries/{id}`                                                 |
| `messages` (chat)       | `threads/{clientUid}/messages/{id}` (`from, text, createdAt`)    |

## 4. Swap the function bodies in `backend.ts`

The signatures stay identical — only the insides change. Examples:

```ts
// Sign in (booked clients + owner)
import { signInWithEmailAndPassword } from "firebase/auth";
await signInWithEmailAndPassword(auth, email, password);

// Booking → create account
import { createUserWithEmailAndPassword } from "firebase/auth";

// Realtime chat (replaces onMessages polling)
import { collection, onSnapshot, orderBy, query, addDoc } from "firebase/firestore";
onSnapshot(query(collection(db, `threads/${clientUid}/messages`), orderBy("createdAt")), cb);
```

**Owner role:** mark your own account by setting `role: "owner"` on its `users/{uid}`
doc (or a custom claim). `RequireRole` already gates on it.

**PIN clients (email + name + PIN):** create them with the **PIN as the password**
(`createUserWithEmailAndPassword(email, pin)`) and store `name` + `source: "granted"`
in their `users` doc. `signInWithPin` then signs in with email + PIN and checks the
name matches the doc (case/space-insensitive — already implemented).
*Tip:* so creating a client doesn't sign **you** out, do the create in a small Cloud
Function with the Admin SDK rather than client-side.

## 5. Custom reset URL — the part you asked for

The branded reset page already exists at **`/auth/action`**. To make Firebase's emails
point at it instead of the default Firebase page:

1. **Authentication → Templates → Password reset → pencil (edit) → Customize action URL**
   → set it to `https://yourdomain.com/auth/action`.
2. The email link then arrives as
   `https://yourdomain.com/auth/action?mode=resetPassword&oobCode=XXXX`.
   Our page already reads `mode` + `oobCode`, calls `verifyPasswordResetCode` /
   `confirmPasswordReset`, and shows your branded form.
3. While in Templates, also edit the **sender name, subject and body** so the email reads
   as Codecraft.

### Sending from *your* domain (optional, later)

- **Quick:** the step above already makes the link + page yours; emails still send via
  Firebase's mailer. Zero setup.
- **Fully branded sender** (`no-reply@codecraftsolutions.com`): **Authentication →
  Settings → SMTP settings**, plug in a provider (e.g. Resend / SendGrid), and add the
  **SPF + DKIM DNS records** they give you to your domain. That's the only DNS step.

## 6. Firestore security rules (starting point)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isOwner() {
      return request.auth != null &&
        get(/databases/$(db)/documents/users/$(request.auth.uid)).data.role == 'owner';
    }
    match /users/{uid} {
      allow read: if request.auth.uid == uid || isOwner();
      allow write: if isOwner();
    }
    match /threads/{clientUid}/messages/{id} {
      allow read, create: if request.auth.uid == clientUid || isOwner();
    }
    match /bookings/{id}   { allow create: if true; allow read: if isOwner(); }
    match /inquiries/{id}  { allow create: if true; allow read: if isOwner(); }
  }
}
```

## 7. Remove the demo scaffolding

- Delete the `seed()` block and `DEMO_OWNER` in `backend.ts`.
- Remove the "Demo logins" box in `src/app/(app)/login/page.tsx`.
