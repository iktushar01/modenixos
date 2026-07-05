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
    <section className="border-b border-border bg-muted/20 py-8">
      <div className="mkt-section">
        <p className="mkt-label mb-5 text-center">Built with production-grade stack</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {stack.map((item) => (
            <span
              key={item}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
