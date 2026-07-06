"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Sparkles,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrencySelect } from "@/components/shared/CurrencySelect";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { formatPriceSample, getCurrencyName } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { StorefrontShopProfile } from "@/types/store.types";
import { cn } from "@/lib/utils";

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function readShopProfile(theme: Record<string, unknown> | null | undefined): StorefrontShopProfile {
  const profile = (theme?.profile ?? {}) as StorefrontShopProfile;
  return {
    seoDescription: profile.seoDescription ?? "",
    contactEmail: profile.contactEmail ?? "",
    contactPhone: profile.contactPhone ?? "",
    address: profile.address ?? "",
  };
}

export default function StoreProfilePage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    slug: "",
    country: "",
    currency: "USD",
    description: "",
    isPublished: false,
    seoDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });

  useEffect(() => {
    if (store) {
      const profile = readShopProfile(store.theme as Record<string, unknown>);
      setForm({
        brandName: store.brandName,
        slug: store.slug,
        country: store.country,
        currency: store.currency,
        description: store.description ?? "",
        isPublished: store.isPublished,
        seoDescription: profile.seoDescription ?? "",
        contactEmail: profile.contactEmail ?? "",
        contactPhone: profile.contactPhone ?? "",
        address: profile.address ?? "",
      });
    }
  }, [store]);

  const isDirty = useMemo(() => {
    if (!store) return false;
    const profile = readShopProfile(store.theme as Record<string, unknown>);
    return (
      form.brandName !== store.brandName ||
      form.slug !== store.slug ||
      form.country !== store.country ||
      form.currency !== store.currency ||
      form.description !== (store.description ?? "") ||
      form.isPublished !== store.isPublished ||
      form.seoDescription !== (profile.seoDescription ?? "") ||
      form.contactEmail !== (profile.contactEmail ?? "") ||
      form.contactPhone !== (profile.contactPhone ?? "") ||
      form.address !== (profile.address ?? "")
    );
  }, [store, form]);

  const handleSave = async () => {
    if (!store) return;
    if (form.currency.trim().length !== 3) {
      toast.error("Choose a valid 3-letter currency code (e.g. BDT, USD)");
      return;
    }
    setSaving(true);
    try {
      const existingTheme = (store.theme ?? {}) as Record<string, unknown>;
      await updateStoreAction(store.id, {
        brandName: form.brandName,
        slug: form.slug,
        country: form.country,
        currency: form.currency.trim().toUpperCase(),
        description: form.description,
        isPublished: form.isPublished,
        theme: {
          ...existingTheme,
          profile: {
            seoDescription: form.seoDescription,
            contactEmail: form.contactEmail,
            contactPhone: form.contactPhone,
            address: form.address,
          },
          contact: {
            ...((existingTheme.contact as Record<string, unknown>) ?? {}),
            phone: form.contactPhone,
            email: form.contactEmail,
          },
        },
      });
      toast.success("Shop profile saved");
      refetch();
    } catch {
      toast.error("Failed to save shop profile");
    } finally {
      setSaving(false);
    }
  };

  const copyStoreUrl = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/store/${form.slug}`
        : `/store/${form.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Store URL copied");
    } catch {
      toast.error("Could not copy URL");
    }
  };


  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const storefrontPath = `/store/${form.slug}`;
  const storefrontUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${storefrontPath}`
      : storefrontPath;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Shop profile"
        description="Name, URL, region, currency, and visibility for your storefront."
        action={
          store?.slug && (
            <Button asChild variant="outline" size="sm" className="gap-1.5 shadow-sm">
              <Link href={storefrontPath} target="_blank">
                <ExternalLink className="size-4" />
                View storefront
              </Link>
            </Button>
          )
        }
      />

      <section className="admin-panel overflow-hidden p-0">
        <div className="relative border-b border-border/50 bg-gradient-to-br from-[var(--admin-accent-soft)] via-card to-[var(--admin-sky-soft)] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
                {store?.logo ? (
                  <Image
                    src={store.logo}
                    alt={form.brandName || "Store logo"}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {(form.brandName || "S").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 space-y-1.5">
                <h3 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                  {form.brandName || "Your brand"}
                </h3>
                <p className="truncate text-sm text-muted-foreground">/store/{form.slug || "your-slug"}</p>
                <div className="flex flex-wrap gap-2">
                  {form.isPublished ? (
                    <Badge variant="secondary" className="gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                  {form.currency.length === 3 && (
                    <Badge variant="outline">
                      {form.currency.toUpperCase()} · {getCurrencyName(form.currency)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={copyStoreUrl}>
                <Copy className="size-3.5" />
                Copy URL
              </Button>
              <Button asChild size="sm" className="gap-1.5">
                <Link href={storefrontPath} target="_blank">
                  <ExternalLink className="size-3.5" />
                  Open shop
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <section className="admin-panel space-y-6 p-6">
            <div className="space-y-1">
              <p className="admin-section-label">Identity</p>
              <h3 className="text-base font-semibold">Basic information</h3>
              <p className="text-sm text-muted-foreground">
                These details appear on your public shop and in search results.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand name</Label>
                <Input
                  id="brandName"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="e.g. Modenix Atelier"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Store URL slug</Label>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <InputGroupText>/store/</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="slug"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    placeholder="your-brand"
                  />
                </InputGroup>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="seoDescription">Short description (SEO &amp; data feed)</Label>
                <span className="text-xs text-muted-foreground">
                  {form.seoDescription.length}/255
                </span>
              </div>
              <Input
                id="seoDescription"
                maxLength={255}
                value={form.seoDescription}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                placeholder="One-line summary for search engines and social sharing"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brand description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell customers about your brand, style, and values..."
                className="min-h-[120px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Shown on your storefront homepage when customers visit your shop.
              </p>
            </div>
          </section>

          <section className="admin-panel space-y-6 p-6">
            <div className="space-y-1">
              <p className="admin-section-label">Contact</p>
              <h3 className="text-base font-semibold">Shop contact details</h3>
              <p className="text-sm text-muted-foreground">
                Contact info shown on your storefront footer and product pages.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="hello@yourbrand.com"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="+1 555 000 0000"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Shop address</Label>
              <Textarea
                id="address"
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, city, country"
                className="resize-y"
              />
            </div>
          </section>

          <section className="admin-panel space-y-6 p-6">
            <div className="space-y-1">
              <p className="admin-section-label">Region</p>
              <h3 className="text-base font-semibold">Location & currency</h3>
              <p className="text-sm text-muted-foreground">
                Set where you operate and how prices are displayed to shoppers.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <MapPin className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. Bangladesh"
                  />
                </InputGroup>
              </div>
              <div>
                <CurrencySelect
                  value={form.currency}
                  onChange={(currency) => setForm({ ...form, currency })}
                  showPreview={false}
                />
              </div>
            </div>

            {form.currency.length === 3 && (
              <div className="flex gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg admin-stat-warm">
                  <Sparkles className="size-4 text-[var(--admin-accent-strong)]" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Storefront pricing preview</p>
                  <p className="mt-1 text-muted-foreground">
                    Example: {formatPriceSample(form.currency)} — all product, cart, and checkout amounts
                    display as {getCurrencyName(form.currency)} ({form.currency.toUpperCase()}).
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="admin-panel p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="admin-section-label">Visibility</p>
                <Label htmlFor="published" className="text-base font-semibold">
                  Publish storefront
                </Label>
                <p className="text-sm text-muted-foreground">
                  When off, your shop is hidden from public visitors. You can still preview it while logged in.
                </p>
              </div>
              <Switch
                id="published"
                checked={form.isPublished}
                onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
                className="shrink-0"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <section className="admin-panel space-y-4 p-5">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg admin-stat-sky">
                <Globe className="size-4 text-foreground/70" />
              </div>
              <h3 className="text-sm font-semibold">Storefront link</h3>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Public URL</p>
              <Link
                href={storefrontPath}
                target="_blank"
                className="block break-all text-sm font-medium text-primary hover:underline"
              >
                {storefrontUrl}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={copyStoreUrl}>
                <Copy className="size-3.5" />
                Copy
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={storefrontPath} target="_blank">
                  <ExternalLink className="size-3.5" />
                  Visit
                </Link>
              </Button>
            </div>
          </section>

          <section className="admin-panel space-y-3 p-5">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg admin-stat-slate">
                <Store className="size-4 text-foreground/70" />
              </div>
              <h3 className="text-sm font-semibold">Quick tips</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--admin-accent-strong)]" />
                Keep your slug short and memorable — it appears in every product link.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--admin-accent-strong)]" />
                Set currency before adding products so prices stay consistent.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--admin-accent-strong)]" />
                Publish only when branding and shipping are ready for customers.
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/90 p-4 backdrop-blur-md sm:static sm:rounded-xl sm:border sm:p-4",
          "lg:left-auto lg:right-auto",
        )}
      >
        <div className="mx-auto flex max-w-none items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {isDirty ? (
              <span className="text-foreground">You have unsaved changes</span>
            ) : (
              "All changes saved"
            )}
          </p>
          <Button onClick={handleSave} disabled={saving || !isDirty} className="min-w-[140px] shadow-sm">
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save profile
          </Button>
        </div>
      </div>
    </div>
  );
}
