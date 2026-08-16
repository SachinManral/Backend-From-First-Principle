'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroMeshScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      type: 'client' | 'proxy' | 'server' | 'db';
      label: string;
      color: string;
    }

    interface Packet {
      fromNode: number;
      toNode: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
    }

    const NODE_TYPES: { type: 'client' | 'proxy' | 'server' | 'db'; label: string; color: string; count: number }[] = [
      { type: 'client', label: 'Client', color: '#06b6d4', count: 6 },
      { type: 'proxy', label: 'Nginx', color: '#6366f1', count: 4 },
      { type: 'server', label: 'Node.js', color: '#10b981', count: 5 },
      { type: 'db', label: 'Postgres', color: '#f59e0b', count: 3 }
    ];

    const nodes: Node[] = [];
    NODE_TYPES.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        nodes.push({
          x: Math.random() * (width - 100) + 50,
          y: Math.random() * (height - 100) + 50,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: group.type === 'db' ? 7 : group.type === 'server' ? 6 : 5,
          type: group.type,
          label: group.label,
          color: group.color
        });
      }
    });

    const packets: Packet[] = [];
    const spawnPacket = () => {
      if (nodes.length < 2) return;
      const fromNode = Math.floor(Math.random() * nodes.length);
      let toNode = Math.floor(Math.random() * nodes.length);
      while (toNode === fromNode) toNode = Math.floor(Math.random() * nodes.length);

      packets.push({
        fromNode,
        toNode,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: nodes[fromNode].color,
        size: 3.5
      });
    };

    let packetTimer = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(9, 9, 11, 0.25)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 30 || a.x > width - 30) a.vx *= -1;
        if (a.y < 30 || a.y > height - 30) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const alpha = 1 - dist / 160;
            ctx.strokeStyle = `rgba(39, 39, 42, ${alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      packetTimer++;
      if (packetTimer % 18 === 0 && packets.length < 25) {
        spawnPacket();
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const start = nodes[p.fromNode];
        const end = nodes[p.toNode];
        if (!start || !end) continue;

        const currentX = start.x + (end.x - start.x) * p.progress;
        const currentY = start.y + (end.y - start.y) * p.progress;

        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}15`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#a1a1aa';
        ctx.font = '10px monospace';
        ctx.fillText(node.label, node.x + node.radius + 4, node.y + 3);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] md:h-[440px] rounded-2xl overflow-hidden border border-surface-border bg-background shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-4 left-4 flex items-center gap-3 bg-surface/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-surface-border text-xs text-zinc-300">
        <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
        <span>Simulated Distributed Topology • 18 Live Nodes</span>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-lg border border-surface-border text-xs">
        <div className="flex items-center gap-1.5 text-brand-cyan">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan inline-block"></span>
          <span>Clients</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-indigo">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo inline-block"></span>
          <span>Proxies</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-emerald">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald inline-block"></span>
          <span>App Servers</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-amber">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber inline-block"></span>
          <span>Databases</span>
        </div>
      </div>
    </div>
  );
}
