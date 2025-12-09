import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Toaster} from "react-hot-toast";

import { DM_Sans } from 'next/font/google'
import CoreBanner from "@/components/ui/coreBanner";
import Instrumentation from "@/components/instrumentation";
import Script from "next/script";

const dm_sans = DM_Sans({ subsets: ['latin'] })


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: {
    default: "Compose Craft - Docker Compose GUI Builder & Visualizer",
    template: "%s | Compose Craft"
  },
  description: "Create, visualize, and manage Docker Compose files effortlessly with Compose Craft. The best free Docker Compose GUI builder and viewer for developers and teams.",
  keywords: [
    "docker compose",
    "docker compose builder",
    "docker compose GUI",
    "docker compose visualizer",
    "docker compose editor",
    "docker compose tool",
    "container orchestration",
    "docker UI",
    "yaml editor",
    "microservices",
    "devops tools",
    "container management"
  ],
  authors: [{ name: "Compose Craft" }],
  creator: "Compose Craft",
  publisher: "Compose Craft",
  metadataBase: new URL('https://composecraft.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Compose Craft - Docker Compose GUI Builder & Visualizer',
    description: 'Create, visualize, and manage Docker Compose files effortlessly. The best free Docker Compose GUI builder for developers and teams.',
    url: 'https://composecraft.com',
    siteName: 'Compose Craft',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 627,
        alt: 'Compose Craft - Docker Compose GUI Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compose Craft - Docker Compose GUI Builder & Visualizer',
    description: 'Create, visualize, and manage Docker Compose files effortlessly. Free Docker Compose GUI builder.',
    images: ['/og.png'],
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
    // Add your verification codes here when available
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
    <html lang="en">
      <head>
      {!process.env.DISABLE_TELEMETRY && 
        <Script
          src="https://opentech-ux.org/lom-captor/dist/opentech-ux-lib.js"
          strategy="beforeInteractive"
          async
          data-endpoint="https://cattlemoontwelve.ux-key.com/endpoint"
          suppressHydrationWarning
        />
        }
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dm_sans.className} antialiased h-screen`}
      >
        {!process.env.DISABLE_TELEMETRY && <Instrumentation posthogKey={process.env.NEXT_PUBLIC_POSTHOG_KEY!} />}
      <Toaster
          position="top-right"
          reverseOrder={false}
      />
      <CoreBanner />
      {children}
      </body>
    </html>
  );
}
