"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, Phone, Search, ShoppingBag, X } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks, resolveStoreLogo } from "@/lib/storefront";
import {
  buildStorefrontCategoryNav,
  type StorefrontNavItem,
} from "@/lib/catalog/categoryTree";
import { useStorefrontCssVars } from "../../useStorefrontCssVars";
import { buildShopHref } from "@/lib/shopFilters";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useStoreCartCount } from "@/hooks/useStoreCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, StorefrontSheetContent } from "../../StorefrontSheet";
import { StorefrontThemeToggle } from "./StorefrontThemeToggle";
import { StorefrontAccountMenu } from "../../StorefrontAccountMenu";
import { StorefrontNavLink } from "../../StorefrontNavLink";
import { useOptionalStorefrontNav } from "../../StorefrontNavContext";
import { useOptionalStorefrontCustomer } from "../../StorefrontCustomerContext";
import { useStorefrontTheme } from "../../StorefrontThemeContext";
import { cn } from "@/lib/utils";

interface StoreHeaderProps {
  store: Store;
  theme: StorefrontThemeConfig;
  categories: Category[];
}

type NavGroupItem = Extract<StorefrontNavItem, { type: "group" }>;

function NavCategoryDropdown({ item }: { item: NavGroupItem }) {
  const portalVars = useStorefrontCssVars();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.bottom,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const show = useCallback(() => {
    updatePosition();
    setOpen(true);
  }, [updatePosition]);

  const hide = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onReposition = () => updatePosition();
    window.addEventListener("scroll", onReposition, { passive: true, capture: true });
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, { capture: true });
      window.removeEventListener("resize", onReposition);
    };
  }, [open, updatePosition]);

  const toggle = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      updatePosition();
      setOpen((prev) => !prev);
    },
    [updatePosition],
  );

  return (
    <div
      ref={triggerRef}
      className="relative shrink-0"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <button
        type="button"
        className="sf-nav-menu-item inline-flex items-center gap-1"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform", open && "rotate-180")} />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="storefront-theme pt-2"
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              transform: "translateX(-50%)",
              zIndex: 60,
              ...portalVars,
            }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            <div className="sf-nav-dropdown-panel">
              <Link href={item.href} className="sf-nav-dropdown-item font-medium">
                View all {item.label}
              </Link>
              {item.children.map((child) => (
                <StorefrontNavLink key={child.href} href={child.href} className="sf-nav-dropdown-item">
                  {child.label}
                </StorefrontNavLink>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export function StoreHeader({ store, theme, categories }: StoreHeaderProps) {
  const router = useRouter();
  const { colorMode } = useStorefrontTheme();
  const storefrontNav = useOptionalStorefrontNav();
  const hydrated = useCartHydrated();
  const cartCount = useStoreCartCount(store.id);
  const customerCtx = useOptionalStorefrontCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const logoUrl = useMemo(
    () => resolveStoreLogo(store, theme, colorMode),
    [store, theme, colorMode],
  );

  const base = `/store/${store.slug}`;
  const isLoggedIn = Boolean(customerCtx?.customer);
  const navLinks = useMemo(
    () => resolveStorefrontNavLinks(theme, store.slug, categories),
    [theme, store.slug, categories],
  );

  const menuItems = useMemo(() => {
    const home = { type: "link" as const, label: "HOME", href: base };
    const navSource = theme.header.navSource;

    if (navSource === "manual") {
      return [
        home,
        ...navLinks.map((link) => ({
          type: "link" as const,
          label: link.label,
          href: link.href,
        })),
      ];
    }

    const categoryNav = buildStorefrontCategoryNav(categories, base);

    if (navSource === "both") {
      const manualItems: StorefrontNavItem[] = navLinks.map((link) => ({
        type: "link",
        label: link.label,
        href: link.href,
      }));
      return [home, ...manualItems, ...categoryNav];
    }

    return [home, ...categoryNav];
  }, [base, categories, navLinks, theme.header.navSource]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const href = buildShopHref(
      store.slug,
      searchQuery.trim() ? { search: searchQuery.trim() } : undefined,
    );
    if (storefrontNav) {
      storefrontNav.navigate(href);
    } else {
      router.push(href);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "sf-navbar sf-safe-top sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "sf-glass-nav" : "sf-border border-b",
        )}
      >
        <div className="sf-section border-b sf-border">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 py-3 sm:gap-3 md:grid-cols-3 md:gap-6 md:py-4">
            <div className="flex min-w-0 items-center gap-1 sm:gap-2 md:justify-self-start">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="sf-navbar-fg sf-touch-target h-11 w-11 shrink-0 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {theme.header.showSearch && (
                <form onSubmit={handleSearch} className="hidden min-w-0 lg:block">
                  <div className="sf-header-search">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="sf-input h-10 border-0 px-3 text-sm shadow-none focus-visible:ring-0"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="sf-navbar-fg h-10 w-10 shrink-0 rounded-none"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <StorefrontNavLink
              href={base}
              className="flex min-w-0 max-w-[52vw] flex-col items-center justify-self-center text-center sm:max-w-none"
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={store.brandName}
                  width={180}
                  height={56}
                  className="h-7 w-auto max-w-full object-contain sm:h-8 md:h-10"
                  unoptimized
                />
              ) : (
                <span className="sf-display-lg truncate text-base sm:text-lg md:text-xl">{store.brandName}</span>
              )}
              {theme.header.tagline && (
                <span className="mt-1 hidden text-[10px] tracking-[0.22em] text-muted-foreground uppercase sm:block">
                  {theme.header.tagline}
                </span>
              )}
            </StorefrontNavLink>

            <div className="flex items-center justify-end gap-0.5 sm:gap-1 md:gap-3 md:justify-self-end">
              {theme.header.showPhone && theme.contact.phone && (
                <a
                  href={`tel:${theme.contact.phone}`}
                  className="sf-link sf-touch-target hidden p-2 lg:inline-flex"
                  aria-label="Call store"
                >
                  <Phone className="h-5 w-5" strokeWidth={1.5} />
                </a>
              )}

              <StorefrontNavLink
                href={`${base}/cart`}
                className="sf-touch-target relative inline-flex items-center justify-center p-2.5"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {hydrated && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-semibold sf-primary">
                    {cartCount}
                  </span>
                )}
              </StorefrontNavLink>

              <div className="hidden sm:block">
                <StorefrontAccountMenu base={base} />
              </div>

              <div className="hidden sm:block">
                <StorefrontThemeToggle />
              </div>
            </div>
          </div>

          {theme.header.showSearch && (
            <form onSubmit={handleSearch} className="pb-3 lg:hidden">
              <div className="sf-header-search">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="sf-input h-10 border-0 px-3 text-sm shadow-none focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="sf-navbar-fg h-10 w-10 shrink-0 rounded-none"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </div>

        {menuItems.length > 0 && (
          <nav
            className="sf-section hidden overflow-visible border-b sf-border lg:block"
            aria-label="Store categories"
          >
            <div className="sf-nav-menu-scroll">
              <div className="sf-nav-menu">
                {menuItems.map((item) =>
                  item.type === "group" ? (
                    <NavCategoryDropdown key={item.label} item={item} />
                  ) : (
                    <StorefrontNavLink
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      className="sf-nav-menu-item shrink-0"
                    >
                      {item.label}
                    </StorefrontNavLink>
                  ),
                )}
              </div>
            </div>
          </nav>
        )}
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <StorefrontSheetContent side="left" showCloseButton={false} className="sf-safe-bottom w-full max-w-md border-r p-0">
          <div className="flex h-full flex-col px-6 py-8">
            <div className="mb-10 flex items-center justify-between">
              <span className="sf-display-lg text-2xl">{store.brandName}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {theme.header.tagline && (
              <p className="sf-body-lg sf-muted-fg mb-8">{theme.header.tagline}</p>
            )}

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) =>
                item.type === "group" ? (
                  <div key={item.label} className="border-b sf-border py-2">
                    <StorefrontNavLink
                      href={item.href}
                      className="sf-eyebrow block py-2 text-sm transition-opacity hover:opacity-70"
                      onNavigate={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </StorefrontNavLink>
                    <div className="ml-3 space-y-1 border-l pl-3 sf-border">
                      {item.children.map((child) => (
                        <StorefrontNavLink
                          key={child.href}
                          href={child.href}
                          className="block py-2 text-sm sf-muted-fg transition-opacity hover:opacity-70"
                          onNavigate={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </StorefrontNavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <StorefrontNavLink
                    key={`m-${item.label}-${item.href}`}
                    href={item.href}
                    className="sf-eyebrow border-b sf-border py-4 text-sm transition-opacity hover:opacity-70"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </StorefrontNavLink>
                ),
              )}
            </nav>

            {theme.header.showSearch && (
              <form onSubmit={handleSearch} className="mt-8 flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="sf-input flex-1"
                />
                <Button type="submit" size="icon" className="sf-btn-secondary shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}

            <div className="mt-auto space-y-4 border-t sf-border pt-6">
              {isLoggedIn && customerCtx?.customer ? (
                <>
                  <p className="text-sm font-medium">{customerCtx.customer.name}</p>
                  <p className="text-xs sf-muted-fg">{customerCtx.customer.email}</p>
                  <StorefrontNavLink
                    href={`${base}/account/orders`}
                    className="block text-sm sf-link"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    Orders
                  </StorefrontNavLink>
                  <StorefrontNavLink
                    href={`${base}/account/wishlist`}
                    className="block text-sm sf-link"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    Wishlist
                  </StorefrontNavLink>
                  <StorefrontNavLink
                    href={`${base}/track`}
                    className="block text-sm sf-link"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    Track order
                  </StorefrontNavLink>
                  <button
                    type="button"
                    className="block text-left text-sm sf-link"
                    onClick={async () => {
                      setMobileOpen(false);
                      await customerCtx.logout();
                      router.push(base);
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <StorefrontNavLink
                    href={`${base}/account/login`}
                    className="block text-sm sf-link"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    Log in
                  </StorefrontNavLink>
                  <StorefrontNavLink
                    href={`${base}/account/register`}
                    className="block text-sm sf-link"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    Create account
                  </StorefrontNavLink>
                </>
              )}
              <div className="flex items-center gap-3">
                <span className="sf-eyebrow">Theme</span>
                <StorefrontThemeToggle />
              </div>
            </div>
          </div>
        </StorefrontSheetContent>
      </Sheet>
    </>
  );
}
