"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/cn";
import { nav } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Logo height={30} priority />

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Client login
          </ButtonLink>
          <ButtonLink href="/book" variant="primary" size="sm" iconLeft={MessageSquare}>
            Book a project
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-10 place-items-center rounded-full text-fg ring-1 ring-line-strong md:hidden"
        >
          <Icon icon={open ? X : Menu} size={20} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-line bg-bg/95 backdrop-blur-xl md:hidden",
          open ? "max-h-[80vh]" : "max-h-0 border-transparent",
          "transition-[max-height] duration-300 ease-[var(--ease-out-soft)]",
        )}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <ButtonLink href="/login" variant="secondary" size="md" onClick={() => setOpen(false)}>
              Client login
            </ButtonLink>
            <ButtonLink
              href="/book"
              variant="primary"
              size="md"
              iconLeft={MessageSquare}
              onClick={() => setOpen(false)}
            >
              Book a project
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
