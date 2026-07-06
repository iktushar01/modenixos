import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  industry: string;
};

export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="mkt-glass-card flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <Quote className="h-8 w-8 text-primary/30" aria-hidden />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {item.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <p className="truncate text-xs text-muted-foreground">{item.role}</p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {item.industry}
        </Badge>
      </div>
    </div>
  );
}
