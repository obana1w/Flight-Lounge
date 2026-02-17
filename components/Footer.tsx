'use client';

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/20 bg-background/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col items-center gap-3">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xs sm:text-sm text-muted/60 text-center leading-relaxed"
          >
            © {new Date().getFullYear()} FLY LOUNGE - Голос неба между рейсами.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            href="mailto:cloud@flylounge.ru"
            className="text-xs sm:text-sm text-muted/60 hover:text-primary transition-colors"
          >
            cloud@flylounge.ru
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
