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

/** Storefront home — long-scroll landing, not an inner chrome page. */
export function isStoreHomePath(pathname: string, slug: string): boolean {
  if (!slug) return false;
  const base = `/store/${slug}`;
  return pathname === base || pathname === `${base}/`;
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
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "auth-login"
  | "auth-register"
  | "wishlist"
  | "orders"
  | "static";

export function getStorefrontSkeletonVariant(pathname: string): StorefrontSkeletonVariant {
  if (/\/products\/[^/]+$/.test(pathname)) return "product";
  if (pathname.endsWith("/shop") || pathname.includes("/categories/") || pathname.includes("/collections/")) {
    return "shop";
  }
  if (pathname.endsWith("/cart")) return "cart";
  if (pathname.endsWith("/checkout")) return "checkout";
  if (pathname.includes("/account/register")) return "auth-register";
  if (pathname.includes("/account/login")) return "auth-login";
  if (pathname.includes("/account/wishlist")) return "wishlist";
  if (pathname.includes("/account/orders") || pathname.endsWith("/track")) return "orders";
  if (
    pathname.endsWith("/about") ||
    pathname.endsWith("/contact-us") ||
    pathname.endsWith("/privacy-policy") ||
    pathname.endsWith("/shipping-policy") ||
    pathname.endsWith("/return-exchange-policy") ||
    pathname.endsWith("/payment-refund-policy")
  ) {
    return "static";
  }
  return "home";
}
