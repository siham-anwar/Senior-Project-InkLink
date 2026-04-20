"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { EditorWorksService, WorkDto } from "@/app/services/editor-works.service";

export function Hero() {
  const [featured, setFeatured] = useState<WorkDto[]>([]);

  useEffect(() => {
    EditorWorksService.browse().then(data => {
      if (data && data.length > 0) {
        setFeatured(data.slice(0, 3));
      }
    }).catch(() => {});
  }, []);

  const floatingCards = featured.length > 0 
    ? featured.map((story, i) => ({
        title: story.title,
        author: story.authorUsername || "Author",
        delay: i * 0.15,
        x: i === 0 ? "8%" : i === 1 ? "72%" : "52%",
        y: i === 0 ? "12%" : i === 1 ? "18%" : "58%",
      }))
    : [
        { title: "Morning Pages", author: "A. Rowe", delay: 0, x: "8%", y: "12%" },
        { title: "City Essays", author: "L. Park", delay: 0.15, x: "72%", y: "18%" },
        { title: "Paid · Featured", author: "InkLink", delay: 0.3, x: "52%", y: "58%" },
      ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent)]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 text-sm font-medium uppercase tracking-widest text-primary"
          >
            InkLink — Writing Platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Read. Write. <span className="text-primary">Get Paid.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/50"
          >
            A platform where writers publish, readers engage, and quality
            content earns rewards.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/editor"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-hover"
              >
                Start Writing
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#explore"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                Explore Stories
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:max-w-none">
          <div className="absolute inset-0 rounded-3xl border border-border bg-gradient-to-br from-card via-background to-card shadow-xl dark:shadow-black/40" />
          <div className="absolute inset-[12%] rounded-2xl border border-dashed border-primary/25 bg-background/60 dark:bg-background/40" />

          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20"
            animate={{ scale: [1, 1.04, 1], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <PenLine className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </motion.div>

          {floatingCards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.25 + (card.delay || 0) }}
              className="absolute w-[min(44%,200px)] rounded-xl border border-border bg-card p-3 shadow-lg dark:shadow-black/50"
              style={{ left: card.x, top: card.y }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4 + (card.delay || 0) * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: card.delay || 0,
                }}
              >
                <p className="text-xs font-medium text-primary line-clamp-1">{card.title}</p>
                <p className="mt-1 text-[11px] text-foreground/50">by {card.author}</p>
                <div className="mt-2 flex gap-2">
                  <span className="h-1.5 flex-1 rounded-full bg-primary/20" />
                  <span className="h-1.5 w-6 rounded-full bg-primary/35" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Updated documentation for clarity
