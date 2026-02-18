'use client';

import { Mic, Music, Cloud } from "lucide-react";
import { motion } from "motion/react";

export function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: "Живой эфир ATC",
      description: "Настоящие переговоры пилотов и диспетчеров — в реальном времени, 24/7.",
      colorClass: "text-primary",
      bgClass: "bg-primary/10"
    },
    {
      icon: Music,
      title: "Музыка",
      description: "Голоса неба наложены на деликатный Lo-Fi. Два независимых регулятора для идеального баланса.",
      colorClass: "text-secondary",
      bgClass: "bg-secondary/10"
    },
    {
      icon: Cloud,
      title: "Погода аэропорта",
      description: "METAR-данные в реальном времени: ветер, температура, видимость, восход и закат.",
      colorClass: "text-success",
      bgClass: "bg-success/10"
    }
  ];

  return (
    <section className="pt-10 pb-12 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 lg:gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                className="group relative bg-card border border-border rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-black/20 overflow-hidden"
              >
                {/* Top border accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${feature.bgClass} flex items-center justify-center mb-4 sm:mb-5`}>
                  <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${feature.colorClass}`} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-2.5 text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] sm:text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
