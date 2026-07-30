import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import LayoutWrapper from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

  const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://viraam-vaani.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Viraam Vaani",
    template: "%s | Viraam Vaani",
  },

  description:
    "Viraam Vaani is a trusted coaching institute offering quality education, study materials, online tests, results, and student portal.",

  openGraph: {
    title: "Viraam Vaani",
    description: "A New Ray of Hope",
    url: SITE_URL,
    siteName: "Viraam Vaani",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Viraam Vaani",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Viraam Vaani",
    description: "A New Ray of Hope",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/images/logo.jpeg",
    shortcut: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },

  keywords: [
    "Viraam Vaani",
    "Coaching Institute",
    "Education",
    "Online Tests",
    "Student Portal",
    "CBSE",
    "ICSE",
    "UP Board",
  ],

  authors: [
    {
      name: "Viraam Vaani",
      url: SITE_URL,
    },
  ],

  creator: "Viraam Vaani",
  publisher: "Viraam Vaani",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}