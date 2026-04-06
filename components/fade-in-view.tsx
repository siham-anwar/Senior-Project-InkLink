"use client";

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type FadeInViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
} & Omit<MotionProps, "children">;

export function FadeInView({
  children,
  className,
  delay = 0,
  ...motionProps
}: FadeInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        delay,
      }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
