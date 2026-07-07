import type { Metadata } from "next";
import { Inter_Tight, Kalam } from "next/font/google";
import { profile } from "@/data/site";
import SmoothScroll from "@/components/SmoothScroll";
import AvailabilityPill from "@/components/AvailabilityPill";
import "./globals.css";

// -------------------- Fonts --------------------

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-hand",
});

// -------------------- Metadata --------------------

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: `${profile.role} building polished mobile games and apps. ${profile.tagline}. Based in ${profile.location}, open to freelance and contract work.`,
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: `${profile.role} — ${profile.tagline}`,
    type: "website",
  },
};

// -------------------- Layout --------------------

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${kalam.variable} bg-zinc-50 tracking-tight antialiased dark:bg-zinc-950`}
      >
        <SmoothScroll />
        {profile.available && <AvailabilityPill />}
        {children}
      </body>
    </html>
  );
}
