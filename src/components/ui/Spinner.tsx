import { cn } from "@/lib/cn";

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-brand-blue">
      <Spinner size={28} />
    </div>
  );
}
