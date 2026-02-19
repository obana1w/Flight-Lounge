'use client';

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartListening?: () => void;
}

export function ContextModal({ isOpen, onClose, onStartListening }: ContextModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const paragraphs = [
    "Мир движется быстро. Шум везде. Плейлисты, подкасты, уведомления. Тишина кажется пустотой, которую нужно срочно заполнить.",
    "На высоте 10 000 метров — иначе.",
    "Там говорят только когда нужно. Там каждое слово имеет вес. Каждая фраза — это решение.",
    "FLY LOUNGE — это окно в мир, где тишина не пустота. Где музыка не перебивает мысли. Где можно работать, думать, засыпать под голоса неба.",
    "Каждый день тысячи пилотов разговаривают с землёй. 118.1 МГц. 122.75 МГц. Частоты, которые не замолкают.",
    "Короткие команды. Точные координаты. Спокойствие на эшелоне.",
    "Эти разговоры обычно слышат только диспетчеры. Небо говорит, но мало кто слушает.",
    "То, что ты слышишь — происходит сейчас. Над тобой. На высоте, где слова весят тонны.",
    "Мы добавляем музыку, которая понимает тишину. Треки, которые знают: иногда лучшее — не мешать.",
    "Мы показываем погоду как контекст. METAR. TAF. QNH. Язык, на котором небо объясняет свои решения.",
    "Это не про авиацию. Это про то, как звучит пространство между облаками.",
    "Про то, что высота — это не расстояние от земли. Это состояние, когда лишнее исчезает само.",
    "FLY LOUNGE — для тех, кто работает в шуме, но ищет покой. Для тех, кто устал от плейлистов, которые кричат. Для тех, кто понимает: белый шум бывает разным.",
    "Мы не ускоряем мир. Мы даём ему быть услышанным.",
    "Пока одни летят — другие наблюдают. Пока небо говорит — мы слушаем.",
    "FLY LOUNGE. Голос неба между рейсами."
  ];

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            className="bg-background/80 backdrop-blur-xl"
          />

          {/* Modal */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '672px', zIndex: 100000 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                position: 'relative',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              className="rounded-xl sm:rounded-2xl lg:rounded-3xl border border-border/30 bg-card/80 backdrop-blur-xl shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-lg text-muted/60 hover:text-foreground hover:bg-background/50 transition-all z-10"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Content */}
              <div className="p-5 sm:p-6 md:p-8 lg:p-12">
                {/* Header */}
                <div className="mb-5 sm:mb-6 lg:mb-8 text-center">
                  <h2 className="text-[11px] sm:text-xs lg:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-muted/60 font-medium font-mono">
                    Контекст
                  </h2>
                </div>

                {/* Text */}
                <div className="space-y-5 sm:space-y-6 lg:space-y-8">
                  {paragraphs.map((text, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + index * 0.1,
                        ease: "easeOut"
                      }}
                      className="text-[14px] sm:text-[15px] lg:text-base leading-[1.9] text-muted-foreground font-light text-center whitespace-pre-line px-2 sm:px-0"
                    >
                      {text}
                    </motion.p>
                  ))}
                </div>

                {/* Call to Action Button */}
                {onStartListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + paragraphs.length * 0.1,
                      ease: "easeOut"
                    }}
                    className="mt-6 sm:mt-8 lg:mt-12 flex justify-center"
                  >
                    <button
                      onClick={onStartListening}
                      className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-[10px] bg-gradient-to-br from-primary to-secondary px-6 sm:px-7 py-3 sm:py-[14px] text-[14px] sm:text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
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
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
