"use client";

import dynamic from "next/dynamic";
import Hero from "./landing/Hero";
import SocialProofStrip from "./SocialProofStrip";

function SectionFallback() {
  return <div className="min-h-[12rem] border-b border-border/40" aria-hidden />;
}

const StatsSection = dynamic(() => import("./landing/Stats"), {
  loading: () => <SectionFallback />,
});
const ProductPreviewSection = dynamic(() => import("./landing/ProductPreview"), {
  loading: () => <SectionFallback />,
});
const HowItWorks = dynamic(() => import("./HowItWorksSection"), {
  loading: () => <SectionFallback />,
});
const Features = dynamic(() => import("./landing/FeaturesSection"), {
  loading: () => <SectionFallback />,
});
const Testimonials = dynamic(() => import("./TestimonialsSection"), {
  loading: () => <SectionFallback />,
});
const Pricing = dynamic(() => import("./landing/PricingSection"), {
  loading: () => <SectionFallback />,
});
const FAQ = dynamic(() => import("./landing/FAQSection"), {
  loading: () => <SectionFallback />,
});
const CTA = dynamic(() => import("./landing/CTASection"), {
  loading: () => <SectionFallback />,
});

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Hero />
      <SocialProofStrip />
      <StatsSection />
      <ProductPreviewSection />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
