"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import type { Message, Role } from "@/lib/data/types";
import { getMessages, sendMessage, onMessages } from "@/lib/data/backend";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function Chat({
  threadId,
  role,
  peerName,
  emptyHint,
}: {
  threadId: string;
  role: Role;
  peerName: string;
  emptyHint?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () => getMessages(threadId).then((m) => active && setMessages(m));
    refresh();
    const unsub = onMessages(refresh);
    return () => {
      active = false;
      unsub();
    };
  }, [threadId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    setText("");
    try {
      await sendMessage(threadId, role, value);
    } finally {
      setSending(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {messages.length === 0 ? (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-faint">
            {emptyHint ?? "No messages yet — say hello."}
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.from === role;
            return (
              <div key={m.id} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed",
                    mine
                      ? "bg-[var(--brand-gradient)] text-white rounded-br-sm"
                      : "bg-surface text-fg ring-1 ring-line rounded-bl-sm",
                  )}
                >
                  {m.text}
                </div>
                <span className="px-1 text-[0.7rem] text-faint">
                  {mine ? "You" : peerName} · {timeLabel(m.createdAt)}
                </span>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="mt-3 flex items-end gap-2 border-t border-line pt-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={1}
          placeholder={`Message ${peerName}…`}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl bg-bg-soft px-4 py-3 text-fg placeholder:text-faint ring-1 ring-line-strong focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          aria-label="Send message"
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--brand-gradient)] text-white transition-opacity disabled:opacity-40"
        >
          <Icon icon={SendHorizontal} size={18} />
        </button>
      </form>
    </div>
  );
}
