'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Github, Database, Network, BookOpen, Layers } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1e2640] bg-[#070b14]/90 backdrop-blur-xl pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1e2640]">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-blue/20 to-brand-purple/20 border border-brand-blue/40 shadow-md shadow-brand-blue/15 group-hover:scale-105 transition">
                <svg className="w-4 h-4 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <div className="font-bold text-sm tracking-tight text-white">
                Backend <span className="text-brand-blue font-extrabold">First Principles</span>
              </div>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Mastering backend systems from absolute first principles. From raw TCP sockets and HTTP wire anatomy to persistent SQLite WAL storage and production scalability.
            </p>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1222] border border-[#1e2640] text-xs font-mono text-emerald-400 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Express & SQLite Engine Live (:4000)</span>
            </div>
          </div>

          {/* Curriculum Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">Curriculum</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li>
                <Link href="/lectures/01-roadmap" className="hover:text-brand-blue transition">
                  Lecture 01: Complete 31 Roadmap
                </Link>
              </li>
              <li>
                <Link href="/lectures/02-walk-the-path" className="hover:text-brand-blue transition">
                  Lecture 02: The 3-Phase Journey
                </Link>
              </li>
              <li>
                <Link href="/lectures/03-what-is-a-backend" className="hover:text-brand-blue transition">
                  Lecture 03: What is a Backend & Why
                </Link>
              </li>
              <li>
                <Link href="/lectures/05-http-protocol" className="hover:text-brand-blue transition">
                  Lecture 05: HTTP Protocol Anatomy
                </Link>
              </li>
              <li>
                <Link href="/lectures/06-backend-routing" className="hover:text-brand-blue transition">
                  Lecture 06: Backend Routing & SQL
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">Interactive Sandbox</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li>
                <Link href="/playground" className="hover:text-brand-blue transition">
                  Interactive API Console
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-brand-emerald transition">
                  Module Mastery Tracker
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:4000/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition"
                >
                  Live Server Catalog (:4000)
                </a>
              </li>
            </ul>
          </div>

          {/* Core Foundations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">Core Foundations</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li>• Eliminate Syntax Fatigue</li>
              <li>• Wire & TCP Socket Level Inspection</li>
              <li>• On-Disk SQLite WAL Persistence</li>
              <li>• Zero-Boilerplate Conceptual Mastery</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Backend First Principles. Free and open learning platform.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/SachinManral/Backend-From-First-Principle.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/lectures/01-roadmap" className="hover:text-white transition">Curriculum</Link>
            <Link href="/playground" className="hover:text-white transition">Playground</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
