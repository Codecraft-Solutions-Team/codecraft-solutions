"use client";

/**
 * Custom email-action handler — the branded page Firebase's reset email links to
 * (set Authentication → Templates → customize action URL to https://yourdomain/auth/action).
 * It reads ?mode= & ?code= (Firebase calls it oobCode), verifies it, and lets the
 * user set a new password. See FIREBASE.md for the exact wiring.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { verifyResetCode, confirmPasswordReset } from "@/lib/data/backend";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Icon } from "@/components/ui/Icon";

type Status = "loading" | "ready" | "invalid" | "done";

export default function AuthActionPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const oob = params.get("code") ?? params.get("oobCode") ?? "";
    if (mode !== "resetPassword" || !oob) {
      setStatus("invalid");
      return;
    }
    setCode(oob);
    verifyResetCode(oob)
      .then((mail) => {
        setEmail(mail);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const pw = String(f.get("password"));
    const confirm = String(f.get("confirm"));
    setError(null);
    if (pw.length < 6) return setError("Password must be at least 6 characters.");
    if (pw !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    confirmPasswordReset(code, pw)
      .then(() => setStatus("done"))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not reset password."))
      .finally(() => setBusy(false));
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-20">
      <Logo variant="mark" height={40} />

      {status === "loading" && (
        <div className="mt-10 text-brand-blue">
          <Spinner size={26} />
        </div>
      )}

      {status === "invalid" && (
        <div className="surface mt-8 w-full p-7 text-center">
          <h1 className="text-2xl font-semibold">Link expired</h1>
          <p className="mt-2 text-muted">This reset link is invalid or has already been used.</p>
          <div className="mt-6">
            <Button onClick={() => (window.location.href = "/login")}>Back to sign in</Button>
          </div>
        </div>
      )}

      {status === "ready" && (
        <div className="surface mt-8 w-full p-7 sm:p-8">
          <h1 className="text-2xl font-semibold">Set a new password</h1>
          <p className="mt-2 text-sm text-muted">
            For <span className="text-fg">{email}</span>
          </p>
          {error && <div className="mt-4"><Alert tone="error">{error}</Alert></div>}
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <Field label="New password" htmlFor="password">
              <Input id="password" name="password" type="password" required placeholder="At least 6 characters" autoComplete="new-password" />
            </Field>
            <Field label="Confirm password" htmlFor="confirm">
              <Input id="confirm" name="confirm" type="password" required placeholder="Re-enter password" autoComplete="new-password" />
            </Field>
            <Button type="submit" disabled={busy}>
              {busy ? <Spinner size={18} /> : "Reset password"}
            </Button>
          </form>
        </div>
      )}

      {status === "done" && (
        <div className="surface mt-8 w-full p-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/15 text-success">
            <Icon icon={CheckCircle2} size={28} />
          </span>
          <h1 className="mt-5 text-2xl font-semibold">Password updated</h1>
          <p className="mt-2 text-muted">You can now sign in with your new password.</p>
          <div className="mt-6">
            <Link href="/login">
              <Button iconRight={ArrowRight}>Go to sign in</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
