"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";

const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR", "CAD", "AUD"];

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
  });

  useEffect(() => {
    if (store) {
      setForm({
        brandName: store.brandName,
        slug: store.slug,
        country: store.country,
        currency: store.currency,
        description: store.description ?? "",
        isPublished: store.isPublished,
      });
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      await updateStoreAction(store.id, {
        brandName: form.brandName,
        slug: form.slug,
        country: form.country,
        currency: form.currency,
        description: form.description,
        isPublished: form.isPublished,
      });
      toast.success("Shop profile saved");
      refetch();
    } catch {
      toast.error("Failed to save shop profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const storefrontUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/store/${form.slug}`
      : `/store/${form.slug}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shop profile"
        description="Name, URL, region, and visibility for your storefront."
        action={
          store?.slug && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/store/${store.slug}`} target="_blank" className="gap-1.5">
                <ExternalLink className="h-4 w-4" />
                View storefront
              </Link>
            </Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
          <CardDescription>These details appear on your public shop.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand name</Label>
              <Input
                id="brandName"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Store URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">/store/</span>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell customers about your brand..."
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="published">Publish storefront</Label>
              <p className="text-xs text-muted-foreground">
                When off, your shop is hidden from public visitors.
              </p>
            </div>
            <Switch
              id="published"
              checked={form.isPublished}
              onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
            />
          </div>

          <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Storefront URL: </span>
            <Link href={`/store/${form.slug}`} target="_blank" className="font-medium text-primary hover:underline">
              {storefrontUrl}
            </Link>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
