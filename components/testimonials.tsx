"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { FadeInView } from "@/components/fade-in-view";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section
      id="about"
      className="border-b border-border bg-card/50 px-4 py-20 dark:bg-card/30 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Trusted by readers and writers
          </h2>
          <p className="mt-4  text-foreground/50">
            Voices from the beta on payouts, safety, and craft.
          </p>
        </FadeInView>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeInView key={t.name} delay={i * 0.07}>
              <motion.li
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm"
              >
                <Quote
                  className="h-8 w-8 text-primary/40"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  {t.quote}
                </blockquote>
                <footer className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs  text-foreground/50">{t.role}</p>
                </footer>
              </motion.li>
            </FadeInView>
          ))}
        </ul>
      </div>
    </section>
  );
}
