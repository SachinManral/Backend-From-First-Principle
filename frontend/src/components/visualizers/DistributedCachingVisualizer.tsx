'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  HardDrive,
  Database,
  Globe,
  Radio,
  Play,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';

type CacheTier = 'BROWSER_HIT' | 'CDN_HIT' | 'REDIS_HIT' | 'DB_MISS';
type EvictionPolicy = 'LRU' | 'LFU' | 'TTL';

interface CacheItem {
  key: string;
  value: string;
  lastAccessed: number;
  accessCount: number;
  ttlRemaining: number;
}

export default function DistributedCachingVisualizer() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'eviction' | 'ratelimit'>('tiers');

  // Tab 1: Multi-Tier Request Journey State
  const [selectedScenario, setSelectedScenario] = useState<'google' | 'netflix' | 'twitter' | 'product'>('google');
  const [cacheStatus, setCacheStatus] = useState<CacheTier | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeHop, setActiveHop] = useState<number>(0);
  const [browserCached, setBrowserCached] = useState(false);
  const [cdnCached, setCdnCached] = useState(true);
  const [redisCached, setRedisCached] = useState(true);

  // Tab 2: Eviction Policy Simulation State
  const [policy, setPolicy] = useState<EvictionPolicy>('LRU');
  const [cacheSlots, setCacheSlots] = useState<CacheItem[]>([
    { key: 'item:1', value: 'Google Weather Delhi', lastAccessed: Date.now() - 50000, accessCount: 12, ttlRemaining: 45 },
    { key: 'item:2', value: 'Netflix Movie 1080p Chunk', lastAccessed: Date.now() - 30000, accessCount: 8, ttlRemaining: 30 },
    { key: 'item:3', value: 'Twitter #Trending Topic', lastAccessed: Date.now() - 10000, accessCount: 25, ttlRemaining: 60 },
    { key: 'item:4', value: 'Amazon Laptop Product Page', lastAccessed: Date.now() - 5000, accessCount: 4, ttlRemaining: 15 }
  ]);
  const [newKeyInput, setNewKeyInput] = useState('item:5');
  const [newValueInput, setNewValueInput] = useState('User Session Token');
  const [lastEvicted, setLastEvicted] = useState<string | null>(null);

  // Tab 3: Rate Limiter State
  const [requestCount, setRequestCount] = useState<number>(38);
  const maxLimit = 50;
  const [rateLimitWindow, setRateLimitWindow] = useState<number>(42);

  // Countdown timer for TTL simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setRateLimitWindow(prev => (prev > 1 ? prev - 1 : 60));
      setCacheSlots(prev =>
        prev.map(slot => ({
          ...slot,
          ttlRemaining: slot.ttlRemaining > 1 ? slot.ttlRemaining - 1 : 60
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Multi-tier simulation execution
  const runTierSimulation = (targetTier: CacheTier) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCacheStatus(null);
    setActiveHop(1);

    const hopDelays = [400, 800, 1200, 1600];

    setTimeout(() => {
      if (targetTier === 'BROWSER_HIT') {
        setActiveHop(1);
        setCacheStatus('BROWSER_HIT');
        setIsSimulating(false);
      } else {
        setActiveHop(2);
        setTimeout(() => {
          if (targetTier === 'CDN_HIT') {
            setActiveHop(2);
            setCacheStatus('CDN_HIT');
            setIsSimulating(false);
          } else {
            setActiveHop(3);
            setTimeout(() => {
              if (targetTier === 'REDIS_HIT') {
                setActiveHop(3);
                setCacheStatus('REDIS_HIT');
                setIsSimulating(false);
              } else {
                setActiveHop(4);
                setTimeout(() => {
                  setCacheStatus('DB_MISS');
                  setIsSimulating(false);
                }, hopDelays[0]);
              }
            }, hopDelays[0]);
          }
        }, hopDelays[0]);
      }
    }, hopDelays[0]);
  };

  // Eviction insertion logic
  const handleInsertCacheItem = () => {
    const key = newKeyInput.trim();
    const value = newValueInput.trim();
    if (!key) return;

    setCacheSlots(prev => {
      const existingIdx = prev.findIndex(item => item.key === key);
      const now = Date.now();

      if (existingIdx !== -1) {
        // Cache update / Hit
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          value,
          lastAccessed: now,
          accessCount: updated[existingIdx].accessCount + 1
        };
        setLastEvicted(null);
        return updated;
      }

      if (prev.length < 5) {
        // Room available
        setLastEvicted(null);
        return [...prev, { key, value, lastAccessed: now, accessCount: 1, ttlRemaining: 60 }];
      }

      // Eviction required
      let evictIdx = 0;
      if (policy === 'LRU') {
        // Find oldest lastAccessed
        let oldest = prev[0].lastAccessed;
        prev.forEach((item, idx) => {
          if (item.lastAccessed < oldest) {
            oldest = item.lastAccessed;
            evictIdx = idx;
          }
        });
      } else if (policy === 'LFU') {
        // Find lowest accessCount
        let lowest = prev[0].accessCount;
        prev.forEach((item, idx) => {
          if (item.accessCount < lowest) {
            lowest = item.accessCount;
            evictIdx = idx;
          }
        });
      } else if (policy === 'TTL') {
        // Find closest to expiration
        let lowestTtl = prev[0].ttlRemaining;
        prev.forEach((item, idx) => {
          if (item.ttlRemaining < lowestTtl) {
            lowestTtl = item.ttlRemaining;
            evictIdx = idx;
          }
        });
      }

      setLastEvicted(`${prev[evictIdx].key} (${policy} Evicted)`);
      const filtered = prev.filter((_, idx) => idx !== evictIdx);
      return [...filtered, { key, value, lastAccessed: now, accessCount: 1, ttlRemaining: 60 }];
    });
  };

  const handleAccessItem = (key: string) => {
    setCacheSlots(prev =>
      prev.map(item =>
        item.key === key
          ? { ...item, lastAccessed: Date.now(), accessCount: item.accessCount + 1 }
          : item
      )
    );
  };

  return (
    <div className="w-full bg-[#030712] border border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>Interactive Distributed Caching Simulator</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Multi-Tier Cache & Eviction Engine</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#0b1329] p-1.5 rounded-2xl border border-[#1e293b]">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'tiers'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Multi-Tier Request Flow
          </button>
          <button
            onClick={() => setActiveTab('eviction')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'eviction'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Eviction (LRU / LFU / TTL)
          </button>
          <button
            onClick={() => setActiveTab('ratelimit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ratelimit'
                ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            In-Memory Rate Limiting
          </button>
        </div>
      </div>

      {/* TAB 1: Multi-Tier Request Journey */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#0b1329]/60 p-4 rounded-2xl border border-[#1e293b]">
            <button
              onClick={() => runTierSimulation('BROWSER_HIT')}
              disabled={isSimulating}
              className="p-3 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-blue-500/30 text-left transition"
            >
              <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">Scenario 1</div>
              <div className="text-sm font-bold text-white mt-0.5">1. Browser Cache Hit</div>
              <div className="text-[11px] text-zinc-400 mt-1">Memory Cache / Service Worker (~0.2 ms)</div>
            </button>

            <button
              onClick={() => runTierSimulation('CDN_HIT')}
              disabled={isSimulating}
              className="p-3 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-cyan-500/30 text-left transition"
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Scenario 2</div>
              <div className="text-sm font-bold text-white mt-0.5">2. CDN Edge Node Hit</div>
              <div className="text-[11px] text-zinc-400 mt-1">Netflix / Cloudflare PoP (~12 ms)</div>
            </button>

            <button
              onClick={() => runTierSimulation('REDIS_HIT')}
              disabled={isSimulating}
              className="p-3 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-emerald-500/30 text-left transition"
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Scenario 3</div>
              <div className="text-sm font-bold text-white mt-0.5">3. Redis In-Memory Hit</div>
              <div className="text-[11px] text-zinc-400 mt-1">RAM Cache-Aside Store (~1.2 ms)</div>
            </button>

            <button
              onClick={() => runTierSimulation('DB_MISS')}
              disabled={isSimulating}
              className="p-3 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-rose-500/30 text-left transition"
            >
              <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Scenario 4</div>
              <div className="text-sm font-bold text-white mt-0.5">4. Complete Cache Miss</div>
              <div className="text-[11px] text-zinc-400 mt-1">PostgreSQL Disk I/O (~140 ms)</div>
            </button>
          </div>

          {/* Tier Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Tier 1: Browser */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                cacheStatus === 'BROWSER_HIT'
                  ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]'
                  : activeHop === 1
                  ? 'bg-blue-500/5 border-blue-500/50'
                  : 'bg-[#080e1e] border-[#1e293b]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-blue-400 uppercase">
                  <span>1. Client Browser</span>
                  {cacheStatus === 'BROWSER_HIT' && <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px]">HIT (0.2ms)</span>}
                </div>
                <div className="text-base font-bold text-white mt-1.5">Local Memory Cache</div>
                <p className="text-xs text-zinc-400 mt-1">Directly inside browser RAM. Eliminates network roundtrips completely.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e293b] text-[11px] font-mono text-zinc-400">
                Storage: <span className="text-white font-bold">Client RAM</span>
              </div>
            </div>

            {/* Tier 2: CDN Edge */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                cacheStatus === 'CDN_HIT'
                  ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]'
                  : activeHop === 2
                  ? 'bg-cyan-500/5 border-cyan-500/50'
                  : 'bg-[#080e1e] border-[#1e293b]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-400 uppercase">
                  <span>2. CDN Edge Node</span>
                  {cacheStatus === 'CDN_HIT' && <span className="bg-cyan-500 text-white px-2 py-0.5 rounded text-[10px]">HIT (12ms)</span>}
                </div>
                <div className="text-base font-bold text-white mt-1.5">Point of Presence (PoP)</div>
                <p className="text-xs text-zinc-400 mt-1">Geographically close edge server. Serves static chunks and images.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e293b] text-[11px] font-mono text-zinc-400">
                Storage: <span className="text-white font-bold">Edge SSD / RAM</span>
              </div>
            </div>

            {/* Tier 3: Redis */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                cacheStatus === 'REDIS_HIT'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]'
                  : activeHop === 3
                  ? 'bg-emerald-500/5 border-emerald-500/50'
                  : 'bg-[#080e1e] border-[#1e293b]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400 uppercase">
                  <span>3. Redis Cache</span>
                  {cacheStatus === 'REDIS_HIT' && <span className="bg-emerald-500 text-black px-2 py-0.5 rounded font-bold text-[10px]">HIT (1.2ms)</span>}
                </div>
                <div className="text-base font-bold text-white mt-1.5">In-Memory RAM Store</div>
                <p className="text-xs text-zinc-400 mt-1">Stores hot precomputed trends, user sessions, and database query results.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e293b] text-[11px] font-mono text-zinc-400">
                Storage: <span className="text-white font-bold">Server RAM (DDR5)</span>
              </div>
            </div>

            {/* Tier 4: Database */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                cacheStatus === 'DB_MISS'
                  ? 'bg-rose-500/10 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]'
                  : activeHop === 4
                  ? 'bg-rose-500/5 border-rose-500/50'
                  : 'bg-[#080e1e] border-[#1e293b]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-rose-400 uppercase">
                  <span>4. Primary Database</span>
                  {cacheStatus === 'DB_MISS' && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">MISS (140ms)</span>}
                </div>
                <div className="text-base font-bold text-white mt-1.5">PostgreSQL Engine</div>
                <p className="text-xs text-zinc-400 mt-1">Authoritative disk storage. High latency sequential scan or index lookup.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e293b] text-[11px] font-mono text-zinc-400">
                Storage: <span className="text-white font-bold">NVMe SSD Disk</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Eviction Policy Simulation */}
      {activeTab === 'eviction' && (
        <div className="space-y-6">
          {/* Policy Selector & Insertion Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b1329]/60 p-4 rounded-2xl border border-[#1e293b]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Eviction Policy:</span>
              <div className="flex gap-1 bg-[#080e1e] p-1 rounded-xl border border-[#1e293b]">
                {(['LRU', 'LFU', 'TTL'] as EvictionPolicy[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPolicy(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      policy === p ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newKeyInput}
                onChange={e => setNewKeyInput(e.target.value)}
                placeholder="Key (e.g. item:5)"
                className="bg-[#080e1e] border border-[#1e293b] text-white text-xs px-3 py-2 rounded-xl w-28 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                value={newValueInput}
                onChange={e => setNewValueInput(e.target.value)}
                placeholder="Value"
                className="bg-[#080e1e] border border-[#1e293b] text-white text-xs px-3 py-2 rounded-xl w-44 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleInsertCacheItem}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-xl shadow hover:opacity-90 transition"
              >
                Insert Key (`SET`)
              </button>
            </div>
          </div>

          {lastEvicted && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Memory limit reached (5 slots max). Evicted: <strong>{lastEvicted}</strong></span>
            </div>
          )}

          {/* Cache Slots Display */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {cacheSlots.map((item, idx) => (
              <div
                key={item.key}
                onClick={() => handleAccessItem(item.key)}
                className="p-4 bg-[#0b1329] border border-[#1e293b] hover:border-purple-500/50 rounded-2xl cursor-pointer transition flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 font-bold">
                    <span>Slot {idx + 1}</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Hit to read</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1 group-hover:text-purple-300 transition truncate">{item.key}</div>
                  <div className="text-xs text-zinc-400 truncate">{item.value}</div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#1e293b] text-[10px] font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>Frequency (LFU):</span>
                    <span className="text-emerald-400 font-bold">{item.accessCount} reads</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TTL Remaining:</span>
                    <span className="text-amber-400 font-bold">{item.ttlRemaining}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Rate Limiting Simulator */}
      {activeTab === 'ratelimit' && (
        <div className="space-y-6">
          <div className="bg-[#0b1329]/60 p-6 rounded-2xl border border-[#1e293b] flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold uppercase">Redis In-Memory Counter (`INCR` + `EXPIRE`)</div>
              <div className="text-2xl font-bold text-white">
                {requestCount} / {maxLimit} Requests
              </div>
              <div className="text-xs text-zinc-400">
                Sliding window resets in <span className="text-amber-400 font-bold">{rateLimitWindow} seconds</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRequestCount(prev => prev + 1)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-lg hover:opacity-90 transition"
              >
                Send Request (`INCR ratelimit:ip`)
              </button>
              <button
                onClick={() => setRequestCount(prev => prev + 15)}
                className="px-4 py-3 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-600/30 transition"
              >
                Simulate Burst Attack (+15 Req)
              </button>
              <button
                onClick={() => setRequestCount(0)}
                className="px-3 py-3 rounded-2xl bg-[#080e1e] border border-[#1e293b] text-zinc-400 hover:text-white transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rate status banner */}
          {requestCount > maxLimit ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500 rounded-2xl flex items-center gap-3 text-rose-300">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <div className="font-bold text-sm text-rose-400">HTTP 429 Too Many Requests</div>
                <div className="text-xs text-rose-200 mt-0.5">
                  Client has exceeded 50 requests per minute. Redis atomic check rejected request before reaching the database.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-sm text-emerald-400">HTTP 200 OK — Under Rate Threshold</div>
                <div className="text-xs text-emerald-200 mt-0.5">
                  Remaining allowed requests in active window: {maxLimit - requestCount}.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
