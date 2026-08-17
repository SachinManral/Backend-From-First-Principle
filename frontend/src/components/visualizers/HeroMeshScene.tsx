'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Quantango-Inspired High-Tech 3D Particle & Lattice Visualizer
 * Renders 3D perspective nodes, orbital data ribbons, pulsing packet beams,
 * and glowing neon depth effects that react to cursor movement.
 */
export default function HeroMeshScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      targetRotY = (mouseX / width - 0.5) * 0.8;
      targetRotX = -(mouseY / height - 0.5) * 0.6;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    // 3D Point in space
    interface Point3D {
      x: number;
      y: number;
      z: number;
      origX: number;
      origY: number;
      origZ: number;
      color: string;
      radius: number;
      label?: string;
      layer: 'server' | 'gateway' | 'cluster' | 'database';
    }

    // 3D Moving packet
    interface BeamPacket {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      color: string;
    }

    const points: Point3D[] = [];
    const numRingPoints = 28;
    const ringRadius = 220;

    // Create central 3D orbital rings (Quantango ribbon effect)
    for (let i = 0; i < numRingPoints; i++) {
      const theta = (i / numRingPoints) * Math.PI * 2;
      const x = Math.cos(theta) * ringRadius;
      const z = Math.sin(theta) * ringRadius;
      const y = Math.sin(theta * 3) * 60;

      const colors = ['#5c77db', '#ac84eb', '#5c77db', '#ac84eb'];
      const color = colors[i % colors.length];

      points.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        color,
        radius: (i % 3 === 0) ? 5 : 3.5,
        label: i === 0 ? 'Proxy Ingress' : i === 7 ? 'Node API' : i === 14 ? 'Postgres Pool' : i === 21 ? 'Redis Cache' : undefined,
        layer: (i % 3 === 0) ? 'server' : 'cluster'
      });
    }

    // Add central core nodes
    const coreNodes = [
      { x: 0, y: 0, z: 0, color: '#5c77db', radius: 9, label: 'TCP Kernel 0.0.0.0:4000', layer: 'gateway' as const },
      { x: -90, y: -40, z: 80, color: '#ac84eb', radius: 6, label: 'Worker Thread #1', layer: 'server' as const },
      { x: 90, y: 40, z: -80, color: '#5c77db', radius: 6, label: 'Worker Thread #2', layer: 'server' as const },
      { x: 0, y: 110, z: 40, color: '#ac84eb', radius: 7, label: 'Storage Cluster', layer: 'database' as const },
    ];

    coreNodes.forEach(c => {
      points.push({
        x: c.x,
        y: c.y,
        z: c.z,
        origX: c.x,
        origY: c.y,
        origZ: c.z,
        color: c.color,
        radius: c.radius,
        label: c.label,
        layer: c.layer
      });
    });

    const packets: BeamPacket[] = [];
    const spawnPacket = () => {
      if (points.length < 2) return;
      const fromIndex = Math.floor(Math.random() * points.length);
      let toIndex = Math.floor(Math.random() * points.length);
      while (toIndex === fromIndex) toIndex = Math.floor(Math.random() * points.length);

      packets.push({
        fromIndex,
        toIndex,
        progress: 0,
        speed: 0.012 + Math.random() * 0.018,
        color: points[fromIndex].color
      });
    };

    let angle = 0;
    let packetTimer = 0;

    const render = () => {
      // Smooth camera interpolation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      angle += 0.008;

      // Dark background trail
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, width, height);


      // Ambient radial background glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 380);
      grad.addColorStop(0, 'rgba(92, 119, 219, 0.16)');
      grad.addColorStop(0.5, 'rgba(172, 132, 235, 0.06)');
      grad.addColorStop(1, 'rgba(15, 15, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const fov = 400;
      const projectedPoints: { x: number; y: number; scale: number; z: number; pt: Point3D }[] = [];

      // 3D rotation & projection
      points.forEach(pt => {
        // Rotate around Y axis
        const cosA = Math.cos(angle + rotY);
        const sinA = Math.sin(angle + rotY);
        const x1 = pt.origX * cosA - pt.origZ * sinA;
        const z1 = pt.origX * sinA + pt.origZ * cosA;

        // Rotate around X axis
        const cosB = Math.cos(rotX);
        const sinB = Math.sin(rotX);
        const y2 = pt.origY * cosB - z1 * sinB;
        const z2 = pt.origY * sinB + z1 * cosB;

        const distance = 420;
        const scale = fov / (fov + z2 + distance);
        const projX = x1 * scale + width / 2;
        const projY = y2 * scale + height / 2;

        projectedPoints.push({
          x: projX,
          y: projY,
          scale,
          z: z2,
          pt
        });
      });

      // Sort by depth (painters algorithm)
      projectedPoints.sort((a, b) => b.z - a.z);

      // Draw connecting 3D wireframe lattice
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.4 * p1.scale;
            ctx.strokeStyle = `rgba(172, 132, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update & Draw 3D Light Packets
      packetTimer++;
      if (packetTimer % 12 === 0 && packets.length < 24) {
        spawnPacket();
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const start = projectedPoints.find(item => item.pt === points[p.fromIndex]);
        const end = projectedPoints.find(item => item.pt === points[p.toIndex]);
        if (!start || !end) continue;

        const curX = start.x + (end.x - start.x) * p.progress;
        const curY = start.y + (end.y - start.y) * p.progress;
        const curScale = start.scale + (end.scale - start.scale) * p.progress;

        // Glowing neon photon
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(curX, curY, 3 * curScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw 3D Nodes
      projectedPoints.forEach(p => {
        const r = p.pt.radius * p.scale;

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 6 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `${p.pt.color}18`;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.pt.color;
        ctx.shadowBlur = 16 * p.scale;
        ctx.shadowColor = p.pt.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label if present
        if (p.pt.label && p.scale > 0.65) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `${Math.round(11 * p.scale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.fillText(p.pt.label, p.x + r + 6, p.y + 4);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] md:h-[480px] rounded-3xl overflow-hidden border border-surface-border bg-background shadow-2xl ambient-glow">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Top Floating Badge */}
      <div className="absolute top-5 left-5 flex items-center gap-3 bg-surface/90 backdrop-blur-xl px-4 py-2 rounded-full border border-surface-border text-xs text-zinc-200 shadow-xl">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse"></span>
        <span className="font-semibold tracking-wide">3D Distributed System Architecture • Real-Time Packet Flow</span>
      </div>

      {/* Bottom Color Scheme Badges */}
      <div className="absolute bottom-5 right-5 flex items-center gap-3 bg-surface/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-surface-border text-xs shadow-xl">
        <div className="flex items-center gap-1.5 text-brand-blue font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-blue inline-block"></span>
          <span>Ingress</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-purple font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-purple inline-block"></span>
          <span>Workers</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-purple font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-purple inline-block"></span>
          <span>Compute</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-emerald font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald inline-block"></span>
          <span>Storage</span>
        </div>
      </div>
    </div>
  );
}
