'use client';

import React from 'react';
import { Lecture, LectureBlock } from '@/lib/types';
import { BookOpen, Info, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

interface ZoneNotesProps {
  lecture: Lecture;
}

export default function ZoneNotes({ lecture }: ZoneNotesProps) {
  const renderBlock = (block: LectureBlock, idx: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={idx} className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
            {block.text}
          </p>
        );

      case 'code':
        return (
          <div key={idx} className="space-y-1.5 my-4">
            {block.caption && (
              <div className="text-[11px] font-mono text-zinc-400 font-medium">{block.caption}</div>
            )}
            <pre className="p-4 rounded-2xl bg-background border border-surface-border font-mono text-xs text-brand-cyan overflow-x-auto shadow-inner">
              <code>{block.code}</code>
            </pre>
          </div>
        );

      case 'callout':
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border flex items-start gap-3.5 my-5 ${
              block.variant === 'warning'
                ? 'bg-brand-amber/10 border-brand-amber/30 text-amber-200'
                : block.variant === 'success'
                ? 'bg-brand-emerald/10 border-brand-emerald/30 text-emerald-200'
                : 'bg-brand-indigo/10 border-brand-indigo/30 text-indigo-200'
            }`}
          >
            {block.variant === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
            ) : block.variant === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">{block.title}</div>
              <p className="text-xs md:text-sm mt-1.5 leading-relaxed opacity-90">{block.text}</p>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="qt-card p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-surface border border-surface-border text-brand-cyan inline-block mb-3">
                    {item.badge}
                  </span>
                  <div className="font-bold text-sm text-white mb-2">{item.title}</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div key={idx} className="my-5 overflow-x-auto rounded-2xl border border-surface-border bg-background shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted border-b border-surface-border text-zinc-300 font-semibold font-mono">
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="p-3.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-zinc-300 font-normal">
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-surface-muted/50 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3.5 align-top leading-relaxed">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'checklist':
        return (
          <div key={idx} className="space-y-2.5 my-4">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-surface-muted border border-surface-border text-xs md:text-sm text-zinc-300 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      {lecture.sections.map((section, sIdx) => (
        <div
          key={section.id || sIdx}
          className="qt-card p-6 md:p-8 space-y-5"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
            <span className="text-xs font-mono font-bold text-brand-cyan">
              0{sIdx + 1}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {section.title}
            </h2>
          </div>

          <div className="space-y-4">
            {section.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
          </div>
        </div>
      ))}

      {/* Self-Check Questions */}
      {lecture.selfCheckQuestions && lecture.selfCheckQuestions.length > 0 && (
        <div className="qt-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-brand-indigo font-bold text-sm">
            <HelpCircle className="w-5 h-5 text-brand-indigo" />
            <span className="text-white text-base">Self-Check Reflection Questions</span>
          </div>

          <div className="space-y-3 pt-2">
            {lecture.selfCheckQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-2xl bg-background border border-surface-border text-xs md:text-sm text-zinc-300 flex items-start gap-3"
              >
                <span className="font-mono text-brand-cyan font-bold text-xs shrink-0 mt-0.5">
                  Q{qIdx + 1}.
                </span>
                <span className="leading-relaxed font-medium">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
