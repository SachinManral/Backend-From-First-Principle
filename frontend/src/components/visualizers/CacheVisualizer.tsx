'use client';

import React, { useState } from 'react';
import { Database, Zap, RefreshCw, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export default function CacheVisualizer() {
  const [cacheScenario, setCacheScenario] = useState<'fresh' | 'cached' | 'mutated'>('cached');
  const [resourceVersion, setResourceVersion] = useState<number>(1);
  const [lastEtag, setLastEtag] = useState<string>('W/"f9a8b7c6"');

  const handleMutate = () => {
    const nextVer = resourceVersion + 1;
    const newHash = `W/"${Math.random().toString(16).substring(2, 10)}"`;
    setResourceVersion(nextVer);
    setLastEtag(newHash);
    setCacheScenario('mutated');
  };

  return (
    <div className="w-full bg-surface border border-surface-border rounded-2xl p-5 md:p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
              Interactive Cache Mechanics
            </span>
            <span className="text-xs text-zinc-400">ETags & 304 Not Modified</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mt-1">
            HTTP Caching & Conditional Revalidation
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMutate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-surface-highlight text-brand-amber border border-surface-border text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Mutate Resource (V{resourceVersion + 1})</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="flex flex-wrap gap-2 py-4 border-b border-surface-border">
        <button
          onClick={() => setCacheScenario('fresh')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            cacheScenario === 'fresh'
              ? 'bg-brand-cyan/20 text-brand-cyan border border-cyan-500/30'
              : 'bg-surface-muted text-zinc-400 border border-surface-border'
          }`}
        >
          1. First Request (200 OK Fresh)
        </button>
        <button
          onClick={() => setCacheScenario('cached')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            cacheScenario === 'cached'
              ? 'bg-brand-emerald/20 text-brand-emerald border border-emerald-500/30'
              : 'bg-surface-muted text-zinc-400 border border-surface-border'
          }`}
        >
          2. Re-request with If-None-Match (304 Not Modified)
        </button>
        <button
          onClick={() => setCacheScenario('mutated')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            cacheScenario === 'mutated'
              ? 'bg-brand-amber/20 text-brand-amber border border-amber-500/30'
              : 'bg-surface-muted text-zinc-400 border border-surface-border'
          }`}
        >
          3. Server Data Changed (New 200 + New ETag)
        </button>
      </div>

      {/* Visual Pipeline */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client Box */}
        <div className="bg-surface-muted border border-surface-border rounded-xl p-4">
          <div className="text-xs font-mono text-zinc-400 mb-1">CLIENT BROWSER</div>
          <div className="font-bold text-xs text-zinc-200">Request Headers Dispatched</div>
          <div className="mt-3 p-2.5 bg-background rounded font-mono text-[11px] text-zinc-300 space-y-1">
            <div>GET /api/demo/cache/resource</div>
            <div>Host: localhost:4000</div>
            {cacheScenario === 'cached' ? (
              <div className="text-brand-emerald font-semibold">
                If-None-Match: {lastEtag}
              </div>
            ) : cacheScenario === 'mutated' ? (
              <div className="text-zinc-500">
                If-None-Match: W/"old-stale-hash"
              </div>
            ) : (
              <div className="text-zinc-500">(No conditional headers)</div>
            )}
          </div>
        </div>

        {/* Server Evaluation Box */}
        <div className="bg-surface-muted border border-surface-border rounded-xl p-4">
          <div className="text-xs font-mono text-zinc-400 mb-1">EXPRESS SERVER HASH CHECK</div>
          <div className="font-bold text-xs text-zinc-200">Server Evaluates ETag Match</div>
          <div className="mt-3 p-2.5 bg-background rounded font-mono text-[11px] space-y-1">
            <div>Current Server State: V{resourceVersion}</div>
            <div>Generated MD5 Hash: {lastEtag}</div>
            <div className="pt-1.5 border-t border-surface-border">
              {cacheScenario === 'cached' ? (
                <span className="text-brand-emerald font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hash Match: 304 NOT MODIFIED
                </span>
              ) : (
                <span className="text-brand-cyan font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Hash Diff / Fresh: 200 OK
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Wire & Transfer Metric */}
        <div className="bg-surface-muted border border-surface-border rounded-xl p-4">
          <div className="text-xs font-mono text-zinc-400 mb-1">NETWORK WIRE METRICS</div>
          <div className="font-bold text-xs text-zinc-200">Transfer Payload Comparison</div>
          <div className="mt-3 p-2.5 bg-background rounded text-xs space-y-2">
            {cacheScenario === 'cached' ? (
              <>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Payload Body:</span>
                  <span className="text-brand-emerald font-bold font-mono">0 BYTES</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Bandwidth Saved:</span>
                  <span className="text-brand-emerald font-bold font-mono">100%</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2">
                  Browser reuses cached memory instantly without re-downloading bytes.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Payload Body:</span>
                  <span className="text-brand-cyan font-bold font-mono">~18.4 KB</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>ETag Attached:</span>
                  <span className="text-brand-cyan font-mono text-[10px]">{lastEtag}</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2">
                  Full resource transferred and stored in browser HTTP cache.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
