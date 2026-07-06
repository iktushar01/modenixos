"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import {
  parseStorefrontTheme,
  buildThemePayload,
  StorefrontHeaderConfig,
  StorefrontNavSource,
} from "@/lib/storefront";
import { EditableLinkList } from "./EditableLinkList";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";

export default function StoreHeaderPage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StorefrontHeaderConfig & { phone: string }>({
    announcement: { enabled: true, text: "" },
    tagline: "",
    utilityLinks: [],
    navItems: [],
    navSource: "categories",
    showSearch: true,
    showPhone: true,
    phone: "",
  });

  useEffect(() => {
    if (store) {
      const theme = parseStorefrontTheme(store);
      setForm({
        ...theme.header,
        phone: theme.contact.phone,
      });
    }
  }, [store]);

  useDashboardReady(!isLoading);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      const existing = (store.theme ?? {}) as Record<string, unknown>;
      const header: StorefrontHeaderConfig = {
        announcement: form.announcement,
        tagline: form.tagline,
        utilityLinks: [],
        navItems: form.navItems.filter((l) => l.label && l.href),
        navSource: form.navSource,
        showSearch: form.showSearch,
        showPhone: form.showPhone,
      };

      await updateStoreAction(store.id, {
        theme: buildThemePayload({
          existingTheme: existing,
          header,
          contact: { phone: form.phone },
        }),
      });
      toast.success("Header & navigation saved");
      refetch();
    } catch {
      toast.error("Failed to save header settings");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Header & navigation"
        description="Announcement bar, main menu, search, and phone for your storefront."
      />

      <Card>
        <CardHeader>
          <CardTitle>Announcement bar</CardTitle>
          <CardDescription>Full-width strip at the very top of your shop.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="announcementEnabled">Show announcement bar</Label>
            <Switch
              id="announcementEnabled"
              checked={form.announcement.enabled}
              onCheckedChange={(v) =>
                setForm({ ...form, announcement: { ...form.announcement, enabled: v } })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementText">Announcement text</Label>
            <Input
              id="announcementText"
              value={form.announcement.text}
              onChange={(e) =>
                setForm({ ...form, announcement: { ...form.announcement, text: e.target.value } })
              }
              placeholder="Step Into The Festive Season With Your Brand"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Main navigation</CardTitle>
          <CardDescription>Centered category menu below the logo row.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tagline">Brand tagline</Label>
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Life is good"
            />
            <p className="text-[11px] text-muted-foreground">Shown under your logo on the storefront.</p>
          </div>
          <div className="space-y-2">
            <Label>Navigation source</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "categories", label: "From categories" },
                  { id: "manual", label: "Manual only" },
                  { id: "both", label: "Manual + categories" },
                ] as const
              ).map((opt) => (
                <Button
                  key={opt.id}
                  type="button"
                  size="sm"
                  variant={form.navSource === opt.id ? "default" : "outline"}
                  onClick={() => setForm({ ...form, navSource: opt.id as StorefrontNavSource })}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          {(form.navSource === "manual" || form.navSource === "both") && (
            <EditableLinkList
              label="Manual nav links"
              description="Use #shop, /cart, or full paths. Labels appear in ALL CAPS on the storefront."
              links={form.navItems}
              onChange={(navItems) => setForm({ ...form, navItems })}
              hrefPlaceholder="#shop or OFFER"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search & contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="showSearch">Show search bar</Label>
            <Switch
              id="showSearch"
              checked={form.showSearch}
              onCheckedChange={(showSearch) => setForm({ ...form, showSearch })}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="showPhone">Show phone number</Label>
            <Switch
              id="showPhone"
              checked={form.showPhone}
              onCheckedChange={(showPhone) => setForm({ ...form, showPhone })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01777702000"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save header & navigation
      </Button>
    </div>
  );
}
