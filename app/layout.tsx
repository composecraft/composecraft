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

// CORE_ONLY mode: minimal metadata, no SEO indexing
export const metadata: Metadata = {
  title: "Compose Craft",
  robots: {
    index: false,
    follow: false,
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
