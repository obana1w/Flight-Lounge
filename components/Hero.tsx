'use client';

import { Play, Pause, Loader2 } from "lucide-react";
import { StreamCard, StreamCardRef } from "./StreamCard";
import BlurText from "./BlurText";
import { ContextModal } from "./ContextModal";
import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";

export function Hero() {
  const streamCardRef = useRef<StreamCardRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync loading state with StreamCard
  useEffect(() => {
    const interval = setInterval(() => {
      if (streamCardRef.current) {
        setIsLoading(streamCardRef.current.isLoading);
        setIsPlaying(streamCardRef.current.isPlaying);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleStartListening = async () => {
    if (isLoading) return; // Prevent clicks during loading

    if (isPlaying) {
      streamCardRef.current?.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await streamCardRef.current?.play();
        setIsPlaying(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

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

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
                onClick={handleStartListening}
                disabled={isLoading}
                className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all ${
                  isLoading
                    ? 'cursor-not-allowed opacity-80'
                    : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30'
                }`}
              >
                {isLoading ? (
                  <>
                    Подключение...
                    <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
                  </>
                ) : isPlaying ? (
                  <>
                    Остановить
                    <Pause className="h-5 w-5" strokeWidth={2} />
                  </>
                ) : (
                  <>
                    Слушать небо
                    <Play className="h-5 w-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                  </>
                )}
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card/50 px-8 py-4 text-lg font-semibold text-foreground/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80"
              >
                Зачем это
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
                ambientMusicUrl="https://stream.zeno.fm/f3wvbbqmdg8uv"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal - render outside to ensure proper z-index */}
      <ContextModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartListening={handleStartListening}
      />
    </>
  );
}
