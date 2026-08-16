'use client';

import React, { useState } from 'react';
import { Database, RefreshCw, Send, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function CacheVisualizer() {
  const [cachedEtag, setCachedEtag] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);
  const [lastStatusCode, setLastStatusCode] = useState<number | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transferType, setTransferType] = useState<'200_FULL' | '304_CACHE_HIT' | null>(null);

  const fetchResource = async (sendIfNoneMatch: boolean = true) => {
    setIsLoading(true);
    const start = performance.now();

    const headers: Record<string, string> = {};
    if (sendIfNoneMatch && cachedEtag) {
      headers['If-None-Match'] = cachedEtag;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/demo/cache/resource`, {
        headers,
      });

      const latency = Math.round(performance.now() - start);
      setLastLatency(latency);
      setLastStatusCode(res.status);

      const newEtag = res.headers.get('etag');
      if (newEtag) setCachedEtag(newEtag);

      if (res.status === 304) {
        setTransferType('304_CACHE_HIT');
      } else {
        setTransferType('200_FULL');
        const data = await res.json();
        setResourceData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const mutateOnServer = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/demo/cache/resource`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_price' }),
      });
      const data = await res.json();
      setLastStatusCode(res.status);
      setTransferType('200_FULL');
      const newEtag = res.headers.get('etag');
      if (newEtag) setCachedEtag(newEtag);
      setResourceData(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Interactive Controls */}
      <div className="p-5 rounded-3xl bg-surface border border-surface-border shadow-2xl flex flex-wrap items-center justify-between gap-4 ambient-glow">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => fetchResource(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-indigo text-white text-xs font-bold transition hover:opacity-90 disabled:opacity-50 shadow-xl shadow-indigo-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{cachedEtag ? 'Revalidate with ETag' : 'Fetch First Time (200 OK)'}</span>
          </button>

          <button
            onClick={mutateOnServer}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-highlight text-brand-amber border border-surface-border text-xs font-bold transition shadow"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mutate Resource (Invalidate Cache)</span>
          </button>

          <button
            onClick={() => {
              setCachedEtag(null);
              setResourceData(null);
              setLastStatusCode(null);
              setTransferType(null);
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-surface hover:bg-surface-highlight text-zinc-400 border border-surface-border text-xs transition"
          >
            Clear Browser Cache
          </button>
        </div>

        {lastLatency !== null && (
          <div className="text-xs font-mono text-zinc-400">
            Round-trip: <span className="text-brand-cyan font-bold">{lastLatency}ms</span>
          </div>
        )}
      </div>

      {/* Visual State Representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Browser Cache Box */}
        <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse"></span>
              <span>Browser Cache Memory</span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-background border border-surface-border text-zinc-400">
              LocalStorage / Disk Cache
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="text-zinc-400">Stored ETag Token:</div>
            <div className="p-3 rounded-xl bg-background border border-surface-border text-brand-violet truncate">
              {cachedEtag ? cachedEtag : '<No ETag stored yet>'}
            </div>
          </div>

          {transferType && (
            <div
              className={`p-4 rounded-2xl border text-xs font-mono ${
                transferType === '304_CACHE_HIT'
                  ? 'bg-brand-emerald/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-brand-indigo/10 border-indigo-500/30 text-indigo-300'
              }`}
            >
              <div className="font-bold flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {transferType === '304_CACHE_HIT'
                    ? '304 Not Modified (0 Bytes Body Transferred!)'
                    : '200 OK (Full Body Transferred)'}
                </span>
              </div>
              <p className="font-sans text-[11px] opacity-80 leading-relaxed">
                {transferType === '304_CACHE_HIT'
                  ? 'The server verified the resource hash matches your If-None-Match header. Response had no body payload, saving bandwidth.'
                  : 'Server sent the full JSON body with a fresh ETag header.'}
              </p>
            </div>
          )}
        </div>

        {/* Current Resource Data */}
        <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-emerald" />
              <span>Current Resource Payload</span>
            </div>
            {lastStatusCode && (
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                  lastStatusCode === 304
                    ? 'bg-brand-emerald/10 text-brand-emerald border-emerald-500/30'
                    : 'bg-brand-cyan/10 text-brand-cyan border-cyan-500/30'
                }`}
              >
                HTTP {lastStatusCode}
              </span>
            )}
          </div>

          <pre className="p-4 rounded-2xl bg-background border border-surface-border text-xs font-mono text-zinc-300 overflow-x-auto max-h-[160px]">
            {resourceData
              ? JSON.stringify(resourceData, null, 2)
              : '// Click "Fetch First Time" to load server data'}
          </pre>
        </div>
      </div>
    </div>
  );
}
