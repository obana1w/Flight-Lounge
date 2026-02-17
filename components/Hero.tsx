'use client';

import { StreamCard, StreamCardRef } from "./StreamCard";
import BlurText from "./BlurText";
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
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-center">
          {/* Left Side - Text Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1]">
                <BlurText
                  text="Ты не слушаешь переговоры."
                  delay={50}
                  animateBy="words"
                  direction="top"
                  className="text-foreground block"
                />
                <motion.span
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block mt-2"
                >
                  Ты подслушиваешь небо.
                </motion.span>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                className="text-lg lg:text-xl text-muted/90 leading-relaxed"
              >
                Медитация на частоте десяти тысяч метров. Голоса пилотов и диспетчеров в реальном времени — спокойно и глубоко.
              </motion.p>
            </div>

            <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
                onClick={onOpenContextModal}
                className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                <Info className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                О проекте
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                onClick={onOpenRadioModal}
                className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-border/40 bg-card/50 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold text-foreground/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <Radio className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                Радиолюбителям
              </motion.button>
            </div>
          </div>

          {/* Right Side - Stream Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <div className="w-full lg:w-96">
              <StreamCard
                ref={streamCardRef}
                code="ULLI"
                city="Санкт-Петербург (Пулково)"
                listeners={0}
                isLive={true}
                radioScannerCode="ulli"
                ambientMusicUrl="https://ice3.somafm.com/fluid-128-mp3"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
