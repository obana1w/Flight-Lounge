'use client';

import { motion } from "motion/react";

interface FooterProps {
  onOpenRadioModal?: () => void;
}

export function Footer({ onOpenRadioModal }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-border/30 bg-background/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 xl:py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-5 lg:gap-0">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 lg:gap-4 text-center sm:text-left"
          >
            
            <div className="text-[11px] sm:text-xs lg:text-sm text-muted/60">
            © FLY LOUNGE · Голос неба между рейсами · {new Date().getFullYear()}
            </div>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-5"
          >
            <a
              href="mailto:cloud@flylounge.ru"
              className="text-[11px] sm:text-xs lg:text-sm text-muted/60 hover:text-foreground transition-colors"
            >
              cloud@flylounge.ru
            </a>
            
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
