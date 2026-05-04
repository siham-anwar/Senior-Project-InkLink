"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Zap } from "lucide-react";
import { FadeInView } from "@/components/fade-in-view";

const features = [
  {
    icon: Zap,
    title: "AI Content Screening",
    body: "Every chapter is analyzed in real-time by our proprietary AI model to detect policy violations before publishing.",
  },
  {
    icon: Lock,
    title: "Parental Controls",
    body: "Create linked child accounts with strict access limits, ensuring kids only see age-appropriate, child-safe stories.",
  },
  {
    icon: Eye,
    title: "Human Admin Review",
    body: "Borderline content is escalated to our dedicated human moderation team, combining AI efficiency with human empathy.",
  },
] as const;

export function ModerationHighlight() {
  return (
    <section className="border-b border-border bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Industry-Leading Safety
          </h2>
          <p className="mt-4 text-sm text-foreground/50">
            A robust, multi-layered safety system to ensure InkLink remains a welcoming and age-appropriate environment.
          </p>
        </FadeInView>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <FadeInView key={feature.title} delay={i * 0.08}>
              <motion.div
                className="flex h-full flex-col rounded-2xl border border-border bg-card/50 p-6 shadow-sm"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  <feature.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {feature.body}
                </p>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
