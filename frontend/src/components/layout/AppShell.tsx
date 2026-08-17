'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Lecture } from '@/lib/types';
import { ProgressProvider } from '@/context/ProgressContext';

interface AppShellProps {
  lectures: Lecture[];
  children: React.ReactNode;
}

export default function AppShell({ lectures, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-brand-blue/25 selection:text-white">
        {/* Floating Capsule Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          isSidebarOpen={sidebarOpen}
          showSidebarToggle={!isLandingPage}
        />

        {/* Content Container */}
        <div className={`flex-1 flex ${!isLandingPage ? 'gap-6 lg:gap-8' : ''} max-w-7xl w-full mx-auto pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8`}>
          {/* Sidebar (Desktop Sticky + Mobile Drawer) */}
          {!isLandingPage && (
            <Sidebar
              lectures={lectures}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 pb-16">
            <div className={isLandingPage ? 'w-full' : 'w-full max-w-4xl mx-auto'}>
              {children}
            </div>
          </main>
        </div>

        {/* Platform Footer (Landing Page) */}
        {isLandingPage && <Footer />}
      </div>
    </ProgressProvider>
  );
}
