"use client";

import Link from "next/link";
import Logo from "@/components/shared/logo/logo";
import { APP_NAME } from "@/lib/app-config";

const footerLinks = [
  { href: "#product-tour", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#developers", label: "Developers" },
  { href: "/store/luxe-threads", label: "Demo store" },
];

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mkt-section w-full py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The operating system for fashion brands — storefront, dashboard, and analytics in one
              platform.
            </p>
          </div>
          <div>
            <p className="mkt-label">Explore</p>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="mkt-nav-link text-sm transition-colors"
                    {...(link.href.startsWith("/store") ? { target: "_blank" } : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mkt-label">Get started</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/register" className="mkt-nav-link text-sm transition-colors">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/login" className="mkt-nav-link text-sm transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/store/luxe-threads"
                  target="_blank"
                  className="mkt-nav-link text-sm transition-colors"
                >
                  Try demo store
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p>Built with Next.js, Express, Prisma & PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
