"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";
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
    <section id="contact" className="sf-section w-full py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sf-border sf-card rounded-2xl border px-6 py-12 text-center md:px-16 md:py-16"
      >
        <Mail className="sf-muted-fg mx-auto h-8 w-8" />
        <h2 className="mt-4 text-2xl font-light sf-fg md:text-3xl">Join the {brandName} list</h2>
        <p className="sf-muted-fg mx-auto mt-3 max-w-md text-sm">
          Be first to know about new drops, exclusive offers, and style edits.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sf-input h-11 flex-1 rounded-full"
          />
          <Button
            type="submit"
            disabled={loading}
            className="sf-btn-primary h-11 rounded-full px-8"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
