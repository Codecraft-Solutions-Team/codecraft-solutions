import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * Renders the ORIGINAL logo asset (never recreated).
 * - "lockup": mark + CODECRAFT SOLUTIONS wordmark (nav / footer)
 * - "mark": the bracket mark only (compact / icon)
 */
export function Logo({
  variant = "lockup",
  height = 34,
  href = "/",
  className,
  priority = false,
  blend = false,
}: {
  variant?: "lockup" | "mark";
  height?: number;
  href?: string | null;
  className?: string;
  priority?: boolean;
  blend?: boolean;
}) {
  const asset =
    variant === "mark"
      ? { src: "/brand/logo-mark-t.png", w: 629, h: 406 }
      : { src: "/brand/logo-lockup-t.png", w: 1028, h: 649 };

  const width = Math.round((asset.w / asset.h) * height);

  const img = (
    <Image
      src={asset.src}
      alt={`${site.name} logo`}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto select-none", blend && "mix-blend-lighten", className)}
      style={{ height, width }}
    />
  );

  if (href === null) return img;
  return (
    <Link href={href} aria-label={`${site.name} — home`} className="inline-flex items-center">
      {img}
    </Link>
  );
}
