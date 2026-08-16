'use client';

import React from 'react';
import { getDemoById } from '@/lib/demos';
import PlaygroundConsole from '../playground/PlaygroundConsole';
import { Terminal, Layers } from 'lucide-react';

interface ZonePlaygroundProps {
  demoIds: string[];
}

export default function ZonePlayground({ demoIds }: ZonePlaygroundProps) {
  if (!demoIds || demoIds.length === 0) return null;

  const validDemos = demoIds
    .map(id => getDemoById(id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  if (validDemos.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-brand-cyan/20 text-brand-cyan">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-300">
            Zone 4 — Practical Playground ({validDemos.length} Live Endpoints)
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {validDemos.map((demo) => (
          <PlaygroundConsole key={demo.id} demo={demo} />
        ))}
      </div>
    </div>
  );
}
