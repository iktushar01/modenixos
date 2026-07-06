"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ExternalLink, Palette, Store } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import ThemeSettingsPage from "@/components/modules/settings/ThemeSettingsPage";
import { storeBasePath } from "@/lib/storePaths";

export default function StoreSettingsPage() {
  const { data: store, refetch } = useMyStore();
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (store) setIsPublished(store.isPublished);
  }, [store]);

  const handlePublishToggle = async (published: boolean) => {
    if (!store) return;
    setIsPublished(published);
    try {
      await updateStoreAction(store.id, { isPublished: published });
      toast.success(published ? "Store published" : "Store unpublished");
      refetch();
    } catch {
      setIsPublished(!published);
      toast.error("Failed to update publish status");
    }
  };

  const storefrontPath = store ? storeBasePath(store.slug) : "#";

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Account preferences and quick store controls." />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Storefront
          </CardTitle>
          <CardDescription>
            Brand profile, branding, appearance, and header are managed in Shop settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={handlePublishToggle} id="published-quick" />
              <Label htmlFor="published-quick">Publish storefront</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Unpublished stores are visible only to you when previewing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/dashboard/store">
                <Palette className="h-4 w-4" />
                Customize storefront
              </Link>
            </Button>
            {store && (
              <Button asChild variant="outline" className="gap-2">
                <Link href={storefrontPath} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View storefront
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ThemeSettingsPage scope="client" />

      <Card>
        <CardHeader><CardTitle>Billing</CardTitle><CardDescription>Subscription and payment methods.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">Current plan: {store?.plan ?? "FREE"}</p>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/settings/billing">Manage billing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
