"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { NewsletterNav } from "./NewsletterNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { getCollectionsAction, getProductsAction } from "@/actions/catalog.actions";
import {
  createNewsletterCampaignAction,
  getNewsletterCampaignAction,
  NewsletterCampaign,
  sendNewsletterCampaignAction,
  updateNewsletterCampaignAction,
} from "@/actions/newsletter.actions";
import { cn } from "@/lib/utils";

const CAMPAIGN_TYPES = [
  { value: "PROMOTION", label: "Promotion", description: "Sale, offer, or seasonal promo" },
  { value: "PRODUCT_SPOTLIGHT", label: "Product spotlight", description: "Highlight selected products" },
  { value: "NEW_ARRIVALS", label: "New arrivals", description: "Automatically feature latest products" },
  { value: "COLLECTION", label: "Collection", description: "Promote a product collection" },
  { value: "ANNOUNCEMENT", label: "Announcement", description: "Text-only update" },
  { value: "CUSTOM", label: "Custom", description: "Flexible message" },
] as const;

type CampaignType = NewsletterCampaign["type"];

export default function NewsletterCampaignEditorPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string | undefined;
  const isNew = !campaignId || campaignId === "new";

  const [type, setType] = useState<CampaignType>("PROMOTION");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [headline, setHeadline] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [collectionId, setCollectionId] = useState<string>("");
  const [productIds, setProductIds] = useState<string[]>([]);

  const { data: campaign, isLoading: loadingCampaign } = useQuery({
    queryKey: ["newsletter-campaign", campaignId],
    queryFn: () => getNewsletterCampaignAction(campaignId!),
    enabled: !isNew,
  });

  const { data: productsRes, isLoading: loadingProducts } = useQuery({
    queryKey: ["products-for-newsletter"],
    queryFn: () => getProductsAction({ status: "ACTIVE", limit: 100 }),
  });

  const { data: collectionsRes } = useQuery({
    queryKey: ["collections-for-newsletter"],
    queryFn: () => getCollectionsAction({ limit: 100 }),
  });

  const products = productsRes?.data ?? [];
  const collections = collectionsRes?.data ?? [];

  useEffect(() => {
    if (!campaign) return;
    setType(campaign.type);
    setSubject(campaign.subject);
    setPreviewText(campaign.previewText ?? "");
    setHeadline(campaign.headline ?? "");
    setBodyHtml(campaign.bodyHtml ?? "");
    setCouponCode(campaign.couponCode ?? "");
    setCollectionId(campaign.collectionId ?? "");
    setProductIds(campaign.productIds ?? []);
  }, [campaign]);

  const showProductPicker = useMemo(
    () => type === "PRODUCT_SPOTLIGHT" || type === "PROMOTION" || type === "CUSTOM",
    [type],
  );
  const showCollectionPicker = type === "COLLECTION";

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        type,
        subject,
        previewText: previewText || undefined,
        headline: headline || undefined,
        bodyHtml: bodyHtml || undefined,
        productIds: showProductPicker ? productIds : [],
        collectionId: showCollectionPicker && collectionId ? collectionId : null,
        couponCode: couponCode || null,
      };
      if (isNew) {
        return createNewsletterCampaignAction(payload);
      }
      return updateNewsletterCampaignAction(campaignId!, payload);
    },
    onSuccess: (saved) => {
      toast.success(isNew ? "Campaign created" : "Campaign saved");
      if (isNew) router.replace(`/dashboard/marketing/newsletter/campaigns/${saved.id}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      let id = campaignId;
      if (isNew || !id) {
        const saved = await saveMutation.mutateAsync();
        id = saved.id;
      } else {
        await saveMutation.mutateAsync();
      }
      return sendNewsletterCampaignAction(id!);
    },
    onSuccess: () => {
      toast.success("Campaign sent");
      router.push("/dashboard/marketing/newsletter/campaigns");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleProduct = (id: string) => {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  if (!isNew && loadingCampaign) return <DashboardFormSkeleton compact />;

  return (
    <div className="dashboard-page pb-24 sm:pb-0">
      <NewsletterNav />
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/marketing/newsletter/campaigns">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Campaigns
          </Link>
        </Button>
      </div>
      <PageHeader
        eyebrow="Marketing"
        title={isNew ? "Create campaign" : "Edit campaign"}
        description="Choose a post type, customize your message, and publish to subscribers."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              Save draft
            </Button>
            <Button onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending || !subject.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send now
            </Button>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="dashboard-panel p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Post type</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {CAMPAIGN_TYPES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-colors",
                    type === option.value ? "border-primary bg-primary/5" : "hover:bg-muted/40",
                  )}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="dashboard-panel space-y-4 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Email content</h2>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject line</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Summer sale — 20% off this week" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previewText">Preview text</Label>
              <Input id="previewText" value={previewText} onChange={(e) => setPreviewText(e.target.value)} placeholder="Short inbox preview" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyHtml">Message</Label>
              <Textarea id="bodyHtml" rows={6} value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} />
            </div>
            {(type === "PROMOTION" || type === "CUSTOM") && (
              <div className="space-y-2">
                <Label htmlFor="couponCode">Coupon code (optional)</Label>
                <Input id="couponCode" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {showCollectionPicker && (
            <section className="dashboard-panel space-y-3 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Collection</h2>
              <Select value={collectionId} onValueChange={setCollectionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>
          )}

          {showProductPicker && (
            <section className="dashboard-panel p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Products</h2>
              {loadingProducts ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm",
                        productIds.includes(product.id) && "border-primary bg-primary/5",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={productIds.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                      />
                      <span className="line-clamp-2">{product.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>
          )}

          {type === "NEW_ARRIVALS" && (
            <section className="dashboard-panel p-6 text-sm text-muted-foreground">
              Latest active products will be included automatically when you send this campaign.
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
