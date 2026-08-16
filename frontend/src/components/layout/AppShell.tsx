'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Lecture } from '@/lib/types';
import { ProgressProvider } from '@/context/ProgressContext';

interface AppShellProps {
  lectures: Lecture[];
  children: React.ReactNode;
}

export default function AppShell({ lectures, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-background text-zinc-100 flex flex-col selection:bg-brand-cyan selection:text-black">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar
            lectures={lectures}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 md:pl-72 w-full min-w-0 pb-16">
            <div className="px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProgressProvider>
  );
}
