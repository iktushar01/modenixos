"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Mail, Megaphone, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardStatCard } from "@/components/shared/DashboardStatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsletterNav } from "./NewsletterNav";
import { getNewsletterStatsAction } from "@/actions/newsletter.actions";

export default function NewsletterOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["newsletter-stats"],
    queryFn: getNewsletterStatsAction,
  });

  return (
    <div className="dashboard-page pb-24 sm:pb-0">
      <NewsletterNav />
      <PageHeader
        eyebrow="Marketing"
        title="Newsletter"
        description="Grow your audience, send promotions, and keep customers coming back."
        action={
          <Button asChild>
            <Link href="/dashboard/marketing/newsletter/campaigns/new">Create campaign</Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard label="Active subscribers" value={stats?.active ?? 0} icon={Users} />
          <DashboardStatCard label="Pending confirmation" value={stats?.pending ?? 0} icon={Mail} />
          <DashboardStatCard label="Unsubscribed" value={stats?.unsubscribed ?? 0} icon={Users} />
          <DashboardStatCard label="Campaigns sent" value={stats?.campaignsSent ?? 0} icon={Megaphone} />
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/marketing/newsletter/subscribers" className="dashboard-panel block p-6 transition-colors hover:bg-muted/30">
          <h3 className="font-semibold">Manage subscribers</h3>
          <p className="mt-2 text-sm text-muted-foreground">View, search, and remove newsletter subscribers.</p>
        </Link>
        <Link href="/dashboard/marketing/newsletter/campaigns" className="dashboard-panel block p-6 transition-colors hover:bg-muted/30">
          <h3 className="font-semibold">Campaigns</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create promotional posts and publish to your list.</p>
        </Link>
        <Link href="/dashboard/marketing/newsletter/settings" className="dashboard-panel block p-6 transition-colors hover:bg-muted/30">
          <h3 className="font-semibold">Email settings</h3>
          <p className="mt-2 text-sm text-muted-foreground">Customize welcome email copy, colors, and opt-in rules.</p>
        </Link>
      </div>
    </div>
  );
}
