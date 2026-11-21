"use client";

import Link from "next/link";
import Logo from "@/components/shared/logo/logo";
import { APP_NAME, DEMO_STORE_PATH } from "@/lib/app-config";
import { StartFreeLink } from "./StartFreeLink";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerColumns = {
  product: [
    { href: "/#product-tour", label: "Product tour" },
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#pricing", label: "Pricing" },
  ],
  solutions: [
    { href: "/#product-tour", label: "Fashion & apparel" },
    { href: "/#product-tour", label: "Electronics" },
    { href: "/#product-tour", label: "Furniture & home" },
    { href: "/#product-tour", label: "Grocery & delivery" },
    { href: "/#product-tour", label: "Beauty & cosmetics" },
  ],
  resources: [
    { href: "/#faq", label: "FAQ" },
    { href: DEMO_STORE_PATH, label: "Live demo", external: true },
    { href: "/demo", label: "Demo shortcut" },
    { href: "/register", label: "Documentation" },
  ],
  company: [
    { href: "/register", label: "Start free" },
    { href: "/login", label: "Log in" },
    { href: "mailto:support@modenixos.com", label: "Contact" },
  ],
  legal: [
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
    { href: "#", label: "Security" },
  ],
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="mkt-label mb-1">{title}</p>
      <ul className="mt-2 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.href === "/register" ? (
              <StartFreeLink className="mkt-nav-link text-sm transition-colors">
                {link.label}
              </StartFreeLink>
            ) : (
              <Link
                href={link.href}
                className="mkt-nav-link text-sm transition-colors"
                {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)]" aria-hidden />
      <div className="mkt-section relative z-10 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo />
            </div>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {APP_NAME} is the operating system for modern commerce. Launch storefronts, manage
              operations, and scale revenue — from one beautifully designed platform.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterColumn title="Product" links={footerColumns.product} />
          <FooterColumn title="Solutions" links={footerColumns.solutions} />
          <FooterColumn title="Resources" links={footerColumns.resources} />
          <div className="space-y-8">
            <FooterColumn title="Company" links={footerColumns.company} />
            <FooterColumn title="Legal" links={footerColumns.legal} />
          </div>
        </div>

        <Separator className="my-10 border-border/60" />
        <div className="flex flex-col items-center justify-between gap-2 border-t border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row md:pt-10">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Build. Sell. Scale.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
