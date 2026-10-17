"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/lib/data/auth";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export function AppHeader() {
  const { account, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Logo height={28} priority />

        {account ? (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{account.name}</p>
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-faint">
                {account.role}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm text-muted ring-1 ring-line-strong transition-colors hover:text-fg"
            >
              <Icon icon={LogOut} size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <Icon icon={ArrowLeft} size={16} />
            Back to site
          </Link>
        )}
      </div>
    </header>
  );
}
