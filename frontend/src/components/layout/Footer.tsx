'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Terminal, BookOpen, Download, Github, Heart, Sparkles, Cpu, Layers } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-md pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-md shadow-brand-blue/20">
                <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
                  <Flame className="w-4 h-4 text-brand-purple fill-brand-purple" />
                </div>
              </div>
              <div className="font-extrabold text-sm tracking-tight text-foreground">
                Backend <span className="text-brand-blue">First Principle</span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Developing foundational engineering mechanics from first principles. Master protocols, sockets, and distributed streaming with zero-code fluff.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
              <span>Express Engine :4000</span>
            </div>
          </div>

          {/* Curriculum Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">Curriculum</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/lectures/01-roadmap" className="hover:text-brand-blue transition">
                  Lecture 01: Complete Roadmap
                </Link>
              </li>
              <li>
                <Link href="/lectures/03-what-is-a-backend" className="hover:text-brand-blue transition">
                  Lecture 03: What is a Backend?
                </Link>
              </li>
              <li>
                <Link href="/lectures/04-why-first-principles" className="hover:text-brand-blue transition">
                  Lecture 04: Mental Models
                </Link>
              </li>
              <li>
                <Link href="/lectures/05-http-protocol" className="hover:text-brand-blue transition">
                  Lecture 05: HTTP Protocol Anatomy
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">Live Tools</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/playground" className="hover:text-brand-blue transition">
                  Interactive API Sandbox
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-brand-emerald transition">
                  Curriculum Mastery Tracker
                </Link>
              </li>
              <li>
                <a
                  href={`${API_BASE_URL}/api/export/postman`}
                  download="backend-first-principles.postman_collection.json"
                  className="hover:text-brand-amber transition flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  <span>Postman Collection</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Philosophy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">Core Pillars</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Language-Agnostic Concepts</li>
              <li>• Wire & Kernel Level Inspection</li>
              <li>• Real-Time 3D Physics Modeling</li>
              <li>• Zero Magic Framework Dogma</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Backend First Principle. Built for engineers who want deep mastery.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition">Home</Link>
            <Link href="/playground" className="hover:text-foreground transition">Playground</Link>
            <Link href="/progress" className="hover:text-foreground transition">Progress</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
