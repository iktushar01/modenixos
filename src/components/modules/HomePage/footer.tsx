"use client";

import Link from "next/link";
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
    <footer className="border-t border-border/40 py-12 md:py-14">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold">{APP_NAME}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The operating system for fashion brands.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}. Built with Next.js, Express, Prisma &
          PostgreSQL.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
