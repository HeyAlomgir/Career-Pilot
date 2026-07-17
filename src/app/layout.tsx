import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerPilot - AI-Powered Job & Freelance Marketplace",
  description: "AI-driven job recommendations, resume analysis, and career guidance. Post jobs, apply for gigs, and find your dream career.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-16 flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
