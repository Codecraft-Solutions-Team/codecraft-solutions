import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type Tone = "error" | "success" | "info";

const styles: Record<Tone, { ring: string; text: string; icon: typeof Info }> = {
  error: { ring: "ring-danger/40 bg-danger/10", text: "text-danger", icon: AlertCircle },
  success: { ring: "ring-success/40 bg-success/10", text: "text-success", icon: CheckCircle2 },
  info: { ring: "ring-brand-blue/40 bg-brand-blue/10", text: "text-brand-blue", icon: Info },
};

export function Alert({ tone = "info", children }: { tone?: Tone; children: ReactNode }) {
  const s = styles[tone];
  return (
    <div className={cn("flex items-start gap-3 rounded-xl px-4 py-3 text-sm ring-1", s.ring)}>
      <span className={cn("mt-0.5", s.text)}>
        <Icon icon={s.icon} size={18} />
      </span>
      <div className="text-fg/90">{children}</div>
    </div>
  );
}
