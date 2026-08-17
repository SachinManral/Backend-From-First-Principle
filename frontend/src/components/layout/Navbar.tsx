'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Download, Menu, X, Sun, Moon, Flame } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';
import { useProgress } from '@/context/ProgressContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  showSidebarToggle?: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen, showSidebarToggle = true }: NavbarProps) {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [isDark, setIsDark] = useState<boolean>(true);
  const pathname = usePathname();
  const { completedSlugs } = useProgress();

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/`, { cache: 'no-store' });
        setApiOnline(res.ok);
      } catch {
        setApiOnline(false);
      }
    };

    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-x-0 top-3 md:top-4 z-50 w-full max-w-screen px-3 sm:px-6 pointer-events-none">
      <header className="pointer-events-auto mx-auto max-w-7xl rounded-full bg-card/85 backdrop-blur-xl border border-border/80 shadow-lg shadow-black/25 px-3 sm:px-5 py-2 flex items-center justify-between transition-all duration-300">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-full bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-md shadow-brand-blue/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
                <Flame className="w-4 h-4 text-brand-purple fill-brand-purple animate-sparkle-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <span>Backend</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded-full bg-secondary border border-border text-brand-blue">
                  FIRST PRINCIPLES
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              pathname === '/'
                ? 'bg-secondary text-foreground font-semibold shadow-top'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/lectures/01-roadmap"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              pathname.startsWith('/lectures')
                ? 'bg-secondary text-foreground font-semibold shadow-top'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            Curriculum
          </Link>
          <Link
            href="/playground"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              pathname === '/playground'
                ? 'bg-secondary text-foreground font-semibold shadow-top'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            Interactive Lab
          </Link>
          <Link
            href="/progress"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              pathname === '/progress'
                ? 'bg-secondary text-foreground font-semibold shadow-top'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            Mastery Checklist
          </Link>
        </nav>

        {/* Right: Actions & Badges */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Live API Health Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition ${
              apiOnline === true
                ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                : apiOnline === false
                ? 'bg-brand-rose/10 text-brand-rose border-brand-rose/30'
                : 'bg-secondary text-muted-foreground border-border'
            }`}
            title={apiOnline === true ? "Express API connected on Port 4000" : "Cannot reach http://localhost:4000"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                apiOnline === true ? 'bg-brand-emerald animate-pulse' : apiOnline === false ? 'bg-brand-rose' : 'bg-muted-foreground'
              }`}
            />
            <span className="hidden sm:inline font-semibold">
              {apiOnline === true ? 'API :4000 Live' : apiOnline === false ? 'API :4000 Offline' : 'Connecting...'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-brand-amber" /> : <Moon className="w-3.5 h-3.5 text-brand-blue" />}
          </button>

          {/* Postman Export CTA */}
          <a
            href={`${API_BASE_URL}/api/export/postman`}
            download="backend-first-principles.postman_collection.json"
            target="_blank"
            rel="noreferrer"
            className="codehelp-gradient-btn !py-1.5 !px-3.5 !rounded-full !text-xs !font-bold"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden md:inline">Postman Export</span>
          </a>
        </div>
      </header>
    </div>
  );
}
