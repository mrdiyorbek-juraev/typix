"use client";

import { BookOpen, Bug, Github, HelpCircle, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Spotlight } from "@/components/effects/spotlight";

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const resources = [
  {
    icon: Bug,
    title: "Report a Bug",
    description:
      "Found something broken? Open an issue on GitHub and we'll look into it.",
    href: "https://github.com/mrdiyorbek-juraev/typix/issues/new",
    linkLabel: "Open an issue",
    external: true,
  },
  {
    icon: MessageCircle,
    title: "Discussions",
    description:
      "Ask questions, share ideas, and connect with the Typix community.",
    href: "https://github.com/mrdiyorbek-juraev/typix/discussions",
    linkLabel: "Join discussions",
    external: true,
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description:
      "Browse the docs for guides, API references, and extension tutorials.",
    href: "/docs",
    linkLabel: "Read the docs",
    external: false,
  },
  {
    icon: Github,
    title: "Contribute",
    description:
      "Typix is open source. Check out the repo, pick an issue, and submit a PR.",
    href: "https://github.com/mrdiyorbek-juraev/typix",
    linkLabel: "View on GitHub",
    external: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function SupportPage() {
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
          {/* Header */}
          <motion.div
            className="mb-12 flex flex-col items-center text-center sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border/60 bg-card">
              <HelpCircle className="size-6 text-emerald-500" />
            </div>
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
              How can we{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                help
              </span>
              ?
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
              Get support, report issues, or join the community.
            </p>
          </motion.div>

          {/* Resource cards */}
          <motion.div
            className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true }}
            whileInView="show"
          >
            {resources.map((r) => (
              <motion.div
                key={r.title}
                // @ts-ignore
                variants={cardVariants}
              >
                <Link
                  className="group flex h-full flex-col rounded-xl border border-border/60 bg-card p-6 transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-emerald-500/5"
                  href={r.href}
                  {...(r.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-muted/40 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
                    <r.icon className="size-5 text-muted-foreground transition-colors group-hover:text-emerald-500" />
                  </div>
                  <h3 className="mt-4 font-semibold text-base">{r.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground leading-relaxed">
                    {r.description}
                  </p>
                  <span className="mt-4 text-sm font-medium text-emerald-500">
                    {r.linkLabel} &rarr;
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
