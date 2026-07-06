"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { Input } from "@/components/ui/input";

interface NewsletterSectionProps {
  brandName: string;
  theme: StorefrontThemeConfig;
}

export function NewsletterSection({ brandName, theme }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!theme.newsletterEnabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("You're subscribed! Check your inbox for updates.");
    setEmail("");
    setLoading(false);
  };

  return (
    <section id="contact" className="sf-t2-newsletter-band border-t sf-border">
      <div className="sf-section grid gap-8 py-14 md:grid-cols-[1fr_1.2fr] md:items-center md:py-16">
        <div>
          <p className="sf-t2-label">Newsletter</p>
          <h2 className="sf-t2-section-title mt-2">Notes from {brandName}</h2>
          <p className="sf-t2-section-sub mt-3 max-w-sm">
            Early access to drops, private sales, and editorial picks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="sf-t2-newsletter-form">
          <Input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sf-t2-newsletter-input sf-input h-12 flex-1 rounded-none border-0 bg-transparent"
          />
          <button type="submit" disabled={loading} className="sf-t2-btn-primary h-12 shrink-0 px-8">
            {loading ? "Joining…" : "Join"}
          </button>
        </form>
      </div>
    </section>
  );
}
