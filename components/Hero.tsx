'use client';

import { StreamCard, StreamCardRef } from "./StreamCard";
import { motion } from "motion/react";
import { RefObject } from "react";
import { Info, Radio } from "lucide-react";

interface HeroProps {
  streamCardRef: RefObject<StreamCardRef | null>;
  onOpenContextModal: () => void;
  onOpenRadioModal: () => void;
}

export function Hero({ streamCardRef, onOpenContextModal, onOpenRadioModal }: HeroProps) {

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-20 items-center">
          {/* Left Side - Text Content */}
          <div className="w-full lg:flex-1 lg:pr-8 space-y-6 sm:space-y-7 lg:space-y-8">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              <div className="text-[32px] sm:text-[42px] md:text-5xl lg:text-[54px] xl:text-[58px] font-bold leading-[1.15]">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="text-foreground block"
                >
                  Ты не слушаешь переговоры.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                  className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block mt-2"
                >
                  Ты подслушиваешь небо.
                </motion.span>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                className="text-[15px] sm:text-base md:text-lg lg:text-[19px] text-muted-foreground leading-[1.7]"
              >
                Медитация на частоте десяти тысяч метров. Голоса пилотов и диспетчеров в реальном времени — спокойно и глубоко.
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 lg:gap-4 items-stretch sm:items-center">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
                onClick={onOpenContextModal}
                className="group cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-gradient-to-br from-primary to-secondary px-6 sm:px-7 py-3 sm:py-[14px] text-[14px] sm:text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
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
                <Info className="h-4 w-4 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                О проекте
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
                onClick={onOpenRadioModal}
                className="group cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-[10px] px-6 sm:px-7 py-3 sm:py-[14px] text-[14px] sm:text-[15px] font-semibold text-foreground transition-all"
                style={{
                  background: 'rgba(20, 27, 45, 0.5)',
                  border: '1px solid rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.background = 'rgba(20, 27, 45, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.6)';
                  e.currentTarget.style.background = 'rgba(20, 27, 45, 0.5)';
                }}
              >
                <Radio className="h-4 w-4 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                Радиолюбителям
              </motion.button>
            </div>
          </div>

          {/* Right Side - Stream Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <div className="w-full lg:w-96">
              <StreamCard
                ref={streamCardRef}
                listeners={0}
                isLive={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
