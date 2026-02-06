"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { TypixLogo } from "@/components/logo";

const productLinks = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "License", href: "/license" },
];

export function Footer() {
  return (
    <motion.footer
      className="border-t border-border/60"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 md:pt-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <TypixLogo className="size-6" />
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text font-bold text-lg text-transparent">
                Typix
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Build your editor.
            </p>
          </div>

          {/* Link groups */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Product</span>
              {productLinks.map((link) => (
                <Link
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Legal</span>
              {legalLinks.map((link) => (
                <Link
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Typix. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
