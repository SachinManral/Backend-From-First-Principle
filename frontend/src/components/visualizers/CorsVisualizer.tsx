'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, Play, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export default function CorsVisualizer() {
  const [requestType, setRequestType] = useState<'simple' | 'preflight'>('preflight');
  const [corsAllowed, setCorsAllowed] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const startSimulation = () => {
    setActiveStep(1);
    setIsSimulating(true);

    const maxSteps = requestType === 'preflight' ? 4 : 3;
    let current = 1;

    const timer = setInterval(() => {
      current++;
      setActiveStep(current);
      if (current >= maxSteps) {
        clearInterval(timer);
        setIsSimulating(false);
      }
    }, 1400);
  };

  const reset = () => {
    setActiveStep(1);
    setIsSimulating(false);
  };

  return (
    <div className="w-full bg-surface border border-surface-border rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-violet/10 text-brand-violet border border-brand-violet/20">
              Interactive CORS Flow
            </span>
            <span className="text-xs text-zinc-400">Simple vs Preflight Handshake</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mt-1">
            Browser CORS Enforcement Simulation
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-violet hover:bg-violet-400 text-white font-semibold text-xs transition disabled:opacity-50 shadow-lg shadow-violet-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isSimulating ? 'Evaluating...' : 'Simulate Request Flow'}</span>
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-xl bg-surface-muted hover:bg-surface-highlight text-zinc-400 hover:text-zinc-200 border border-surface-border transition text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-surface-border text-xs">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-medium">Flow Type:</span>
          <div className="flex bg-surface-muted rounded-xl p-1 border border-surface-border">
            <button
              onClick={() => { setRequestType('preflight'); reset(); }}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                requestType === 'preflight' ? 'bg-surface-highlight text-brand-cyan shadow' : 'text-zinc-400'
              }`}
            >
              Preflight (PUT + Headers)
            </button>
            <button
              onClick={() => { setRequestType('simple'); reset(); }}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                requestType === 'simple' ? 'bg-surface-highlight text-brand-cyan shadow' : 'text-zinc-400'
              }`}
            >
              Simple (GET)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-medium">Backend CORS Configuration:</span>
          <div className="flex bg-surface-muted rounded-xl p-1 border border-surface-border">
            <button
              onClick={() => { setCorsAllowed(true); reset(); }}
              className={`px-3 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 ${
                corsAllowed ? 'bg-brand-emerald/20 text-brand-emerald border border-emerald-500/30' : 'text-zinc-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Allow Origin (200 OK)</span>
            </button>
            <button
              onClick={() => { setCorsAllowed(false); reset(); }}
              className={`px-3 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 ${
                !corsAllowed ? 'bg-brand-rose/20 text-brand-rose border border-rose-500/30' : 'text-zinc-400'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Omit Origin (Blocked)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Sequence Pipeline */}
      <div className="py-6">
        {requestType === 'preflight' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 1 ? 'border-brand-cyan bg-surface-highlight shadow-lg' : 'border-surface-border bg-surface-muted opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-brand-cyan">STEP 1</span>
                <span className="text-zinc-400">Browser</span>
              </div>
              <div className="font-bold text-xs text-zinc-200">Preflight Trigger Detected</div>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Frontend attempts `PUT /api/demo/cors/preflight` with custom header `X-First-Principles-Auth`.
              </p>
              <div className="mt-3 p-2 bg-background rounded font-mono text-[10px] text-zinc-400">
                OPTIONS /api/demo/cors/preflight<br/>
                Origin: http://localhost:3000
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 2 ? 'border-brand-violet bg-surface-highlight shadow-lg' : 'border-surface-border bg-surface-muted opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-brand-violet">STEP 2</span>
                <span className="text-zinc-400">OPTIONS Handshake</span>
              </div>
              <div className="font-bold text-xs text-zinc-200">Server Evaluates Preflight</div>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Express server receives OPTIONS query asking if PUT and custom headers are permitted.
              </p>
              <div className="mt-3 p-2 bg-background rounded font-mono text-[10px] text-zinc-400">
                {corsAllowed ? (
                  <span className="text-brand-emerald">
                    HTTP 204 No Content<br/>
                    Access-Control-Allow-Methods: PUT<br/>
                    Access-Control-Allow-Origin: *
                  </span>
                ) : (
                  <span className="text-brand-rose">
                    HTTP 403 Forbidden<br/>
                    (No Access-Control headers returned)
                  </span>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 3 ? 'border-brand-indigo bg-surface-highlight shadow-lg' : 'border-surface-border bg-surface-muted opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-brand-indigo">STEP 3</span>
                <span className="text-zinc-400">Browser Verdict</span>
              </div>
              <div className="font-bold text-xs text-zinc-200">CORS Gate Check</div>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                {corsAllowed
                  ? "Browser inspects preflight headers and greenlights the real payload dispatch."
                  : "Browser halts execution! The actual PUT request will never be sent."}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                {corsAllowed ? (
                  <span className="text-brand-emerald flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Preflight Passed
                  </span>
                ) : (
                  <span className="text-brand-rose flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> CORS Policy Error
                  </span>
                )}
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 4 ? 'border-brand-emerald bg-surface-highlight shadow-lg' : 'border-surface-border bg-surface-muted opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-brand-emerald">STEP 4</span>
                <span className="text-zinc-400">Payload Execution</span>
              </div>
              <div className="font-bold text-xs text-zinc-200">Actual PUT Request</div>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                {corsAllowed
                  ? "Real PUT payload sent and processed by Express backend handler."
                  : "Request aborted before hitting network wire."}
              </p>
              <div className="mt-3 p-2 bg-background rounded font-mono text-[10px] text-zinc-300">
                {corsAllowed ? "HTTP 200 OK | Body: Resource Updated" : "(Blocked by browser engine)"}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Simple Step 1 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 1 ? 'border-brand-cyan bg-surface-highlight shadow-lg' : 'border-surface-border bg-surface-muted opacity-60'
            }`}>
              <div className="font-mono text-xs text-brand-cyan mb-1">STEP 1</div>
              <div className="font-bold text-xs text-zinc-200">Direct Simple Request (GET)</div>
              <p className="text-xs text-zinc-400 mt-1">
                Browser dispatches GET request immediately with `Origin: http://localhost:3000`. No OPTIONS preflight needed.
              </p>
            </div>

            {/* Simple Step 2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 2 ? 'border-brand-indigo bg-surface-highlight shadow-lg' : 'border-surface-border bg-surface-muted opacity-60'
            }`}>
              <div className="font-mono text-xs text-brand-indigo mb-1">STEP 2</div>
              <div className="font-bold text-xs text-zinc-200">Server Execution</div>
              <p className="text-xs text-zinc-400 mt-1">
                The Express backend executes business logic and prepares the response payload.
              </p>
            </div>

            {/* Simple Step 3 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 3 ? 'border-brand-emerald bg-surface-highlight shadow-lg' : 'border-surface-border bg-surface-muted opacity-60'
            }`}>
              <div className="font-mono text-xs text-brand-emerald mb-1">STEP 3</div>
              <div className="font-bold text-xs text-zinc-200">Browser Security Filter</div>
              <p className="text-xs text-zinc-400 mt-1">
                {corsAllowed
                  ? "Response contains Access-Control-Allow-Origin -> Javascript reads JSON response."
                  : "Response lacks header -> Browser hides payload and throws TypeError: Failed to fetch (CORS)."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
