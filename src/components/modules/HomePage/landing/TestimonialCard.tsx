import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  industry: string;
};

const industryColors: Record<string, string> = {
  Electronics: "bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-500/20",
  Furniture: "bg-amber-500/10 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-500/20",
  Beauty: "bg-pink-500/10 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 border-pink-500/20",
  Fashion: "bg-violet-500/10 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 border-violet-500/20",
  "Digital Products": "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-500/20",
  Grocery: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-500/20",
};

export function TestimonialCard({ item }: { item: Testimonial }) {
  const industryClass = industryColors[item.industry] || industryColors.Fashion;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ y: -2 }}
      className={cn(
        "mkt-glass-card flex h-full flex-col rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_12px_40px_oklch(0.50_0.22_285/0.08)]",
        "group"
      )}
    >
      <div className="flex items-start gap-2 mb-6">
        <Quote className="h-7 w-7 text-primary/20 transition-transform duration-500 group-hover:scale-110" aria-hidden />
        <span className="text-[3px] text-primary/10 mt-1" aria-hidden />
      </div>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 border-t border-border/50 pt-6">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold shadow-md transition-transform duration-500 group-hover:rotate-6",
          industryClass.replace(/border-blue-500\/20|border-amber-500\/20|border-pink-500\/20|border-violet-500\/20|border-indigo-500\/20|border-emerald-500\/20/, "border-transparent")
        )}>
          {item.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.role}</p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px] px-2.5 py-1 {industryClass}">
          {item.industry}
        </Badge>
      </div>
    </motion.div>
  );
}
