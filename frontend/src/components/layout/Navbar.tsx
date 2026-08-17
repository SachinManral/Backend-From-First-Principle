'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Menu, X, Sun, Moon, Terminal, BookOpen, Layers } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  showSidebarToggle?: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen, showSidebarToggle = true }: NavbarProps) {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [isDark, setIsDark] = useState<boolean>(true);
  const pathname = usePathname();

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

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Curriculum', href: '/lectures/01-roadmap' },
    { label: 'Interactive Lab', href: '/playground' },
    { label: 'Mastery Checklist', href: '/progress' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e2640] bg-[#070b14]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-[#0f1424] hover:bg-[#161d31] text-zinc-400 hover:text-white border border-[#1e2640] transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-md shadow-brand-blue/15 transition group-hover:scale-105">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-brand-blue" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                Backend <span className="text-brand-blue">First Principles</span>
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-[#0f1424] border border-[#1e2640] text-zinc-400">
                v1.0
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#0f1424] text-white border border-[#1e2640] font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#0f1424]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Status Pill, Theme Toggle, and Postman Export */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Live API Health Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition ${
              apiOnline === true
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : apiOnline === false
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-[#0f1424] text-zinc-400 border-[#1e2640]'
            }`}
            title={apiOnline === true ? "Connected to Express API on Port 4000" : "Cannot reach http://localhost:4000"}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline === true 
                  ? 'bg-emerald-400 animate-pulse' 
                  : apiOnline === false 
                  ? 'bg-rose-400' 
                  : 'bg-zinc-500'
              }`}
            />
            <span className="hidden sm:inline font-medium">
              {apiOnline === true ? 'API :4000 Live' : apiOnline === false ? 'API :4000 Offline' : 'Connecting...'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#0f1424] hover:bg-[#161d31] text-zinc-400 hover:text-white border border-[#1e2640] transition cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-blue" />}
          </button>

          {/* Postman Export Button */}
          <a
            href={`${API_BASE_URL}/api/export/postman`}
            download="backend-first-principles.postman_collection.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-blue hover:bg-brand-indigo text-white text-xs font-bold transition shadow-md shadow-brand-blue/20 cursor-pointer"
            title="Download Postman Collection"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Postman Export</span>
          </a>
        </div>

      </div>
    </header>
  );
}
