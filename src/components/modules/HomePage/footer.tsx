"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/app-config";

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-semibold">{APP_NAME}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The operating system for fashion brands.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-foreground">How it works</Link>
            <Link href="#try-project" className="hover:text-foreground">Try it</Link>
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="/store/luxe-threads" className="hover:text-foreground">Demo store</Link>
            <Link href="/register" className="hover:text-foreground">Sign up</Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}. Built with Next.js, Express, Prisma & PostgreSQL.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
