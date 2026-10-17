import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The ONLY way icons are rendered across the site.
 * Locks size + stroke weight so every icon is visually identical — no emojis,
 * no mismatched glyphs. Default 20px / 1.75 stroke.
 */
export function Icon({
  icon: Glyph,
  size = 20,
  strokeWidth = 1.75,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <Glyph
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      aria-hidden="true"
    />
  );
}

/**
 * Icon inside a consistent gradient-bordered tile. Used for feature/service
 * cards so each badge is identical in size and treatment.
 */
export function IconBadge({
  icon,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "size-10", md: "size-12", lg: "size-14" }[size];
  const glyph = { sm: 18, md: 22, lg: 26 }[size];
  return (
    <span
      className={cn(
        "relative inline-grid place-items-center rounded-xl",
        "bg-[linear-gradient(140deg,#2f93ff22,#8a3ff022)] text-fg",
        "ring-1 ring-line-strong",
        box,
        className,
      )}
    >
      <Icon icon={icon} size={glyph} className="text-brand-blue" />
    </span>
  );
}
