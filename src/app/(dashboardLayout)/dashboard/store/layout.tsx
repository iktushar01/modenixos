import { StoreSettingsNav } from "@/components/modules/store/StoreSettingsNav";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell space-y-6 rounded-2xl border border-border/50 p-4 sm:p-6 lg:p-8">
      <header className="space-y-1.5">
        <p className="admin-section-label">Your storefront</p>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Store settings</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Customize your shop profile, branding, and how customers experience your brand online.
        </p>
      </header>

      <StoreSettingsNav />
      {children}
    </div>
  );
}
