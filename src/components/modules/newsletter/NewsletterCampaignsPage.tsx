"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { NewsletterNav } from "./NewsletterNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteNewsletterCampaignAction,
  getNewsletterCampaignsAction,
  NewsletterCampaign,
  sendNewsletterCampaignAction,
} from "@/actions/newsletter.actions";
import { cn } from "@/lib/utils";

function statusClass(status: NewsletterCampaign["status"]) {
  switch (status) {
    case "SENT":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
    case "SCHEDULED":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700";
    case "DRAFT":
      return "";
    case "FAILED":
      return "border-red-500/30 bg-red-500/10 text-red-700";
    default:
      return "";
  }
}

export default function NewsletterCampaignsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["newsletter-campaigns"],
    queryFn: () => getNewsletterCampaignsAction({ limit: 50, sortBy: "createdAt", sortOrder: "desc" }),
  });

  const campaigns = data?.data ?? [];

  const sendMutation = useMutation({
    mutationFn: sendNewsletterCampaignAction,
    onSuccess: () => {
      toast.success("Campaign sent to subscribers");
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["newsletter-stats"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNewsletterCampaignAction,
    onSuccess: () => {
      toast.success("Campaign deleted");
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="dashboard-page pb-24 sm:pb-0">
      <NewsletterNav />
      <PageHeader
        eyebrow="Marketing"
        title="Campaigns"
        description="Create promotional posts and send them to your subscriber list."
        action={
          <Button asChild>
            <Link href="/dashboard/marketing/newsletter/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              New campaign
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : campaigns.length === 0 ? (
        <div className="dashboard-panel flex flex-col items-center justify-center p-12 text-center">
          <Megaphone className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No campaigns yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Create your first newsletter campaign to promote products, sales, or announcements.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/marketing/newsletter/campaigns/new">Create campaign</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="dashboard-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{campaign.subject}</h3>
                  <Badge variant="outline" className={cn(statusClass(campaign.status))}>
                    {campaign.status}
                  </Badge>
                  <Badge variant="secondary">{campaign.type.replace(/_/g, " ")}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {campaign.sentAt
                    ? `Sent ${new Date(campaign.sentAt).toLocaleString()} · ${campaign.recipientCount} recipients`
                    : `Created ${new Date(campaign.createdAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/marketing/newsletter/campaigns/${campaign.id}`}>Edit</Link>
                </Button>
                {campaign.status === "DRAFT" || campaign.status === "SCHEDULED" ? (
                  <Button size="sm" onClick={() => sendMutation.mutate(campaign.id)} disabled={sendMutation.isPending}>
                    <Send className="mr-2 h-4 w-4" />
                    Send now
                  </Button>
                ) : null}
                {campaign.status !== "SENT" && campaign.status !== "SENDING" ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(campaign.id)}
                    aria-label="Delete campaign"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
