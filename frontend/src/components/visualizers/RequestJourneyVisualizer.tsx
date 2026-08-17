'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Shield, Server, Cpu, Database, Network, Play, Pause, RotateCcw } from 'lucide-react';

interface HopInfo {
  id: number;
  name: string;
  shortLabel: string;
  protocol: string;
  icon: any;
  summary: string;
  detail: string;
  color: string;
}

const HOPS: HopInfo[] = [
  {
    id: 1,
    name: 'Browser Client',
    shortLabel: 'Browser',
    protocol: 'HTTP/1.1 or HTTP/2',
    icon: Globe,
    color: '#5c77db',
    summary: 'User initiates an action in the UI. The browser constructs the HTTP request in memory.',
    detail: 'Allocates a local TCP port (e.g. 52418) and sets headers (User-Agent, Accept, Cookies).'
  },
  {
    id: 2,
    name: 'DNS Resolution',
    shortLabel: 'DNS',
    protocol: 'UDP Port 53',
    icon: Network,
    color: '#ac84eb',
    summary: 'Browser looks up the domain name (api.example.com) to find the server\'s public IP address.',
    detail: 'Resolves through browser cache ➔ OS hosts file ➔ Recursive ISP/Cloudflare DNS.'
  },
  {
    id: 3,
    name: 'Cloud Firewall',
    shortLabel: 'Firewall',
    protocol: 'Security Group / WAF',
    icon: Shield,
    color: '#f87171',
    summary: 'Cloud security groups filter network packets at the data center perimeter.',
    detail: 'Allows standard web ports (80/443) and silently drops unauthorized ports (e.g. 5432 DB).'
  },
  {
    id: 4,
    name: 'Cloud Virtual Host',
    shortLabel: 'Host VM',
    protocol: 'Linux Kernel TCP',
    icon: Cpu,
    color: '#818cf8',
    summary: 'Packets reach the virtual network interface card (vNIC) of the host server.',
    detail: 'OS kernel completes the TCP 3-way handshake and handles TLS cryptographic decryption.'
  },
  {
    id: 5,
    name: 'Reverse Proxy (Nginx)',
    shortLabel: 'Nginx',
    protocol: 'Reverse Proxy',
    icon: Server,
    color: '#34d399',
    summary: 'Nginx terminates SSL, applies rate limits, and routes traffic to internal app ports.',
    detail: 'Proxies raw HTTP stream over a local socket to your backend app process (localhost:4000).'
  },
  {
    id: 6,
    name: 'App Server & Database',
    shortLabel: 'App & DB',
    protocol: 'Express & PostgreSQL',
    icon: Database,
    color: '#fbbf24',
    summary: 'Backend executes business logic, queries database connection pools, and returns JSON.',
    detail: 'Authenticates token, queries database records, and writes status 200 OK back down the pipe.'
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

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (activeHop >= 6) setActiveHop(1);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveHop(1);
  };

  const current = HOPS.find((h) => h.id === activeHop) || HOPS[0];
  const CurrentIcon = current.icon;

  return (
    <div className="my-6 p-5 rounded-2xl bg-[#0b0f19] border border-[#1e2640] space-y-4">
      {/* Title & Control Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#1e2640]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-300">
            Interactive 6-Hop Request Pipeline
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayToggle}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1e2640] hover:bg-[#283254] text-xs font-semibold text-white transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Simulate</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1e2640] transition cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {HOPS.map((hop) => {
          const Icon = hop.icon;
          const isCurrent = hop.id === activeHop;
          const isCompleted = hop.id < activeHop;

          return (
            <button
              key={hop.id}
              onClick={() => {
                setIsPlaying(false);
                setActiveHop(hop.id);
              }}
              className={`p-2.5 rounded-xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center gap-1.5 ${
                isCurrent
                  ? 'bg-[#151c30] border-brand-blue text-white shadow-lg shadow-brand-blue/15 scale-[1.03]'
                  : isCompleted
                  ? 'bg-[#0f1424] border-[#1e2640] text-zinc-300 hover:border-zinc-500'
                  : 'bg-transparent border-[#181f33] text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition"
                style={{
                  backgroundColor: isCurrent ? `${hop.color}25` : 'transparent',
                  color: isCurrent ? hop.color : 'currentColor'
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold leading-none truncate w-full">
                {hop.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Clean Single Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#0f1424] border border-[#1e2640] flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${current.color}20`, color: current.color }}
        >
          <CurrentIcon className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              Hop {current.id}: {current.name}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              ({current.protocol})
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {current.summary}
          </p>
          <p className="text-[11px] text-zinc-400 font-mono pt-0.5">
            ➔ {current.detail}
          </p>
        </div>
      </div>
    </div>
  );
}
