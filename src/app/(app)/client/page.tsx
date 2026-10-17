"use client";

import { MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/data/auth";
import { RequireRole } from "@/components/app/RequireRole";
import { Container } from "@/components/ui/Container";
import { Chat } from "@/components/app/Chat";
import { Icon } from "@/components/ui/Icon";

export default function ClientPage() {
  return (
    <RequireRole role="client">
      <ClientArea />
    </RequireRole>
  );
}

function ClientArea() {
  const { account } = useAuth();
  if (!account) return null;

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-1.5">
        <span className="eyebrow">Client area</span>
        <h1 className="text-3xl font-semibold">Welcome back, {account.name.split(" ")[0]}</h1>
        <p className="text-muted">Your private line to Sasen. Messages are answered as soon as possible.</p>
      </div>

      <div className="surface mt-8 flex h-[68vh] flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-3 border-b border-line pb-4">
          <span className="grid size-10 place-items-center rounded-full bg-brand-blue/15 text-brand-blue">
            <Icon icon={MessageSquare} size={18} />
          </span>
          <div>
            <p className="font-medium">Sasen · Codecraft Solutions</p>
            <p className="text-xs text-success">● Usually replies within a day</p>
          </div>
        </div>
        <Chat
          threadId={account.id}
          role="client"
          peerName="Sasen"
          emptyHint="This is the start of your conversation with Sasen. Say hello."
        />
      </div>
    </Container>
  );
}
