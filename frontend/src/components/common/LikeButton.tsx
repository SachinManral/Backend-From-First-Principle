'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';

interface LikeButtonProps {
  targetId: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function LikeButton({
  targetId,
  size = 'sm',
  showCount = true
}: LikeButtonProps) {
  const { isLiked, getLikesCount, toggleLike } = useProgress();
  const [animating, setAnimating] = useState(false);

  const liked = isLiked(targetId);
  const count = getLikesCount(targetId);

  const handleClick = async () => {
    setAnimating(true);
    await toggleLike(targetId);
    setTimeout(() => setAnimating(false), 500);
  };

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-xs gap-1.5',
    md: 'h-9 px-3.5 text-xs sm:text-sm gap-2',
    lg: 'h-10 px-4 text-sm sm:text-base gap-2.5'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5'
  }[size];

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center rounded-full font-semibold transition-all duration-200 cursor-pointer select-none border ${sizeClasses} ${
        liked
          ? 'bg-rose-500/15 border-rose-500/50 text-rose-400 shadow-md shadow-rose-500/15 hover:bg-rose-500/20'
          : 'bg-[#0e1424] hover:bg-[#151d32] border-[#222e4c] hover:border-zinc-500 text-zinc-300 hover:text-white'
      }`}
      title={liked ? "Liked from this device (Click to undo)" : "Like this lecture"}
      aria-label={liked ? "Unlike lecture" : "Like lecture"}
    >
      <Heart
        className={`${iconSizes} transition-transform duration-300 ${
          liked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400 group-hover:text-rose-400'
        } ${animating ? 'scale-125' : 'scale-100'}`}
      />

      {showCount && (
        <span
          className={`px-1.5 py-0.2 rounded-md font-mono text-[11px] font-bold ${
            liked
              ? 'bg-rose-500/25 text-rose-300'
              : 'bg-[#182138] text-zinc-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
