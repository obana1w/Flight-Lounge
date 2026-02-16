'use client';

import { motion } from "motion/react";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/20 bg-background/30 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center"
        >
          <Image
            src="/fl-logo.png"
            alt="FLY LOUNGE"
            width={180}
            height={50}
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <input
              type="search"
              placeholder="Поиск"
              className="h-10 w-64 rounded-lg border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted transition-colors focus:border-primary focus:outline-none"
            />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
