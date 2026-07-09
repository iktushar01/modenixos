"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import Hero from "./landing/Hero";
import SocialProofStrip from "./SocialProofStrip";

function SectionFallback() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="min-h-[12rem] overflow-hidden border-b border-border/40" aria-hidden>
      <div className="mkt-section flex h-full min-h-[12rem] flex-col items-center justify-center gap-4 py-12">
        <div className="h-3 w-40 rounded-full bg-muted/60" />
        <div className="h-3 w-64 rounded-full bg-muted/40" />
      </div>
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none -mt-[12rem] h-[12rem] w-full bg-gradient-to-r from-transparent via-background/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
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

function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-primary/60 via-primary to-primary/60"
      style={{ scaleX }}
    />
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollProgress />
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