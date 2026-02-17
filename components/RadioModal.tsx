'use client';

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface RadioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RadioModal({ isOpen, onClose }: RadioModalProps) {
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
    "FLY LOUNGE транслирует авиачастоты в реальном времени.",
    "Нам нужно больше частот. Нам нужны ваши приёмники.",
    "Если у вас есть SDR или сканер, настроенный на авиадиапазон. Если вы ловите UUEE, ULLI, USSS или любой другой аэропорт. Если готовы пустить поток в проект — напишите нам.",
    "Мы не коммерческий проект. Мы не монетизируем эфир. Мы просто открываем частоту для тех, кто хочет слушать.",
    "Что нам нужно от вас:",
    "Стабильный поток с авиачастот вашего региона. 118–137 МГц, гражданская авиация. Качество: чистый сигнал, минимум шумов. Формат: любой стрим (Icecast, HLS, RTMP — договоримся).",
    "Что мы даём взамен:",
    "Ваш позывной в credits проекта. Ссылку на ваш ресурс (если есть). Техническую поддержку по интеграции. Сообщество людей, которые ценят то, что вы делаете.",
    "Мы понимаем: вы держите приёмники, платите за интернет, следите за качеством. Это труд. Мы его уважаем.",
    "FLY LOUNGE — это мост между вашими антеннами и теми, кто хочет слушать небо. Вы ловите сигнал. Мы даём ему аудиторию.",
    "Если интересно — пишите: cloud@flylounge.ru",
    "Укажите:\n— Ваш позывной или никнейм\n— Какой аэропорт/частоты ловите\n— Оборудование (SDR, сканер, модель)\n— Технические детали потока (если уже настроен)",
    "Ответим в течение суток. Обсудим детали. Подключим частоту."
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
              className="rounded-2xl sm:rounded-3xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-lg text-muted/60 hover:text-foreground hover:bg-background/50 transition-all z-10"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8 md:p-12">
                {/* Header */}
                <div className="mb-6 sm:mb-8 text-center">
                  <h2 className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted/60 font-medium">
                    Для радиолюбителей
                  </h2>
                </div>

                {/* Text */}
                <div className="space-y-6 sm:space-y-8">
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
                      className="text-sm sm:text-base md:text-lg leading-relaxed text-foreground/80 text-center whitespace-pre-line"
                    >
                      {text.includes('cloud@flylounge.ru') ? (
                        <>
                          Если интересно — пишите:{' '}
                          <a
                            href="mailto:cloud@flylounge.ru"
                            className="text-primary hover:text-primary/80 transition-colors font-medium"
                          >
                            cloud@flylounge.ru
                          </a>
                        </>
                      ) : (
                        text
                      )}
                    </motion.p>
                  ))}
                </div>

                {/* Contact Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + paragraphs.length * 0.1,
                    ease: "easeOut"
                  }}
                  className="mt-8 sm:mt-12 flex justify-center"
                >
                  <a
                    href="mailto:cloud@flylounge.ru"
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:scale-110"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Связь с нами
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
