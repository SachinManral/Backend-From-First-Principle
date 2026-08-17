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
  const isLecturePage = pathname?.startsWith('/lectures');
  const isChatPage = pathname === '/chat';

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-brand-blue/25 selection:text-white">
        {/* Floating Capsule Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          isSidebarOpen={sidebarOpen}
          showSidebarToggle={isLecturePage}
        />

        {/* Content Container */}
        {isChatPage ? (
          // Dedicated Full-View for Chat Page
          <main className="flex-1 w-full pt-16">
            {children}
          </main>
        ) : (
          <div
            className={`flex-1 flex ${
              isLecturePage ? 'gap-6 lg:gap-8' : ''
            } max-w-7xl w-full mx-auto pt-20 sm:pt-24 px-3 sm:px-6`}
          >
            {/* Sidebar (Desktop Sticky + Mobile Drawer) ONLY for Lecture Curriculum Pages */}
            {isLecturePage && (
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
        )}

        {/* Platform Footer (Shown on landing page and overview pages, hidden on chat) */}
        {!isChatPage && isLandingPage && <Footer />}
      </div>
    </ProgressProvider>
  );
}
