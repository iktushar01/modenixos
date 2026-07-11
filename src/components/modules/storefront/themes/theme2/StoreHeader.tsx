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
import { StorefrontThemeToggle } from "../theme1/StorefrontThemeToggle";
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
    setPosition({ top: rect.bottom, left: rect.left });
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
      <button
        type="button"
        className="sf-nav-menu-item inline-flex items-center gap-1 text-xs tracking-[0.12em]"
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          updatePosition();
          setOpen((prev) => !prev);
        }}
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
    const home = { type: "link" as const, label: "Home", href: base };
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
      <header className="sf-navbar sf-safe-top sticky top-0 z-50 w-full border-b sf-border">
        <div className="sf-section flex items-center gap-4 py-3 md:py-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="sf-header-action lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <StorefrontNavLink href={base} className="group shrink-0 cursor-pointer">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={store.brandName}
                width={140}
                height={44}
                className="h-7 w-auto max-w-[140px] object-contain transition-opacity group-hover:opacity-80 sm:h-8"
                unoptimized
              />
            ) : (
              <span className="sf-display-lg sm:text-lg block max-w-[45vw] truncate text-base transition-opacity group-hover:opacity-80 sm:max-w-xs">{store.brandName}</span>
            )}
          </StorefrontNavLink>

          {menuItems.length > 0 && (
            <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex" aria-label="Store navigation">
              {menuItems.map((item) =>
                item.type === "group" ? (
                  <NavCategoryDropdown key={item.label} item={item} />
                ) : (
                  <StorefrontNavLink
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="sf-nav-menu-item shrink-0 px-3 text-xs tracking-[0.12em]"
                  >
                    {item.label}
                  </StorefrontNavLink>
                ),
              )}
            </nav>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            {theme.header.showSearch && (
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="sf-header-search w-44 xl:w-52">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="sf-input h-full border-0 px-3 text-sm shadow-none focus-visible:ring-0"
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

            {theme.header.showPhone && theme.contact.phone && (
              <a
                href={`tel:${theme.contact.phone}`}
                className="sf-header-action hidden xl:inline-flex"
                aria-label="Call store"
              >
                <Phone className="h-5 w-5" strokeWidth={1.5} />
              </a>
            )}

            <StorefrontNavLink href={`${base}/cart`} className="sf-header-action relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {hydrated && cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-semibold sf-primary">
                  {cartCount}
                </span>
              )}
            </StorefrontNavLink>

            <div className="hidden sm:contents">
              <StorefrontAccountMenu base={base} className="sf-header-action" />
            </div>

            <div className="hidden sm:block">
              <StorefrontThemeToggle className="sf-header-action h-10 w-10" />
            </div>
          </div>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <StorefrontSheetContent side="left" showCloseButton={false} className="sf-safe-bottom w-full max-w-md border-r p-0">
          <div className="flex h-full flex-col px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
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
              <p className="sf-body-lg sf-muted-fg mb-6">{theme.header.tagline}</p>
            )}

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) =>
                item.type === "group" ? (
                  <div key={item.label} className="border-b sf-border py-2">
                    <StorefrontNavLink
                      href={item.href}
                      className="block py-2 text-sm font-medium"
                      onNavigate={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </StorefrontNavLink>
                    <div className="ml-3 space-y-1 border-l pl-3 sf-border">
                      {item.children.map((child) => (
                        <StorefrontNavLink
                          key={child.href}
                          href={child.href}
                          className="block py-2 text-sm sf-muted-fg"
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
                    className="border-b sf-border py-4 text-sm"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </StorefrontNavLink>
                ),
              )}
            </nav>

            {theme.header.showSearch && (
              <form onSubmit={handleSearch} className="mt-6 flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
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
                  <StorefrontNavLink
                    href={`${base}/account/orders`}
                    className="block text-sm sf-link"
                    onNavigate={() => setMobileOpen(false)}
                  >
                    Orders
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
                <StorefrontNavLink
                  href={`${base}/account/login`}
                  className="block text-sm sf-link"
                  onNavigate={() => setMobileOpen(false)}
                >
                  Log in
                </StorefrontNavLink>
              )}
              <StorefrontThemeToggle />
            </div>
          </div>
        </StorefrontSheetContent>
      </Sheet>
    </>
  );
}
