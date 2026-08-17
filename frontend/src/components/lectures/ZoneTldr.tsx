'use client';

import React, { useState } from 'react';
import { Zap, Clock, Bookmark, Share2 } from 'lucide-react';
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
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-[#1b2438]">
        <div className="flex items-center gap-1.5 text-xs font-medium select-none">
          <span className="text-zinc-400">Articles</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 font-semibold truncate max-w-[220px] sm:max-w-none">
            {lecture.phaseTitle}
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {lecture.youtubeUrl && (
            <a
              href={lecture.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-[#FF0000] hover:text-[#ff3333] border border-red-500/25 hover:border-red-500/50 transition cursor-pointer flex items-center justify-center shadow-sm"
              title="Watch lecture on YouTube"
              aria-label="Watch lecture on YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          )}

          {/* Real 1-Like Per Device Button */}
          <LikeButton targetId={lecture.slug} size="sm" />

          {/* Share Article */}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-[#0e1424] hover:bg-[#151d32] border border-[#222e4c] hover:border-zinc-500 text-zinc-400 hover:text-white transition cursor-pointer flex items-center justify-center relative shadow-sm"
            title="Share article link"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedShare && (
              <span className="absolute -top-7 -left-6 px-2 py-0.5 rounded bg-brand-emerald text-black text-[10px] font-bold shadow-md">
                Copied!
              </span>
            )}
          </button>

          {/* Per-Device Progress Toggle */}
          <button
            onClick={() => toggleComplete(lecture.slug)}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold border transition cursor-pointer select-none shadow-sm ${
              completed
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-[#0e1424] hover:bg-[#151d32] border-[#222e4c] hover:border-zinc-500 text-zinc-300 hover:text-white'
            }`}
            title={completed ? "Completed (Click to unmark)" : "Mark lecture as completed"}
          >
            <Check className={`w-3.5 h-3.5 ${completed ? 'text-emerald-400' : 'text-zinc-400'}`} />
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
