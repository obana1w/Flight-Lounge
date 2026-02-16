import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import Aurora from "@/components/Aurora";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";

export default function Home() {
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
          <Header />

          <main className="flex-1">
            <section className="px-6 py-20 min-h-[calc(100vh-160px)] flex items-center">
              <Hero />
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </AudioPlayerProvider>
  );
}
