"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Account } from "./types";
import { getCurrentAccount, onAuthChange, signOut as backendSignOut } from "./backend";

type AuthState = {
  account: Account | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const refresh = () =>
      getCurrentAccount().then((a) => {
        if (active) {
          setAccount(a);
          setLoading(false);
        }
      });
    refresh();
    const unsub = onAuthChange(refresh);
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const signOut = async () => {
    await backendSignOut();
  };

  return <AuthContext.Provider value={{ account, loading, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
