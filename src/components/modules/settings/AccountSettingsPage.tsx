"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyStore } from "@/hooks/useMyStore";
import ThemeSettingsPage from "@/components/modules/settings/ThemeSettingsPage";

export default function AccountSettingsPage() {
  const { data: store } = useMyStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account settings"
        description="Dashboard preferences and account options."
      />

      <Card>
        <CardHeader>
          <CardTitle>Your shop</CardTitle>
          <CardDescription>
            Edit storefront profile, logo, and appearance from the Shop section.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/store">Shop profile</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/store/branding">Branding</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/store/header">Header</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/store/appearance">Appearance</Link>
          </Button>
        </CardContent>
      </Card>

      <ThemeSettingsPage scope="client" embedded />

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Subscription billing coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Current plan: {store?.plan ?? "FREE"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
