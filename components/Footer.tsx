'use client';

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/20 bg-background/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xs sm:text-sm text-muted/60 text-center leading-relaxed"
          >
            © {new Date().getFullYear()} Fly Lounge - Голос неба между рейсами.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
