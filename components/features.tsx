"use client";

import { motion } from "framer-motion";
import { FadeInView } from "@/components/fade-in-view";
import {
  BookOpen,
  PenLine,
  BrainCircuit,
  Baby,
  Coins,
  HeartHandshake,
} from "lucide-react";

type FeatureIcon = React.ComponentType<{ className?: string }>;

const features: ReadonlyArray<{
  icon: FeatureIcon;
  title: string;
  description: string;
}> = [
  {
    icon: BookOpen,
    title: "Read Freely",
    description: "Discover high-quality stories from global authors",
  },
  {
    icon: PenLine,
    title: "Write & Publish",
    description: "Seamless editor to share your ideas",
  },
  {
    icon: BrainCircuit,
    title: "AI Moderation",
    description: "Toxic content detection using integrated moderation service",
  },
  {
    icon: Baby,
    title: "Safe Content for Children",
    description: "Automatically filters unsafe content for younger audiences",
  },
  {
    icon: Coins,
    title: "Earn & Monetize",
    description: "Writers earn based on engagement",
  },
  {
    icon: HeartHandshake,
    title: "Reader Donations",
    description: "Support your favorite authors directly",
  },
] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-border bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl ">
        <FadeInView className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for readers, writers, and{" "}
            <span className="text-primary">trust</span>
          </h2>
          <p className="mt-4  text-base  text-foreground/50">
            Everything you need to publish with confidence and discover work
            worth your time.
          </p>
        </FadeInView>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => {
            const Icon = f.icon;

            return (
              <motion.li
                key={f.title}
                variants={item}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary">
                  {f.title}
                </h3>
                <p className="mt-2  leading-relaxed text-sm  text-foreground/50">
                  {f.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}