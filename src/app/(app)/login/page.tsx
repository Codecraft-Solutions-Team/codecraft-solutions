"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, ArrowRight } from "lucide-react";
import { signIn, signInWithPin, requestPasswordReset, DEMO_OWNER } from "@/lib/data/backend";
import type { Account } from "@/lib/data/types";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";

type Mode = "password" | "pin" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const go = (account: Account) => router.push(account.role === "owner" ? "/owner" : "/client");

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run(async () => {
      const acc = await signIn({
        email: String(f.get("email")),
        password: String(f.get("password")),
      });
      go(acc);
    });
  };

  const onPin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run(async () => {
      const acc = await signInWithPin({
        email: String(f.get("email")),
        name: String(f.get("name")),
        pin: String(f.get("pin")),
      });
      go(acc);
    });
  };

  const onForgot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run(async () => {
      const { code } = await requestPasswordReset(String(f.get("email")));
      // In production Firebase emails this link (pointing at our domain). For the
      // demo we surface it so the custom reset page is testable.
      setResetLink(code ? `/auth/action?mode=resetPassword&code=${code}` : null);
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-16 sm:py-24">
      <Logo variant="mark" height={40} />
      <h1 className="mt-6 text-3xl font-semibold">Client area</h1>
      <p className="mt-2 text-center text-muted">Sign in to message Sasen and track your project.</p>

      <div className="surface mt-8 w-full p-6 sm:p-8">
        {mode !== "forgot" && (
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-bg-soft p-1 ring-1 ring-line">
            <TabButton active={mode === "password"} onClick={() => setMode("password")} icon={Lock}>
              Password
            </TabButton>
            <TabButton active={mode === "pin"} onClick={() => setMode("pin")} icon={KeyRound}>
              Access PIN
            </TabButton>
          </div>
        )}

        {error && (
          <div className="mb-4">
            <Alert tone="error">{error}</Alert>
          </div>
        )}

        {mode === "password" && (
          <form onSubmit={onPassword} className="flex flex-col gap-4">
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input id="password" name="password" type="password" required placeholder="••••••••" autoComplete="current-password" />
            </Field>
            <button
              type="button"
              onClick={() => { setError(null); setResetLink(null); setMode("forgot"); }}
              className="-mt-1 w-fit text-sm text-brand-blue hover:text-brand-violet"
            >
              Forgot password?
            </button>
            <Button type="submit" disabled={loading} iconRight={loading ? undefined : ArrowRight}>
              {loading ? <Spinner size={18} /> : "Sign in"}
            </Button>
          </form>
        )}

        {mode === "pin" && (
          <form onSubmit={onPin} className="flex flex-col gap-4">
            <p className="text-sm text-muted">
              Didn&apos;t book through the site? Use the email, name and PIN Sasen gave you.
            </p>
            <Field label="Email" htmlFor="pin-email">
              <Input id="pin-email" name="email" type="email" required placeholder="you@email.com" />
            </Field>
            <Field label="Full name" htmlFor="pin-name" hint="Capitalisation and spacing don't matter.">
              <Input id="pin-name" name="name" type="text" required placeholder="Your name" />
            </Field>
            <Field label="Access PIN" htmlFor="pin">
              <Input id="pin" name="pin" inputMode="numeric" required placeholder="••••" />
            </Field>
            <Button type="submit" disabled={loading} iconRight={loading ? undefined : ArrowRight}>
              {loading ? <Spinner size={18} /> : "Enter chat"}
            </Button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={onForgot} className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold">Reset your password</h2>
              <p className="mt-1 text-sm text-muted">
                Enter your email and we&apos;ll send a reset link from {""}
                <span className="text-fg">codecraftsolutions.com</span>.
              </p>
            </div>
            <Field label="Email" htmlFor="forgot-email">
              <Input id="forgot-email" name="email" type="email" required placeholder="you@email.com" />
            </Field>
            {resetLink !== null && (
              <Alert tone="success">
                Reset link sent. For this demo,{" "}
                <Link href={resetLink} className="font-medium text-brand-blue underline">
                  open it here
                </Link>
                .
              </Alert>
            )}
            {resetLink === null && (
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner size={18} /> : "Send reset link"}
              </Button>
            )}
            <button
              type="button"
              onClick={() => { setError(null); setResetLink(null); setMode("password"); }}
              className="w-fit text-sm text-muted hover:text-fg"
            >
              ← Back to sign in
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have access yet?{" "}
        <Link href="/book" className="text-brand-blue hover:text-brand-violet">
          Book a project
        </Link>
      </p>

      {/* DEMO credentials — remove before launch */}
      <div className="mt-8 w-full rounded-xl border border-dashed border-line-strong bg-bg-soft px-4 py-3 text-xs text-faint">
        <p className="font-mono uppercase tracking-widest text-muted">Demo logins</p>
        <p className="mt-1.5">Owner — {DEMO_OWNER.email} / {DEMO_OWNER.password}</p>
        <p>Client PIN — demo@client.com / Demo Client / 2468</p>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Lock;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors " +
        (active ? "bg-[var(--brand-gradient)] text-white" : "text-muted hover:text-fg")
      }
    >
      <Icon icon={icon} size={16} />
      {children}
    </button>
  );
}
