/** Split an in-app href into pathname, query, and hash. */
export function parseStorefrontHref(href: string): {
  pathname: string;
  search: string;
  hash: string;
} {
  const hashIdx = href.indexOf("#");
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const searchIdx = withoutHash.indexOf("?");
  const search = searchIdx >= 0 ? withoutHash.slice(searchIdx) : "";
  const pathname = searchIdx >= 0 ? withoutHash.slice(0, searchIdx) : withoutHash;
  return { pathname: pathname || "/", search, hash };
}

export function buildStorefrontPath(pathname: string, search = "", hash = "") {
  return `${pathname}${search}${hash}`;
}

export function isStorefrontClientNavHref(href: string): boolean {
  return href.startsWith("/store/");
}

export function scrollStorefrontToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo(0, 0);
}

export function scrollStorefrontToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  if (!hash || typeof window === "undefined") return;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return;
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
  });
}

/** After navigation settles: jump to hash target or page top. */
export function applyStorefrontScrollAfterNav(hash?: string) {
  if (hash) {
    scrollStorefrontToHash(hash);
  } else {
    scrollStorefrontToTop();
  }
}

export type StorefrontSkeletonVariant =
  | "home"
  | "product"
  | "cart"
  | "checkout"
  | "auth-login"
  | "auth-register"
  | "wishlist"
  | "orders";

export function getStorefrontSkeletonVariant(pathname: string): StorefrontSkeletonVariant {
  if (/\/products\/[^/]+$/.test(pathname)) return "product";
  if (pathname.endsWith("/cart")) return "cart";
  if (pathname.endsWith("/checkout")) return "checkout";
  if (pathname.includes("/account/register")) return "auth-register";
  if (pathname.includes("/account/login")) return "auth-login";
  if (pathname.includes("/account/wishlist")) return "wishlist";
  if (pathname.includes("/account/orders") || pathname.endsWith("/track")) return "orders";
  return "home";
}
