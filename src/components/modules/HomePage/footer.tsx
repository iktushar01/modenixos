"use client";

import Link from "next/link";
import Logo from "@/components/shared/logo/logo";
import { APP_NAME } from "@/lib/app-config";

const footerLinks = {
  product: [
    { href: "#product-tour", label: "Product tour" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
  ],
  company: [
    { href: "#faq", label: "FAQ" },
    { href: "/store/luxe-threads", label: "Live demo", external: true },
    { href: "/login", label: "Log in" },
    { href: "/register", label: "Start free" },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mkt-section w-full py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The operating system for fashion brands. Launch your storefront, manage orders, and
              grow with analytics — all from one platform.
            </p>
          </div>
          <div>
            <p className="mkt-label">Product</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="mkt-nav-link text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mkt-label">Get started</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="mkt-nav-link text-sm transition-colors"
                    {...("external" in link && link.external ? { target: "_blank" } : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p>Built for fashion founders who move fast.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
