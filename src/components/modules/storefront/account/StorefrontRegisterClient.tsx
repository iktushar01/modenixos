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
import { registerStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";

export default function StorefrontRegisterClient({
  store,
  categories = [],
}: {
  store: Store;
  categories?: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const base = `/store/${store.slug}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerStorefrontCustomerAction(store.slug, { name, email, password });
      toast.success("Account created!");
      router.push(`${base}/account/wishlist`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section mx-auto w-full max-w-md py-14">
        <h1 className="mb-2 text-2xl font-bold sf-fg">Create account</h1>
        <p className="sf-muted-fg mb-8 text-sm">
          Join {store.brandName} to save items to your wishlist.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="sf-btn-primary w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>
        <p className="sf-muted-fg mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href={`${base}/account/login`} className="sf-link font-medium underline">
            Log in
          </Link>
        </p>
      </main>
    </StorefrontPageShell>
  );
}
