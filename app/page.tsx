'use client';

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { PhilosophySection } from "@/components/PhilosophySection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { WeatherRibbon } from "@/components/WeatherRibbon";
import { BoardingPassSection } from "@/components/BoardingPassSection";
import Aurora from "@/components/Aurora";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { ContextModal } from "@/components/ContextModal";
import { RadioModal } from "@/components/RadioModal";
import { useState, useRef } from "react";
import { StreamCardRef } from "@/components/StreamCard";

export default function Home() {
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [isRadioModalOpen, setIsRadioModalOpen] = useState(false);
  const streamCardRef = useRef<StreamCardRef | null>(null);

  const handleStartListening = async () => {
    await streamCardRef.current?.play();
    setIsContextModalOpen(false);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FLY LOUNGE',
    alternateName: 'Fly Lounge',
    description: 'Медитация на частоте десяти тысяч метров. Голоса пилотов и диспетчеров в реальном времени — спокойно и глубоко.',
    url: 'https://flylounge.ru',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
    provider: {
      '@type': 'Organization',
      name: 'FLY LOUNGE',
      email: 'cloud@flylounge.ru',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Aviation enthusiasts, meditation practitioners, ambient music lovers',
    },
    keywords: 'авиация, радио, ATC, диспетчеры, пилоты, ambient, lofi, медитация, авиационная связь',
  };

  return (
    <AudioPlayerProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative min-h-screen bg-background flex flex-col">
        {/* Aurora Background */}
        <Aurora
          colorStops={["#0B1628", "#1E3A5F", "#3B5998"]}
          blend={0.6}
          amplitude={1.4}
          speed={1.2}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1">
          <Header
            onOpenRadioModal={() => setIsRadioModalOpen(true)}
          />

          <main className="flex-1">
            {/* Hero Section */}
            <section className="pt-6 pb-10 sm:pt-10 sm:pb-12 md:pt-14 md:pb-14 lg:pt-20 lg:pb-14 lg:min-h-[calc(100vh-160px)] flex items-start lg:items-center">
              <Hero
                streamCardRef={streamCardRef}
                onOpenContextModal={() => setIsContextModalOpen(true)}
                onOpenRadioModal={() => setIsRadioModalOpen(true)}
              />
            </section>

            {/* Philosophy Section */}
            <div id="philosophy">
              <PhilosophySection />
            </div>

            {/* Features Section */}
            <div id="features">
              <FeaturesSection />
            </div>

            {/* Weather Ribbon */}
            <WeatherRibbon />

            {/* Boarding Pass Section */}
            <BoardingPassSection onStartListening={handleStartListening} />
          </main>

          <Footer onOpenRadioModal={() => setIsRadioModalOpen(true)} />
        </div>

        {/* Modals */}
        <ContextModal
          isOpen={isContextModalOpen}
          onClose={() => setIsContextModalOpen(false)}
          onStartListening={handleStartListening}
        />
        <RadioModal
          isOpen={isRadioModalOpen}
          onClose={() => setIsRadioModalOpen(false)}
        />
      </div>
    </AudioPlayerProvider>
  );
}
