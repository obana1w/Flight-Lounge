'use client';

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import Aurora from "@/components/Aurora";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { ContextModal } from "@/components/ContextModal";
import { RadioModal } from "@/components/RadioModal";
import { useState, useRef } from "react";
import { StreamCardRef } from "@/components/StreamCard";

export default function Home() {
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [isRadioModalOpen, setIsRadioModalOpen] = useState(false);
  const streamCardRef = useRef<StreamCardRef>(null);

  const handleStartListening = async () => {
    await streamCardRef.current?.play();
    setIsContextModalOpen(false);
  };

  return (
    <AudioPlayerProvider>
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
            onOpenContextModal={() => setIsContextModalOpen(true)}
            onOpenRadioModal={() => setIsRadioModalOpen(true)}
          />

          <main className="flex-1">
            <section className="px-0 py-12 sm:py-16 md:py-20 min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)] flex items-center">
              <Hero
                streamCardRef={streamCardRef}
                onOpenContextModal={() => setIsContextModalOpen(true)}
                onOpenRadioModal={() => setIsRadioModalOpen(true)}
              />
            </section>
          </main>

          <Footer />
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
