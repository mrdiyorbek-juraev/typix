"use client";
import { motion } from "motion/react";
import { Spotlight } from "@/components/effects/spotlight";
import { ExtensionsGrid } from "./components/extensions-grid";
import { Hero } from "./components/hero";
import { QuickSetup } from "./components/quick-setup";
import { WhyTypix } from "./components/why-typix";
import { Faq } from "./components/faq";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
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
      <Hero />
      <WhyTypix />
      <ExtensionsGrid />
      <QuickSetup />
      <Faq />
      <Footer />
    </div>
  );
}
