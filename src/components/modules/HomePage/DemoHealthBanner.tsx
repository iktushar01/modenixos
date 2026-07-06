import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getPublicStoreAction } from "@/actions/catalog.actions";
import { DEMO_STORE_PATH, DEMO_STORE_SLUG } from "@/lib/app-config";
import { Button } from "@/components/ui/button";

export async function DemoHealthBanner() {
  const store = await getPublicStoreAction(DEMO_STORE_SLUG);

  if (store) return null;

  return (
    <div
      role="alert"
      className="border-b border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <div className="mkt-section flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            Demo store is not available. Run{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-900/50">
              npm run seed:demo
            </code>{" "}
            in <strong>modenixos-server</strong> to enable the live demo.
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0 border-amber-500/40">
          <Link href={DEMO_STORE_PATH}>Try demo URL</Link>
        </Button>
      </div>
    </div>
  );
}
