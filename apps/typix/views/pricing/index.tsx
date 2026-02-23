"use client";

import { Check, Github, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Spotlight } from "@/components/effects/spotlight";

const communityFeatures = [
  "Unlimited editors & projects",
  "17+ modular extensions",
  "Rich text, code blocks & media",
  "Zero UI restrictions",
  "TypeScript support",
  "Next.js & React ready",
  "MIT license — use anywhere",
  "Community & GitHub support",
];

const proFeatures: { label: string; isAI: boolean }[] = [
  { label: "Everything in Community", isAI: false },
  { label: "AI writing assistant", isAI: true },
  { label: "AI autocomplete & suggestions", isAI: true },
  { label: "AI grammar & style checking", isAI: true },
  { label: "AI content generation", isAI: true },
  { label: "Real-time collaboration", isAI: false },
  { label: "Custom themes builder", isAI: false },
  { label: "Priority support & SLA", isAI: false },
  { label: "Dedicated onboarding", isAI: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PricingPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1 }}
      >
        <Spotlight
          className="absolute -translate-x-1/3 -translate-y-1/3 top-0 left-0 opacity-50"
          fill="white"
        />
      </motion.div>
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          {/* Heading */}
          <motion.div
            className="mb-12 text-center sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Badge
              className="mb-4 gap-1.5 border-emerald-500/30 px-3 py-1 font-medium text-emerald-500 text-xs sm:text-sm"
              variant="outline"
            >
              <Sparkles className="size-3.5" />
              100% Free
            </Badge>
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Free &{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                Open Source
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
              Typix is completely free to use. No paywalls, no premium tiers —
              just a powerful editor framework for everyone.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-emerald-500/5">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-green-500/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="text-center">
                    <h2 className="font-bold text-xl sm:text-2xl">Community</h2>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="font-bold text-5xl tracking-tight">
                        $0
                      </span>
                      <span className="text-muted-foreground text-sm">
                        / forever
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Everything included. No strings attached.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <Button asChild size="lg">
                      <Link href="/docs">Get Started</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link
                        href="https://github.com/mrdiyorbek-juraev/typix"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Github className="size-4" />
                        Star on GitHub
                      </Link>
                    </Button>
                  </div>

                  <motion.ul
                    className="mt-8 space-y-3 border-t border-border/60 pt-8"
                    initial="hidden"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    whileInView="show"
                  >
                    {communityFeatures.map((feature) => (
                      <motion.li
                        className="flex items-center gap-3 text-sm"
                        key={feature}
                        variants={itemVariants}
                      >
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="size-3 text-emerald-500" />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </motion.div>

            {/* Pro — Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-card p-8 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
                {/* Gradient border glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-green-500/[0.05] opacity-100 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="font-bold text-xl sm:text-2xl">Pro</h2>
                      <Badge
                        className="border-emerald-500/30 text-[10px] text-emerald-500 sm:text-xs"
                        variant="outline"
                      >
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text font-bold text-5xl tracking-tight text-transparent">
                        TBD
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground text-sm">
                      For teams that need more power.
                    </p>
                  </div>

                  <div className="mt-8">
                    <Button className="w-full" size="lg" variant="outline">
                      <Sparkles className="size-4" />
                      Notify Me
                    </Button>
                  </div>

                  <motion.ul
                    className="mt-8 space-y-3 border-t border-border/60 pt-8"
                    initial="hidden"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    whileInView="show"
                  >
                    {proFeatures.map((feature) => (
                      <motion.li
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                        key={feature.label}
                        variants={itemVariants}
                      >
                        <div
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full ${feature.isAI ? "bg-emerald-500/20" : "bg-emerald-500/10"}`}
                        >
                          {feature.isAI ? (
                            <Sparkles className="size-3 text-emerald-400" />
                          ) : (
                            <Check className="size-3 text-emerald-500" />
                          )}
                        </div>
                        <span className={feature.isAI ? "text-foreground" : ""}>
                          {feature.label}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom note */}
          <motion.p
            className="mt-10 text-center text-muted-foreground text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
          >
            Need enterprise support or custom features?{" "}
            <Link
              className="text-foreground underline underline-offset-4 transition-colors hover:text-emerald-500"
              href="https://github.com/mrdiyorbek-juraev/typix/issues"
              rel="noopener noreferrer"
              target="_blank"
            >
              Get in touch
            </Link>
          </motion.p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
