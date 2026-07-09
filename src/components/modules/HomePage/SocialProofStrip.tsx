"use client";

import { motion, useReducedMotion } from "motion/react";
import { socialProofItems } from "./landing-data";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

export default function SocialProofStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-border/60 bg-muted/20 py-10 backdrop-blur-sm"
      aria-label="Platform capabilities"
    >
      <div className="mkt-section">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mkt-label mb-6 text-center"
        >
          Everything modern businesses need to sell online
        </motion.p>

        <motion.div
          variants={reduceMotion ? undefined : container}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {socialProofItems.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={reduceMotion ? undefined : item}
              whileHover={reduceMotion ? undefined : { y: -1 }}
              className="group flex items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
                {!reduceMotion && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-primary/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.25 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                )}
                <Icon
                  className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110"
                  aria-hidden
                />
              </span>
              {label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}