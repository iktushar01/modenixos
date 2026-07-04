"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/app-config";
import FadeContent from "@/components/FadeContent";
import ShinyText from "@/components/ShinyText";

const footerLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#try-project", label: "Try it" },
  { href: "#features", label: "Features" },
  { href: "/store/luxe-threads", label: "Demo store" },
  { href: "/register", label: "Sign up" },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/40 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent" />
      <div className="container relative mx-auto max-w-6xl px-4">
        <FadeContent duration={800} blur>
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold">
                <ShinyText
                  text={APP_NAME}
                  className="font-semibold"
                  color="var(--foreground)"
                  shineColor="var(--muted-foreground)"
                  speed={3}
                />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                The operating system for fashion brands.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors duration-300 hover:text-foreground"
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
        </FadeContent>
      </div>
    </footer>
  );
}

export default Footer;
