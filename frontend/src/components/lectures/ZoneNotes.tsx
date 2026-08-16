'use client';

import React from 'react';
import { Lecture, LectureBlock } from '@/lib/types';
import { BookOpen, Info, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

interface ZoneNotesProps {
  lecture: Lecture;
}

export default function ZoneNotes({ lecture }: ZoneNotesProps) {
  const renderBlock = (block: LectureBlock, idx: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={idx} className="text-sm md:text-base text-zinc-300 leading-relaxed">
            {block.text}
          </p>
        );

      case 'code':
        return (
          <div key={idx} className="space-y-1.5 my-3">
            {block.caption && (
              <div className="text-[11px] font-mono text-zinc-400">{block.caption}</div>
            )}
            <pre className="p-4 rounded-xl bg-background border border-surface-border font-mono text-xs text-brand-cyan overflow-x-auto">
              <code>{block.code}</code>
            </pre>
          </div>
        );

      case 'callout':
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex items-start gap-3 my-4 ${
              block.variant === 'warning'
                ? 'bg-brand-amber/10 border-brand-amber/30 text-amber-200'
                : block.variant === 'success'
                ? 'bg-brand-emerald/10 border-brand-emerald/30 text-emerald-200'
                : 'bg-brand-indigo/10 border-brand-indigo/30 text-indigo-200'
            }`}
          >
            {block.variant === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
            ) : block.variant === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">{block.title}</div>
              <p className="text-xs md:text-sm mt-1 leading-relaxed opacity-90">{block.text}</p>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 my-4">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-surface-muted border border-surface-border hover:border-surface-highlight transition flex flex-col justify-between"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-surface border border-surface-border text-brand-cyan inline-block mb-2">
                    {item.badge}
                  </span>
                  <div className="font-bold text-xs md:text-sm text-zinc-100 mb-1.5">{item.title}</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-surface-border bg-background">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted border-b border-surface-border text-zinc-300 font-semibold font-mono">
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="p-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-zinc-300 font-normal">
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-surface-muted/50 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 align-top leading-relaxed">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8">
      {lecture.sections.map((section, sIdx) => (
        <section
          key={section.id || sIdx}
          id={section.id}
          className="bg-surface border border-surface-border rounded-2xl p-6 md:p-7 shadow-2xl space-y-4 scroll-mt-20"
        >
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-lg md:text-xl font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-brand-cyan font-mono font-bold text-sm">
                0{sIdx + 1}.
              </span>
              <span>{section.title}</span>
            </h2>
            {section.summary && (
              <p className="text-xs text-zinc-400 mt-1">{section.summary}</p>
            )}
          </div>

          <div className="space-y-4 pt-1">
            {section.blocks.map((b, bIdx) => renderBlock(b, bIdx))}
          </div>
        </section>
      ))}

      {/* Key Takeaways & Reflection Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lecture.keyTakeaways && lecture.keyTakeaways.length > 0 && (
          <div className="bg-surface border border-surface-border rounded-2xl p-5 md:p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-brand-emerald">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key First Principles</span>
            </div>
            <ul className="space-y-2 text-xs md:text-sm text-zinc-300">
              {lecture.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald shrink-0 mt-2" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lecture.reflectionQuestions && lecture.reflectionQuestions.length > 0 && (
          <div className="bg-surface border border-surface-border rounded-2xl p-5 md:p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-brand-indigo">
              <HelpCircle className="w-4 h-4" />
              <span>Self-Check Questions</span>
            </div>
            <ul className="space-y-2 text-xs md:text-sm text-zinc-300">
              {lecture.reflectionQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0 mt-2" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
