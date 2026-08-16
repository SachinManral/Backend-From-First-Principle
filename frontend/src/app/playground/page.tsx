'use client';

import React, { useState } from 'react';
import { DEMO_CATALOG } from '@/lib/demos';
import PlaygroundConsole from '@/components/playground/PlaygroundConsole';
import { Terminal, Download, Layers, Filter } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function GlobalPlaygroundPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(DEMO_CATALOG.map(d => d.category)))];

  const filteredDemos = selectedCategory === 'All'
    ? DEMO_CATALOG
    : DEMO_CATALOG.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full Interactive API Sandbox</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 mt-2">
              Global Practical Playground
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Every live Express demo endpoint gathered in one place. Fire real HTTP requests, inspect wire formats, and observe server mechanics.
            </p>
          </div>

          <a
            href={`${API_BASE_URL}/api/export/postman`}
            download="backend-first-principles.postman_collection.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-black font-bold text-xs transition shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
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
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-brand-cyan text-black'
                  : 'bg-surface-muted hover:bg-surface-highlight text-zinc-400 hover:text-zinc-200 border border-surface-border'
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
