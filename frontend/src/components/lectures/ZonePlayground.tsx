'use client';

import React from 'react';
import { getDemoById } from '@/lib/demos';
import PlaygroundConsole from '../playground/PlaygroundConsole';
import { Terminal } from 'lucide-react';

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
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
          <Terminal className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
          Interactive API Lab ({validDemos.length} Live Endpoints)
        </span>
      </div>

      <div className="space-y-6">
        {validDemos.map((demo) => (
          <PlaygroundConsole key={demo.id} demo={demo} />
        ))}
      </div>
    </div>
  );
}
