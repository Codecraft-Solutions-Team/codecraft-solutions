"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { createInquiry } from "@/lib/data/backend";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setError(null);
    setLoading(true);
    createInquiry({
      name: String(f.get("name")),
      email: String(f.get("email")),
      message: String(f.get("message")),
    })
      .then(() => {
        setSent(true);
        form.reset();
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not send message."))
      .finally(() => setLoading(false));
  };

  if (sent) {
    return (
      <div className="surface p-7">
        <Alert tone="success">
          Thanks — your message is in. I&apos;ll get back to you at the email you gave shortly.
        </Alert>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-brand-blue hover:text-brand-violet"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface flex flex-col gap-4 p-6 sm:p-7">
      {error && <Alert tone="error">{error}</Alert>}
      <Field label="Name" htmlFor="contact-name">
        <Input id="contact-name" name="name" required placeholder="Your name" autoComplete="name" />
      </Field>
      <Field label="Email" htmlFor="contact-email">
        <Input id="contact-email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
      </Field>
      <Field label="Message" htmlFor="contact-message">
        <Textarea id="contact-message" name="message" required placeholder="How can I help?" />
      </Field>
      <Button type="submit" disabled={loading} iconLeft={loading ? undefined : Send}>
        {loading ? <Spinner size={18} /> : "Send message"}
      </Button>
    </form>
  );
}
