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
  GitBranch,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HardDrive
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

  // Indexing animation
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
      }, useIndex ? 300 : 250);
    }
    return () => clearInterval(timer);
  }, [isScanning, useIndex]);

  const ATTACK_PAYLOADS = [
    {
      id: 'auth_bypass',
      label: "Bypass Auth (' OR '1'='1)",
      payload: "' OR '1'='1",
      description: "Appends an always-true boolean condition to dump or log in as the first user."
    },
    {
      id: 'comment_out',
      label: "Admin Hijack (admin' --)",
      payload: "admin' --",
      description: "Comments out the remainder of the query, skipping password validation entirely."
    },
    {
      id: 'drop_table',
      label: "Destructive Injection ('; DROP TABLE...)",
      payload: "'; DROP TABLE users; --",
      description: "Terminates the primary query and attempts to execute an arbitrary destructive statement."
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
    setTimeout(() => setTriggerFired(false), 2500);
  };

  return (
    <div className="w-full rounded-2xl border border-[#1e2640] bg-[#090d16] p-5 sm:p-6 shadow-2xl space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b233a] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue/30 to-brand-purple/30 border border-brand-blue/40 flex items-center justify-center text-brand-blue shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                PostgreSQL Engine & Indexing Lab
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-[10px] font-mono text-brand-blue font-semibold">
                Interactive Simulation
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Explore B-Tree logarithmic search, parameterized query AST isolation, and automatic triggers.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#0d1322] border border-[#1e2842] rounded-xl p-1 gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('indexing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'indexing'
                ? 'bg-brand-blue text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>B-Tree vs Table Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('injection')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'injection'
                ? 'bg-brand-blue text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SQL Injection Defense</span>
          </button>
          <button
            onClick={() => setActiveTab('triggers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'triggers'
                ? 'bg-brand-blue text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Triggers & Automation</span>
          </button>
        </div>
      </div>

      {/* TAB 1: B-Tree Index vs Full Table Scan */}
      {activeTab === 'indexing' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0d1424] border border-[#19233c] rounded-xl p-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Target Lookup Value (`email`)
              </label>
              <div className="flex items-center gap-2 bg-[#070b14] border border-[#1e2942] rounded-lg px-3 py-1.5 text-xs text-white font-mono">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchTarget}
                  onChange={e => setSearchTarget(e.target.value)}
                  className="bg-transparent outline-none w-full text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Index Strategy
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseIndex(true)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    useIndex
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-[#070b14] border-[#1e2942] text-zinc-400 hover:text-white'
                  }`}
                >
                  ⚡ B-Tree Index (O(log N))
                </button>
                <button
                  onClick={() => setUseIndex(false)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    !useIndex
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-[#070b14] border-[#1e2942] text-zinc-400 hover:text-white'
                  }`}
                >
                  🐢 Full Table Scan (O(N))
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setIsScanning(true)}
                disabled={isScanning}
                className="w-full py-2 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>{isScanning ? 'Executing Query...' : 'Run EXPLAIN ANALYZE'}</span>
              </button>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Diagram Area */}
            <div className="lg:col-span-7 bg-[#070b14] border border-[#1a233a] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-brand-blue" />
                  Disk Page Access Simulator (1,000,000 Rows Dataset)
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Storage: 8KB PostgreSQL Pages
                </span>
              </div>

              {useIndex ? (
                /* B-Tree Graph */
                <div className="space-y-4 py-2">
                  {/* Root Node */}
                  <div className="flex justify-center">
                    <div className={`px-4 py-2 rounded-xl border transition-all duration-300 font-mono text-xs text-center ${
                      scanStep >= 1
                        ? 'bg-brand-blue/30 border-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105'
                        : 'bg-[#0f172a] border-[#223150] text-zinc-400'
                    }`}>
                      <div className="text-[10px] text-brand-blue font-bold uppercase">Root Page (Level 2)</div>
                      <div className="font-semibold mt-0.5">Keys: [a.. - m..] | [n.. - z..]</div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-0.5 h-4 bg-[#23314f]" />
                  </div>

                  {/* Branch Nodes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2.5 rounded-lg border border-[#1b2640] bg-[#0b101c] text-center opacity-40 font-mono text-[11px]">
                      Branch [a.. - g..]
                    </div>
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 font-mono text-xs text-center ${
                      scanStep >= 2
                        ? 'bg-brand-blue/30 border-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105'
                        : 'bg-[#0f172a] border-[#223150] text-zinc-400'
                    }`}>
                      <div className="text-[10px] text-cyan-400 font-bold uppercase">Branch Page (Level 1)</div>
                      <div className="font-semibold mt-0.5">Key Range: [r.. - t..]</div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-0.5 h-4 bg-[#23314f]" />
                  </div>

                  {/* Leaf Node & Row Pointer */}
                  <div className="flex justify-center">
                    <div className={`px-5 py-3 rounded-xl border transition-all duration-300 font-mono text-xs text-center ${
                      scanStep >= 3
                        ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105'
                        : 'bg-[#0f172a] border-[#223150] text-zinc-400'
                    }`}>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Leaf Node (Level 0) Match!
                      </div>
                      <div className="font-semibold mt-1">`{searchTarget}` ➔ Pointer: `Page 412, Offset 18`</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Full Table Scan Blocks */
                <div className="space-y-3 py-2">
                  <div className="text-xs text-rose-400 font-semibold mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Sequential Full Table Scan in Progress...
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map(pageIdx => (
                      <div
                        key={pageIdx}
                        className={`p-2.5 rounded-lg border text-center font-mono text-[11px] transition-all duration-200 ${
                          scanStep >= pageIdx
                            ? 'bg-rose-500/25 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                            : 'bg-[#0b101c] border-[#1b2640] text-zinc-500'
                        }`}
                      >
                        <div className="text-[9px] uppercase text-zinc-500">Block</div>
                        <div className="font-bold">Page {pageIdx * 1666}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mt-3">
                    <strong>I/O Bottleneck:</strong> The database engine must sequentially read all 10,000 disk pages into memory buffers to evaluate the condition on every row.
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className="mt-4 pt-3 border-t border-[#182138] flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">
                  Scan Method: <strong className={useIndex ? 'text-emerald-400' : 'text-rose-400'}>{useIndex ? 'Index Scan using idx_users_email' : 'Seq Scan on users'}</strong>
                </span>
                <span className="text-zinc-400">
                  Status: <strong className="text-white">{isScanning ? 'Scanning...' : 'Completed'}</strong>
                </span>
              </div>
            </div>

            {/* Performance Metrics & EXPLAIN Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0d1424] border border-[#19233c] rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                  Engine Performance Metrics
                </h4>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-2.5 rounded-lg bg-[#070b14] border border-[#1a243a]">
                    <div className="text-[10px] text-zinc-500 uppercase">Execution Time</div>
                    <div className={`text-base font-bold ${useIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {useIndex ? '0.042 ms' : '418.60 ms'}
                    </div>
                    <div className="text-[10px] text-zinc-500">{useIndex ? '⚡ ~9,900x faster' : '🐢 High latency'}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#070b14] border border-[#1a243a]">
                    <div className="text-[10px] text-zinc-500 uppercase">Buffer Page Reads</div>
                    <div className={`text-base font-bold ${useIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {useIndex ? '3 pages' : '10,000 pages'}
                    </div>
                    <div className="text-[10px] text-zinc-500">{useIndex ? '24 KB read' : '80 MB read'}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#070b14] border border-[#1a243a]">
                    <div className="text-[10px] text-zinc-500 uppercase">Time Complexity</div>
                    <div className="text-sm font-bold text-white">
                      {useIndex ? 'O(log N)' : 'O(N)'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#070b14] border border-[#1a243a]">
                    <div className="text-[10px] text-zinc-500 uppercase">Index Cost Trade-off</div>
                    <div className="text-sm font-bold text-amber-300">
                      {useIndex ? '+Write Overhead' : 'Zero Index Size'}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPLAIN Output */}
              <div className="bg-[#070b14] border border-[#19233c] rounded-xl p-3.5 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  PostgreSQL Query Plan Output
                </div>
                {useIndex ? (
                  <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">
{`Index Scan using idx_users_email on users
  Index Cond: (email = '${searchTarget}'::text)
  Buffers: shared hit=3
Execution Time: 0.042 ms`}
                  </pre>
                ) : (
                  <pre className="text-rose-300 leading-relaxed whitespace-pre-wrap">
{`Seq Scan on users  (cost=0.00..18450.00 rows=1)
  Filter: (email = '${searchTarget}'::text)
  Rows Removed by Filter: 999999
  Buffers: shared hit=10000
Execution Time: 418.600 ms`}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SQL Injection Defense Simulator */}
      {activeTab === 'injection' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0d1424] border border-[#19233c] rounded-xl p-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Select or Enter Attack Vector
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {ATTACK_PAYLOADS.map(att => (
                  <button
                    key={att.id}
                    onClick={() => handleSelectAttack(att.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition cursor-pointer border ${
                      selectedAttack === att.id
                        ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold'
                        : 'bg-[#070b14] border-[#1e2942] text-zinc-400 hover:text-white'
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
                className="w-full bg-[#070b14] border border-[#1e2942] rounded-lg px-3 py-1.5 text-xs text-rose-300 font-mono outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Backend Query Defense
              </label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setUseParameterized(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    useParameterized
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                      : 'bg-[#070b14] border-[#1e2942] text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Parameterized Query ($1)</span>
                </button>
                <button
                  onClick={() => setUseParameterized(false)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    !useParameterized
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
                      : 'bg-[#070b14] border-[#1e2942] text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Vulnerable String Interpolation</span>
                </button>
              </div>
            </div>
          </div>

          {/* AST & Execution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Query Assembled */}
            <div className="bg-[#070b14] border border-[#19233c] rounded-xl p-4 font-mono text-xs space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">
                {useParameterized ? 'Database Driver Protocol (Safe)' : 'Vulnerable Raw String Query (Unsafe)'}
              </div>

              {useParameterized ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#0e1628] border border-[#223254] text-cyan-300">
                    <span className="text-zinc-500">// Prepared Statement Template</span>
                    <br />
                    SELECT * FROM users WHERE email = <span className="text-emerald-400 font-bold">$1</span>;
                  </div>
                  <div className="p-3 rounded-lg bg-[#0e1628] border border-[#223254] text-amber-300">
                    <span className="text-zinc-500">// Parameter Array (Sent separately in protocol frame)</span>
                    <br />
                    $1 = <span className="text-white font-bold">"{customInput}"</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-zinc-200">
                  <span className="text-zinc-500">// Raw Concatenated String sent to SQL Engine</span>
                  <br />
                  SELECT * FROM users WHERE email = '<span className="text-rose-400 font-bold">{customInput}</span>';
                </div>
              )}

              <div className="pt-2 text-[11px] text-zinc-400 font-sans">
                {useParameterized ? (
                  <p className="text-emerald-400 flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>SQL Injection Neutralized:</strong> The SQL query bytecode was compiled before receiving parameters. The input <code>{customInput}</code> is treated strictly as literal data. Zero records match.</span>
                  </p>
                ) : (
                  <p className="text-rose-400 flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Critical Security Breach:</strong> The input quotes broke out of the string boundary, allowing attacker code to be compiled directly into the SQL Abstract Syntax Tree (AST).</span>
                  </p>
                )}
              </div>
            </div>

            {/* Execution Result */}
            <div className="bg-[#070b14] border border-[#19233c] rounded-xl p-4 font-mono text-xs space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">
                Server Response & AST Inspection
              </div>

              <div className={`p-4 rounded-xl border ${
                useParameterized
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {useParameterized ? '🛡️ Query Status: Safe & Secure' : '🚨 Vulnerability Exploited!'}
                </div>
                <p className="text-[11px] font-sans text-zinc-300 leading-relaxed">
                  {useParameterized
                    ? `Prepared statement executed successfully. Rows returned: 0. The database looked for an email literally named "${customInput}".`
                    : `Authentication bypassed! Condition evaluated to TRUE for all rows. Dumping table or authenticating as root admin.`}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0e1628] border border-[#1c2742] text-[11px] font-sans text-zinc-400">
                <strong>First-Principle Rule:</strong> Never concatenate user variables directly into SQL strings. Always use parameterized queries (e.g. <code>$1</code> in PostgreSQL, <code>?</code> in MySQL/SQLite) to separate query instructions from untrusted user data.
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
            <div className="bg-[#070b14] border border-[#19233c] rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b253e] pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Database Table: `users` (Row ID #42)
                </span>
                {triggerFired && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 animate-pulse">
                    ⚡ Trigger: updated_at auto-refreshed!
                  </span>
                )}
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-[#1a2540]">
                  <span className="text-zinc-500">id</span>
                  <span className="text-white font-bold">{userRow.id}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-[#1a2540]">
                  <span className="text-zinc-500">username</span>
                  <span className="text-white">{userRow.username}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-[#1a2540]">
                  <span className="text-zinc-500">email</span>
                  <span className="text-cyan-300 font-bold">{userRow.email}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-[#1a2540]">
                  <span className="text-zinc-500">status (ENUM)</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {userRow.status}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ${
                  triggerFired
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-[#0d1424] border-[#1a2540] text-amber-300'
                }`}>
                  <span className="text-zinc-400">updated_at (Triggered)</span>
                  <span className="font-bold">{userRow.updated_at}</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Mutate Email Column (Application Level)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="flex-1 bg-[#0d1424] border border-[#1e2942] rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-brand-blue"
                  />
                  <button
                    onClick={handleTriggerUpdate}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue/80 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Execute UPDATE
                  </button>
                </div>
              </div>
            </div>

            {/* Trigger DDL Code Box */}
            <div className="bg-[#070b14] border border-[#19233c] rounded-xl p-4 font-mono text-xs space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">
                PostgreSQL Trigger Function & DDL
              </div>

              <div className="p-3 rounded-lg bg-[#0c1220] border border-[#1c2742] text-zinc-300 text-[11px] leading-relaxed overflow-x-auto">
                <pre className="text-cyan-300">
{`-- 1. Create timestamp updater function
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

              <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
                <strong>Why Triggers Matter:</strong> Moving timestamp maintenance to the database ensures consistency across all microservices, administrative SQL scripts, and migrations without relying on application-level clock synchronization.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
