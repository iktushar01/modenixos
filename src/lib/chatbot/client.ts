export type ChatAction = {
  label: string;
  href: string;
};

export type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatbotConfig = {
  enabled: boolean;
  starterPrompts: string[];
};

export type ChatbotReply = {
  reply: string;
  actions: ChatAction[];
  sources: { title: string; category: string }[];
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function assertApiBase() {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  return API_BASE;
}

export async function fetchChatbotConfig(): Promise<ChatbotConfig> {
  const base = assertApiBase();
  const res = await fetch(`${base}/public/chat/config`, { cache: "no-store" });
  const json = (await res.json()) as ApiEnvelope<ChatbotConfig>;

  if (!res.ok || !json.success || !json.data) {
    return { enabled: false, starterPrompts: [] };
  }

  return json.data;
}

export async function sendChatMessage(
  message: string,
  sessionId: string,
  history: ChatHistoryMessage[],
): Promise<ChatbotReply> {
  const base = assertApiBase();
  const res = await fetch(`${base}/public/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId, history }),
  });

  const json = (await res.json()) as ApiEnvelope<ChatbotReply>;

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Failed to send message");
  }

  return json.data;
}
