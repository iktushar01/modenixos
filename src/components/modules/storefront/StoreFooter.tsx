"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";

interface StoreFooterProps {
  store: Store;
  theme: StorefrontThemeConfig;
}

const FOOTER_LINKS = [
  { label: "About", href: "#about" },
  { label: "Help", href: "#contact" },
  { label: "Shipping", href: "#contact" },
  { label: "Returns", href: "#contact" },
];

export function StoreFooter({ store, theme }: StoreFooterProps) {
  const base = `/store/${store.slug}`;

  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-lg font-medium text-white">{store.brandName}</p>
            <p className="mt-2 max-w-xs text-sm text-white/50">{store.description}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Links</p>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={`${base}${link.href}`} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${base}/cart`} className="text-sm text-white/60 transition-colors hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Follow</p>
            <div className="mt-4 flex gap-3">
              {theme.social.instagram && (
                <a href={theme.social.instagram} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {theme.social.twitter && (
                <a href={theme.social.twitter} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {theme.social.facebook && (
                <a href={theme.social.facebook} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {!theme.social.instagram && !theme.social.twitter && !theme.social.facebook && (
                <span className="text-sm text-white/30">Social links from dashboard</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {store.brandName}. All rights reserved.</p>
          <p>Powered by ModenixOS</p>
        </div>
      </div>
    </footer>
  );
}
