import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-xl bg-bg-soft px-4 text-fg placeholder:text-faint " +
  "ring-1 ring-line-strong transition-colors duration-200 " +
  "focus:ring-2 focus:ring-brand-blue focus:outline-none";

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-fg">
      {children}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-32 resize-y py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "h-12 appearance-none pr-10", className)} {...props}>
      {children}
    </select>
  );
}

/** Field wrapper: label + control + optional hint/error. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-faint">{hint}</p>
      ) : null}
    </div>
  );
}
