"use client";

import { CheckCircle2, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const devSteps = [
  { label: "Clone repos", code: "modenixos-server + modenixos-client" },
  { label: "Server env", code: "cp .env.example .env → fill DATABASE_URL, auth secrets, Cloudinary" },
  { label: "Migrate DB", code: "npm run db:migrate" },
  { label: "Seed demo (optional)", code: "npm run seed:demo" },
  { label: "Run both apps", code: "server :5000 · client :3000" },
];

export default function DeveloperSection() {
  return (
    <section id="developers" className="scroll-mt-28 border-b border-border bg-muted/20 py-16 md:py-20">
      <div className="mkt-section max-w-4xl">
        <AnimatedContent distance={40} duration={0.8}>
          <MarketingSectionHeader
            label="For developers"
            title="Run it locally"
            description="Full-stack setup for recruiters and contributors evaluating the codebase."
          />
        </AnimatedContent>

        <AnimatedContent distance={40} duration={0.75} delay={0.08}>
          <Card className="mt-10 border-border bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#7047EB]" />
                <CardTitle className="text-lg">Local development</CardTitle>
              </div>
              <CardDescription>
                Client talks to server at{" "}
                <code className="text-xs">http://localhost:5000/api/v1</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {devSteps.map((step, i) => (
                  <li key={step.label} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.label}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{step.code}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-2">
                {["npm run dev", "pnpm dev", "npm run seed:demo"].map((cmd) => (
                  <Badge key={cmd} variant="outline" className="font-mono text-xs">
                    {cmd}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>

        <FadeContent blur duration={800} delay={150}>
          <div className="mt-8 rounded-md border border-dashed border-border p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <CheckCircle2 className="h-5 w-5 text-[#7047EB]" />
              Recruiter demo checklist
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Sign up → verify email → create brand",
                "Add 3 products with images",
                "Publish store in Settings",
                "Checkout on storefront (incognito)",
                "Manage order status in dashboard",
                "View revenue in Analytics",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7047EB]/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
