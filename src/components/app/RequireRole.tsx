"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/data/types";
import { useAuth } from "@/lib/data/auth";
import { PageSpinner } from "@/components/ui/Spinner";

/** Client-side gate. Redirects to /login if the session doesn't match `role`. */
export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { account, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!account) {
      router.replace(`/login?next=${role}`);
    } else if (account.role !== role) {
      router.replace(account.role === "owner" ? "/owner" : "/client");
    }
  }, [account, loading, role, router]);

  if (loading || !account || account.role !== role) return <PageSpinner />;
  return <>{children}</>;
}
