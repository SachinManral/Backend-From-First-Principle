'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, CheckCircle2, XCircle, RefreshCw, Send, Lock } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function CorsVisualizer() {
  const [corsMode, setCorsMode] = useState<'allow' | 'block'>('allow');
  const [method, setMethod] = useState<'GET' | 'PUT' | 'DELETE'>('PUT');
  const [customHeader, setCustomHeader] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<{
    step: string;
    preflightSent: boolean;
    preflightStatus?: number;
    mainRequestStatus?: number;
    success: boolean;
    errorReason?: string;
  } | null>(null);

  const isSimple = method === 'GET' && !customHeader;

  const runSimulation = async () => {
    setIsLoading(true);
    setExecutionLog(null);

    // Simulate network delay for educational observation
    await new Promise((res) => setTimeout(res, 350));

    try {
      if (isSimple) {
        // Simple request simulation
        const res = await fetch(`${API_BASE_URL}/api/demo/cors/simple`);
        const data = await res.json();
        setExecutionLog({
          step: "Browser detected Simple Request (GET, no custom headers). Dispatched without OPTIONS preflight.",
          preflightSent: false,
          mainRequestStatus: res.status,
          success: res.ok,
        });
      } else {
        // Non-simple request triggering preflight
        const headers: Record<string, string> = {};
        if (customHeader) headers['X-Custom-Header'] = 'BackendFirstPrinciples';

        const url = `${API_BASE_URL}/api/demo/cors/preflight?mode=${corsMode}`;
        const res = await fetch(url, {
          method,
          headers,
        });
        const data = await res.json();

        setExecutionLog({
          step: "Browser detected Non-Simple Request. Automatically fired OPTIONS preflight before executing main request.",
          preflightSent: true,
          preflightStatus: 204,
          mainRequestStatus: res.status,
          success: res.ok,
        });
      }
    } catch (err: any) {
      setExecutionLog({
        step: "CORS Violation: Browser security policy blocked response from being accessed by JavaScript.",
        preflightSent: !isSimple,
        success: false,
        errorReason: "Access to fetch has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-5 rounded-3xl bg-surface border border-surface-border shadow-2xl flex flex-wrap items-center justify-between gap-4 ambient-glow">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-2xl border border-surface-border">
            <button
              onClick={() => setCorsMode('allow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                corsMode === 'allow'
                  ? 'bg-brand-emerald text-black shadow-lg shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Server Allows Origin
            </button>
            <button
              onClick={() => setCorsMode('block')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                corsMode === 'block'
                  ? 'bg-brand-rose text-white shadow-lg shadow-rose-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Server Blocks Origin
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-surface-muted rounded-2xl border border-surface-border">
            {(['GET', 'PUT', 'DELETE'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  method === m ? 'bg-brand-cyan text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-muted border border-surface-border text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={customHeader}
              onChange={(e) => setCustomHeader(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>Include Custom Header (X-Custom-Header)</span>
          </label>
        </div>

        <button
          onClick={runSimulation}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-indigo text-white font-bold text-xs transition hover:opacity-90 disabled:opacity-50 shadow-xl shadow-indigo-500/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Simulating...' : 'Trigger Request'}</span>
        </button>
      </div>

      {/* Handshake Visual Stage */}
      <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-2xl space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse"></span>
            <span className="font-bold text-white">BROWSER ORIGIN: http://localhost:3000</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">TARGET API: http://localhost:4000</span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo"></span>
          </div>
        </div>

        {/* 2-Step Handshake Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Preflight */}
          <div
            className={`p-4 rounded-2xl border transition ${
              isSimple
                ? 'bg-surface/30 border-surface-border/40 opacity-40'
                : 'bg-surface-muted border-surface-border shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-brand-violet uppercase">
                Step 1: OPTIONS Preflight
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background text-zinc-400">
                {isSimple ? 'SKIPPED (Simple)' : 'REQUIRED'}
              </span>
            </div>
            <div className="font-mono text-xs text-zinc-300 space-y-1">
              <div>OPTIONS /api/demo/cors/preflight</div>
              <div className="text-[11px] text-zinc-500">Origin: http://localhost:3000</div>
              <div className="text-[11px] text-zinc-500">Access-Control-Request-Method: {method}</div>
            </div>
          </div>

          {/* Step 2: Main Request */}
          <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-brand-cyan uppercase">
                Step 2: Actual Request
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background text-brand-emerald font-bold">
                {method} /api/demo/cors
              </span>
            </div>
            <div className="font-mono text-xs text-zinc-300 space-y-1">
              <div>{method} /api/demo/cors/preflight</div>
              <div className="text-[11px] text-zinc-500">Origin: http://localhost:3000</div>
              {customHeader && <div className="text-[11px] text-brand-cyan">X-Custom-Header: BackendFirstPrinciples</div>}
            </div>
          </div>
        </div>

        {/* Live Simulation Result */}
        {executionLog && (
          <div
            className={`p-5 rounded-2xl border text-xs space-y-2 transition animate-fade-in ${
              executionLog.success
                ? 'bg-brand-emerald/10 border-emerald-500/30 text-emerald-300'
                : 'bg-brand-rose/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {executionLog.success ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                  <span>CORS Check Succeeded</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-brand-rose" />
                  <span>CORS Security Block Triggered</span>
                </>
              )}
            </div>
            <p className="leading-relaxed font-sans">{executionLog.step}</p>
            {executionLog.errorReason && (
              <p className="font-mono text-[11px] bg-background/80 p-2.5 rounded-xl border border-rose-500/20 text-rose-400">
                {executionLog.errorReason}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
