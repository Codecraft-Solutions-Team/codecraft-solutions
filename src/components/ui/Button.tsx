import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full whitespace-nowrap " +
  "transition-all duration-200 ease-[var(--ease-out-soft)] focus-visible:outline-none " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[var(--brand-gradient)] shadow-[0_8px_30px_-8px_#5b6bff80] " +
    "hover:shadow-[0_12px_40px_-8px_#7c4dffaa] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "text-fg bg-surface ring-1 ring-line-strong hover:ring-brand-blue/60 " +
    "hover:bg-elevated hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-muted hover:text-fg hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  children: ReactNode;
  className?: string;
};

function Inner({ iconLeft, iconRight, children }: Pick<CommonProps, "iconLeft" | "iconRight" | "children">) {
  return (
    <>
      {iconLeft ? <Icon icon={iconLeft} size={18} /> : null}
      {children}
      {iconRight ? <Icon icon={iconRight} size={18} /> : null}
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<"button">, "children">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </Inner>
    </Link>
  );
}
