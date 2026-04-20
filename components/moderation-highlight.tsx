"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { FadeInView } from "@/components/fade-in-view";

export function ModerationHighlight() {
  return (
    <section className="border-b border-border bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeInView>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              AI moderation layer
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Safety that scales with your audience
            </h2>
            <p className="mt-4 text-base  text-foreground/50">
              InkLink runs continuous checks on new and updated content so
              communities stay constructive—without slowing good writers down.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold text-foreground">
                    Toxic content detection
                  </p>
                  <p className="text-sm   text-foreground/50">
                    Models flag harassment, hate, and abuse patterns before they
                    spread.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold text-foreground">
                    Child-safe filtering
                  </p>
                  <p className=" text-base md:text-lg text-foreground/50">
                    Age-aware filters hide unsafe material for younger readers
                    while preserving teen and adult libraries.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <AlertTriangle
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold text-foreground">
                    Human review when it matters
                  </p>
                  <p className="text-sm   text-foreground/50">
                    Edge cases route to moderators with full context—not
                    opaque bans.
                  </p>
                </div>
              </li>
            </ul>
          </FadeInView>

          <FadeInView delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <p className="text-sm font-medium text-primary">Live signals</p>
              <div className="mt-6 space-y-4">
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    Toxicity scan
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Clear
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    Child-safety profile
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Protected
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-2xl border border-amber-500/35 bg-amber-500/5 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    Policy review queue
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    2 pending
                  </span>
                </motion.div>
              </div>
              <p className="mt-6 text-xs  text-foreground/60">
                Illustrative dashboard elements—numbers reset on refresh in this
                preview.
              </p>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
