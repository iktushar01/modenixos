"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { buildThemePayload, parseStorefrontTheme, StorefrontTemplateId } from "@/lib/storefront";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSection } from "./StoreSection";
import { StoreSaveBar } from "./StoreSaveBar";
import { StoreThemePicker } from "./StoreThemePicker";

export default function StoreThemePage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState<StorefrontTemplateId>("theme1");

  useEffect(() => {
    if (store) {
      const theme = parseStorefrontTheme(store);
      setTemplateId(theme.templateId);
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;

    setSaving(true);
    try {
      const existing = (store.theme ?? {}) as Record<string, unknown>;
      const themePayload = buildThemePayload({
        templateId,
        existingTheme: existing,
      });

      await updateStoreAction(store.id, { theme: themePayload });
      toast.success("Storefront theme saved");
      refetch();
    } catch {
      toast.error("Failed to save theme");
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
        title="Storefront theme"
        description="Pick the layout for your public shop. More themes are coming soon."
      />

      <StoreSection
        eyebrow="Layout"
        title="Available themes"
        description="Your active theme controls the structure and sections of your storefront."
      >
        <StoreThemePicker value={templateId} onChange={setTemplateId} />
      </StoreSection>

      <StoreSaveBar
        label="Save theme"
        onSave={handleSave}
        saving={saving}
        hint="Applies the selected layout to your public storefront."
      />
    </>
  );
}
