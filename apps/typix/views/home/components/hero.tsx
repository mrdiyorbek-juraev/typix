"use client";

import {
  ArrowRight,
  Blocks,
  Code,
  Feather,
  Puzzle,
  Shield,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditorPreview } from "./editor-preview";

const rotatingWords = [
  "the web!",
  "developers!",
  "startups!",
  "creators!",
  "teams!",
  "everyone!",
];

const highlights = [
  { icon: Puzzle, text: "Extension-based" },
  { icon: Zap, text: "Blazing fast" },
  { icon: Code, text: "Fully typed" },
  { icon: Shield, text: "Production ready" },
  { icon: Feather, text: "Lightweight" },
  { icon: Blocks, text: "Headless core" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function useWordCycle(words: string[], interval = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % words.length),
      interval
    );
    return () => clearInterval(id);
  }, [words.length, interval]);

  return index;
}

export function Hero() {
  const wordIndex = useWordCycle(rotatingWords, 3000);

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-4 pt-12 pb-16 sm:px-6 md:pt-16 md:pb-20 lg:pt-36 lg:pb-28">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Content */}
          <motion.div
            className="flex flex-col gap-6 sm:gap-8"
            initial="hidden"
            variants={container}
            viewport={{ once: true }}
            whileInView="show"
          >
            {/* Badges */}
            <motion.div
              className="flex flex-wrap items-center gap-2"
              variants={item}
            >
              <Badge
                className="gap-2 px-3 py-1 font-medium text-xs sm:text-sm"
                variant="outline"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Open Source
              </Badge>
              <Badge
                className="gap-1.5 border-cyan-500/30 px-3 py-1 font-medium text-cyan-500 text-xs sm:text-sm"
                variant="outline"
              >
                <svg
                  aria-hidden="true"
                  className="size-3.5 sm:size-4"
                  viewBox="-11.5 -10.232 23 20.463"
                >
                  <circle fill="currentColor" r="2.05" />
                  <g fill="none" stroke="currentColor" strokeWidth="1">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                  </g>
                </svg>
                React Only
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.div
              className="flex flex-col gap-3 sm:gap-4"
              variants={item}
            >
              <h1 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                A modern editor
                <br className="hidden sm:block" /> framework for{" "}
                <br className="hidden sm:block" />
                <span className="relative inline-flex h-[1.2em] items-end overflow-hidden align-bottom">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      className="inline-block bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent"
                      exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                      initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                      key={rotatingWords[wordIndex]}
                      transition={{
                        duration: 0.45,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                    >
                      {rotatingWords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              <p className="max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
                An extensible, headless rich-text editor built on{" "}
                <a
                  className="relative inline-block font-semibold text-foreground hover:text-emerald-500 transition-colors"
                  href="https://lexical.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lexical
                  <svg
                    className="-bottom-1 absolute left-0 w-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 70 8"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M1 5.5C15 2 30 1 35 3.5C40 6 55 5 69 2.5"
                      initial={{ pathLength: 0 }}
                      stroke="url(#underline-grad)"
                      strokeLinecap="round"
                      strokeWidth="2"
                      transition={{
                        duration: 0.8,
                        delay: 0.6,
                        ease: "easeOut",
                      }}
                      viewport={{ once: true }}
                      whileInView={{ pathLength: 1 }}
                    />
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="underline-grad"
                        x1="0"
                        x2="70"
                        y1="0"
                        y2="0"
                      >
                        <stop stopColor="#34d399" />
                        <stop offset="0.5" stopColor="#22c55e" />
                        <stop offset="1" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </a>
                . From simple inputs to complex document editors — build exactly
                what you need.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              variants={item}
            >
              <Button asChild className="w-full sm:w-auto" size="lg">
                <Link href="/docs">
                  Get Started
                  <ArrowRight />
                </Link>
              </Button>

              <Button
                asChild
                className="w-full border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 sm:w-auto"
                size="lg"
                variant="outline"
              >
                <Link href="/examples">
                  <Blocks className="size-4" />
                  Examples
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={item}>
              <Separator className="max-w-xs" />
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-3"
              variants={item}
            >
              {highlights.map(({ icon: Icon, text }) => (
                <div
                  className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"
                  key={text}
                >
                  <Icon className="size-3.5 shrink-0 text-foreground sm:size-4" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Editor Preview */}
          <EditorPreview />
        </div>
      </div>
    </section>
  );
}
