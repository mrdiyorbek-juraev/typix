"use client";

import {
  AtSign,
  ChevronDown,
  Code,
  GripVertical,
  Heading,
  Image,
  Keyboard,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Mic,
  Minus,
  Paintbrush,
  Pilcrow,
  Puzzle,
  Quote,
  Sparkles,
  Table,
  Type,
} from "lucide-react";
import { motion } from "motion/react";

const blocks = [
  { name: "Paragraph", icon: Pilcrow },
  { name: "Headings", icon: Heading },
  { name: "List", icon: List },
  { name: "Ordered List", icon: ListOrdered },
  { name: "Checklist", icon: ListChecks },
  { name: "Collapsible", icon: ChevronDown },
  { name: "Code Block", icon: Code },
  { name: "Quote", icon: Quote },
  { name: "Divider", icon: Minus },
  { name: "Table", icon: Table },
  { name: "Image", icon: Image },
  { name: "Link", icon: Link2 },
  { name: "Mention", icon: AtSign },
  { name: "Rich Text", icon: Paintbrush },
  { name: "Drag & Drop", icon: GripVertical },
  { name: "Shortcuts", icon: Keyboard },
  { name: "Autocomplete", icon: Sparkles },
  { name: "Speech to Text", icon: Mic },
  { name: "Keywords", icon: Type },
  { name: "Your Own", icon: Puzzle },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function ExtensionsGrid() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          className="mb-10 flex flex-col items-center text-center sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Build anything,{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
              Block by Block.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
            Every Typix document is powered by extensions — paragraphs,
            headings, lists, code blocks, and more. Use the built-in ones,
            customize them, or create entirely new ones.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.1 }}
          whileInView="show"
        >
          {blocks.map((block) => (
            <motion.div
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-card px-4 py-5 transition-all duration-200 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
              key={block.name}
              variants={itemVariants}
            >
              <block.icon className="size-5 text-muted-foreground transition-colors group-hover:text-emerald-500" />
              <span className="text-center font-medium text-sm">
                {block.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
