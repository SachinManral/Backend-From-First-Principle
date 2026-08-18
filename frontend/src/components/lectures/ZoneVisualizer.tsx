'use client';

import React from 'react';
import { VisualizerType } from '@/lib/types';
import RequestJourneyVisualizer from '../visualizers/RequestJourneyVisualizer';
import CorsVisualizer from '../visualizers/CorsVisualizer';
import CacheVisualizer from '../visualizers/CacheVisualizer';
import HeroMeshScene from '../visualizers/HeroMeshScene';
import DatabaseIndexingVisualizer from '../visualizers/DatabaseIndexingVisualizer';

interface ZoneVisualizerProps {
  type: VisualizerType;
}

export default function ZoneVisualizer({ type }: ZoneVisualizerProps) {
  if (type === 'none') {
    return null;
  }

  return (
    <div className="w-full">
      {type === 'request-journey' && <RequestJourneyVisualizer />}
      {type === 'cors-preflight' && <CorsVisualizer />}
      {(type === 'cache-validation' || (type as string) === 'caching-flow') && <CacheVisualizer />}
      {type === 'database-indexing' && <DatabaseIndexingVisualizer />}
      {type === '3d-mesh' && <HeroMeshScene />}
    </div>
  );
}
