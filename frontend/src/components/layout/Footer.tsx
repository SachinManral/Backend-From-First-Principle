'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Terminal, BookOpen, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1e2640] bg-[#070b14]/95 backdrop-blur-xl pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1e2640]">
          
          {/* Brand Column */}
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
              An open-source interactive learning platform and real-time backend lab designed to teach core backend engineering concepts from first principles.
            </p>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1222] border border-[#1e2640] text-xs font-mono text-emerald-400 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Express & SQLite Engine Live</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">Platform</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-normal">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/lectures/01-roadmap" className="hover:text-white transition">
                  Interactive Articles
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-white transition">
                  API Playground & Lab
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-cyan-300 text-brand-blue font-medium transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Neo AI Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-white transition">
                  Mastery Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">Resources</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-normal">
              <li>
                <a
                  href="https://github.com/SachinManral/Backend-From-First-Principle/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>Contributing Guide</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SachinManral/Backend-From-First-Principle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:4000/api/export/postman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>Postman Collection</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SachinManral/Backend-From-First-Principle/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  MIT License
                </a>
              </li>
            </ul>
          </div>

          {/* Core Foundations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">Foundations</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li>• Wire & TCP Socket Level Anatomy</li>
              <li>• HTTP/1.1 vs HTTP/2 Multiplexing</li>
              <li>• 3-Layer Clean Architecture</li>
              <li>• On-Disk SQLite WAL Persistence</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Backend, From First Principles. Free and open source under MIT License.
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/SachinManral/Backend-From-First-Principle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/lectures/01-roadmap" className="hover:text-white transition">Articles</Link>
            <Link href="/playground" className="hover:text-white transition">Playground</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
