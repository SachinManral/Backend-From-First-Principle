'use client';

import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Terminal, Download, Clock, ShieldCheck, ArrowUpRight, FileCode, Layers, Radio, Sparkles } from 'lucide-react';
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
    <div className="qt-card p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              Live Practical Playground
            </span>
            <span className="text-xs text-zinc-400 font-mono">Port 4000 Express Socket</span>
          </div>
          <h4 className="text-lg font-bold text-white mt-1.5">
            {demo.title}
          </h4>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={copyCurl}
            className="qt-btn-secondary py-2 px-3.5 text-xs"
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
            className="qt-btn-secondary py-2 px-3.5 text-xs hover:text-brand-amber hover:border-amber-500/40"
          >
            <Download className="w-3.5 h-3.5 text-brand-amber" />
            <span>Postman</span>
          </a>
        </div>
      </div>

      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-normal">
        {demo.description}
      </p>

      {/* Dynamic Controls if present */}
      {demo.customControls && demo.customControls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-muted border border-surface-border rounded-2xl">
          {demo.customControls.map(ctrl => (
            <div key={ctrl.key} className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                {ctrl.label}
              </label>
              {ctrl.type === 'select' && ctrl.options && (
                <select
                  value={controlValues[ctrl.key] || ctrl.defaultValue}
                  onChange={(e) => setControlValues(prev => ({ ...prev, [ctrl.key]: e.target.value }))}
                  className="w-full bg-background border border-surface-border rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:outline-none focus:border-brand-blue transition"
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        (controlValues[ctrl.key] || ctrl.defaultValue) === opt.value
                          ? 'bg-brand-blue text-black shadow-md shadow-blue-500/20'
                          : 'bg-background text-zinc-400 border border-surface-border hover:text-white'
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
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center flex-1 bg-background border border-surface-border rounded-2xl overflow-hidden focus-within:border-brand-blue/60 transition shadow-inner">
          <select
            value={method}
            onChange={(e) => {
              const newMethod = e.target.value;
              setMethod(newMethod);
              if (['POST', 'PUT', 'PATCH'].includes(newMethod) && !bodyText) {
                setBodyText(JSON.stringify({ title: "New Book from Interactive Lab", author: "Sachin Manral" }, null, 2));
              }
            }}
            className={`px-3.5 py-2.5 text-xs font-bold font-mono border-r border-surface-border bg-surface-muted focus:outline-none cursor-pointer ${
              method === 'GET'
                ? 'text-brand-blue'
                : method === 'POST'
                ? 'text-brand-emerald'
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
            <option value="HEAD">HEAD</option>
          </select>
          <input
            type="text"
            value={urlPath}
            onChange={(e) => setUrlPath(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2.5 text-xs font-mono text-white focus:outline-none"
            placeholder="/api/demo/..."
          />
        </div>

        <button
          onClick={handleFireRequest}
          disabled={loading}
          className="qt-btn-primary py-2.5 px-6 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{loading ? 'Executing...' : 'Fire Request'}</span>
        </button>
      </div>

      {/* Headers Editor Tab */}
      {Object.keys(headers).length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Active Request Headers:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(headers).map(([k, v]) => (
              <span
                key={k}
                className="px-3 py-1 rounded-xl bg-background border border-surface-border font-mono text-xs text-zinc-300"
              >
                <span className="text-zinc-500">{k}:</span> <span className="text-brand-blue font-bold">{v}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Body Input Editor if method allows */}
      {['POST', 'PUT', 'PATCH'].includes(method) && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Request Body (JSON / text):
          </div>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={3}
            className="w-full p-3.5 bg-background border border-surface-border rounded-2xl font-mono text-xs text-zinc-200 focus:outline-none focus:border-brand-blue/60 transition"
          />
        </div>
      )}

      {/* Response Panel */}
      {(responseStatus !== null || streamEvents.length > 0) && (
        <div className="space-y-4 pt-4 border-t border-surface-border animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
                  responseStatus && responseStatus >= 200 && responseStatus < 300
                    ? 'bg-brand-emerald/15 text-brand-emerald border-emerald-500/30'
                    : responseStatus === 304
                    ? 'bg-brand-blue/15 text-brand-blue border-blue-500/30'
                    : responseStatus && responseStatus >= 400 && responseStatus < 500
                    ? 'bg-brand-amber/15 text-brand-amber border-amber-500/30'
                    : 'bg-brand-rose/15 text-brand-rose border-rose-500/30'
                }`}
              >
                <span>HTTP {responseStatus}</span>
                {responseStatusText && <span className="opacity-80 font-sans">• {responseStatusText}</span>}
              </div>

              {latencyMs !== null && (
                <div className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{latencyMs} ms</span>
                </div>
              )}
            </div>

            {/* Protocol Principle Callout */}
            {responseData && responseData._note && (
              <div className="text-xs text-brand-blue font-mono font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Principle Note: {responseData._note}</span>
              </div>
            )}
          </div>

          {/* SSE Stream Logs */}
          {streamEvents.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isStreamingActive ? 'bg-brand-blue animate-ping' : 'bg-brand-emerald'}`} />
                <span>Chunked Event Stream (text/event-stream)</span>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-surface-border space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
                {streamEvents.map((evt, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 border-b border-surface-border/40 pb-1.5">
                    <div className="text-brand-blue">
                      <span className="text-zinc-500">[{evt.time}] Step {evt.step || i + 1}: </span>
                      <span>{evt.message || evt.raw}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Payload Inspector */}
          {responseRawText && streamEvents.length === 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                <span>Response Body:</span>
                <span className="text-zinc-500 font-normal lowercase">{responseHeaders['content-type'] || 'raw bytes'}</span>
              </div>
              <pre className="p-4 rounded-2xl bg-background border border-surface-border font-mono text-xs text-zinc-200 overflow-x-auto max-h-72 shadow-inner">
                <code>
                  {typeof responseData === 'object'
                    ? JSON.stringify(responseData, null, 2)
                    : responseRawText}
                </code>
              </pre>
            </div>
          )}

          {/* Response Headers Table */}
          {Object.keys(responseHeaders).length > 0 && (
            <details className="text-xs group">
              <summary className="cursor-pointer font-mono font-bold text-zinc-400 hover:text-white py-1 transition flex items-center gap-2 select-none">
                <span>View Raw Response Headers ({Object.keys(responseHeaders).length})</span>
              </summary>
              <div className="mt-2 p-3 rounded-2xl bg-background border border-surface-border font-mono text-[11px] space-y-1 overflow-x-auto">
                {Object.entries(responseHeaders).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-brand-blue">{k}:</span>
                    <span className="text-zinc-300">{v}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
