"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { NewsletterNav } from "./NewsletterNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSaveBar } from "@/components/modules/store/StoreSaveBar";
import {
  getNewsletterSettingsAction,
  NewsletterSettings,
  updateNewsletterSettingsAction,
} from "@/actions/newsletter.actions";

const defaults: NewsletterSettings = {
  enabled: true,
  doubleOptIn: false,
  welcomeEnabled: true,
  welcomeSubject: "Welcome to our newsletter",
  welcomeHeadline: "You're on the list",
  welcomeBody:
    "Thanks for subscribing. You'll be the first to hear about new arrivals, exclusive offers, and style notes.",
  footerText: "You received this email because you subscribed to our newsletter.",
  primaryColor: "#18181b",
};

export default function NewsletterSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewsletterSettings>(defaults);

  const { data, isLoading } = useQuery({
    queryKey: ["newsletter-settings"],
    queryFn: getNewsletterSettingsAction,
  });

  useEffect(() => {
    if (data) setForm({ ...defaults, ...data });
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNewsletterSettingsAction(form);
      toast.success("Newsletter settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <DashboardFormSkeleton compact />;

  return (
    <div className="dashboard-page pb-24 sm:pb-0">
      <NewsletterNav />
      <PageHeader
        eyebrow="Marketing"
        title="Newsletter settings"
        description="Control opt-in behavior and customize your welcome email."
      />

      <div className="space-y-8">
        <section className="dashboard-panel space-y-6 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Behavior</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Newsletter enabled</p>
              <p className="text-sm text-muted-foreground">Show subscribe forms on your storefront.</p>
            </div>
            <Switch checked={form.enabled !== false} onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Double opt-in</p>
              <p className="text-sm text-muted-foreground">Require email confirmation before subscribing.</p>
            </div>
            <Switch checked={form.doubleOptIn === true} onCheckedChange={(v) => setForm((f) => ({ ...f, doubleOptIn: v }))} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Welcome email</p>
              <p className="text-sm text-muted-foreground">Send a congratulation email after subscribe.</p>
            </div>
            <Switch
              checked={form.welcomeEnabled !== false}
              onCheckedChange={(v) => setForm((f) => ({ ...f, welcomeEnabled: v }))}
            />
          </div>
        </section>

        <section className="dashboard-panel space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Welcome email copy</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="welcomeSubject">Subject</Label>
              <Input
                id="welcomeSubject"
                value={form.welcomeSubject ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, welcomeSubject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Brand color</Label>
              <Input
                id="primaryColor"
                value={form.primaryColor ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcomeHeadline">Headline</Label>
            <Input
              id="welcomeHeadline"
              value={form.welcomeHeadline ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, welcomeHeadline: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcomeBody">Body</Label>
            <Textarea
              id="welcomeBody"
              rows={5}
              value={form.welcomeBody ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, welcomeBody: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerText">Email footer</Label>
            <Textarea
              id="footerText"
              rows={3}
              value={form.footerText ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, footerText: e.target.value }))}
            />
          </div>
        </section>
      </div>

      <StoreSaveBar label="Save newsletter settings" saving={saving} onSave={handleSave} />
    </div>
  );
}
