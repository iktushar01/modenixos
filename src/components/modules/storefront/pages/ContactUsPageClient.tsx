"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorePageTitle } from "@/components/modules/storefront/StorePageTitle";
import { getStoreStaticPage } from "@/lib/storefront/storeStaticPages";
import { parseStorefrontTheme } from "@/lib/storefront";
import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { storeBasePath } from "@/lib/storePaths";
import { StorefrontShopProfile } from "@/types/store.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Clock, Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactUsPageClient() {
  const { store, storeReady } = useStorefront();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", subject: "", message: "" });

  if (!storeReady || !store) {
    return null;
  }

  const page = getStoreStaticPage(store.brandName, "contact-us", store.theme);
  const theme = parseStorefrontTheme(store);
  const profile = (store.theme?.profile ?? {}) as StorefrontShopProfile;
  const base = storeBasePath(store.slug);
  const email = profile.contactEmail ?? `hello@${store.slug.replace(/-/g, "")}.com`;
  const phone = profile.contactPhone ?? theme.contact.phone ?? "+880 1XXX-XXXXXX";
  const address = profile.address ?? "Dhaka, Bangladesh";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", orderNumber: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <>
      <StorePageTitle pageId="contact-us" brandName={store.brandName} />
      <main className="sf-section w-full py-12 md:py-16">
        <nav className="sf-muted-fg mb-8 flex flex-wrap items-center gap-1.5 text-xs">
          <StorefrontNavLink href={base} className="sf-link sf-hover-fg transition-colors">
            Home
          </StorefrontNavLink>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span>Contact Us</span>
        </nav>

        <header className="mb-10 max-w-2xl md:mb-12">
          <p className="sf-eyebrow">{page.eyebrow}</p>
          <h1 className="sf-display-lg mt-2 text-3xl md:text-4xl">{page.title}</h1>
          <p className="sf-muted-fg sf-body-lg mt-4 leading-relaxed">{page.description}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <form onSubmit={handleSubmit} className="sf-editorial-card space-y-5 p-6 md:p-8">
            <div className="flex items-center gap-3 border-b sf-border pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sf-muted)]">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Send us a message</p>
                <p className="sf-muted-fg text-xs">We typically reply within 24 hours</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  className="sf-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="sf-input"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order number (optional)</Label>
                <Input
                  id="orderNumber"
                  className="sf-input"
                  placeholder="ORD-..."
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  required
                  className="sf-input"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                rows={5}
                className="sf-input min-h-[120px] resize-y"
                placeholder="Tell us more about your inquiry..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={loading} className="sf-btn-primary w-full rounded-full sm:w-auto">
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>

          <aside className="space-y-4">
            <div className="sf-editorial-card p-6">
              <p className="sf-eyebrow mb-4">Reach us</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Mail className="sf-muted-fg mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${email}`} className="sf-link sf-hover-fg text-sm">
                      {email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="sf-muted-fg mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a href={`tel:${phone}`} className="sf-link sf-hover-fg text-sm">
                      {phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="sf-muted-fg mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="sf-muted-fg text-sm">{address}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="sf-muted-fg mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Support hours</p>
                    <p className="sf-muted-fg text-sm">Sat – Thu, 10 AM – 8 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            {page.sections.map((section) => (
              <div key={section.title} className="sf-editorial-card p-6">
                <p className="mb-3 text-sm font-medium">{section.title}</p>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="sf-muted-fg text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="sf-muted-fg mt-2 list-disc space-y-1.5 pl-4 text-sm marker:text-[var(--sf-accent)]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet.slice(0, 40)}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="flex gap-3 px-1">
              {theme.social.instagram && (
                <a
                  href={theme.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-link sf-hover-fg text-xs underline-offset-4 hover:underline"
                >
                  Instagram
                </a>
              )}
              {theme.social.facebook && (
                <a
                  href={theme.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-link sf-hover-fg text-xs underline-offset-4 hover:underline"
                >
                  Facebook
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
