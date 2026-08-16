'use client';

import React from 'react';
import { VisualizerType } from '@/lib/types';
import RequestJourneyVisualizer from '../visualizers/RequestJourneyVisualizer';
import CorsVisualizer from '../visualizers/CorsVisualizer';
import CacheVisualizer from '../visualizers/CacheVisualizer';
import HeroMeshScene from '../visualizers/HeroMeshScene';

interface ZoneVisualizerProps {
  type: VisualizerType;
}

export default function ZoneVisualizer({ type }: ZoneVisualizerProps) {
  if (type === 'none') {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400">
          Zone 3 — Concept Visualizer
        </span>
      </div>

      {type === 'request-journey' && <RequestJourneyVisualizer />}
      {type === 'cors-preflight' && <CorsVisualizer />}
      {type === 'caching-flow' && <CacheVisualizer />}
    </div>
  );
}
