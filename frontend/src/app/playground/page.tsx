'use client';

import React, { useState } from 'react';
import { DEMO_CATALOG } from '@/lib/demos';
import PlaygroundConsole from '@/components/playground/PlaygroundConsole';
import { Terminal, Filter, Sparkles, Database } from 'lucide-react';

export default function GlobalPlaygroundPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(DEMO_CATALOG.map(d => d.category)))];

  const filteredDemos = selectedCategory === 'All'
    ? DEMO_CATALOG
    : DEMO_CATALOG.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#090e1c]/85 border border-[#1b2644] shadow-2xl backdrop-blur-2xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold mb-2.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full Interactive API Sandbox</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              API Playground & Sandbox
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Execute live REST endpoints, inspect HTTP wire bytes, and observe database execution in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1428] border border-[#202e52] text-xs font-mono text-emerald-400 shrink-0 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Server Connected</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto">
          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3 text-brand-blue" /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25 border border-brand-blue/50'
                  : 'bg-[#0d1428] hover:bg-[#141e3c] text-zinc-400 hover:text-white border border-[#202e52]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Demos List */}
      <div className="space-y-6">
        {filteredDemos.map(demo => (
          <PlaygroundConsole key={demo.id} demo={demo} />
        ))}
      </div>
    </div>
  );
}
