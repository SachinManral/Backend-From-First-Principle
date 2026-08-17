'use client';

import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Terminal, Clock, ShieldCheck, FileCode, Layers, Zap } from 'lucide-react';
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

  // Sync console state whenever selected demo changes
  useEffect(() => {
    setMethod(demo.method);
    setUrlPath(demo.path);
    setHeaders(demo.defaultHeaders || {});
    setBodyText(demo.defaultBody ? JSON.stringify(demo.defaultBody, null, 2) : '');
    setResponseStatus(null);
    setResponseData(null);
    setResponseRawText('');
    setStreamEvents([]);
    const initial: Record<string, string> = {};
    demo.customControls?.forEach(c => {
      initial[c.key] = c.defaultValue;
    });
    setControlValues(initial);
  }, [demo]);

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
    } else if (demo.id === 'routingStatic') {
      if (controlValues.action === 'post_book') {
        setMethod('POST');
        setUrlPath('/api/demo/routing/books');
        setHeaders({ 'Content-Type': 'application/json' });
        setBodyText(JSON.stringify({ title: "Building Microservices with Go", author: "Sachin Manral" }, null, 2));
      } else {
        setMethod('GET');
        setUrlPath('/api/demo/routing/books');
        setHeaders({});
      }
    } else if (demo.id === 'routingDynamic') {
      const uId = controlValues.userId || '123';
      setMethod('GET');
      setUrlPath(`/api/demo/routing/users/${uId}`);
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
        setResponseRawText(`Failed to connect to API server: ${err.message}. Ensure backend is running on port 4000.`);
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
      setResponseStatusText('Network Exception');
      setResponseRawText(`Failed to fetch: ${err.message}\n\nTroubleshooting:\n1. Ensure backend is running on http://localhost:4000.\n2. If testing CORS blocked simulation, this exception is expected behavior.`);
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
    <div className="p-4 sm:p-6 md:p-7 rounded-2xl bg-[#090e1c]/90 border border-[#1b2644] shadow-2xl space-y-5">
      
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1b2644]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              {demo.category || 'API Playground'}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live API</span>
            </div>
          </div>
          <h4 className="text-base font-bold text-white mt-1.5">
            {demo.title}
          </h4>
        </div>

        <button
          onClick={copyCurl}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1428] hover:bg-[#141e3c] border border-[#202e52] text-xs font-semibold text-zinc-300 transition w-fit cursor-pointer"
          title="Copy cURL snippet"
        >
          {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
        </button>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed font-normal">
        {demo.description}
      </p>

      {/* Preset Action Switcher Tabs (Clean pill tabs instead of clunky dropdown) */}
      {demo.customControls && demo.customControls.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {demo.customControls.map(ctrl => (
            <div key={ctrl.key} className="flex flex-wrap items-center gap-1.5">
              {ctrl.options?.map(opt => {
                const isSelected = (controlValues[ctrl.key] || ctrl.defaultValue) === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setControlValues(prev => ({ ...prev, [ctrl.key]: opt.value }))}
                    className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25 border border-brand-blue/50'
                        : 'bg-[#0d1428] text-zinc-400 hover:text-white border border-[#202e52] hover:border-zinc-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Unified URL Bar & Fire Button */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <div className="flex items-center flex-1 bg-[#060a14] border border-[#1b2644] rounded-xl overflow-hidden focus-within:border-brand-blue/60 transition shadow-inner">
          <select
            value={method}
            onChange={(e) => {
              const newMethod = e.target.value;
              setMethod(newMethod);
              if (['POST', 'PUT', 'PATCH'].includes(newMethod) && !bodyText) {
                setBodyText(JSON.stringify({ title: "New Book from Interactive Lab", author: "Sachin Manral" }, null, 2));
              }
            }}
            className={`px-3 py-2.5 sm:py-2 text-xs font-bold font-mono border-r border-[#1b2644] bg-[#0b1020] focus:outline-none cursor-pointer ${
              method === 'GET'
                ? 'text-cyan-400'
                : method === 'POST'
                ? 'text-emerald-400'
                : method === 'PUT' || method === 'PATCH'
                ? 'text-amber-400'
                : method === 'DELETE'
                ? 'text-rose-400'
                : 'text-zinc-300'
            }`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
          <input
            type="text"
            value={urlPath}
            onChange={(e) => setUrlPath(e.target.value)}
            className="flex-1 bg-transparent px-3.5 py-2.5 sm:py-2 text-xs font-mono text-white focus:outline-none"
            placeholder="/api/demo/..."
          />
        </div>

        <button
          onClick={handleFireRequest}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 shadow-md shadow-brand-blue/20 transition cursor-pointer w-full sm:w-auto shrink-0 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{loading ? 'Executing...' : 'Fire Request'}</span>
        </button>
      </div>

      {/* Request Headers Pill Row */}
      {Object.keys(headers).length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="text-zinc-500 font-bold">Headers:</span>
          {Object.entries(headers).map(([k, v]) => (
            <span
              key={k}
              className="px-2.5 py-0.5 rounded-md bg-[#0d1428] border border-[#1b2644] text-zinc-300"
            >
              <span className="text-zinc-400">{k}:</span> <span className="text-cyan-400 font-semibold">{v}</span>
            </span>
          ))}
        </div>
      )}

      {/* Body Input Editor if method allows */}
      {['POST', 'PUT', 'PATCH'].includes(method) && (
        <div className="space-y-2 rounded-xl bg-[#090d16] border border-[#1e2640] p-3 shadow-inner">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-300 font-mono tracking-wide">
                Request Body (JSON Payload)
              </span>
              {(() => {
                try {
                  if (bodyText.trim()) JSON.parse(bodyText);
                  return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Valid JSON
                    </span>
                  );
                } catch {
                  return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Syntax Error
                    </span>
                  );
                }
              })()}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(bodyText);
                    setBodyText(JSON.stringify(parsed, null, 2));
                  } catch {}
                }}
                className="px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1c2742] text-[11px] font-mono text-zinc-300 hover:text-white border border-[#223050] transition cursor-pointer"
              >
                Format JSON
              </button>

              <button
                type="button"
                onClick={() => {
                  setBodyText(demo.defaultBody ? JSON.stringify(demo.defaultBody, null, 2) : '');
                }}
                className="px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1c2742] text-[11px] font-mono text-zinc-400 hover:text-white border border-[#223050] transition cursor-pointer"
              >
                Reset Default
              </button>
            </div>
          </div>

          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={6}
            spellCheck={false}
            className="w-full p-3 bg-[#050811] border border-[#1b2644] rounded-lg font-mono text-xs text-emerald-400 focus:outline-none focus:border-brand-blue/60 transition resize-y min-h-[120px] leading-relaxed shadow-inner"
            placeholder="{ ... }"
          />
        </div>
      )}

      {/* Response Panel */}
      {responseStatus !== null && (
        <div className="rounded-xl bg-[#060a14] border border-[#1b2644] overflow-hidden space-y-0">
          
          {/* Status Bar */}
          <div className="px-4 py-2 bg-[#0b1020] border-b border-[#1b2644] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  responseStatus >= 200 && responseStatus < 300
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : responseStatus >= 300 && responseStatus < 400
                    ? 'bg-blue-500/15 text-cyan-300 border border-cyan-400/30'
                    : responseStatus >= 400 && responseStatus < 500
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                HTTP {responseStatus} {responseStatusText}
              </span>
              {latencyMs !== null && (
                <span className="text-[11px] text-zinc-400 font-mono">
                  {latencyMs}ms
                </span>
              )}
            </div>

            <span className="text-[10px] text-zinc-500 font-mono">
              Live Express Response
            </span>
          </div>

          {/* Response Payload */}
          <div className="p-4 overflow-x-auto">
            {responseData !== null ? (
              <pre className="font-mono text-xs text-zinc-200 leading-relaxed">
                {typeof responseData === 'object'
                  ? JSON.stringify(responseData, null, 2)
                  : String(responseData)}
              </pre>
            ) : responseRawText ? (
              <pre className="font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {responseRawText}
              </pre>
            ) : null}
          </div>

        </div>
      )}

      {/* SSE Streaming Console */}
      {demo.id === 'stream' && streamEvents.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold text-cyan-400 font-mono">
            Chunked SSE Stream Events ({streamEvents.length} frames received):
          </div>
          <div className="p-3 bg-[#060a14] border border-[#1b2644] rounded-xl space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto">
            {streamEvents.map((ev, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-500">[{ev.time}]</span>
                <span className="text-emerald-400 font-bold">chunk #{i + 1}:</span>
                <span>{ev.message || ev.raw}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
