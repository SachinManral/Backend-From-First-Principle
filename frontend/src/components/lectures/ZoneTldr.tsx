'use client';

import React, { useState } from 'react';
import { Zap, Clock, Bookmark, Play, ExternalLink, ThumbsUp, ThumbsDown, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Lecture } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';

interface ZoneTldrProps {
  lecture: Lecture;
}

function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#141b2d] border border-[#232f4e] font-mono text-[12px] text-brand-rose font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={i} className="italic text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

import LikeButton from '@/components/common/LikeButton';
import { Check } from 'lucide-react';

export default function ZoneTldr({ lecture }: ZoneTldrProps) {
  const { isCompleted, toggleComplete } = useProgress();
  const completed = isCompleted(lecture.slug);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Top Breadcrumb & Action Toolbar (CodeHelp Article Style) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pb-2 border-b border-border/60">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:text-brand-blue transition font-mono"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Articles / {lecture.phaseTitle}</span>
        </Link>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {lecture.youtubeUrl && (
            <a
              href={lecture.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition shadow-sm"
              title="Watch on YouTube"
            >
              <Play className="w-3 h-3 fill-red-400 text-red-400" />
              <span className="hidden sm:inline">Watch on YouTube</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          )}

          {/* Real 1-Like Per Device Button */}
          <LikeButton targetId={lecture.slug} label="Like" size="sm" />

          {/* Share Article */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-secondary text-zinc-400 hover:text-white transition cursor-pointer relative"
            title="Share article link"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -top-7 -left-6 px-2 py-0.5 rounded bg-brand-emerald text-black text-[10px] font-bold">
                Copied!
              </span>
            )}
          </button>

          {/* Per-Device Progress Toggle */}
          <button
            onClick={() => toggleComplete(lecture.slug)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
              completed
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-[#0e1424] border-[#222e4c] text-zinc-400 hover:text-white hover:border-zinc-500'
            }`}
            title={completed ? "Marked as completed on this device" : "Mark as completed"}
          >
            <Check className={`w-3.5 h-3.5 ${completed ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span>{completed ? 'Completed' : 'Mark Done'}</span>
          </button>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2 pt-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {lecture.title}
        </h1>
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
          {renderFormattedText(lecture.subtitle)}
        </p>
      </div>

      {/* TL;DR Callout Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1322] border border-[#1e2640] flex items-start gap-3.5 shadow-md">
        <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-blue shrink-0 mt-0.5">
          <Zap className="w-4 h-4 fill-brand-blue" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-blue font-mono">
            Core Concept & First Principle
          </div>
          <p className="text-xs sm:text-sm text-zinc-200 mt-1 leading-relaxed">
            {renderFormattedText(lecture.tldr)}
          </p>
        </div>
      </div>
    </div>
  );
}
