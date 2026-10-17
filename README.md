# Codecraft Solutions

The official site + client web app for Codecraft Solutions — _We code. We build. We deliver._

A polished marketing site **and** a private client area: bookings, a real-time chat
between you and each client, and an owner panel to manage it all. Built backend-agnostic
so you can connect Firebase whenever you like (see **[FIREBASE.md](./FIREBASE.md)**).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000  (the preview here runs on :3210)
```

It works fully offline — the backend is mocked in the browser, so you can click the whole
flow (book → chat → owner panel) with no account or keys.

### Demo logins

| Role          | How                                                          |
| ------------- | ----------------------------------------------------------- |
| Owner         | `hello@codecraftsolutions.com` / `owner1234` (Password tab) |
| Client (PIN)  | `demo@client.com` / `Demo Client` / `2468` (Access PIN tab) |

## Stack

- **Next.js 16** (App Router, React 19) · **Tailwind v4** · **lucide-react** icons
- Dark, blue→purple brand theme — all tokens in `src/app/globals.css`
- Mock backend (`src/lib/data/backend.ts`) mirroring a real one → swap to Firebase later

## Structure

```
src/
  app/
    (marketing)/        Public site (home: hero, services, process, work, about, contact)
    (app)/              login · book · client (chat) · owner (panel) · auth/action (reset)
  components/
    ui/                 Design system (Icon, Button, Logo, Field, Section, …)
    layout/             SiteNav, SiteFooter
    sections/           Home page sections
    app/                AppHeader, Chat, RequireRole
  lib/
    site.ts             All brand copy + content (single source of truth)
    data/               types, mock backend, auth context
public/brand/           Original logo assets (cropped, never recreated)
```

## Before launch — your to-dos

1. **Domain + email** — update `domain` and `email` in `src/lib/site.ts` (used everywhere).
2. **Portfolio** — replace the placeholder projects in `site.ts` with real case studies
   + screenshots (the Work cards are built to take a project image).
3. **Social links** — real URLs in `site.ts`.
4. **Connect Firebase** — follow `FIREBASE.md`, then remove the demo scaffolding.

## Brand assets

The logo is **never recreated** — only the original PNG is used (cropped to a transparent
mark + lockup via `scripts/`). Source originals live in your iCloud `Codecraft` folder.
