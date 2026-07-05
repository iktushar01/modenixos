"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useStoreCartCount } from "@/hooks/useStoreCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "" },
  { label: "Shop", href: "#shop" },
  { label: "Categories", href: "#categories" },
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

interface StoreNavbarProps {
  store: Store;
  theme: StorefrontThemeConfig;
}

export function StoreNavbar({ store, theme }: StoreNavbarProps) {
  const hydrated = useCartHydrated();
  const cartCount = useStoreCartCount(store.id);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = `/store/${store.slug}`;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled ? "sf-border sf-navbar backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[4.5rem] md:px-6">
        <Link href={base} className="flex shrink-0 items-center gap-2">
          {store.logo ? (
            <Image src={store.logo} alt={store.brandName} width={120} height={36} className="h-8 w-auto object-contain" unoptimized />
          ) : (
            <span className="text-lg font-semibold tracking-wide sf-navbar-fg md:text-xl">{store.brandName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href ? `${base}${link.href.startsWith("#") ? link.href : link.href}` : base}
              className="text-sm sf-link transition-colors sf-hover-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="sf-navbar-fg hover:bg-[color-mix(in_srgb,var(--sf-muted)_50%,transparent)]"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link href={`${base}/cart`}>
            <Button variant="ghost" size="icon" className="relative sf-navbar-fg hover:bg-[color-mix(in_srgb,var(--sf-muted)_50%,transparent)]" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {hydrated && cartCount > 0 && (
                <span
                  className="sf-badge-secondary absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                >
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-1.5 sf-navbar-fg hover:bg-[color-mix(in_srgb,var(--sf-muted)_50%,transparent)]">
              <User className="h-4 w-4" />
              Login
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="sf-navbar-fg md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="sf-border sf-navbar border-t px-4 py-3 md:px-6"
        >
          <Input
            placeholder="Search products..."
            className="sf-input max-w-xl"
            autoFocus
          />
        </motion.div>
      )}

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sf-border sf-navbar border-t px-4 py-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href ? `${base}${link.href}` : base}
              className="sf-link block py-2.5 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="sf-navbar-link-muted mt-2 block py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
            Login
          </Link>
        </motion.nav>
      )}
    </motion.header>
  );
}
