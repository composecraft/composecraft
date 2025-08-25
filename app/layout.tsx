import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Toaster} from "react-hot-toast";

import { DM_Sans } from 'next/font/google'
import CoreBanner from "@/components/ui/coreBanner";
import Instrumentation from "@/components/instrumentation";

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

export const metadata: Metadata = {
  title: "Compose Craft",
  description: "Compose craft is the unique docker compose GUI builder and viewer",
    openGraph: {
        title: 'Compose Craft',
        description: 'Compose craft is the unique docker compose GUI builder and viewer',
        url: 'https://composecraft.com',
        siteName: 'Compose Craft',
        images: [
            {
                url: 'https://composecraft.com/og.png',
                width: 1200,
                height: 627,
                alt: 'Open graph image',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
