import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fira_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { getAllLectures } from "@/lib/lectures";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const firaMono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fira-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Backend Engineering — First Principles Learning Hub & Live Lab",
  description: "Ultra-premium learning platform for Backend Engineering from First Principles. Interactive 3D visualizers, live practical playground, and zero-code extensible curriculum.",
  keywords: ["Backend Engineering", "First Principles", "HTTP", "Protocols", "TCP/IP", "WebSockets", "CORS", "System Design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lectures = getAllLectures();

  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable} ${firaMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased selection:bg-brand-blue/25 selection:text-white">
        <AppShell lectures={lectures}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
