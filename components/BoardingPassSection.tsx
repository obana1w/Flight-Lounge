'use client';

import { motion } from "motion/react";

interface BoardingPassSectionProps {
  onStartListening?: () => void;
}

export function BoardingPassSection({ onStartListening }: BoardingPassSectionProps) {
  const handleStartListening = () => {
    if (onStartListening) {
      onStartListening();
    }
    // Scroll to hero section where stream card is
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="py-10 sm:py-12 lg:py-14 xl:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-card border border-border rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
            {/* Main Section */}
            <div className="p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col gap-5 sm:gap-6 lg:gap-7">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-muted/60 font-medium font-mono">
                  FLY LOUNGE
                </div>
                <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 border border-primary/20 rounded-md">
                  <span className="text-[9px] sm:text-[10px] font-mono text-primary uppercase tracking-wider">
                    First Class
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-5 lg:gap-6">
                <div className="text-center lg:text-left">
                  <div className="font-mono text-[24px] sm:text-[28px] md:text-[32px] font-semibold tracking-[0.2em] sm:tracking-[0.25em]">
                    КРЕСЛО
                  </div>
                  <div className="text-[12px] sm:text-[13px] text-muted-foreground mt-1">
                    Ваше пространство
                  </div>
                </div>

                {/* Connector - visible only on desktop */}
                <div className="hidden lg:flex flex-1 items-center gap-2">
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: 'repeating-linear-gradient(90deg, #1E293B 0, #1E293B 6px, transparent 6px, transparent 12px)'
                    }}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5 text-primary flex-shrink-0"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L11 12l-2 3H6l-1 1 3 2 2 3 1-1v-3l3-2 3.7 7.3c.2.4.7.5 1.1.3l.5-.3c.4-.2.5-.7.4-1.1Z"/>
                  </svg>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: 'repeating-linear-gradient(90deg, #1E293B 0, #1E293B 6px, transparent 6px, transparent 12px)'
                    }}
                  />
                </div>

                <div className="text-center lg:text-right">
                  <div className="font-mono text-[24px] sm:text-[28px] md:text-[32px] font-semibold tracking-[0.2em] sm:tracking-[0.25em]">
                    ЭФИР
                  </div>
                  <div className="text-[12px] sm:text-[13px] text-muted-foreground mt-1">
                    Голоса на высоте
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-10">
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] text-muted uppercase tracking-wider">
                    Рейс
                  </div>
                  <div className="font-mono text-sm font-semibold">
                    FL 001
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] text-muted uppercase tracking-wider">
                    Частота
                  </div>
                  <div className="font-mono text-sm font-semibold">
                    118.1 MHz
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] text-muted uppercase tracking-wider">
                    Статус
                  </div>
                  <div className="font-mono text-sm font-semibold text-success">
                    Boarding
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] text-muted uppercase tracking-wider">
                    Формат
                  </div>
                  <div className="font-mono text-sm font-semibold">
                    24/7 Live
                  </div>
                </div>
              </div>
            </div>

            {/* Stub Section */}
            <div
              className="border-t-2 lg:border-t-0 lg:border-l-2 border-dashed p-6 sm:p-7 lg:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center"
              style={{
                background: 'rgba(30, 41, 59, 0.3)',
                borderColor: '#1E293B'
              }}
            >
              <div className="text-[9px] sm:text-[10px] font-mono text-muted uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                Ваш посадочный
              </div>

              <button
                onClick={handleStartListening}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-[14px] bg-gradient-to-br from-primary to-secondary rounded-[10px] text-[14px] sm:text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
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
                Слушать небо
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </motion.svg>
              </button>

              <div className="text-[8px] sm:text-[9px] font-mono text-muted uppercase tracking-wider">
                Бесплатно · Без регистрации
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
