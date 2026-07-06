"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/app-config";
import {
  type ChatAction,
  type ChatHistoryMessage,
  fetchChatbotConfig,
  sendChatMessage,
} from "@/lib/chatbot/client";

const SESSION_KEY = "modenixos-chat-session";

const DEFAULT_PROMPTS = [
  "What is ModenixOS?",
  "How do I start for free?",
  "Compare pricing plans",
  "Show me the demo store",
];

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

type UiMessage = ChatHistoryMessage & {
  actions?: ChatAction[];
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [starterPrompts, setStarterPrompts] = useState(DEFAULT_PROMPTS);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatbotConfig()
      .then((config) => {
        setEnabled(config.enabled);
        if (config.starterPrompts.length > 0) {
          setStarterPrompts(config.starterPrompts);
        }
      })
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const submitMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setInput("");
      setLoading(true);

      const userMessage: UiMessage = { role: "user", content: trimmed };
      const history = [...messages, userMessage];
      setMessages(history);

      try {
        const result = await sendChatMessage(
          trimmed,
          getSessionId(),
          messages.map(({ role, content }) => ({ role, content })),
        );

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.reply,
            actions: result.actions,
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  if (!enabled) return null;

  return (
    <>
      <Button
        type="button"
        size="lg"
        aria-label="Open chat assistant"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full p-0 shadow-lg shadow-primary/25",
          "transition-transform hover:scale-105 active:scale-95",
        )}
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b border-border/60 px-4 py-4 text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <div>
                <SheetTitle className="text-base">{APP_NAME} Assistant</SheetTitle>
                <SheetDescription className="text-xs">
                  Ask about features, pricing, or how to get started
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hi! I can help you learn about {APP_NAME}, compare plans, or guide you to launch your store.
                </p>
                <div className="flex flex-wrap gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={loading}
                      onClick={() => submitMessage(prompt)}
                      className="rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {message.actions.map((action) => (
                        <Button
                          key={action.href}
                          asChild
                          size="sm"
                          variant="secondary"
                          className="h-7 rounded-full px-2.5 text-xs"
                        >
                          <Link href={action.href} onClick={() => setOpen(false)}>
                            {action.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Thinking...
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <form
            className="border-t border-border/60 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submitMessage(input);
            }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={loading}
                maxLength={1000}
                className="flex-1 rounded-xl border border-border/80 bg-background px-3 py-2.5 text-sm outline-none ring-primary/20 transition focus:ring-2"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="h-10 w-10 shrink-0 rounded-xl"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
