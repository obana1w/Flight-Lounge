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
    "Мир движется быстро.\nШум везде. Плейлисты, подкасты, уведомления.",
    "На высоте 10 000 метров — иначе.\nТам говорят только когда нужно.\nТам каждое слово имеет вес.",
    "FLY LOUNGE — это окно в мир, где тишина не пустота.\nГде музыка не перебивает мысли.\nГде можно работать, думать, засыпать под голоса неба.",
    "Мы не ускоряем мир.\nМы даём ему быть услышанным.",
    "Пока одни летят — другие наблюдают."
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
            padding: '16px',
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
                maxHeight: '85vh',
                overflow: 'auto',
              }}
              className="rounded-3xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted/60 hover:text-foreground hover:bg-background/50 transition-all"
                style={{ zIndex: 100001 }}
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h2 className="text-sm uppercase tracking-[0.3em] text-muted/60 font-medium">
                    Контекст
                  </h2>
                </div>

                {/* Text */}
                <div className="space-y-8">
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
                      className="text-base md:text-lg leading-relaxed text-foreground/80 text-center whitespace-pre-line"
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
                    className="mt-12 flex justify-center"
                  >
                    <button
                      onClick={() => {
                        onStartListening();
                        onClose();
                      }}
                      className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                    >
                      Слушать небо
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
