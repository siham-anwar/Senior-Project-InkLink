"use client";

import { motion } from "framer-motion";
import { UserPlus, BookOpen, Send, Coins } from "lucide-react";
import { FadeInView } from "@/components/fade-in-view";

const steps = [
  {
    icon: UserPlus,
    title: "Create account",
    body: "Join in minutes. Pick reader, writer, or both.",
  },
  {
    icon: BookOpen,
    title: "Write or explore content",
    body: "Draft in a focused editor or browse curated feeds.",
  },
  {
    icon: Send,
    title: "Publish & engage",
    body: "Ship stories, get feedback, and grow your audience.",
  },
  {
    icon: Coins,
    title: "Earn or support creators",
    body: "Monetize engagement and tips, or back authors you love.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-card/50 px-4 py-20 dark:bg-card/30 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-sm  text-foreground/50">
            A simple path from first draft to sustainable creative income.
          </p>
        </FadeInView>

        <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <FadeInView key={step.title} delay={i * 0.08}>
              <motion.li
                className="relative flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
              >
                <span className="absolute -top-3 left-6 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <step.icon
                  className="mt-4 h-8 w-8 text-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed  md:text-sm text-foreground/60">
                  {step.body}
                </p>
              </motion.li>
            </FadeInView>
          ))}
        </ol>
      </div>
    </section>
  );
}
