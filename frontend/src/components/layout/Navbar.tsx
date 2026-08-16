'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Download, Cpu, CheckCircle2, Menu, X, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';
import { useProgress } from '@/context/ProgressContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
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

  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-2xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-surface hover:bg-surface-highlight text-zinc-300 border border-surface-border transition"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-cyan via-brand-indigo to-brand-violet flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <Cpu className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Backend, First Principles</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface border border-surface-border text-brand-cyan">
                  LAB
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 hidden sm:block font-medium">
                Sriniously Series Interactive Companion
              </div>
            </div>
          </Link>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live API Health Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition ${
              apiOnline === true
                ? 'bg-brand-emerald/10 text-brand-emerald border-emerald-500/30'
                : apiOnline === false
                ? 'bg-brand-rose/10 text-brand-rose border-rose-500/30'
                : 'bg-surface text-zinc-400 border-surface-border'
            }`}
            title={apiOnline === true ? "Express API connected on Port 4000" : "Cannot reach http://localhost:4000"}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline === true ? 'bg-brand-emerald animate-pulse' : apiOnline === false ? 'bg-brand-rose' : 'bg-zinc-500'
              }`}
            />
            <span className="hidden sm:inline font-semibold">
              {apiOnline === true ? 'API :4000 Live' : apiOnline === false ? 'API :4000 Offline' : 'Connecting...'}
            </span>
          </div>

          <Link
            href="/playground"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-highlight text-zinc-200 border border-surface-border text-xs font-semibold transition shadow"
          >
            <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="hidden md:inline">Playground</span>
          </Link>

          <Link
            href="/progress"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-highlight text-zinc-200 border border-surface-border text-xs font-semibold transition shadow"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
            <span className="hidden md:inline">Progress</span>
            <span className="px-1.5 py-0.2 rounded bg-background text-[10px] font-mono text-zinc-400">
              {completedSlugs.length}
            </span>
          </Link>

          <a
            href={`${API_BASE_URL}/api/export/postman`}
            download="backend-first-principles.postman_collection.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo text-white text-xs font-bold transition hover:opacity-90 shadow-md shadow-indigo-500/20"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden lg:inline">Postman Export</span>
          </a>
        </div>
      </div>
    </header>
  );
}
