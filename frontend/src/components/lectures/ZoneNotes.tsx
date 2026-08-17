'use client';

import React, { useState } from 'react';
import { Lecture, LectureBlock } from '@/lib/types';
import { Info, AlertTriangle, CheckCircle2, HelpCircle, Copy, Check, Sparkles } from 'lucide-react';
import LikeButton from '@/components/common/LikeButton';

interface ZoneNotesProps {
  lecture: Lecture;
}

/**
 * Parses markdown inline formatting (**bold**, `inline_code`, *italic*, [link](url))
 * and renders proper Tailwind-styled React elements.
 */
function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#141b2d] border border-[#232f4e] font-mono text-[12px] md:text-[13px] text-brand-rose font-medium"
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
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:text-brand-indigo underline font-medium transition"
          >
            {match[1]}
          </a>
        );
      }
    }
    return part;
  });
}

export default function ZoneNotes({ lecture }: ZoneNotesProps) {
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<number, number>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(id);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const renderBlock = (block: LectureBlock, idx: number, sIdx: number) => {
    const blockKey = `${sIdx}-${idx}`;

    switch (block.type) {
      case 'paragraph':
        return (
          <p key={idx} className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
            {renderFormattedText(block.text)}
          </p>
        );

      case 'points':
        return (
          <div key={idx} className="space-y-6 my-4 pt-1">
            {block.items.map((pt, pIdx) => (
              <div key={pIdx} className="space-y-2">
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-brand-blue font-mono">{pt.number || pIdx + 1}.</span>
                  <span>{renderFormattedText(pt.title)}</span>
                </h3>
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed pl-6">
                  {renderFormattedText(pt.text)}
                </p>
                {pt.code && (
                  <div className="pl-6 pt-1">
                    <pre className="p-3 rounded-xl bg-[#090d16] border border-[#1e2640] font-mono text-xs text-brand-rose overflow-x-auto">
                      <code>{pt.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'example':
        return (
          <div
            key={idx}
            className="my-6 p-5 rounded-2xl bg-[#0b0f19] border border-[#1e2640] shadow-xl space-y-4 font-sans"
          >
            <div className="font-bold text-white text-sm md:text-base border-b border-[#1e2640] pb-3 flex items-center justify-between">
              <span>{block.title}</span>
              <button
                onClick={() => handleCopy(`${block.input || ''}\n\n${block.output || ''}`, `ex-${blockKey}`)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-zinc-400 hover:text-white bg-[#161d31] hover:bg-[#1e2640] transition cursor-pointer"
                title="Copy Example"
              >
                {copiedIdx === `ex-${blockKey}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-emerald" />
                    <span className="text-brand-emerald font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Side-by-Side Input / Output Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Left: Input / Request */}
              {block.input && (
                <div className="rounded-xl bg-[#080c14] border border-[#1e2640] overflow-hidden flex flex-col">
                  <div className="px-3.5 py-1.5 bg-[#0f1424] border-b border-[#1e2640] text-[11px] font-mono font-bold text-brand-blue flex items-center justify-between">
                    <span>REQUEST (Input)</span>
                  </div>
                  <pre className="p-3.5 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed flex-1">
                    <code>{block.input}</code>
                  </pre>
                </div>
              )}

              {/* Right: Output / Response */}
              {block.output && (
                <div className="rounded-xl bg-[#080c14] border border-[#1e2640] overflow-hidden flex flex-col">
                  <div className="px-3.5 py-1.5 bg-[#0f1424] border-b border-[#1e2640] text-[11px] font-mono font-bold text-brand-emerald flex items-center justify-between">
                    <span>RESPONSE (Output)</span>
                  </div>
                  <pre className="p-3.5 font-mono text-xs text-brand-purple overflow-x-auto leading-relaxed flex-1">
                    <code>{block.output}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Explanation Badge & Text */}
            {block.explanation && (
              <div className="pt-2 text-xs md:text-sm leading-relaxed flex items-start gap-2.5 border-t border-[#1e2640]">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30 shrink-0 mt-0.5">
                  Explanation:
                </span>
                <span className="text-zinc-300 font-medium">{renderFormattedText(block.explanation)}</span>
              </div>
            )}
          </div>
        );

      case 'code':
        const tabs = block.tabs || [{ label: block.language || 'code', code: block.code }];
        const currentTabIdx = activeTabs[idx] || 0;
        const currentCode = tabs[currentTabIdx]?.code || block.code;
        const codeLines = currentCode.split('\n');

        return (
          <div key={idx} className="my-5 rounded-2xl bg-[#090d16] border border-[#1e2640] overflow-hidden shadow-xl">
            {/* macOS Chrome Header & Tabs */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1424] border-b border-[#1e2640]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>

                {tabs.length > 1 ? (
                  <div className="flex items-center gap-1 ml-2">
                    {tabs.map((tab, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => setActiveTabs(prev => ({ ...prev, [idx]: tIdx }))}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                          currentTabIdx === tIdx
                            ? 'bg-[#1e2640] text-white font-bold'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161d31]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-mono text-zinc-400 font-medium ml-1">
                    {block.caption || tabs[0]?.label || 'code'}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCopy(currentCode, blockKey)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-zinc-400 hover:text-white bg-[#161d31] hover:bg-[#1e2640] transition cursor-pointer"
              >
                {copiedIdx === blockKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-emerald" />
                    <span className="text-brand-emerald font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body with Line Numbers */}
            <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-200 flex gap-4">
              <div className="select-none text-zinc-600 text-right pr-2 font-mono shrink-0">
                {codeLines.map((_, lIdx) => (
                  <div key={lIdx}>{lIdx + 1}</div>
                ))}
              </div>
              <pre className="text-brand-purple overflow-x-auto flex-1 font-mono">
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>
        );

      case 'callout':
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex items-start gap-3 my-4 ${
              block.variant === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : block.variant === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
            }`}
          >
            {block.variant === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : block.variant === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">{renderFormattedText(block.title)}</div>
              <p className="text-xs md:text-sm mt-1 leading-relaxed opacity-95">{renderFormattedText(block.text)}</p>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={idx} className="my-5 rounded-2xl border border-[#1e2640] bg-[#090d16] shadow-md overflow-hidden">
            <div className="sm:hidden px-3.5 py-1.5 bg-[#0f1424] border-b border-[#1e2640] text-[10px] text-zinc-400 font-mono flex items-center justify-between">
              <span>Comparison Table</span>
              <span className="text-brand-blue">↔ Scroll table horizontally</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm min-w-[480px]">
                <thead className="bg-[#0f1424] border-b border-[#1e2640] text-zinc-200 font-semibold font-mono">
                  <tr>
                    {block.headers.map((h, i) => (
                      <th key={i} className="p-3 md:p-3.5 whitespace-nowrap">
                        {renderFormattedText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2640] text-zinc-300 font-normal">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#111728] transition">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 md:p-3.5 align-top leading-relaxed">
                          {renderFormattedText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div key={idx} className="space-y-2.5 my-4">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-zinc-200">{renderFormattedText(item)}</span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-12">
      {/* Main Lecture Sections */}
      {lecture.sections.map((section, sIdx) => {
        const secId = section.id || `section-${sIdx}`;
        return (
          <section
            key={secId}
            id={secId}
            className="space-y-4"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-b border-[#1e2640] pb-3">
              {section.title}
            </h2>

            <div className="space-y-4 pt-1">
              {section.blocks.map((block, bIdx) => renderBlock(block, bIdx, sIdx))}
            </div>
          </section>
        );
      })}

      {/* Key Takeaways & Cheat-Sheet */}
      {lecture.keyTakeaways && lecture.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#090f1d] border border-brand-blue/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-brand-blue font-bold text-sm">
            <Sparkles className="w-4 h-4 text-brand-blue" />
            <span className="text-white text-base font-bold">First-Principles Key Takeaways</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {lecture.keyTakeaways.map((takeaway, tIdx) => (
              <div
                key={tIdx}
                className="text-xs md:text-sm text-zinc-200 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{renderFormattedText(takeaway)}</span>
              </div>
            ))}
          </div>

          {/* Bottom Feedback / Like Lesson */}
          <div className="pt-3 mt-3 border-t border-[#1e2640] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-zinc-400">
              Did this breakdown clarify the first principles?
            </div>
            <LikeButton targetId={lecture.slug} label="Helpful Lesson" size="md" />
          </div>
        </div>
      )}

      {/* Self-Check Questions (if provided) */}
      {lecture.selfCheckQuestions && lecture.selfCheckQuestions.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0e1322] border border-[#1e2640] space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span className="text-white text-sm font-bold">Self-Check Reflection</span>
          </div>

          <div className="space-y-2 pt-1">
            {lecture.selfCheckQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="text-xs md:text-sm text-zinc-200 flex items-start gap-2.5"
              >
                <span className="font-mono text-brand-blue font-bold text-xs shrink-0 mt-0.5">
                  Q{qIdx + 1}.
                </span>
                <span className="leading-relaxed font-medium">{renderFormattedText(q)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
