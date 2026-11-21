"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MarketingSectionHeader } from "../MarketingSectionHeader";
import { faqs } from "../landing-data";

export default function FAQSection() {
  const [openValue, setOpenValue] = useState<string | null>(null);

  return (
    <section id="faq" className="scroll-mt-28 border-b border-border/60 py-20 md:py-28">
      <div className="mkt-section max-w-3xl">
        <div className="text-center mb-14">
          <p className="mkt-label mb-4">Frequently asked questions</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.625rem]">
            Everything you need to know
          </h2>
        </div>

        <div className="mt-12 space-y-2">
          <Accordion value={openValue} onValueChange={setOpenValue} type="single" collapsible>
            {faqs.map((item) => {
              const isOpen = openValue === item.q;
              return (
                <AccordionItem key={item.q} className="rounded-xl border border-border/60 bg-background/40">
                  <AccordionTrigger
                    className="flex flex-1 items-center justify-between py-4 sm:py-3 text-left text-sm font-medium text-foreground transition-all outline-none"
                  >
                    <span className="select-none">{item.q}</span>
                    <motion.div
                      className="flex h-5 w-5 items-center justify-center shrink-0 transition-transform duration-300 ease-out"
                      style={{ rotate: reduceMotion ? 0 : isOpen ? 180 : 0 }}
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 sm:pt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
