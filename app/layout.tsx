import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Toaster} from "react-hot-toast";
import BetaBanner from "@/components/ui/betaBanner";

import { DM_Sans } from 'next/font/google'
import CoreBanner from "@/components/ui/coreBanner";

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
      {(process.env.NODE_ENV !== 'development' || !process.env.DISABLE_TELEMETRY) &&
          <script defer src="https://analytics.composecraft.com/script.js"
                  data-website-id="cf5719ce-ce94-4ad1-9573-76d2b7e8e62a"></script>
      }
      <Toaster
          position="top-right"
          reverseOrder={false}
      />
      <BetaBanner />
      <CoreBanner />
      {children}
      </body>
    </html>
  );
}
