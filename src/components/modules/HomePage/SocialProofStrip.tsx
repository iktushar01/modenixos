"use client";

import { socialProofItems } from "./landing-data";

export default function SocialProofStrip() {
  return (
    <section className="border-b border-border/60 bg-muted/20 py-10 backdrop-blur-sm" aria-label="Platform capabilities">
      <div className="mkt-section">
        <p className="mkt-label mb-6 text-center">
          Everything modern businesses need to sell online
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {socialProofItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
