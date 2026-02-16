'use client';

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/20 bg-background/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-sm text-muted/60 text-center"
          >
            © {new Date().getFullYear()} FLY LOUNGE. Голос неба между рейсами. Всегда на связи.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
