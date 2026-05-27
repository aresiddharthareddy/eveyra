"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Badge variant="outline" className="mb-6">
          Technical knowledge platform
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Structured knowledge for modern technical teams.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Publish, organize, and measure documentation with enterprise-grade foundations.
          Built for engineers who value clarity, speed, and information density.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-medium text-background hover:opacity-90"
          >
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/explore"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium hover:bg-muted"
          >
            Explore docs
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
