"use client";

import { BookOpen, Bug, Github, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Spotlight } from "@/components/effects/spotlight";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

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
    icon: DiscordIcon,
    title: "Discord",
    description:
      "Hop into the Typix Discord to chat with the team and other builders in real time.",
    href: "https://discord.gg/KV5gYv5gw",
    linkLabel: "Join the server",
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
      <section className="relative py-16 md:py-24 lg:py-32 h-[calc(100vh-130px)]">
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
