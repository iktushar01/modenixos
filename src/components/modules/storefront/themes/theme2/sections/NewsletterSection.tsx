"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { Input } from "@/components/ui/input";
import { subscribeNewsletterAction } from "@/actions/newsletter.actions";

interface NewsletterSectionProps {
  brandName: string;
  storeSlug: string;
  theme: StorefrontThemeConfig;
}

export function NewsletterSection({ brandName, storeSlug, theme }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!theme.newsletterEnabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = await subscribeNewsletterAction(storeSlug, email.trim(), "homepage");
      toast.success(result.message);
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };
