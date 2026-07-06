"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import ThemeSettingsPage from "@/components/modules/settings/ThemeSettingsPage";

export default function StoreSettingsPage() {
  const { data: store, refetch } = useMyStore();
  const [form, setForm] = useState({
    brandName: "",
    description: "",
    isPublished: false,
    primaryColor: "#1a1a2e",
    secondaryColor: "#e94560",
  });

  useEffect(() => {
    if (store) {
      const theme = (store.theme ?? {}) as Record<string, string>;
      setForm({
        brandName: store.brandName,
        description: store.description ?? "",
        isPublished: store.isPublished,
        primaryColor: theme.primaryColor ?? "#1a1a2e",
        secondaryColor: theme.secondaryColor ?? "#e94560",
      });
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;
    try {
      await updateStoreAction(store.id, {
        brandName: form.brandName,
        description: form.description,
        isPublished: form.isPublished,
        theme: { primaryColor: form.primaryColor, secondaryColor: form.secondaryColor },
      });
      toast.success("Settings saved");
      refetch();
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your store configuration." />
      <Card>
        <CardHeader><CardTitle>Store Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Brand Name</Label><Input value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
            <Label>Publish store (visible on storefront)</Label>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Store Appearance</CardTitle><CardDescription>Customize colors applied to your storefront.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Primary Color</Label><Input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} /></div>
          <div><Label>Secondary Color</Label><Input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} /></div>
          <Button onClick={handleSave}>Save Appearance</Button>
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
