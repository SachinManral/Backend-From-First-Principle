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

export default function ZoneTldr({ lecture }: ZoneTldrProps) {
  const { isCompleted, toggleComplete } = useProgress();
  const completed = isCompleted(lecture.slug);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

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
        <div className="flex items-center gap-3">
          {lecture.youtubeUrl && (
            <a
              href={lecture.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition shadow-sm"
              title="Watch on YouTube"
            >
              <Play className="w-3 h-3 fill-red-400 text-red-400" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          )}

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 hover:text-foreground transition cursor-pointer ${hasLiked ? 'text-brand-blue' : ''}`}
            title="Like this article"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="font-mono text-xs">{likes}</span>
          </button>

          <button
            onClick={handleShare}
            className="hover:text-foreground transition cursor-pointer relative"
            title="Share article link"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -top-7 -left-6 px-2 py-0.5 rounded bg-brand-emerald text-black text-[10px] font-bold">
                Copied!
              </span>
            )}
          </button>

          <button
            onClick={() => toggleComplete(lecture.slug)}
            className={`p-1 hover:text-foreground transition cursor-pointer ${completed ? 'text-brand-emerald' : ''}`}
            title={completed ? "Completed" : "Bookmark module"}
          >
            <Bookmark className={`w-4 h-4 ${completed ? 'fill-brand-emerald' : ''}`} />
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
