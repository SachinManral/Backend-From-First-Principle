'use client';

import React, { useState } from 'react';
import { DEMO_CATALOG } from '@/lib/demos';
import PlaygroundConsole from '@/components/playground/PlaygroundConsole';
import { Terminal, Download, Layers, Filter, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function GlobalPlaygroundPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(DEMO_CATALOG.map(d => d.category)))];

  const filteredDemos = selectedCategory === 'All'
    ? DEMO_CATALOG
    : DEMO_CATALOG.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="qt-card p-6 md:p-8 space-y-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="qt-pill mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full Interactive API Sandbox</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Global Practical Playground
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Every live Express demo endpoint gathered in one place. Fire real HTTP requests, inspect wire formats, and observe server mechanics.
            </p>
          </div>

          <a
            href={`${API_BASE_URL}/api/export/postman`}
            download="backend-first-principles.postman_collection.json"
            target="_blank"
            rel="noreferrer"
            className="qt-btn-primary py-2.5 px-5 text-xs shrink-0"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download All in Postman</span>
          </a>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto">
          <span className="text-xs text-zinc-500 font-mono flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-brand-cyan text-black shadow-md shadow-cyan-500/20'
                  : 'bg-surface-muted hover:bg-surface-highlight text-zinc-400 hover:text-white border border-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Demos List */}
      <div className="space-y-8">
        {filteredDemos.map(demo => (
          <PlaygroundConsole key={demo.id} demo={demo} />
        ))}
      </div>
    </div>
  );
}
