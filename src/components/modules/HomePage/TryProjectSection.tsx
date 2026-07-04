import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Package,
  ShoppingBag,
  Store,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ownerSteps = [
  {
    step: "1",
    title: "Create an account",
    description: "Sign up as a brand owner, then verify your email with the OTP sent to your inbox.",
    href: "/register",
    cta: "Sign up",
  },
  {
    step: "2",
    title: "Create your brand",
    description: "Complete onboarding with your brand name, slug, country, and currency.",
    href: "/onboarding",
    cta: "Onboarding",
  },
  {
    step: "3",
    title: "Add products & publish",
    description: "Create categories, products, then go to Settings and turn on “Publish store”.",
    href: "/dashboard/products",
    cta: "Dashboard",
  },
  {
    step: "4",
    title: "Open your storefront",
    description: "Share your public store URL, add items to cart, and place a test order (Cash on Delivery).",
    href: "/store/luxe-threads",
    cta: "Demo store",
  },
];

const devSteps = [
  { label: "Clone repos", code: "modenixos-server + modenixos-client" },
  { label: "Server env", code: "cp .env.example .env → fill DATABASE_URL, auth secrets, Cloudinary" },
  { label: "Migrate DB", code: "npm run db:migrate" },
  { label: "Seed demo (optional)", code: "npm run seed:demo" },
  { label: "Run both apps", code: "server :5000 · client :3000" },
];

export default function TryProjectSection() {
  return (
    <section id="try-project" className="scroll-mt-20 border-t border-border/60 bg-muted/20 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Get started in minutes</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Try ModenixOS</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Use the pre-seeded demo for a quick tour, or create your own brand and run the full recruiter flow.
          </p>
        </div>

        {/* Quick demo card */}
        <Card className="mx-auto mt-12 max-w-3xl border-primary/20 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <CardTitle>Fastest path — demo account</CardTitle>
            </div>
            <CardDescription>
              Already seeded on the backend. Log in and explore immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 font-mono text-sm">
              <p><span className="text-muted-foreground">Email:</span> demo@modenixos.com</p>
              <p className="mt-1"><span className="text-muted-foreground">Password:</span> demo123456</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="gap-2">
                <Link href="/login">
                  <UserPlus className="h-4 w-4" />
                  Log in as demo owner
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/store/luxe-threads" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Visit demo storefront
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Storefront slug: <code className="rounded bg-muted px-1">luxe-threads</code> · 12 products · sample orders included
            </p>
          </CardContent>
        </Card>

        {/* Full owner flow */}
        <div className="mt-16">
          <h3 className="text-center text-xl font-semibold">Full brand-owner flow</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Follow these steps to experience the complete multi-tenant SaaS journey.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ownerSteps.map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {item.step}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base pr-8">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <Button asChild variant="link" className="h-auto p-0 gap-1">
                    <Link href={item.href}>
                      {item.cta}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Local dev setup */}
        <Card className="mt-16">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Run locally (developers)</CardTitle>
            </div>
            <CardDescription>
              Both repos must be running. Client talks to server at{" "}
              <code className="text-xs">http://localhost:5000/api/v1</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {devSteps.map((step, i) => (
                <li key={step.label} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
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

        {/* Recruiter checklist */}
        <div className="mt-12 rounded-2xl border border-dashed p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
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
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600/70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
