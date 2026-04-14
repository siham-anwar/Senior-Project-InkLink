"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Eye } from "lucide-react";
import { FadeInView } from "@/components/fade-in-view";
import { EditorWorksService, WorkDto } from "@/app/services/editor-works.service";
import Link from "next/link";

export function ContentPreview() {
  const [stories, setStories] = useState<WorkDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await EditorWorksService.browse();
        // Limit to 6 for the preview
        setStories(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-foreground/50">
          Loading stories...
        </div>
      </section>
    );
  }

  return (
    <section
      id="explore"
      className="border-b border-border bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <FadeInView className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Stories readers finish
            </h2>
            <p className="mt-3 max-w-xl text-base md:text-lg text-foreground/50">
              Realistic previews of how work appears on InkLink—clean
              typography, clear authorship, and live engagement signals.
            </p>
          </div>
          <span className="text-sm font-medium text-primary">Trending now</span>
        </FadeInView>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, i) => (
            <FadeInView key={story.id} delay={i * 0.06}>
              <Link href={`/book/${story.id}`}>
                <motion.article
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm cursor-pointer"
                >
                  <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {story.tags?.[0] || "Fiction"}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                    {story.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">by {story.authorUsername || "InkLink Author"}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80 line-clamp-3">
                    {story.summary}
                  </p>
                  <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs text-foreground/50">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      {Math.floor(Math.random() * 500) + 50} reads
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" aria-hidden />
                      {Math.floor(Math.random() * 100) + 10}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                      {Math.floor(Math.random() * 20) + 2}
                    </span>
                  </div>
                </motion.article>
              </Link>
            </FadeInView>
          ))}
        </ul>
      </div>
    </section>
  );
}
