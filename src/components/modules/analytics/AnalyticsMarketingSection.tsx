"use client";

import Link from "next/link";
import { ArrowRight, Mail, Megaphone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsOverview } from "@/types/store.types";
import { formatPrice } from "@/lib/currency";

interface AnalyticsMarketingSectionProps {
  overview: AnalyticsOverview;
  currency: string;
}

export function AnalyticsMarketingSection({ overview, currency }: AnalyticsMarketingSectionProps) {
  const { marketing } = overview;

  const cards = [
    {
      title: "Coupon redemptions",
      value: String(marketing.couponRedemptions),
      detail: `${formatPrice(marketing.couponDiscountTotal, currency)} discounted`,
      icon: Tag,
    },
    {
      title: "New subscribers",
      value: String(marketing.newsletterSubscribersNew),
      detail: `${marketing.newsletterSubscribersTotal} total active`,
      icon: Mail,
    },
    {
      title: "Campaigns sent",
      value: String(marketing.newsletterCampaignsSent),
      detail: `${marketing.newsletterCampaignsTotal} campaigns created`,
      icon: Megaphone,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Marketing performance</h3>
          <p className="text-sm text-muted-foreground">
            Coupons and newsletter activity in the selected period
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/dashboard/marketing/newsletter">
            Newsletter
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="dashboard-panel border-0 bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <card.icon className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
