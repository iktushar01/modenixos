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

const DEFAULT_PANEL_SIZE = { width: 400, height: 560 };
const MIN_PANEL_SIZE = { width: 320, height: 420 };
const LG_BREAKPOINT = 1024;

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

function getMaxPanelSize() {
  if (typeof window === "undefined") {
    return { width: 720, height: 720 };
  }
  return {
    width: Math.min(720, Math.floor(window.innerWidth * 0.5)),
    height: Math.floor(window.innerHeight - 96),
  };
}

function loadPanelSize(): { width: number; height: number } {
  if (typeof window === "undefined") return DEFAULT_PANEL_SIZE;

  try {
    const stored = localStorage.getItem(PANEL_SIZE_KEY);
    if (!stored) return DEFAULT_PANEL_SIZE;

    const parsed = JSON.parse(stored) as { width?: number; height?: number };
    const max = getMaxPanelSize();

    return {
      width: clamp(parsed.width ?? DEFAULT_PANEL_SIZE.width, MIN_PANEL_SIZE.width, max.width),
      height: clamp(parsed.height ?? DEFAULT_PANEL_SIZE.height, MIN_PANEL_SIZE.height, max.height),
    };
  } catch {
    return DEFAULT_PANEL_SIZE;
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
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [panelSize, setPanelSize] = useState(DEFAULT_PANEL_SIZE);
  const [isResizing, setIsResizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelSizeRef = useRef(panelSize);

  useEffect(() => {
    panelSizeRef.current = panelSize;
  }, [panelSize]);

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
    const media = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    const sync = () => {
      setIsLargeScreen(media.matches);
      if (media.matches) {
        setPanelSize(loadPanelSize());
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isLargeScreen) return;

    const onResize = () => {
      const max = getMaxPanelSize();
      setPanelSize((current) => ({
        width: clamp(current.width, MIN_PANEL_SIZE.width, max.width),
        height: clamp(current.height, MIN_PANEL_SIZE.height, max.height),
      }));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isLargeScreen]);

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

  useEffect(() => {
    document.body.style.overflow = open && !isLargeScreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isLargeScreen]);

  const startResize = useCallback(
    (direction: ResizeDirection) => (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isLargeScreen) return;

      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startSize = panelSizeRef.current;
      const max = getMaxPanelSize();

      setIsResizing(true);

      const onPointerMove = (moveEvent: PointerEvent) => {
        let width = startSize.width;
        let height = startSize.height;

        if (direction === "left" || direction === "corner") {
          width = startSize.width - (moveEvent.clientX - startX);
        }
        if (direction === "top" || direction === "corner") {
          height = startSize.height - (moveEvent.clientY - startY);
        }

        const next = {
          width: clamp(width, MIN_PANEL_SIZE.width, max.width),
          height: clamp(height, MIN_PANEL_SIZE.height, max.height),
        };

        panelSizeRef.current = next;
        setPanelSize(next);
      };

      const onPointerUp = () => {
        setIsResizing(false);
        localStorage.setItem(PANEL_SIZE_KEY, JSON.stringify(panelSizeRef.current));
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
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

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [isLargeScreen],
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
            "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full p-0 shadow-lg shadow-primary/25",
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
            className={cn(
              "fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]",
              isLargeScreen ? "bg-black/10" : "",
            )}
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-label={`${APP_NAME} Assistant`}
            className={cn(
              "fixed z-50 flex flex-col bg-popover text-popover-foreground shadow-2xl",
              isLargeScreen
                ? "bottom-5 right-5 overflow-hidden rounded-2xl border border-border/60 ring-1 ring-black/5"
                : "inset-0 h-full w-full",
              isResizing && "select-none",
            )}
            style={
              isLargeScreen
                ? { width: panelSize.width, height: panelSize.height }
                : undefined
            }
            onClick={(event) => event.stopPropagation()}
          >
            {isLargeScreen && (
              <>
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize chat width"
                  className="absolute inset-y-0 left-0 z-10 w-2 cursor-ew-resize touch-none"
                  onPointerDown={startResize("left")}
                />
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  aria-label="Resize chat height"
                  className="absolute inset-x-0 top-0 z-10 h-2 cursor-ns-resize touch-none"
                  onPointerDown={startResize("top")}
                />
                <div
                  aria-label="Resize chat panel"
                  className="absolute left-0 top-0 z-20 flex h-5 w-5 cursor-nwse-resize items-center justify-center rounded-br-md bg-muted/80 text-muted-foreground touch-none"
                  onPointerDown={startResize("corner")}
                >
                  <GripHorizontal className="h-3 w-3 -rotate-45" aria-hidden />
                </div>
              </>
            )}

            <header className="relative shrink-0 border-b border-border/60 px-4 py-4 pr-12">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-medium">{APP_NAME} Assistant</h2>
                  <p className="text-xs text-muted-foreground">
                    Ask about features, pricing, or how to get started
                    {isLargeScreen && (
                      <span className="hidden sm:inline"> · drag edges to resize</span>
                    )}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close chat"
                className="absolute right-3 top-3"
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
              className="shrink-0 border-t border-border/60 p-4"
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
