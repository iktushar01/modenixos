const stack = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Express",
  "Prisma",
  "PostgreSQL",
  "TanStack Query",
  "Tailwind CSS",
];

export default function TechStackStrip() {
  return (
    <section className="border-y border-border/40 bg-muted/30 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Built with production-grade stack
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {stack.map((item) => (
            <span
              key={item}
              className="text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
