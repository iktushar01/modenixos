"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GripHorizontal, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/app-config";
import {
  type ChatAction,
  type ChatHistoryMessage,
  fetchChatbotConfig,
  sendChatMessage,
} from "@/lib/chatbot/client";

const SESSION_KEY = "modenixos-chat-session";
const PANEL_SIZE_KEY = "modenixos-chat-panel-size";

const DEFAULT_PROMPTS = [
  "What is ModenixOS?",
  "How do I start for free?",
  "Compare pricing plans",
  "Show me the demo store",
];

type PanelSize = { width: number; height: number };

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getMinPanelSize(): PanelSize {
  if (typeof window === "undefined") {
    return { width: 280, height: 320 };
  }

  const narrow = window.innerWidth < 640;
  return {
    width: narrow ? 260 : 300,
    height: narrow ? 300 : 360,
  };
}

function getMaxPanelSize(): PanelSize {
  if (typeof window === "undefined") {
    return { width: 720, height: 720 };
  }

  const margin = window.innerWidth < 640 ? 12 : 20;
  const bottomOffset = window.innerWidth < 640 ? 12 : 20;

  return {
    width: Math.floor(window.innerWidth - margin * 2),
    height: Math.floor(window.innerHeight - bottomOffset - margin),
  };
}

function getDefaultPanelSize(): PanelSize {
  const max = getMaxPanelSize();
  const min = getMinPanelSize();

  const preferred = {
    width: Math.min(400, max.width),
    height: Math.min(560, max.height),
  };

  return {
    width: clamp(preferred.width, min.width, max.width),
    height: clamp(preferred.height, min.height, max.height),
  };
}

function normalizePanelSize(size: PanelSize): PanelSize {
  const min = getMinPanelSize();
  const max = getMaxPanelSize();

  return {
    width: clamp(size.width, min.width, max.width),
    height: clamp(size.height, min.height, max.height),
  };
}

function loadPanelSize(): PanelSize {
  if (typeof window === "undefined") return getDefaultPanelSize();

  try {
    const stored = localStorage.getItem(PANEL_SIZE_KEY);
    if (!stored) return getDefaultPanelSize();

    const parsed = JSON.parse(stored) as { width?: number; height?: number };
    return normalizePanelSize({
      width: parsed.width ?? getDefaultPanelSize().width,
      height: parsed.height ?? getDefaultPanelSize().height,
    });
  } catch {
    return getDefaultPanelSize();
  }
}

type UiMessage = ChatHistoryMessage & {
  actions?: ChatAction[];
};

type ResizeDirection = "left" | "top" | "corner";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [starterPrompts, setStarterPrompts] = useState(DEFAULT_PROMPTS);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [panelSize, setPanelSize] = useState<PanelSize>(getDefaultPanelSize);
  const [isResizing, setIsResizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelSizeRef = useRef(panelSize);

  useEffect(() => {
    panelSizeRef.current = panelSize;
  }, [panelSize]);

  useEffect(() => {
    setPanelSize(loadPanelSize());
  }, []);

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
    const onResize = () => {
      setPanelSize((current) => normalizePanelSize(current));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const startResize = useCallback(
    (direction: ResizeDirection) => (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startSize = panelSizeRef.current;

      setIsResizing(true);
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);

      const onPointerMove = (moveEvent: PointerEvent) => {
        const max = getMaxPanelSize();
        const min = getMinPanelSize();

        let width = startSize.width;
        let height = startSize.height;

        if (direction === "left" || direction === "corner") {
          width = startSize.width - (moveEvent.clientX - startX);
        }
        if (direction === "top" || direction === "corner") {
          height = startSize.height - (moveEvent.clientY - startY);
        }

        const next = {
          width: clamp(width, min.width, max.width),
          height: clamp(height, min.height, max.height),
        };

        panelSizeRef.current = next;
        setPanelSize(next);
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        setIsResizing(false);
        localStorage.setItem(PANEL_SIZE_KEY, JSON.stringify(panelSizeRef.current));
        target.releasePointerCapture(upEvent.pointerId);
        target.removeEventListener("pointermove", onPointerMove);
        target.removeEventListener("pointerup", onPointerUp);
        target.removeEventListener("pointercancel", onPointerUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.userSelect = "none";
      document.body.style.cursor =
        direction === "left"
          ? "ew-resize"
          : direction === "top"
            ? "ns-resize"
            : "nwse-resize";

      target.addEventListener("pointermove", onPointerMove);
      target.addEventListener("pointerup", onPointerUp);
      target.addEventListener("pointercancel", onPointerUp);
    },
    [],
  );

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
      {!open && (
        <Button
          type="button"
          size="lg"
          aria-label="Open chat assistant"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full p-0 shadow-lg shadow-primary/25 sm:bottom-5 sm:right-5",
            "transition-transform hover:scale-105 active:scale-95",
          )}
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
        </Button>
      )}

      {open && (
        <>
          <button
            type="button"
            aria-label="Close chat assistant"
            className="fixed inset-0 z-50 bg-black/15 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-label={`${APP_NAME} Assistant`}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden bg-popover text-popover-foreground shadow-2xl",
              "bottom-3 right-3 rounded-2xl border border-border/60 ring-1 ring-black/5",
              "sm:bottom-5 sm:right-5",
              isResizing && "select-none",
            )}
            style={{ width: panelSize.width, height: panelSize.height }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize chat width"
              className="absolute inset-y-0 left-0 z-10 w-4 cursor-ew-resize touch-none sm:w-3"
              onPointerDown={startResize("left")}
            />
            <div
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize chat height"
              className="absolute inset-x-0 top-0 z-10 h-4 cursor-ns-resize touch-none sm:h-3"
              onPointerDown={startResize("top")}
            />
            <div
              aria-label="Resize chat panel"
              className="absolute left-0 top-0 z-20 flex h-8 w-8 cursor-nwse-resize items-center justify-center rounded-br-lg bg-muted/90 text-muted-foreground touch-none sm:h-6 sm:w-6"
              onPointerDown={startResize("corner")}
            >
              <GripHorizontal className="h-3.5 w-3.5 -rotate-45 sm:h-3 sm:w-3" aria-hidden />
            </div>

            <header className="relative shrink-0 border-b border-border/60 px-4 py-3.5 pr-12 sm:py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-medium">{APP_NAME} Assistant</h2>
                  <p className="text-xs text-muted-foreground">
                    Ask about features, pricing, or how to get started · drag edges to resize
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close chat"
                className="absolute right-2 top-2 sm:right-3 sm:top-3"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </header>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Hi! I can help you learn about {APP_NAME}, compare plans, or guide you to launch
                    your store.
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
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
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
              className="shrink-0 border-t border-border/60 p-3 sm:p-4"
              onSubmit={(event) => {
                event.preventDefault();
                void submitMessage(input);
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
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
          </div>
        </>
      )}
    </>
  );
}
