import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { getAllLectures } from "@/lib/lectures";

export const metadata: Metadata = {
  title: "Backend Engineering — First Principles Learning Hub",
  description: "Interactive dark-themed learning platform for Sriniously's Backend Engineering series. 3D visualizers, live practical playground, and zero-code extensible curriculum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lectures = getAllLectures();

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-zinc-100 antialiased">
        <AppShell lectures={lectures}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
