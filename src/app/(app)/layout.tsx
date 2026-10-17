import { AppHeader } from "@/components/app/AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
