"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, MessageSquare, ShieldCheck, Clock } from "lucide-react";
import { createBooking } from "@/lib/data/backend";
import { services } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";

const budgets = ["Under £1k", "£1k – £3k", "£3k – £8k", "£8k+", "Not sure yet"];

const perks = [
  { icon: MessageSquare, text: "A private chat with Sasen opens the moment you book." },
  { icon: ShieldCheck, text: "Clean, custom code — built to your exact spec." },
  { icon: Clock, text: "1 month full support, up to 1 year of bug fixes." },
];

export default function BookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null);
    setLoading(true);
    createBooking({
      name: String(f.get("name")),
      email: String(f.get("email")),
      password: String(f.get("password")),
      service: String(f.get("service")),
      budget: String(f.get("budget")),
      message: String(f.get("message")),
    })
      .then(() => router.push("/client?welcome=1"))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoading(false);
      });
  };

  return (
    <Container className="py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Info column */}
        <div className="flex flex-col gap-6 lg:pt-4">
          <span className="eyebrow">Start a project</span>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Let&apos;s build something <span className="text-gradient">worth shipping</span>.
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Tell me what you have in mind. You&apos;ll get an account and a direct line to me straight
            away — no forms lost in an inbox.
          </p>
          <ul className="mt-2 flex flex-col gap-4">
            {perks.map((p) => (
              <li key={p.text} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand-blue/15 text-brand-blue">
                  <Icon icon={p.icon} size={16} />
                </span>
                <span className="text-[0.95rem] text-fg/90">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form column */}
        <div className="surface p-6 sm:p-8">
          {error && (
            <div className="mb-4">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor="name">
                <Input id="name" name="name" required placeholder="Jane Doe" autoComplete="name" />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input id="email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
              </Field>
            </div>
            <Field label="Create a password" htmlFor="password" hint="You'll use this to sign back into your client area.">
              <Input id="password" name="password" type="password" required minLength={6} placeholder="At least 6 characters" autoComplete="new-password" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="What do you need?" htmlFor="service">
                <Select id="service" name="service" required defaultValue="">
                  <option value="" disabled>Select a service</option>
                  {services.map((s) => (
                    <option key={s.title} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Something else">Something else</option>
                </Select>
              </Field>
              <Field label="Budget" htmlFor="budget">
                <Select id="budget" name="budget" required defaultValue="">
                  <option value="" disabled>Select a range</option>
                  {budgets.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Tell me about the project" htmlFor="message">
              <Textarea id="message" name="message" required placeholder="What are you building, and what's the goal?" />
            </Field>
            <Button type="submit" size="lg" disabled={loading} iconLeft={loading ? undefined : Check}>
              {loading ? <Spinner size={18} /> : "Book & open my chat"}
            </Button>
            <p className="text-center text-xs text-faint">
              Already have access?{" "}
              <Link href="/login" className="text-brand-blue hover:text-brand-violet">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </Container>
  );
}
