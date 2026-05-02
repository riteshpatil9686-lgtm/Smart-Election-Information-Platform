import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoteSmart India — ECI Election Information Platform",
  description: "Your complete guide to Indian elections. Check eligibility, find polling booths, track election timelines, and get AI-powered answers about voting in India.",
  keywords: "India election, voter registration, ECI, polling booth, eligibility checker, Lok Sabha 2024",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
