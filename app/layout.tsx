import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FLY LOUNGE — На частоте неба",
  description: "Медитация на частоте десяти тысяч метров. Голоса пилотов и диспетчеров в реальном времени — спокойно и глубоко.",
  keywords: ["авиация", "радио", "ATC", "диспетчеры", "пилоты", "ambient", "lofi", "медитация", "авиационная связь", "небо"],
  authors: [{ name: "FLY LOUNGE" }],
  creator: "FLY LOUNGE",
  publisher: "FLY LOUNGE",
  metadataBase: new URL('https://flylounge.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://flylounge.ru',
    siteName: 'FLY LOUNGE',
    title: 'FLY LOUNGE — На частоте неба',
    description: 'Медитация на частоте десяти тысяч метров. Голоса пилотов и диспетчеров в реальном времени — спокойно и глубоко.',
    images: [
      {
        url: '/fl-logo-v2.png',
        width: 1200,
        height: 630,
        alt: 'FLY LOUNGE — Голос неба между рейсами',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLY LOUNGE — На частоте неба',
    description: 'Медитация на частоте десяти тысяч метров. Голоса пилотов и диспетчеров в реальном времени — спокойно и глубоко.',
    images: ['/fl-logo-v2.png'],
    creator: '@flylounge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add when you get them:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
