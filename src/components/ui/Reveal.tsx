"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Reveals children with a subtle rise the first time they scroll into view.
 * Respects prefers-reduced-motion (handled in globals.css).
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      className={cn("reveal-base", shown && "reveal-in", className)}
      style={shown ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
