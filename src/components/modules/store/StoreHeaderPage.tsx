"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import {
  parseStorefrontTheme,
  buildThemePayload,
  StorefrontHeaderConfig,
  StorefrontNavSource,
} from "@/lib/storefront";
import { EditableLinkList } from "./EditableLinkList";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSection } from "./StoreSection";
import { StoreSaveBar } from "./StoreSaveBar";

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
    return <DashboardFormSkeleton compact />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Header & navigation"
        description="Announcement bar, main menu, search, and phone for your storefront."
      />

      <StoreSection
        eyebrow="Top bar"
        title="Announcement bar"
        description="Full-width strip at the very top of your shop."
      >
        <div className="space-y-4">
          <div className="dashboard-toggle-row">
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
              className="h-10"
              value={form.announcement.text}
              onChange={(e) =>
                setForm({ ...form, announcement: { ...form.announcement, text: e.target.value } })
              }
              placeholder="Step Into The Festive Season With Your Brand"
            />
          </div>
        </div>
      </StoreSection>

      <StoreSection
        eyebrow="Navigation"
        title="Main navigation"
        description="Centered category menu below the logo row."
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="tagline">Brand tagline</Label>
            <Input
              id="tagline"
              className="h-10"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Life is good"
            />
            <p className="text-xs text-muted-foreground">Shown under your logo on the storefront.</p>
          </div>
          <div className="space-y-2">
            <Label>Navigation source</Label>
            <div className="dashboard-segment-group w-fit">
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
                  variant="ghost"
                  data-active={form.navSource === opt.id ? "true" : undefined}
                  className="dashboard-segment-btn h-9"
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
        </div>
      </StoreSection>

      <StoreSection eyebrow="Utility" title="Search & contact">
        <div className="space-y-4">
          <div className="dashboard-toggle-row">
            <Label htmlFor="showSearch">Show search bar</Label>
            <Switch
              id="showSearch"
              checked={form.showSearch}
              onCheckedChange={(showSearch) => setForm({ ...form, showSearch })}
            />
          </div>
          <div className="dashboard-toggle-row">
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
              className="h-10"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01777702000"
            />
          </div>
        </div>
      </StoreSection>

      <StoreSaveBar
        label="Save header & navigation"
        onSave={handleSave}
        saving={saving}
        hint="Changes apply to your public storefront header."
      />
    </>
  );
}
