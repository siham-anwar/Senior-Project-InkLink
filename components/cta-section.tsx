"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeInView } from "@/components/fade-in-view";

export function CtaSection() {
  return (
    <section
      id="write"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="cta-heading"
    >
      <FadeInView className="mx-auto max-w-6xl">
        <div
          id="signup"
          className="relative scroll-mt-24 overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center shadow-lg sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-black/10 blur-3xl dark:bg-white/5" />

          <h2
            id="cta-heading"
            className="relative text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Start your writing journey today
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">
            Publish on a platform that rewards quality, protects readers, and
            keeps your voice intact.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#write"
                className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition-colors hover:bg-white/95"
              >
                Join as Writer
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#explore"
                className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Start Reading
              </Link>
            </motion.div>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
