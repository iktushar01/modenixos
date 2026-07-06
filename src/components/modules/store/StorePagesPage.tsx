"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { storeBasePath } from "@/lib/storePaths";
import {
  getDefaultStaticPage,
  readStaticPagesFromTheme,
  STATIC_PAGE_IDS,
  STATIC_PAGE_LABELS,
  StoreStaticPageContent,
  StoreStaticPageId,
  StoreStaticPageSection,
} from "@/lib/storefront/storeStaticPages";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSection } from "./StoreSection";
import { StoreSaveBar } from "./StoreSaveBar";
import { StaticPageSectionEditor } from "./StaticPageSectionEditor";

function sanitizeSection(section: StoreStaticPageSection): StoreStaticPageSection | null {
  const title = section.title.trim();
  if (section.bullets?.length) {
    const bullets = section.bullets.map((b) => b.trim()).filter(Boolean);
    if (!title && bullets.length === 0) return null;
    return { title, bullets };
  }
  const paragraphs = (section.paragraphs ?? []).map((p) => p.trim()).filter(Boolean);
  if (!title && paragraphs.length === 0) return null;
  return { title, paragraphs };
}

function sanitizePage(page: StoreStaticPageContent): StoreStaticPageContent {
  return {
    ...page,
    sections: page.sections
      .map(sanitizeSection)
      .filter((section): section is StoreStaticPageSection => section !== null),
  };
}

export default function StorePagesPage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [activePageId, setActivePageId] = useState<StoreStaticPageId>("about");
  const [pages, setPages] = useState<Record<StoreStaticPageId, StoreStaticPageContent>>(
    () =>
      Object.fromEntries(STATIC_PAGE_IDS.map((id) => [id, getDefaultStaticPage(id)])) as Record<
        StoreStaticPageId,
        StoreStaticPageContent
      >,
  );

  useEffect(() => {
    if (!store) return;
    setPages(readStaticPagesFromTheme(store.theme as Record<string, unknown> | null));
  }, [store]);

  const activePage = pages[activePageId];
  const previewHref = store ? `${storeBasePath(store.slug)}/${activePageId === "about" ? "about" : activePageId}` : "#";

  const isDirty = useMemo(() => {
    if (!store) return false;
    const saved = readStaticPagesFromTheme(store.theme as Record<string, unknown> | null);
    return JSON.stringify(saved) !== JSON.stringify(pages);
  }, [store, pages]);

  const updateActivePage = (patch: Partial<StoreStaticPageContent>) => {
    setPages((current) => ({
      ...current,
      [activePageId]: { ...current[activePageId], ...patch },
    }));
  };

  const resetActivePage = () => {
    setPages((current) => ({
      ...current,
      [activePageId]: getDefaultStaticPage(activePageId),
    }));
    toast.message("Reset to default template", {
      description: "Save to apply this page on your storefront.",
    });
  };

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      const existingTheme = (store.theme ?? {}) as Record<string, unknown>;
      const staticPages = Object.fromEntries(
        STATIC_PAGE_IDS.map((id) => [id, sanitizePage(pages[id])]),
      ) as Record<StoreStaticPageId, StoreStaticPageContent>;

      await updateStoreAction(store.id, {
        theme: {
          ...existingTheme,
          staticPages,
        },
      });
      toast.success("Store pages saved");
      refetch();
    } catch {
      toast.error("Failed to save store pages");
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
        title="Store pages"
        description="Manage About, policies, and Contact Us content shown on your storefront footer."
      />

      <div className="dashboard-panel mb-6 p-2">
        <div className="dashboard-segment-group flex-wrap">
          {STATIC_PAGE_IDS.map((pageId) => (
            <button
              key={pageId}
              type="button"
              data-active={activePageId === pageId ? "true" : undefined}
              className="dashboard-segment-btn"
              onClick={() => setActivePageId(pageId)}
            >
              {STATIC_PAGE_LABELS[pageId]}
            </button>
          ))}
        </div>
      </div>

      <StoreSection
        eyebrow="Page"
        title={STATIC_PAGE_LABELS[activePageId]}
        description="Use {brand} anywhere in text to insert your shop name automatically on the storefront."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {store && (
            <Button variant="outline" size="sm" asChild>
              <Link href={previewHref} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Preview page
              </Link>
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={resetActivePage}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset to default
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="page-eyebrow">Eyebrow label</Label>
            <Input
              id="page-eyebrow"
              value={activePage.eyebrow}
              onChange={(e) => updateActivePage({ eyebrow: e.target.value })}
              placeholder="e.g. Legal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="page-updated">Last updated</Label>
            <Input
              id="page-updated"
              value={activePage.lastUpdated}
              onChange={(e) => updateActivePage({ lastUpdated: e.target.value })}
              placeholder="e.g. July 2026"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="page-title">Page title</Label>
          <Input
            id="page-title"
            value={activePage.title}
            onChange={(e) => updateActivePage({ title: e.target.value })}
            placeholder="About {brand}"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="page-description">Intro description</Label>
          <Textarea
            id="page-description"
            rows={3}
            value={activePage.description}
            onChange={(e) => updateActivePage({ description: e.target.value })}
            placeholder="Short summary shown below the title..."
            className="resize-y"
          />
        </div>
      </StoreSection>

      <StoreSection
        eyebrow="Content"
        title="Page sections"
        description="Add headings with paragraphs or bullet lists. Drag order using the arrows."
        className="mt-6"
      >
        <StaticPageSectionEditor
          sections={activePage.sections}
          onChange={(sections) => updateActivePage({ sections })}
        />
      </StoreSection>

      {activePageId === "contact-us" && (
        <StoreSection
          eyebrow="Contact details"
          title="Contact info on storefront"
          description="Email, phone, and address are managed in Shop profile. The contact form and sidebar use those values."
          className="mt-6"
        >
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/store">Edit shop profile</Link>
          </Button>
        </StoreSection>
      )}

      <StoreSaveBar
        label="Save store pages"
        onSave={handleSave}
        saving={saving}
        disabled={!isDirty}
        hint="Changes appear on your storefront policy and about pages immediately after saving."
      />
    </>
  );
}
