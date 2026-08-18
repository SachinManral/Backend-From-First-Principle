'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';

export default function DatabaseIndexingVisualizer() {
  const [activeTab, setActiveTab] = useState<'indexing' | 'injection' | 'triggers'>('indexing');

  // Tab 1: Indexing state
  const [useIndex, setUseIndex] = useState(true);
  const [searchTarget, setSearchTarget] = useState('sachin@backend.dev');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  // Tab 2: SQL Injection state
  const [selectedAttack, setSelectedAttack] = useState<string>('auth_bypass');
  const [customInput, setCustomInput] = useState("' OR '1'='1");
  const [useParameterized, setUseParameterized] = useState(true);

  // Tab 3: Trigger state
  const [userRow, setUserRow] = useState({
    id: 42,
    username: 'sachin_dev',
    email: 'sachin@backend.dev',
    status: 'ACTIVE',
    updated_at: '2026-08-18 10:00:00 UTC'
  });
  const [newEmail, setNewEmail] = useState('sachin.architect@backend.dev');
  const [triggerFired, setTriggerFired] = useState(false);

  // Indexing animation steps
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isScanning) {
      setScanStep(0);
      const maxSteps = useIndex ? 3 : 6;
      let current = 0;
      timer = setInterval(() => {
        current += 1;
        setScanStep(current);
        if (current >= maxSteps) {
          setIsScanning(false);
          clearInterval(timer);
        }
      }, useIndex ? 350 : 250);
    }
    return () => clearInterval(timer);
  }, [isScanning, useIndex]);

  const ATTACK_PAYLOADS = [
    {
      id: 'auth_bypass',
      label: "Bypass Auth (' OR '1'='1)",
      payload: "' OR '1'='1",
      description: "Appends an always-true boolean condition to dump or authenticate as first user."
    },
    {
      id: 'comment_out',
      label: "Admin Hijack (admin' --)",
      payload: "admin' --",
      description: "Comments out remainder of query, bypassing password check completely."
    },
    {
      id: 'drop_table',
      label: "Destructive Injection ('; DROP TABLE...)",
      payload: "'; DROP TABLE users; --",
      description: "Terminates query and executes an arbitrary destructive statement."
    }
  ];

  const handleSelectAttack = (attId: string) => {
    setSelectedAttack(attId);
    const found = ATTACK_PAYLOADS.find(a => a.id === attId);
    if (found) setCustomInput(found.payload);
  };

  const handleTriggerUpdate = () => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    setUserRow(prev => ({
      ...prev,
      email: newEmail,
      updated_at: nowStr
    }));
    setTriggerFired(true);
    setTimeout(() => setTriggerFired(false), 3000);
  };

  return (
    <div className="w-full bg-[#030712] border border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6">
      
      {/* Visualizer Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                PostgreSQL Engine & Indexing Lab
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                Live Simulation
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Traverse logarithmic B-Trees, inspect AST parameter isolation, and observe automated database triggers.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#0a1020] border border-[#1e293b] rounded-2xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('indexing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'indexing'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>B-Tree vs Table Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('injection')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'injection'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SQL Injection Defense</span>
          </button>
          <button
            onClick={() => setActiveTab('triggers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'triggers'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Triggers & DDL</span>
          </button>
        </div>
      </div>

      {/* TAB 1: B-Tree Index vs Full Table Scan */}
      {activeTab === 'indexing' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#080e1e]/80 border border-[#1e293b] rounded-2xl p-4.5">
            <div>
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Target Lookup Value (Email Index)
              </label>
              <div className="flex items-center gap-2 bg-[#030712] border border-[#1e293b] focus-within:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono transition">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <input
                  type="text"
                  value={searchTarget}
                  onChange={e => setSearchTarget(e.target.value)}
                  className="bg-transparent outline-none w-full text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Scan Strategy
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseIndex(true)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    useIndex
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#030712] border-[#1e293b] text-zinc-400 hover:text-white'
                  }`}
                >
                  ⚡ B-Tree Index (O(log N))
                </button>
                <button
                  onClick={() => setUseIndex(false)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    !useIndex
                      ? 'bg-rose-500/15 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-[#030712] border-[#1e293b] text-zinc-400 hover:text-white'
                  }`}
                >
                  🐢 Full Seq Scan (O(N))
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setIsScanning(true)}
                disabled={isScanning}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isScanning ? 'Traversing Storage Pages...' : 'Execute EXPLAIN ANALYZE'}</span>
              </button>
            </div>
          </div>

          {/* Visualization Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Diagram Area */}
            <div className="lg:col-span-7 bg-[#060a14] border border-[#1e293b] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  Disk Page Access Simulator (1,000,000 Rows Dataset)
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-[#0d1424] px-2 py-0.5 rounded border border-[#1e293b]">
                  Page Size: 8 KB
                </span>
              </div>

              {useIndex ? (
                /* B-Tree Graph with SVG Connectors */
                <div className="space-y-4 py-2 relative">
                  {/* Root Node */}
                  <div className="flex justify-center">
                    <div className={`px-5 py-2.5 rounded-2xl border transition-all duration-300 font-mono text-xs text-center ${
                      scanStep >= 1
                        ? 'bg-blue-500/20 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105'
                        : 'bg-[#0a1020] border-[#1e293b] text-zinc-400'
                    }`}>
                      <div className="text-[10px] text-cyan-400 font-bold uppercase">Root Page (Level 2)</div>
                      <div className="font-bold mt-0.5">Keys: [a.. - m..] | [n.. - z..]</div>
                    </div>
                  </div>

                  {/* SVG Connector */}
                  <div className="flex justify-center my-1">
                    <div className="w-0.5 h-5 bg-gradient-to-b from-blue-500/60 to-cyan-500/60" />
                  </div>

                  {/* Branch Nodes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl border border-[#152033] bg-[#070c18] text-center opacity-30 font-mono text-xs text-zinc-500">
                      Branch [a.. - g..]
                    </div>
                    <div className={`p-3 rounded-2xl border transition-all duration-300 font-mono text-xs text-center ${
                      scanStep >= 2
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-[#0a1020] border-[#1e293b] text-zinc-400'
                    }`}>
                      <div className="text-[10px] text-cyan-300 font-bold uppercase">Branch Page (Level 1)</div>
                      <div className="font-bold mt-0.5">Key Range: [r.. - t..]</div>
                    </div>
                  </div>

                  {/* SVG Connector */}
                  <div className="flex justify-center my-1">
                    <div className="w-0.5 h-5 bg-gradient-to-b from-cyan-500/60 to-emerald-500/60" />
                  </div>

                  {/* Leaf Node & Row Pointer */}
                  <div className="flex justify-center">
                    <div className={`px-6 py-3 rounded-2xl border transition-all duration-300 font-mono text-xs text-center ${
                      scanStep >= 3
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-105'
                        : 'bg-[#0a1020] border-[#1e293b] text-zinc-400'
                    }`}>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Leaf Page (Level 0) Match Found!
                      </div>
                      <div className="font-bold mt-1 text-white">
                        <code className="text-cyan-300">{searchTarget}</code> ➔ Pointer: <code className="text-emerald-300">Page 412, Offset 18</code>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Full Table Scan Blocks */
                <div className="space-y-3 py-3">
                  <div className="text-xs text-rose-400 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Sequential Disk Scan in Progress...
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map(pageIdx => (
                      <div
                        key={pageIdx}
                        className={`p-3 rounded-xl border text-center font-mono text-xs transition-all duration-200 ${
                          scanStep >= pageIdx
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                            : 'bg-[#090e1c] border-[#1e293b] text-zinc-500'
                        }`}
                      >
                        <div className="text-[9px] uppercase text-zinc-500">Chunk {pageIdx}</div>
                        <div className="font-bold text-[11px] mt-0.5">Page {pageIdx * 1666}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs mt-3 leading-relaxed">
                    <strong>Disk I/O Bottleneck:</strong> The engine must sequentially read all 10,000 disk pages into memory buffers, thrashing the OS page cache to find a single row.
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">
                  Scan Method: <strong className={useIndex ? 'text-emerald-400' : 'text-rose-400'}>{useIndex ? 'Index Scan using idx_users_email' : 'Seq Scan on users'}</strong>
                </span>
                <span className="text-zinc-400">
                  Status: <strong className="text-white">{isScanning ? 'Scanning Disk...' : 'Completed'}</strong>
                </span>
              </div>
            </div>

            {/* Performance Metrics & EXPLAIN Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#060a14] border border-[#1e293b] rounded-2xl p-4.5 space-y-3 shadow-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Engine Performance Metrics
                </h4>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-[#0a1020] border border-[#1e293b]">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">Execution Time</div>
                    <div className={`text-base font-bold mt-0.5 ${useIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {useIndex ? '0.042 ms' : '418.60 ms'}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{useIndex ? '⚡ ~9,900x faster' : '🐢 High latency'}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a1020] border border-[#1e293b]">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">Buffer Page Reads</div>
                    <div className={`text-base font-bold mt-0.5 ${useIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {useIndex ? '3 pages' : '10,000 pages'}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{useIndex ? '24 KB transferred' : '80 MB transferred'}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a1020] border border-[#1e293b]">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">Time Complexity</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {useIndex ? 'O(log N)' : 'O(N)'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a1020] border border-[#1e293b]">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">Index Trade-Off</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">
                      {useIndex ? '+Write Overhead' : 'Zero Index Size'}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPLAIN Output Terminal */}
              <div className="bg-[#040711] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl font-mono text-xs">
                <div className="flex items-center justify-between px-3.5 py-2 bg-[#090f1d] border-b border-[#1e293b]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    <span className="text-[10px] font-bold text-zinc-400 ml-2 uppercase">PostgreSQL EXPLAIN ANALYZE</span>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="p-4 overflow-x-auto">
                  {useIndex ? (
                    <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap text-[11px]">
{`Index Scan using idx_users_email on users
  Index Cond: (email = '${searchTarget}'::text)
  Buffers: shared hit=3 (Root -> Branch -> Leaf)
Execution Time: 0.042 ms`}
                    </pre>
                  ) : (
                    <pre className="text-rose-300 leading-relaxed whitespace-pre-wrap text-[11px]">
{`Seq Scan on users  (cost=0.00..18450.00 rows=1)
  Filter: (email = '${searchTarget}'::text)
  Rows Removed by Filter: 999,999
  Buffers: shared hit=10,000 (Full 80MB scan)
Execution Time: 418.600 ms`}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SQL Injection Defense Simulator */}
      {activeTab === 'injection' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#080e1e]/80 border border-[#1e293b] rounded-2xl p-4.5">
            <div className="md:col-span-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Attack Payload Preset
              </label>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {ATTACK_PAYLOADS.map(att => (
                  <button
                    key={att.id}
                    onClick={() => handleSelectAttack(att.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition border ${
                      selectedAttack === att.id
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold shadow'
                        : 'bg-[#030712] border-[#1e293b] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {att.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customInput}
                onChange={e => {
                  setCustomInput(e.target.value);
                  setSelectedAttack('');
                }}
                className="w-full bg-[#030712] border border-[#1e293b] rounded-xl px-3.5 py-2 text-xs text-rose-300 font-mono outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Backend Query Defense
              </label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setUseParameterized(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                    useParameterized
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow'
                      : 'bg-[#030712] border-[#1e293b] text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Parameterized Query ($1)</span>
                </button>
                <button
                  onClick={() => setUseParameterized(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                    !useParameterized
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow'
                      : 'bg-[#030712] border-[#1e293b] text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Vulnerable String Concatenation</span>
                </button>
              </div>
            </div>
          </div>

          {/* AST & Execution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Query Assembled */}
            <div className="bg-[#060a14] border border-[#1e293b] rounded-2xl p-5 font-mono text-xs space-y-3.5">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {useParameterized ? 'Database Protocol Frame (Safe)' : 'Vulnerable String Assembly (Unsafe)'}
              </div>

              {useParameterized ? (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-[#090f1d] border border-[#1e293b] text-cyan-300">
                    <span className="text-zinc-500">// 1. Query AST is pre-compiled</span>
                    <br />
                    SELECT * FROM users WHERE email = <span className="text-emerald-400 font-bold">$1</span>;
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#090f1d] border border-[#1e293b] text-amber-300">
                    <span className="text-zinc-500">// 2. Parameter payload is passed as literal byte string</span>
                    <br />
                    $1 = <span className="text-white font-bold">"{customInput}"</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-zinc-200">
                  <span className="text-zinc-500">// Raw Concatenated SQL sent to parser</span>
                  <br />
                  SELECT * FROM users WHERE email = '<span className="text-rose-400 font-bold">{customInput}</span>';
                </div>
              )}

              <div className="pt-2 text-xs text-zinc-300 font-sans leading-relaxed">
                {useParameterized ? (
                  <p className="text-emerald-400 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>SQLi Defeated:</strong> The SQL query AST was compiled before parameters arrived. The quotes in <code>{customInput}</code> are escaped as literal characters.</span>
                  </p>
                ) : (
                  <p className="text-rose-400 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Critical Vulnerability:</strong> The attacker's single quote broke out of the string boundary, injecting executable bytecode directly into the database engine.</span>
                  </p>
                )}
              </div>
            </div>

            {/* Execution Result */}
            <div className="bg-[#060a14] border border-[#1e293b] rounded-2xl p-5 font-mono text-xs space-y-3.5">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Database Response Status
              </div>

              <div className={`p-4 rounded-2xl border ${
                useParameterized
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {useParameterized ? '🛡️ Query Result: Safe & Isolated' : '🚨 Authentication Bypassed!'}
                </div>
                <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                  {useParameterized
                    ? `Parameterized query executed. Rows returned: 0. The database searched for a user whose email literally equals "${customInput}".`
                    : `Condition evaluated to TRUE for all rows. Dumping all user records or granting root administrator access.`}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090f1d] border border-[#1e293b] text-xs font-sans text-zinc-400 leading-relaxed">
                <strong>Golden Rule:</strong> Never use string interpolation (e.g. <code>`SELECT * FROM ... ${'${input}'}`</code>) for SQL queries. Always use parameterized placeholders (<code>$1</code> in PostgreSQL, <code>?</code> in SQLite/MySQL).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Triggers & Automated Timestamping */}
      {activeTab === 'triggers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Live Row Card */}
            <div className="bg-[#060a14] border border-[#1e293b] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Database Table: `users` (Row ID #42)
                </span>
                {triggerFired && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500 text-xs font-mono text-cyan-300 animate-pulse font-bold">
                    ⚡ Trigger: updated_at Refreshed!
                  </span>
                )}
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
                  <span className="text-zinc-500">id</span>
                  <span className="text-white font-bold">{userRow.id}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
                  <span className="text-zinc-500">username</span>
                  <span className="text-white">{userRow.username}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
                  <span className="text-zinc-500">email</span>
                  <span className="text-cyan-300 font-bold">{userRow.email}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
                  <span className="text-zinc-500">status (ENUM)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {userRow.status}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                  triggerFired
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'bg-[#090f1d] border-[#1e293b] text-amber-300'
                }`}>
                  <span className="text-zinc-400">updated_at (Triggered)</span>
                  <span className="font-bold">{userRow.updated_at}</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-300 block mb-2 font-mono uppercase tracking-wider">
                  Mutate Email Column (UPDATE query)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="flex-1 bg-[#090f1d] border border-[#1e293b] focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                  <button
                    onClick={handleTriggerUpdate}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow hover:opacity-90 transition"
                  >
                    Execute UPDATE
                  </button>
                </div>
              </div>
            </div>

            {/* Trigger DDL Code Box */}
            <div className="bg-[#060a14] border border-[#1e293b] rounded-2xl p-5 font-mono text-xs space-y-3.5">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                PostgreSQL Trigger Function & DDL
              </div>

              <div className="p-3.5 rounded-xl bg-[#040711] border border-[#1e293b] text-zinc-300 text-[11px] leading-relaxed overflow-x-auto">
                <pre className="text-cyan-300 font-mono">
{`-- 1. Create timestamp updater procedure
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Bind trigger to users table
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();`}
                </pre>
              </div>

              <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                <strong>Why Triggers Matter:</strong> Moving timestamp synchronization to the database guarantees consistency across all microservices, backend workers, and direct admin queries without relying on client or application clocks.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
