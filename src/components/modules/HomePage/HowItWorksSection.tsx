import { LayoutDashboard, Rocket, ShoppingCart, Store } from "lucide-react";

const steps = [
  {
    icon: Rocket,
    title: "Launch your brand",
    description: "Register, verify email, and create your store with a unique slug in under 2 minutes.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage from one dashboard",
    description: "Products, categories, collections, orders, customers, coupons, and analytics — all store-scoped.",
  },
  {
    icon: Store,
    title: "Publish your storefront",
    description: "Your live shop lives at /store/your-slug with theme colors, featured products, and collections.",
  },
  {
    icon: ShoppingCart,
    title: "Sell & fulfill orders",
    description: "Customers browse, add to cart, checkout as guests (COD). You update order status from the dashboard.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border/60 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            From signup to first sale — a complete fashion-brand operating system in four steps.
          </p>
        </div>
        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-border lg:block" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">
                Step {index + 1}
              </p>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
