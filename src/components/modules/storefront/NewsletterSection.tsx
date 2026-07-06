"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { Button } from "@/components/ui/button";
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
    <section id="contact" className="sf-section w-full py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="sf-muted sf-border sf-panel border px-5 py-10 sm:px-8 sm:py-14 md:px-16 md:py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="sf-eyebrow">Stay connected</p>
          <h2 className="sf-display-lg mt-3">Join the {brandName} list</h2>
          <p className="sf-muted-fg mx-auto mt-4 max-w-md text-sm">
            First access to new arrivals, private sales, and editorial style notes.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 border sf-border p-2 shadow-sm transition-shadow duration-300 focus-within:shadow-md sm:flex-row sm:rounded-full sm:bg-[color-mix(in_srgb,var(--sf-card)_80%,transparent)]"
          >
            <Input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sf-input h-12 flex-1 border-0 bg-transparent sm:rounded-full"
            />
            <Button
              type="submit"
              disabled={loading}
              className="sf-btn-primary sf-btn-interactive h-12 rounded-full px-10"
            >
              {loading ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
