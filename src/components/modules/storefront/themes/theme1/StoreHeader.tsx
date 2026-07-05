"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, Phone, Search, ShoppingBag, X } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks } from "@/lib/storefront";
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
import { useOptionalStorefrontCustomer } from "../../StorefrontCustomerContext";
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
      <Link href={item.href} className="sf-nav-menu-item inline-flex items-center gap-1">
        {item.label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </Link>
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
              {item.children.map((child) => (
                <Link key={child.href} href={child.href} className="sf-nav-dropdown-item">
                  {child.label}
                </Link>
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
  const hydrated = useCartHydrated();
  const cartCount = useStoreCartCount(store.id);
  const customerCtx = useOptionalStorefrontCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    router.push(
      buildShopHref(base, searchQuery.trim() ? { search: searchQuery.trim() } : undefined),
    );
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "sf-navbar sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "sf-glass-nav" : "sf-border border-b",
        )}
      >
        <div className="sf-section border-b sf-border">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 md:grid-cols-3 md:gap-6 md:py-4">
            <div className="flex items-center gap-2 md:justify-self-start">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="sf-navbar-fg shrink-0 md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {theme.header.showSearch && (
                <form onSubmit={handleSearch} className="hidden min-w-0 md:block">
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

            <Link
              href={base}
              className="flex flex-col items-center justify-self-center text-center"
            >
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.brandName}
                  width={180}
                  height={56}
                  className="h-8 w-auto object-contain md:h-10"
                  unoptimized
                />
              ) : (
                <span className="sf-display-lg text-lg md:text-xl">{store.brandName}</span>
              )}
              {theme.header.tagline && (
                <span className="mt-1 hidden text-[10px] tracking-[0.22em] text-muted-foreground uppercase sm:block">
                  {theme.header.tagline}
                </span>
              )}
            </Link>

            <div className="flex items-center justify-end gap-1 md:gap-3 md:justify-self-end">
              {theme.header.showPhone && theme.contact.phone && (
                <a
                  href={`tel:${theme.contact.phone}`}
                  className="hidden p-2 sf-link lg:inline-flex"
                  aria-label="Call store"
                >
                  <Phone className="h-5 w-5" strokeWidth={1.5} />
                </a>
              )}

              <Link href={`${base}/cart`} className="relative p-2" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {hydrated && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-semibold sf-primary">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block">
                <StorefrontAccountMenu base={base} />
              </div>

              <div className="hidden sm:block">
                <StorefrontThemeToggle />
              </div>
            </div>
          </div>

          {theme.header.showSearch && (
            <form onSubmit={handleSearch} className="pb-3 md:hidden">
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
            className="sf-section hidden overflow-visible border-b sf-border md:block"
            aria-label="Store categories"
          >
            <div className="sf-nav-menu-scroll">
              <div className="sf-nav-menu">
                {menuItems.map((item) =>
                  item.type === "group" ? (
                    <NavCategoryDropdown key={item.label} item={item} />
                  ) : (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      className="sf-nav-menu-item shrink-0"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </nav>
        )}
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <StorefrontSheetContent side="left" showCloseButton={false} className="w-full max-w-md border-r p-0">
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
                    <Link
                      href={item.href}
                      className="sf-eyebrow block py-2 text-sm transition-opacity hover:opacity-70"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <div className="ml-3 space-y-1 border-l pl-3 sf-border">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2 text-sm sf-muted-fg transition-opacity hover:opacity-70"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={`m-${item.label}-${item.href}`}
                    href={item.href}
                    className="sf-eyebrow border-b sf-border py-4 text-sm transition-opacity hover:opacity-70"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
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
                  <Link
                    href={`${base}/account/orders`}
                    className="block text-sm sf-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href={`${base}/account/wishlist`}
                    className="block text-sm sf-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    href={`${base}/track`}
                    className="block text-sm sf-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    Track order
                  </Link>
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
                  <Link
                    href={`${base}/account/login`}
                    className="block text-sm sf-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href={`${base}/account/register`}
                    className="block text-sm sf-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    Create account
                  </Link>
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
