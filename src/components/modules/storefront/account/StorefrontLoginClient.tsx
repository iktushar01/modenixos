"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Store } from "@/types/store.types";
import { loginStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { useStorefrontCustomer } from "@/components/modules/storefront/StorefrontCustomerContext";
import { AccountAuthLayout } from "./AccountAuthLayout";

export default function StorefrontLoginClient({
  store,
  categories = [],
}: {
  store: Store;
  categories?: Category[];
}) {
  const router = useRouter();
  const { setCustomer } = useStorefrontCustomer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const base = `/store/${store.slug}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const customer = await loginStorefrontCustomerAction(store.slug, { email, password });
      setCustomer(customer);
      toast.success("Welcome back!");
      router.push(`${base}/account/wishlist`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <AccountAuthLayout
          title="Log in"
          subtitle={`Sign in to ${store.brandName} to access your wishlist.`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="sf-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="sf-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="sf-btn-primary h-11 w-full rounded-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log in
            </Button>
          </form>
          <p className="sf-muted-fg mt-6 text-center text-sm">
            No account?{" "}
            <Link href={`${base}/account/register`} className="sf-link underline">
              Register
            </Link>
          </p>
        </AccountAuthLayout>
      </main>
    </StorefrontPageShell>
  );
}
