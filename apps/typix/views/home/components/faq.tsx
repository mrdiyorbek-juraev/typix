"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const faqs = [
  {
    question: "What is Typix?",
    answer:
      "Typix is a modern, extensible rich-text editor framework built on Meta's Lexical. It provides a headless, extension-based architecture that lets you build anything from simple text inputs to complex document editors.",
  },
  {
    question: "Is Typix free and open source?",
    answer:
      "Yes! Typix is fully open source under the MIT license. You can use it in personal and commercial projects without any restrictions.",
  },
  {
    question: "How does Typix compare to other editors?",
    answer:
      "Unlike opinionated editors, Typix is headless — it doesn't force any UI on you. It's built on Lexical for performance, uses a modular extension system so you only include what you need, and offers full TypeScript support with end-to-end type safety.",
  },
  {
    question: "Is Typix production-ready?",
    answer:
      "Typix is actively used in production. It's built on Meta's Lexical — a battle-tested editor engine — and ships with full TypeScript support, semantic versioning, and a changelog to ensure stability.",
  },
  {
    question: "How do I add features like mentions or links?",
    answer:
      "Typix uses an extension system. Just install the extension package (e.g. @typix-editor/extension-link) and pass it to your editor config. Each extension is self-contained with its own nodes, commands, and optional UI.",
  },
  {
    question: "Does Typix support collaborative editing?",
    answer:
      "Real-time collaboration support is on the roadmap and coming soon. It will include multiple cursors, presence awareness, and conflict-free editing out of the box.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/60">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium text-sm transition-colors hover:text-foreground sm:text-base"
        onClick={onToggle}
        type="button"
      >
        {question}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="shrink-0 text-muted-foreground"
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          className="mb-10 text-center sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
            Everything you need to know about Typix.
          </p>
        </motion.div>

        {/* FAQ list */}
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {faqs.map((faq, i) => (
            <FaqItem
              answer={faq.answer}
              isOpen={openIndex === i}
              key={faq.question}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              question={faq.question}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
