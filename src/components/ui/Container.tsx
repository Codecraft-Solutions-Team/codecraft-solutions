import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Centered max-width wrapper with consistent gutters. */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}>{children}</Tag>;
}
