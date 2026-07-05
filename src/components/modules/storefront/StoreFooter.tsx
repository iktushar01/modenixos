"use client";

import Link from "next/link";
import Image from "next/image";
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
    <footer className="sf-border sf-footer border-t">
      <div className="sf-section w-full py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            {store.logo ? (
              <Image src={store.logo} alt={store.brandName} width={120} height={40} className="h-8 w-auto object-contain" unoptimized />
            ) : (
              <p className="text-lg font-medium sf-footer-fg">{store.brandName}</p>
            )}
            <p className="mt-2 max-w-xs text-sm sf-muted-fg">{store.description}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider sf-muted-fg">Links</p>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={`${base}${link.href}`} className="sf-link text-sm transition-colors sf-hover-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${base}/cart`} className="sf-link text-sm transition-colors sf-hover-fg">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider sf-muted-fg">Follow</p>
            <div className="mt-4 flex gap-3">
              {theme.social.instagram && (
                <a href={theme.social.instagram} target="_blank" rel="noopener noreferrer" className="sf-link sf-hover-fg">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {theme.social.twitter && (
                <a href={theme.social.twitter} target="_blank" rel="noopener noreferrer" className="sf-link sf-hover-fg">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {theme.social.facebook && (
                <a href={theme.social.facebook} target="_blank" rel="noopener noreferrer" className="sf-link sf-hover-fg">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {!theme.social.instagram && !theme.social.twitter && !theme.social.facebook && (
                <span className="text-sm sf-muted-fg">Social links from dashboard</span>
              )}
            </div>
          </div>
        </div>
        <div className="sf-border mt-12 flex flex-col items-center justify-between gap-2 border-t pt-8 text-xs sf-muted-fg md:flex-row">
          <p>&copy; {new Date().getFullYear()} {store.brandName}. All rights reserved.</p>
          <p>Powered by ModenixOS</p>
        </div>
      </div>
    </footer>
  );
}
