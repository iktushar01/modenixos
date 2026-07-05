"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { acceptShopInvitationAction } from "@/actions/shop-users.actions";
import { setCookie } from "@/lib/cookieUtils";
import { HAS_STORE_COOKIE, HAS_STORE_MAX_AGE } from "@/lib/hasStoreCookie";

export default function AcceptInvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  useEffect(() => {
    const accept = async () => {
      try {
        const result = await acceptShopInvitationAction(params.token);
        setStoreName(result.storeName);
        await setCookie(HAS_STORE_COOKIE, "1", HAS_STORE_MAX_AGE);
        toast.success(`You now have access to ${result.storeName}`);
        router.replace("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to accept invitation");
      } finally {
        setLoading(false);
      }
    };

    accept();
  }, [params.token, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Accepting invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Invitation unavailable</h1>
        <p className="max-w-md text-muted-foreground">{error}</p>
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Welcome to {storeName}</h1>
      <p className="text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
}
