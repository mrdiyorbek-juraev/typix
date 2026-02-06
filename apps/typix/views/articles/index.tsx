"use client";

import { FileText } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/footer";
import { Spotlight } from "@/components/effects/spotlight";

export default function ArticlesPage() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1 }}
      >
        <Spotlight
          className="-translate-x-1/3 -translate-y-1/3 top-0 left-0 opacity-50"
          fill="white"
        />
      </motion.div>
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border/60 bg-card">
              <FileText className="size-6 text-emerald-500" />
            </div>
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                Articles
              </span>{" "}
              & Notes
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
              Guides, tutorials, and deep dives into building with Typix.
            </p>
          </motion.div>

          {/* Empty state */}
          <motion.div
            className="mx-auto mt-16 flex max-w-sm flex-col items-center text-center sm:mt-20"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-card">
              <FileText className="size-7 text-muted-foreground" />
            </div>
            <h2 className="mt-5 font-semibold text-lg">No articles yet</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              We're working on guides and tutorials. Check back soon for content
              on extensions, architecture, and more.
            </p>
            <Badge
              className="mt-4 border-emerald-500/30 text-xs text-emerald-500"
              variant="outline"
            >
              Coming Soon
            </Badge>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
