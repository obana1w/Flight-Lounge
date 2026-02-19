'use client';

import { motion } from "motion/react";

export function PhilosophySection() {
  return (
    <section className="relative pt-10 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-full sm:max-w-[640px] lg:max-w-[720px] mx-auto text-center px-2 sm:px-0">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-[11px] sm:text-xs lg:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-muted/60 font-medium font-mono">
            Философия
          </h2>
        </motion.div>

        {/* Main Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="font-light mb-6 sm:mb-8 text-foreground/90 px-2 sm:px-0"
          style={{
            fontSize: 'clamp(22px, 3.5vw, 40px)',
            lineHeight: '1.4'
          }}
        >
          Десять тысяч метров звучат иначе<br />
          <strong className="font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">

          </strong>
        </motion.p>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="space-y-5 sm:space-y-6 text-[14px] sm:text-[15px] lg:text-base leading-[1.9] text-muted-foreground font-light px-2 sm:px-0"
        >
          <p>
          Мир движется быстро. Шум везде. Плейлисты, уведомления, бесконечный поток звука. А там, над облаками, говорят только когда нужно. Каждая фраза — решение. Мы соединяем живой авиационный эфир с мягким лаунж-звучанием, создавая пространство, где можно работать, думать и просто быть.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-8 sm:mt-10 mx-auto w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>
    </section>
  );
}
