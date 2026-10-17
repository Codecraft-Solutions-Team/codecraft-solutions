import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

/** A page section with consistent vertical rhythm and optional anchor id. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

/** Standard eyebrow + title + lead used at the top of every section. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">{title}</h2>
      {lead ? (
        <p className={cn("max-w-2xl text-base leading-relaxed text-muted sm:text-lg")}>{lead}</p>
      ) : null}
    </Reveal>
  );
}
