'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Shield, Server, Cpu, Database, Network, Play, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface HopInfo {
  id: number;
  name: string;
  shortLabel: string;
  protocol: string;
  icon: any;
  color: string;
  summary: string;
  mechanics: string[];
  wireDetail: string;
}

const HOPS: HopInfo[] = [
  {
    id: 1,
    name: "1. Browser Client",
    shortLabel: "Browser",
    protocol: "HTTP/1.1 or HTTP/2",
    icon: Globe,
    color: "#34e2e4",
    summary: "User triggers an action (e.g. liking a post or fetching a feed). The browser builds the HTTP request stream in memory.",
    mechanics: [
      "Allocates an ephemeral local TCP source port (e.g. 52418).",
      "Constructs HTTP request line: `GET /api/feed HTTP/1.1`.",
      "Attaches default headers: User-Agent, Cookie, Accept-Encoding."
    ],
    wireDetail: "Client Socket: 127.0.0.1:52418 ➔ Target: api.example.com:443"
  },
  {
    id: 2,
    name: "2. DNS Resolver",
    shortLabel: "DNS",
    protocol: "UDP Port 53",
    icon: Network,
    color: "#ab1dfe",
    summary: "The browser resolves the human hostname (api.example.com) into a routable 32-bit IPv4 or 128-bit IPv6 address.",
    mechanics: [
      "Checks Browser DNS cache ➔ OS hosts file ➔ Router DNS.",
      "Recursive lookup to ISP or Cloudflare (1.1.1.1) / Google (8.8.8.8).",
      "Receives DNS 'A' Record: `api.example.com ➔ 198.51.100.42`."
    ],
    wireDetail: "DNS Query: api.example.com. IN A ➔ Resolved: 198.51.100.42 (TTL 300s)"
  },
  {
    id: 3,
    name: "3. Cloud Firewall / Edge",
    shortLabel: "Firewall",
    protocol: "IP Packet Filter",
    icon: Shield,
    color: "#cf2e2e",
    summary: "Cloud Security Groups & WAF filter packets at the network boundary. Dropping all unauthorized ports.",
    mechanics: [
      "Inspects incoming TCP SYN packet destination port (443 / 80).",
      "Blocks non-whitelisted ports (e.g. port 22 SSH, 5432 Postgres) from the public internet.",
      "Shields backend against Layer 7 DDoS and SQL injection payloads."
    ],
    wireDetail: "FIREWALL RULE: ALLOW TCP 0.0.0.0/0 ➔ Port 443 (ACCEPT)"
  },
  {
    id: 4,
    name: "4. Cloud Virtual Machine",
    shortLabel: "Cloud Host",
    protocol: "Linux Kernel TCP/IP",
    icon: Cpu,
    color: "#4721fb",
    summary: "Packets hit the virtual network interface (vNIC) of the AWS EC2, DigitalOcean droplet, or Docker node.",
    mechanics: [
      "OS Kernel handles the TCP 3-way handshake (SYN ➔ SYN-ACK ➔ ACK).",
      "Establishes TLS session (Client Hello ➔ Server Hello ➔ Key Exchange).",
      "Hands the decrypted byte stream to the listening user-space socket."
    ],
    wireDetail: "OS Socket Table: ESTABLISHED tcp4 0 0 198.51.100.42:443 127.0.0.1:52418"
  },
  {
    id: 5,
    name: "5. Reverse Proxy (Nginx)",
    shortLabel: "Nginx Proxy",
    protocol: "Reverse Proxy / Ingress",
    icon: Server,
    color: "#00d084",
    summary: "Nginx terminates SSL/TLS, manages rate limiting, compresses responses, and routes traffic to internal ports.",
    mechanics: [
      "Decodes hostname (`api.example.com`) and matches location `/api` block.",
      "Injects `X-Forwarded-For` and `X-Real-IP` headers with true client IP.",
      "Proxies byte stream to internal microservice socket (e.g. `localhost:4000`)."
    ],
    wireDetail: "proxy_pass http://127.0.0.1:4000; proxy_set_header X-Forwarded-For $remote_addr;"
  },
  {
    id: 6,
    name: "6. App Server & Database",
    shortLabel: "Express / DB",
    protocol: "Express & Postgres Pool",
    icon: Database,
    color: "#fcb900",
    summary: "Express.js accepts the socket, routes to the controller, executes business logic, queries Postgres, and writes HTTP response bytes.",
    mechanics: [
      "Event loop dispatches request to `router.get('/api/feed')`.",
      "Acquires connection from DB pool: `SELECT * FROM posts LIMIT 20`.",
      "Serializes JSON payload, sets `Content-Type: application/json; charset=utf-8`."
    ],
    wireDetail: "HTTP/1.1 200 OK \\r\\n Content-Type: application/json \\r\\n Content-Length: 1420 \\r\\n\\r\\n {\"posts\": [...]}"
  }
];

export default function RequestJourneyVisualizer() {
  const [activeHop, setActiveHop] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveHop((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return 6;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlay = () => {
    setActiveHop(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveHop(1);
  };

  const current = HOPS.find((h) => h.id === activeHop) || HOPS[0];

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Canvas */}
      <div className="relative p-6 rounded-3xl bg-surface border border-surface-border shadow-2xl overflow-hidden ambient-glow">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
              Interactive 6-Hop Packet Pipeline
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo text-white text-xs font-bold transition hover:opacity-90 disabled:opacity-50 shadow-md shadow-indigo-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isPlaying ? 'Traveling...' : 'Trace Journey'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-surface hover:bg-surface-highlight text-zinc-400 border border-surface-border transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Hop Nodes Sequence */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {HOPS.map((hop) => {
            const Icon = hop.icon;
            const isCurrent = hop.id === activeHop;
            const isPassed = hop.id < activeHop;

            return (
              <button
                key={hop.id}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveHop(hop.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px] ${
                  isCurrent
                    ? 'bg-surface-highlight border-brand-cyan shadow-xl shadow-cyan-500/10 scale-[1.02]'
                    : isPassed
                    ? 'bg-surface/80 border-surface-border hover:border-zinc-500'
                    : 'bg-surface/40 border-surface-border/60 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition"
                    style={{
                      backgroundColor: `${hop.color}20`,
                      color: hop.color,
                      border: `1px solid ${hop.color}40`,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">
                    0{hop.id}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white truncate">
                    {hop.shortLabel}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate">
                    {hop.protocol}
                  </div>
                </div>

                {isCurrent && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: hop.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Card */}
      <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
              style={{
                backgroundColor: `${current.color}20`,
                color: current.color,
                border: `1px solid ${current.color}40`,
              }}
            >
              {React.createElement(current.icon, { className: 'w-5 h-5' })}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{current.name}</h3>
              <p className="text-xs text-zinc-400 font-mono">{current.protocol}</p>
            </div>
          </div>

          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{
              backgroundColor: `${current.color}15`,
              color: current.color,
              border: `1px solid ${current.color}30`,
            }}
          >
            Hop #{current.id} of 6
          </span>
        </div>

        <p className="text-sm text-zinc-200 leading-relaxed font-medium">
          {current.summary}
        </p>

        {/* Mechanics Checklist */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            First Principles Mechanics:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {current.mechanics.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs text-zinc-300 flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                <span className="leading-snug">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Wire Frame / Log */}
        <div className="p-3 rounded-2xl bg-background border border-surface-border font-mono text-xs text-brand-cyan overflow-x-auto">
          <span className="text-zinc-500 select-none">{"[PACKET_INSPECTOR] > "}</span>
          <span>{current.wireDetail}</span>
        </div>
      </div>
    </div>
  );
}
