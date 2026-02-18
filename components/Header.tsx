'use client';

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenRadioModal: () => void;
}

export function Header({ onOpenRadioModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleModalOpen = (callback: () => void) => {
    callback();
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = window.innerWidth >= 640 ? 64 : 56; // h-16 on desktop, h-14 on mobile
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-14 sm:h-16 border-b border-border/20 bg-background/30 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center cursor-pointer"
        >
          <Image
            src="/logo_new.png"
            alt="FLY LOUNGE"
            width={120}
            height={35}
            className="object-contain w-[120px] h-[35px] sm:w-[150px] sm:h-[42px] lg:w-[180px] lg:h-[50px]"
            priority
          />
        </motion.a>

        {/* Desktop Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="hidden md:flex items-center gap-6 lg:gap-8"
        >
          <button
            onClick={() => scrollToSection('philosophy')}
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary whitespace-nowrap"
          >
            Философия
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary whitespace-nowrap"
          >
            Возможности
          </button>
          <button
            onClick={onOpenRadioModal}
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary whitespace-nowrap"
          >
            Радиолюбителям
          </button>
        </motion.nav>

        {/* Desktop Support Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex items-center gap-4"
        >
          <a
            href="https://dalink.to/flylounge"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-primary to-secondary px-5 py-2 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.25)';
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
          </a>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground/70 hover:text-primary transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" strokeWidth={1.5} />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl"
        >
          <nav className="flex flex-col px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('philosophy')}
              className="text-left px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              О проекте
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Возможности
            </button>
            <button
              onClick={() => handleModalOpen(onOpenRadioModal)}
              className="text-left px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Радиолюбителям
            </button>
            <a
              href="https://dalink.to/flylounge"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-[10px] bg-gradient-to-br from-primary to-secondary px-5 py-2 text-[13px] font-semibold text-white transition-all"
              style={{
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              Поддержать
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
