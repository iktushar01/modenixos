export type StorefrontEventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "checkout_started";

const VISITOR_KEY = "modenixos_vid";
const SESSION_KEY = "modenixos_sid";
const SESSION_STARTED_KEY = "modenixos_sid_at";
const SESSION_TTL_MS = 30 * 60 * 1000;

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getStorefrontVisitorId() {
  if (typeof window === "undefined") return randomId();
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = randomId();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getStorefrontSessionId() {
  if (typeof window === "undefined") return randomId();
  const now = Date.now();
  const startedAt = Number(window.sessionStorage.getItem(SESSION_STARTED_KEY) ?? "0");
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id || !startedAt || now - startedAt > SESSION_TTL_MS) {
    id = randomId();
    window.sessionStorage.setItem(SESSION_KEY, id);
    window.sessionStorage.setItem(SESSION_STARTED_KEY, String(now));
  }
  return id;
}

export function trackStorefrontEvent(
  slug: string,
  event: StorefrontEventType,
  extra?: { path?: string; productId?: string },
) {
  if (typeof window === "undefined") return;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base || !slug) return;

  const body = {
    sessionId: getStorefrontSessionId(),
    visitorId: getStorefrontVisitorId(),
    event,
    path: extra?.path ?? window.location.pathname,
    referrer: document.referrer || undefined,
    ...(extra?.productId ? { productId: extra.productId } : {}),
  };

  void fetch(`${base}/public/stores/${encodeURIComponent(slug)}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}
