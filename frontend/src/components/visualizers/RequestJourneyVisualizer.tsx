'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Shield, Server, Cpu, Database, Network, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

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
    color: "#06b6d4",
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
    color: "#8b5cf6",
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
    color: "#f43f5e",
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
    color: "#3b82f6",
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
    color: "#10b981",
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
    shortLabel: "Node.js / DB",
    protocol: "Express & Postgres Pool",
    icon: Database,
    color: "#f59e0b",
    summary: "Your actual Express or Go code runs business logic, accesses Postgres/Redis connection pools, and formats JSON.",
    mechanics: [
      "Parses JSON request body and validates authentication JWT tokens.",
      "Borrows an idle database client from the connection pool to execute SQL.",
      "Streams serialized response payload back down the reverse proxy tunnel."
    ],
    wireDetail: "HTTP/1.1 200 OK | Content-Type: application/json | ETag: W/\"f9a8b\" | 48ms"
  }
];

export default function RequestJourneyVisualizer() {
  const [activeHop, setActiveHop] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [packetProgress, setPacketProgress] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPacketProgress(prev => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 5;
          }
          const next = prev + 1;
          setActiveHop(next + 1);
          return next;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStart = () => {
    setPacketProgress(0);
    setActiveHop(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPacketProgress(0);
    setActiveHop(1);
  };

  const selectedHop = HOPS[activeHop - 1];

  return (
    <div className="w-full bg-surface border border-surface-border rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              Interactive 3D Pipeline
            </span>
            <span className="text-xs text-zinc-400">Click any hop to inspect</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mt-1">
            The 6-Hop Journey of an HTTP Request
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={isPlaying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-black font-semibold text-xs transition disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{isPlaying ? 'Traveling Hops...' : 'Dispatch Request'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-surface-muted hover:bg-surface-highlight text-zinc-400 hover:text-zinc-200 border border-surface-border transition text-xs"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Hop Architecture Diagram */}
      <div className="py-6 overflow-x-auto">
        <div className="min-w-[650px] flex items-center justify-between relative px-4">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-surface-border z-0">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-emerald transition-all duration-700 ease-out"
              style={{ width: `${(packetProgress / 5) * 100}%` }}
            />
          </div>

          {HOPS.map((hop, idx) => {
            const Icon = hop.icon;
            const isCurrent = activeHop === hop.id;
            const isPassed = packetProgress >= idx;

            return (
              <button
                key={hop.id}
                onClick={() => {
                  setActiveHop(hop.id);
                  setPacketProgress(idx);
                }}
                className={`relative z-10 flex flex-col items-center group focus:outline-none transition-all duration-300 ${
                  isCurrent ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'border-brand-cyan bg-surface-highlight shadow-lg shadow-cyan-500/30'
                      : isPassed
                      ? 'border-brand-emerald/60 bg-surface-muted text-zinc-300'
                      : 'border-surface-border bg-surface text-zinc-500'
                  }`}
                  style={{
                    borderColor: isCurrent ? hop.color : undefined,
                    boxShadow: isCurrent ? `0 0 20px ${hop.color}40` : undefined
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: isCurrent ? hop.color : isPassed ? '#10b981' : '#71717a' }}
                  />
                </div>

                <div className="mt-2 text-center">
                  <div className="text-xs font-bold text-zinc-200">{hop.shortLabel}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Hop {hop.id}</div>
                </div>

                {isCurrent && (
                  <div
                    className="absolute -bottom-2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: hop.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hop Deep-Dive Inspector Panel */}
      <div className="mt-2 bg-background border border-surface-border rounded-xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedHop.color }}
            />
            <h4 className="text-base font-bold text-zinc-100">{selectedHop.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-surface-muted border border-surface-border font-mono text-zinc-400">
              {selectedHop.protocol}
            </span>
          </div>
          <div className="text-xs text-zinc-400">
            {activeHop < 6 ? `Next: Hop ${activeHop + 1}` : 'Final Hop: Response Generated'}
          </div>
        </div>

        <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
          {selectedHop.summary}
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Under-the-Hood Mechanics
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {selectedHop.mechanics.map((mech, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                  <span>{mech}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Network Wire Simulation
            </div>
            <div className="bg-surface-muted border border-surface-border rounded-lg p-3 font-mono text-[11px] text-brand-cyan/90 break-all leading-relaxed">
              {selectedHop.wireDetail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
