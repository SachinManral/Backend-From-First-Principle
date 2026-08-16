'use client';

import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Terminal, Download, Clock, ShieldCheck, ArrowUpRight, FileCode, Layers, Radio } from 'lucide-react';
import { DemoEndpoint } from '@/lib/types';
import { API_BASE_URL, generateCurlSnippet } from '@/lib/demos';

interface PlaygroundConsoleProps {
  demo: DemoEndpoint;
  compact?: boolean;
}

export default function PlaygroundConsole({ demo, compact = false }: PlaygroundConsoleProps) {
  const [method, setMethod] = useState<string>(demo.method === 'ANY' ? 'POST' : demo.method);
  const [urlPath, setUrlPath] = useState<string>(demo.path);
  const [headers, setHeaders] = useState<Record<string, string>>(demo.defaultHeaders || {});
  const [bodyText, setBodyText] = useState<string>(
    demo.defaultBody ? JSON.stringify(demo.defaultBody, null, 2) : ''
  );
  
  // Custom controls state
  const [controlValues, setControlValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    demo.customControls?.forEach(c => {
      initial[c.key] = c.defaultValue;
    });
    return initial;
  });

  // Response state
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [responseRawText, setResponseRawText] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  
  // Streaming events state
  const [streamEvents, setStreamEvents] = useState<Array<{ step?: number; message?: string; raw: string; time: string }>>([]);
  const [isStreamingActive, setIsStreamingActive] = useState<boolean>(false);

  // Update path/headers when custom controls change
  useEffect(() => {
    if (demo.id === 'status' && controlValues.code) {
      setUrlPath(`/api/demo/status/${controlValues.code}`);
    } else if (demo.id === 'cors') {
      const isAllowed = controlValues.allowCors !== 'false';
      if (controlValues.flow === 'simple') {
        setMethod('GET');
        setUrlPath(`/api/demo/cors/simple?allowCors=${isAllowed}`);
      } else {
        setMethod('PUT');
        setUrlPath(`/api/demo/cors/preflight?allowCors=${isAllowed}`);
      }
    } else if (demo.id === 'cache') {
      if (controlValues.action === 'get_conditional') {
        setMethod('GET');
        setUrlPath('/api/demo/cache/resource');
        setHeaders({ 'If-None-Match': 'W/"f9a8b7c6d5e4"' });
      } else if (controlValues.action === 'get_fresh') {
        setMethod('GET');
        setUrlPath('/api/demo/cache/resource');
        setHeaders({});
      } else if (controlValues.action === 'patch_mutate') {
        setMethod('PATCH');
        setUrlPath('/api/demo/cache/resource');
        setHeaders({ 'Content-Type': 'application/json' });
        setBodyText(JSON.stringify({ content: "Mutated resource at " + new Date().toLocaleTimeString() }, null, 2));
      }
    } else if (demo.id === 'negotiate') {
      setHeaders({
        'Accept': controlValues.acceptFormat || 'application/json',
        'Accept-Language': controlValues.acceptLang || 'en'
      });
    } else if (demo.id === 'compress') {
      setUrlPath(`/api/demo/compress?gzip=${controlValues.gzip || 'true'}&count=300`);
    } else if (demo.id === 'stream') {
      setUrlPath(`/api/demo/stream?steps=${controlValues.steps || '5'}&interval=500`);
    } else if (demo.id === 'idempotency') {
      setMethod(controlValues.method || 'POST');
    }
  }, [controlValues, demo.id]);

  const handleFireRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    setResponseRawText('');
    setStreamEvents([]);

    const startTime = performance.now();
    const fullUrl = `${API_BASE_URL}${urlPath}`;

    // Handle SSE streaming endpoint
    if (demo.id === 'stream') {
      setIsStreamingActive(true);
      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: { 'Accept': 'text/event-stream' }
        });

        setResponseStatus(response.status);
        setResponseStatusText(response.statusText);
        
        const headerObj: Record<string, string> = {};
        response.headers.forEach((v, k) => { headerObj[k] = v; });
        setResponseHeaders(headerObj);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            
            // Parse event stream lines
            const lines = text.split('\n');
            lines.forEach(line => {
              if (line.startsWith('data:')) {
                try {
                  const dataJson = JSON.parse(line.replace('data:', '').trim());
                  setStreamEvents(prev => [...prev, {
                    step: dataJson.step,
                    message: dataJson.message || dataJson.status,
                    raw: JSON.stringify(dataJson),
                    time: new Date().toLocaleTimeString()
                  }]);
                } catch (e) {
                  setStreamEvents(prev => [...prev, { raw: line, time: new Date().toLocaleTimeString() }]);
                }
              }
            });
          }
        }
      } catch (err: any) {
        setResponseStatus(0);
        setResponseRawText(`Failed to connect to API server: ${err.message}. Is backend running on http://localhost:4000?`);
      } finally {
        setLatencyMs(Math.round(performance.now() - startTime));
        setLoading(false);
        setIsStreamingActive(false);
      }
      return;
    }

    // Standard HTTP request
    try {
      const options: RequestInit = {
        method,
        headers: {
          ...headers,
        },
        mode: 'cors'
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && bodyText) {
        options.body = bodyText;
      }

      const response = await fetch(fullUrl, options);
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed);
      setResponseStatus(response.status);
      setResponseStatusText(response.statusText);

      const headerObj: Record<string, string> = {};
      response.headers.forEach((v, k) => {
        headerObj[k] = v;
      });
      setResponseHeaders(headerObj);

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      setResponseRawText(text);

      if (contentType.includes('application/json')) {
        try {
          setResponseData(JSON.parse(text));
        } catch {
          setResponseData(text);
        }
      } else {
        setResponseData(text);
      }
    } catch (err: any) {
      setLatencyMs(Math.round(performance.now() - startTime));
      setResponseStatus(0);
      setResponseStatusText('Network / CORS Exception');
      setResponseRawText(`Failed to fetch: ${err.message}\n\nTroubleshooting:\n1. Ensure Express API is running: 'npm run dev' inside /backend (listening on port 4000).\n2. If testing CORS blocked mode, this browser error is the intended teaching behavior!`);
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = () => {
    const curl = generateCurlSnippet(demo, `${API_BASE_URL}${urlPath}`, method, headers, bodyText ? JSON.parse(bodyText || '{}') : undefined);
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="w-full bg-surface border border-surface-border rounded-2xl p-5 md:p-6 shadow-2xl space-y-5">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              Live Practical Playground
            </span>
            <span className="text-xs text-zinc-400 font-mono">Real HTTP Endpoint</span>
          </div>
          <h4 className="text-base font-bold text-zinc-100 mt-1">
            {demo.title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCurl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-surface-highlight text-zinc-300 border border-surface-border text-xs transition"
            title="Copy cURL snippet"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-brand-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? 'Copied!' : 'Copy cURL'}</span>
          </button>
          
          <a
            href={`${API_BASE_URL}/api/export/postman`}
            download="backend-first-principles.postman_collection.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-surface-highlight text-brand-amber border border-surface-border text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Postman Export</span>
          </a>
        </div>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed">
        {demo.description}
      </p>

      {/* Dynamic Controls if present */}
      {demo.customControls && demo.customControls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-surface-muted border border-surface-border rounded-xl">
          {demo.customControls.map(ctrl => (
            <div key={ctrl.key} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                {ctrl.label}
              </label>
              {ctrl.type === 'select' && ctrl.options && (
                <select
                  value={controlValues[ctrl.key] || ctrl.defaultValue}
                  onChange={(e) => setControlValues(prev => ({ ...prev, [ctrl.key]: e.target.value }))}
                  className="w-full bg-background border border-surface-border rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-brand-cyan"
                >
                  {ctrl.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              {ctrl.type === 'toggle' && ctrl.options && (
                <div className="flex gap-2">
                  {ctrl.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setControlValues(prev => ({ ...prev, [ctrl.key]: opt.value }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        (controlValues[ctrl.key] || ctrl.defaultValue) === opt.value
                          ? 'bg-brand-cyan text-black'
                          : 'bg-background text-zinc-400 border border-surface-border'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Request Bar & Fire Button */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex items-center flex-1 bg-background border border-surface-border rounded-xl overflow-hidden focus-within:border-brand-cyan transition">
          <span className="px-3.5 py-2 text-xs font-bold font-mono bg-surface-muted text-brand-cyan border-r border-surface-border">
            {method}
          </span>
          <input
            type="text"
            value={urlPath}
            onChange={(e) => setUrlPath(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
            placeholder="/api/demo/..."
          />
        </div>

        <button
          onClick={handleFireRequest}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-black font-bold text-xs transition disabled:opacity-50 shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>{loading ? 'Executing...' : 'Fire Request'}</span>
        </button>
      </div>

      {/* Side-by-Side Raw Request vs Raw Response Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Request Wire Payload */}
        <div className="bg-background border border-surface-border rounded-xl p-4 flex flex-col h-[280px]">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border mb-3">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
              <span>OUTBOUND HTTP REQUEST</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Wire Format</span>
          </div>

          <div className="flex-1 overflow-auto font-mono text-[11px] text-zinc-300 space-y-2">
            <div className="text-brand-cyan">
              {method} {urlPath} HTTP/1.1
            </div>
            <div className="text-zinc-400">
              Host: localhost:4000
            </div>
            {Object.entries(headers).map(([k, v]) => (
              <div key={k} className="text-zinc-400">
                {k}: <span className="text-zinc-300">{v}</span>
              </div>
            ))}
            {bodyText && (
              <div className="pt-2 border-t border-surface-border">
                <div className="text-[10px] text-zinc-500 mb-1">Payload Body:</div>
                <pre className="text-zinc-200 whitespace-pre-wrap">{bodyText}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Inbound Response Inspector */}
        <div className="bg-background border border-surface-border rounded-xl p-4 flex flex-col h-[280px]">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border mb-3">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-brand-emerald" />
              <span>INBOUND RESPONSE</span>
            </span>
            {responseStatus !== null && (
              <div className="flex items-center gap-2">
                {latencyMs !== null && (
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {latencyMs}ms
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  responseStatus >= 200 && responseStatus < 300 ? 'bg-brand-emerald/20 text-brand-emerald border border-emerald-500/30' :
                  responseStatus >= 300 && responseStatus < 400 ? 'bg-brand-cyan/20 text-brand-cyan border border-cyan-500/30' :
                  responseStatus >= 400 && responseStatus < 500 ? 'bg-brand-amber/20 text-brand-amber border border-amber-500/30' :
                  'bg-brand-rose/20 text-brand-rose border border-rose-500/30'
                }`}>
                  {responseStatus === 0 ? 'ERR' : `${responseStatus} ${responseStatusText}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto font-mono text-[11px] text-zinc-300">
            {loading && !isStreamingActive && (
              <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse">
                Transmitting bytes across TCP socket...
              </div>
            )}

            {!loading && responseStatus === null && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center px-4">
                <Play className="w-6 h-6 mb-2 opacity-30" />
                <span>Click &apos;Fire Request&apos; to trigger this live endpoint and inspect response bytes.</span>
              </div>
            )}

            {/* SSE Stream Viewer */}
            {demo.id === 'stream' && streamEvents.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] text-brand-cyan font-bold mb-1">
                  Server-Sent Events Stream (Transfer-Encoding: chunked)
                </div>
                {streamEvents.map((ev, i) => (
                  <div key={i} className="p-2 bg-surface-muted rounded border border-surface-border text-xs">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                      <span>Chunk #{i + 1} {ev.step ? `(Step ${ev.step})` : ''}</span>
                      <span>{ev.time}</span>
                    </div>
                    <div className="text-zinc-200">{ev.message || ev.raw}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Standard Response Viewer */}
            {demo.id !== 'stream' && responseStatus !== null && (
              <div className="space-y-3">
                {/* Educational Note Callout */}
                {responseData?._note && (
                  <div className="p-2.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-lg text-brand-cyan text-xs">
                    <span className="font-bold">Principle Note: </span>
                    {responseData._note}
                  </div>
                )}

                {/* Response Headers */}
                {Object.keys(responseHeaders).length > 0 && (
                  <div className="p-2 bg-surface-muted rounded border border-surface-border text-[10px] text-zinc-400 space-y-0.5">
                    <div className="font-bold text-zinc-300 mb-1">Response Headers:</div>
                    {Object.entries(responseHeaders).slice(0, 6).map(([k, v]) => (
                      <div key={k}>{k}: <span className="text-zinc-200">{v}</span></div>
                    ))}
                  </div>
                )}

                {/* Response Body */}
                <pre className="text-zinc-200 whitespace-pre-wrap break-all">
                  {typeof responseData === 'object'
                    ? JSON.stringify(responseData, null, 2)
                    : responseRawText}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
