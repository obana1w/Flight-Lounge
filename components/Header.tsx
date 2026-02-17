'use client';

import { motion } from "motion/react";
import Image from "next/image";

interface HeaderProps {
  onOpenContextModal: () => void;
  onOpenRadioModal: () => void;
}

export function Header({ onOpenContextModal, onOpenRadioModal }: HeaderProps) {
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
            src="/fl-logo-v2.png"
            alt="FLY LOUNGE"
            width={180}
            height={50}
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex items-center gap-8"
        >
          <button
            onClick={onOpenContextModal}
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
          >
            О проекте
          </button>
          <button
            onClick={onOpenRadioModal}
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
          >
            Радиолюбителям
          </button>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <button className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:scale-110"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            Поддержать
          </button>
        </motion.div>
      </div>
    </header>
  );
}
