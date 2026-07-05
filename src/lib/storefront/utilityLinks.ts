/** Resolve theme utility / nav hrefs to store-scoped URLs. */
export function resolveStorefrontUtilityHref(base: string, href: string) {
  if (href.startsWith("#")) return `${base}${href}`;
  if (href.startsWith("/store/")) return href;
  if (href === "/cart" || href.endsWith("/cart")) return `${base}/cart`;
  if (href === "/login" || href === "/account/login") return `${base}/account/login`;
  if (href === "/register" || href === "/account/register") return `${base}/account/register`;
  if (href.startsWith("/account/")) return `${base}${href}`;
  return href;
}

/** Hide auth utility links when the shopper is already signed in. */
export function filterAuthUtilityLinks(
  links: { label: string; href: string }[],
  isLoggedIn: boolean,
) {
  if (!isLoggedIn) return links;
  return links.filter((link) => {
    const h = link.href.toLowerCase();
    const label = link.label.toLowerCase();
    return (
      !h.includes("/login") &&
      !h.includes("/register") &&
      !h.includes("/account/login") &&
      !h.includes("/account/register") &&
      label !== "log in" &&
      label !== "register" &&
      label !== "sign up"
    );
  });
}
