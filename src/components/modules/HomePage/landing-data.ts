import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  CreditCard,
  Globe,
  Layers,
  LineChart,
  Package,
  Percent,
  Search,
  Shield,
  ShoppingBag,
  Smartphone,
  Store,
  Tag,
  Truck,
  Users,
  Zap,
} from "lucide-react";

export type IndustryId = "fashion" | "electronics" | "furniture" | "grocery" | "beauty";

export type IndustryPreview = {
  id: IndustryId;
  label: string;
  storeName: string;
  tagline: string;
  accent: string;
  accentMuted: string;
  revenue: string;
  revenueTrend: string;
  orders: string;
  ordersTrend: string;
  products: string;
  conversion: string;
  chartHeights: number[];
  recentOrders: string[];
  notification: { title: string; subtitle: string };
  storefrontProducts: { name: string; price: string; gradient: string }[];
};

export const industries: IndustryPreview[] = [
  {
    id: "fashion",
    label: "Fashion",
    storeName: "Luxe Threads",
    tagline: "Premium apparel & accessories",
    accent: "from-violet-500 to-fuchsia-500",
    accentMuted: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    revenue: "$24,680",
    revenueTrend: "+18%",
    orders: "312",
    ordersTrend: "+24",
    products: "148",
    conversion: "3.8%",
    chartHeights: [42, 58, 48, 72, 65, 88, 76],
    recentOrders: ["Silk Blazer — $189", "Linen Dress — $124", "Cashmere Coat — $298"],
    notification: { title: "New order", subtitle: "Silk Blazer — $189" },
    storefrontProducts: [
      { name: "Silk Blazer", price: "$189", gradient: "from-rose-200/90 to-rose-100/50 dark:from-rose-900/50 dark:to-rose-950/30" },
      { name: "Linen Dress", price: "$124", gradient: "from-violet-200/90 to-violet-100/50 dark:from-violet-900/50 dark:to-violet-950/30" },
      { name: "Cashmere Coat", price: "$298", gradient: "from-slate-200/90 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30" },
      { name: "Wide Trousers", price: "$98", gradient: "from-amber-200/90 to-amber-100/50 dark:from-amber-900/40 dark:to-amber-950/30" },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    storeName: "NovaTech",
    tagline: "Consumer electronics & gadgets",
    accent: "from-blue-500 to-cyan-500",
    accentMuted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    revenue: "$41,920",
    revenueTrend: "+22%",
    orders: "189",
    ordersTrend: "+31",
    products: "86",
    conversion: "4.2%",
    chartHeights: [55, 62, 70, 68, 82, 90, 85],
    recentOrders: ["Wireless Earbuds — $79", "4K Monitor — $449", "Mechanical Keyboard — $129"],
    notification: { title: "New order", subtitle: "4K Monitor — $449" },
    storefrontProducts: [
      { name: "Wireless Earbuds", price: "$79", gradient: "from-blue-200/90 to-blue-100/50 dark:from-blue-900/50 dark:to-blue-950/30" },
      { name: "4K Monitor", price: "$449", gradient: "from-slate-200/90 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30" },
      { name: "Smart Watch", price: "$249", gradient: "from-cyan-200/90 to-cyan-100/50 dark:from-cyan-900/40 dark:to-cyan-950/30" },
      { name: "USB-C Hub", price: "$59", gradient: "from-indigo-200/90 to-indigo-100/50 dark:from-indigo-900/40 dark:to-indigo-950/30" },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    storeName: "Oak & Co.",
    tagline: "Modern home furniture",
    accent: "from-amber-500 to-orange-500",
    accentMuted: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    revenue: "$18,340",
    revenueTrend: "+14%",
    orders: "67",
    ordersTrend: "+9",
    products: "42",
    conversion: "2.9%",
    chartHeights: [38, 44, 52, 48, 58, 62, 68],
    recentOrders: ["Oak Dining Table — $890", "Linen Sofa — $1,240", "Floor Lamp — $129"],
    notification: { title: "New order", subtitle: "Oak Dining Table — $890" },
    storefrontProducts: [
      { name: "Oak Dining Table", price: "$890", gradient: "from-amber-200/90 to-amber-100/50 dark:from-amber-900/40 dark:to-amber-950/30" },
      { name: "Linen Sofa", price: "$1,240", gradient: "from-stone-200/90 to-stone-100/50 dark:from-stone-800/50 dark:to-stone-900/30" },
      { name: "Floor Lamp", price: "$129", gradient: "from-orange-200/90 to-orange-100/50 dark:from-orange-900/40 dark:to-orange-950/30" },
      { name: "Bookshelf", price: "$349", gradient: "from-yellow-200/90 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-950/20" },
    ],
  },
  {
    id: "grocery",
    label: "Grocery",
    storeName: "FreshCart",
    tagline: "Local grocery delivery",
    accent: "from-emerald-500 to-green-500",
    accentMuted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    revenue: "$9,870",
    revenueTrend: "+11%",
    orders: "524",
    ordersTrend: "+48",
    products: "320",
    conversion: "5.1%",
    chartHeights: [60, 55, 65, 70, 72, 78, 80],
    recentOrders: ["Organic Basket — $42", "Weekly Essentials — $68", "Fresh Produce Box — $35"],
    notification: { title: "New order", subtitle: "Weekly Essentials — $68" },
    storefrontProducts: [
      { name: "Organic Basket", price: "$42", gradient: "from-green-200/90 to-green-100/50 dark:from-green-900/40 dark:to-green-950/30" },
      { name: "Fresh Produce", price: "$35", gradient: "from-lime-200/90 to-lime-100/50 dark:from-lime-900/40 dark:to-lime-950/30" },
      { name: "Artisan Bread", price: "$8", gradient: "from-amber-200/90 to-amber-100/50 dark:from-amber-900/40 dark:to-amber-950/30" },
      { name: "Cold Press Juice", price: "$12", gradient: "from-emerald-200/90 to-emerald-100/50 dark:from-emerald-900/40 dark:to-emerald-950/30" },
    ],
  },
  {
    id: "beauty",
    label: "Beauty",
    storeName: "Glow Studio",
    tagline: "Skincare & cosmetics",
    accent: "from-pink-500 to-rose-500",
    accentMuted: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    revenue: "$15,420",
    revenueTrend: "+19%",
    orders: "241",
    ordersTrend: "+17",
    products: "96",
    conversion: "4.6%",
    chartHeights: [45, 52, 58, 62, 68, 74, 82],
    recentOrders: ["Vitamin C Serum — $48", "Hydrating Mask — $32", "Lip Set — $24"],
    notification: { title: "New order", subtitle: "Vitamin C Serum — $48" },
    storefrontProducts: [
      { name: "Vitamin C Serum", price: "$48", gradient: "from-pink-200/90 to-pink-100/50 dark:from-pink-900/40 dark:to-pink-950/30" },
      { name: "Hydrating Mask", price: "$32", gradient: "from-rose-200/90 to-rose-100/50 dark:from-rose-900/40 dark:to-rose-950/30" },
      { name: "Lip Set", price: "$24", gradient: "from-fuchsia-200/90 to-fuchsia-100/50 dark:from-fuchsia-900/40 dark:to-fuchsia-950/30" },
      { name: "Night Cream", price: "$56", gradient: "from-purple-200/90 to-purple-100/50 dark:from-purple-900/40 dark:to-purple-950/30" },
    ],
  },
];

export const socialProofItems = [
  { icon: Package, label: "Products" },
  { icon: ShoppingBag, label: "Orders" },
  { icon: Users, label: "Customers" },
  { icon: LineChart, label: "Analytics" },
  { icon: CreditCard, label: "Payments" },
  { icon: Boxes, label: "Inventory" },
  { icon: Tag, label: "Marketing" },
  { icon: Percent, label: "Discounts" },
] as const;

export const stats = [
  { to: 5, suffix: " min", label: "Average time to go live", prefix: "" },
  { to: 50, suffix: "+", label: "Products on the free plan", prefix: "" },
  { to: 12, suffix: "+", label: "Industries supported", prefix: "" },
  { to: 99.9, suffix: "%", label: "Platform uptime", prefix: "" },
];

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: FeatureItem[] = [
  {
    icon: Store,
    title: "Beautiful storefronts",
    description: "Launch a polished, mobile-ready storefront with your branding, collections, and product pages — in minutes.",
  },
  {
    icon: Boxes,
    title: "Smart inventory",
    description: "Track stock, variants, and SKUs across categories. Know what's selling and what needs restocking.",
  },
  {
    icon: Layers,
    title: "Product variants",
    description: "Sizes, colors, options — handle complex catalogs without spreadsheets or custom code.",
  },
  {
    icon: Users,
    title: "Customer management",
    description: "View purchase history, contact details, and lifetime value. Build relationships that drive repeat sales.",
  },
  {
    icon: Shield,
    title: "Secure checkout",
    description: "Guest checkout, order confirmation, and payment-ready flows that customers trust.",
  },
  {
    icon: Truck,
    title: "Order fulfillment",
    description: "Manage orders from pending to delivered. Keep customers informed at every step.",
  },
  {
    icon: Tag,
    title: "Coupons & promotions",
    description: "Run campaigns with discount codes and limited-time offers to boost conversion.",
  },
  {
    icon: BarChart3,
    title: "Sales analytics",
    description: "Revenue, orders, top products, and trends — the metrics that matter for growth.",
  },
  {
    icon: Search,
    title: "SEO optimization",
    description: "Clean URLs, structured product pages, and fast load times that search engines reward.",
  },
  {
    icon: Smartphone,
    title: "Mobile responsive",
    description: "Every storefront and dashboard screen adapts beautifully to phones, tablets, and desktops.",
  },
  {
    icon: Zap,
    title: "Fast performance",
    description: "Built for speed with modern architecture. Your store loads fast — customers stay longer.",
  },
  {
    icon: Globe,
    title: "Multi-category catalog",
    description: "Fashion, electronics, furniture, grocery, beauty — one platform for any product type.",
  },
];

export const howItWorksSteps = [
  {
    title: "Create your store",
    description: "Sign up, add your business details, and configure your catalog structure in minutes.",
  },
  {
    title: "Add your products",
    description: "Upload products with images, variants, pricing, and categories. Organize into collections.",
  },
  {
    title: "Customize & publish",
    description: "Set your brand colors, logo, and theme. Hit publish — your storefront goes live instantly.",
  },
  {
    title: "Sell & scale",
    description: "Process orders, engage customers, and use analytics to grow revenue with confidence.",
  },
];

export const testimonials = [
  {
    quote:
      "We replaced three different tools with ModenixOS. Storefront, orders, and analytics — finally in one place.",
    name: "Marcus Webb",
    role: "Founder, NovaTech Electronics",
    initials: "MW",
    industry: "Electronics",
  },
  {
    quote:
      "Our furniture catalog is complex, but managing variants and fulfillment from one dashboard changed everything.",
    name: "Elena Vasquez",
    role: "Owner, Oak & Co.",
    initials: "EV",
    industry: "Furniture",
  },
  {
    quote:
      "From launch to first 100 orders took less than a week. The platform just works — no developer needed.",
    name: "Priya Sharma",
    role: "CEO, Glow Studio",
    initials: "PS",
    industry: "Beauty",
  },
  {
    quote:
      "We still sell fashion, but ModenixOS feels like enterprise software. Clean, fast, and built to scale.",
    name: "Amira Chen",
    role: "Founder, Luxe Threads",
    initials: "AC",
    industry: "Fashion",
  },
  {
    quote:
      "Digital products, subscriptions, instant delivery — ModenixOS handles our entire commerce operation.",
    name: "James Okonkwo",
    role: "Creator, PixelForge",
    initials: "JO",
    industry: "Digital Products",
  },
  {
    quote:
      "Grocery delivery needs speed. Order management and inventory sync keep our team ahead every day.",
    name: "Sofia Reyes",
    role: "Operations Lead, FreshCart",
    initials: "SR",
    industry: "Grocery",
  },
];

export type PricingPlan = {
  name: string;
  monthlyPrice: number | null;
  desc: string;
  features: string[];
  highlight?: boolean;
  cta: string;
  href: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    desc: "Launch your store at no cost",
    features: [
      "25 products",
      "50 orders / month",
      "Public storefront",
      "Basic analytics",
      "Guest checkout",
    ],
    cta: "Start free",
    href: "/register",
  },
  {
    name: "Pro",
    monthlyPrice: 1,
    desc: "For solo sellers",
    features: [
      "100 products",
      "500 orders / month",
      "Coupons & promotions",
      "Custom branding",
      "Newsletter (500 subs)",
    ],
    cta: "Start free trial",
    href: "/register",
  },
  {
    name: "Pro+",
    monthlyPrice: 3,
    desc: "Growing businesses",
    features: [
      "500 products",
      "5,000 orders / month",
      "Advanced analytics",
      "Custom domain",
      "14-day free trial",
    ],
    highlight: true,
    cta: "Start free trial",
    href: "/register",
  },
  {
    name: "Ultra Pro+",
    monthlyPrice: 5,
    desc: "Power sellers",
    features: [
      "Unlimited products",
      "Unlimited orders",
      "Priority support",
      "Everything in Pro+",
      "Unlimited newsletter",
    ],
    cta: "Start free trial",
    href: "/register",
  },
];

export const faqs = [
  {
    q: "What types of businesses can use ModenixOS?",
    a: "Any business that sells online — fashion, electronics, furniture, grocery, beauty, digital products, books, pet supplies, and more. ModenixOS is industry-agnostic by design.",
  },
  {
    q: "Do I need technical skills?",
    a: "No. ModenixOS is built for business owners and operators, not developers. Create your store, add products, customize your storefront, and start selling from an intuitive dashboard.",
  },
  {
    q: "How quickly can I launch?",
    a: "Most businesses go from signup to a live storefront in under 10 minutes. Add your details, upload products, publish, and share your store link.",
  },
  {
    q: "Can customers checkout without an account?",
    a: "Yes. Guest checkout reduces friction and helps you capture more completed orders with just name and email.",
  },
  {
    q: "What's included in the free plan?",
    a: "Free includes 25 products, 50 orders per month, a public storefront, basic analytics, and guest checkout. No credit card required.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. New stores get 14 days of Pro+ features automatically — no credit card required. You can also start a trial from billing settings if you haven't used one yet.",
  },
  {
    q: "How much do paid plans cost?",
    a: "Pro is $1/month, Pro+ is $3/month, and Ultra Pro+ is $5/month. Yearly billing saves about 17% ($10, $30, and $50 per year).",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Absolutely. Change plans as your business grows. Upgrades take effect immediately; downgrades apply at the end of your billing period.",
  },
];
