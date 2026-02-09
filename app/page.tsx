import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StreamCard } from "@/components/StreamCard";
import { AnimatedGrid } from "@/components/AnimatedGrid";

export default function Home() {
  // Временные данные для демонстрации
  const streams = [
    { code: "UUEE", city: "Москва (Шереметьево)", listeners: 12, isLive: true },
    { code: "ULLI", city: "Санкт-Петербург", listeners: 4, isLive: true },
    { code: "UNNT", city: "Новосибирск", listeners: 7, isLive: true },
    { code: "USSS", city: "Екатеринбург", listeners: 3, isLive: false },
    { code: "UUWW", city: "Москва (Внуково)", listeners: 8, isLive: true },
    { code: "UUDD", city: "Москва (Домодедово)", listeners: 15, isLive: true },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Animated Background Grid */}
      <AnimatedGrid />

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <main>
          <Hero />

          <section className="mx-auto max-w-7xl px-6 pb-20">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {streams.map((stream) => (
                <StreamCard
                  key={stream.code}
                  code={stream.code}
                  city={stream.city}
                  listeners={stream.listeners}
                  isLive={stream.isLive}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
