'use client';

import React, { useState } from 'react';
import { Lecture, LectureBlock } from '@/lib/types';
import { Info, AlertTriangle, CheckCircle2, HelpCircle, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import LikeButton from '@/components/common/LikeButton';
import CodeHighlighter from '@/components/common/CodeHighlighter';

interface ZoneNotesProps {
  lecture: Lecture;
}

/**
 * Parses markdown inline formatting (**bold**, `inline_code`, *italic*, [link](url))
 * and renders clean, premium Tailwind-styled React elements.
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
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#131d36] border border-[#22335c] font-mono text-[11px] md:text-[12.5px] text-cyan-300 font-semibold tracking-tight shadow-sm inline-block"
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
        <em key={i} className="italic text-zinc-300">
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
            className="text-cyan-400 hover:text-cyan-300 underline font-medium transition"
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
  const [activeTabs, setActiveTabs] = useState<Record<string, number>>({});

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
          <p key={idx} className="text-sm md:text-[15px] text-zinc-300 leading-relaxed font-normal">
            {renderFormattedText(block.text)}
          </p>
        );

      case 'points':
        return (
          <div key={idx} className="space-y-6 my-5">
            {block.items.map((pt, pIdx) => (
              <div key={pIdx} className="space-y-2.5 p-4 rounded-2xl bg-[#090e1c]/60 border border-[#1a2540]/60 transition hover:border-[#2a3b66]/80">
                <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                    {pt.number || String(pIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="tracking-tight">{renderFormattedText(pt.title)}</span>
                </h3>
                <div className="text-xs md:text-sm text-zinc-300 leading-relaxed font-normal pl-1">
                  {renderFormattedText(pt.text)}
                </div>
                {pt.code && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#1e293b]">
                    <div className="px-3.5 py-1.5 bg-[#0e172a] border-b border-[#1e293b] text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>SQL / Execution Snippet</span>
                    </div>
                    <div className="p-3 bg-[#060a14] overflow-x-auto">
                      <CodeHighlighter code={pt.code} language="sql" />
                    </div>
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
            className="my-6 p-5 rounded-2xl bg-gradient-to-b from-[#0c1326] to-[#070b14] border border-[#1e2a4a] shadow-2xl space-y-4"
          >
            <div className="font-bold text-white text-sm md:text-base border-b border-[#1e293b] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{renderFormattedText(block.title)}</span>
              </span>
              <button
                onClick={() => handleCopy(`${block.input || ''}\n\n${block.output || ''}`, `ex-${blockKey}`)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs text-zinc-300 hover:text-white bg-[#141d33] hover:bg-[#1f2d4e] border border-[#223359] transition cursor-pointer"
                title="Copy Example"
              >
                {copiedIdx === `ex-${blockKey}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
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
                <div className="rounded-xl bg-[#060a14] border border-[#1e293b] overflow-hidden flex flex-col">
                  <div className="px-3.5 py-1.5 bg-[#0d1527] border-b border-[#1e293b] text-[11px] font-mono font-bold text-cyan-400 flex items-center justify-between">
                    <span>INPUT / REQUEST</span>
                  </div>
                  <pre className="p-3.5 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed flex-1">
                    <code>{block.input}</code>
                  </pre>
                </div>
              )}

              {/* Right: Output / Response */}
              {block.output && (
                <div className="rounded-xl bg-[#060a14] border border-[#1e293b] overflow-hidden flex flex-col">
                  <div className="px-3.5 py-1.5 bg-[#0d1527] border-b border-[#1e293b] text-[11px] font-mono font-bold text-emerald-400 flex items-center justify-between">
                    <span>OUTPUT / RESULT</span>
                  </div>
                  <pre className="p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed flex-1">
                    <code>{block.output}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Explanation Badge & Text */}
            {block.explanation && (
              <div className="pt-2 text-xs md:text-sm leading-relaxed flex items-start gap-2.5 border-t border-[#1e293b]">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shrink-0 mt-0.5">
                  Takeaway:
                </span>
                <span className="text-zinc-300 font-medium">{renderFormattedText(block.explanation)}</span>
              </div>
            )}
          </div>
        );

      case 'code':
        const tabs = block.tabs || [{ label: block.language || 'code', code: block.code }];
        const currentTabIdx = activeTabs[blockKey] || 0;
        const currentCode = tabs[currentTabIdx]?.code || block.code;

        return (
          <div key={idx} className="my-5 rounded-2xl bg-[#070b14] border border-[#1e293b] overflow-hidden shadow-2xl">
            {/* macOS Chrome Header & Tabs */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1424] border-b border-[#1e293b]">
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
                        onClick={() => setActiveTabs(prev => ({ ...prev, [blockKey]: tIdx }))}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${currentTabIdx === tIdx
                            ? 'bg-[#1e293b] text-white font-bold shadow'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#141c2e]'
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
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs text-zinc-300 hover:text-white bg-[#141c2e] hover:bg-[#1e293b] border border-[#23304d] transition cursor-pointer"
              >
                {copiedIdx === blockKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body with Rich Syntax Highlighting & Line Numbers */}
            <div className="p-4 overflow-x-auto bg-[#040711]">
              <CodeHighlighter code={currentCode} language={tabs[currentTabIdx]?.language} />
            </div>
          </div>
        );

      case 'callout':
        const isWarn = block.variant === 'warning';
        const isSuccess = block.variant === 'success';

        return (
          <div
            key={idx}
            className={`my-5 p-4 sm:p-5 rounded-2xl border backdrop-blur-sm transition-all duration-200 flex items-start gap-3.5 ${
              isWarn
                ? 'bg-amber-500/[0.04] border-amber-500/20 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.08)]'
                : isSuccess
                ? 'bg-emerald-500/[0.04] border-emerald-500/20 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.08)]'
                : 'bg-gradient-to-r from-cyan-500/[0.05] via-blue-500/[0.03] to-transparent border-cyan-500/20 shadow-[0_4px_20px_-4px_rgba(6,182,212,0.08)]'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isWarn
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : isSuccess
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              }`}
            >
              {isWarn ? (
                <AlertTriangle className="w-4 h-4" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="text-[13.5px] font-semibold text-white tracking-tight">
                {renderFormattedText(block.title)}
              </div>
              <div className="text-[13px] sm:text-[13.5px] leading-relaxed text-zinc-300">
                {renderFormattedText(block.text)}
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={idx} className="my-6 rounded-2xl border border-[#1e293b] bg-[#070b14] shadow-xl overflow-hidden">
            <div className="sm:hidden px-3.5 py-1.5 bg-[#0d1424] border-b border-[#1e293b] text-[10px] text-zinc-400 font-mono flex items-center justify-between">
              <span>Comparison Table</span>
              <span className="text-cyan-400">↔ Scroll horizontally</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm min-w-[480px]">
                <thead className="bg-[#0d1424] border-b border-[#1e293b] text-zinc-200 font-semibold font-mono">
                  <tr>
                    {block.headers.map((h, i) => (
                      <th key={i} className="p-3.5 whitespace-nowrap">
                        {renderFormattedText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#17223b] text-zinc-300 font-normal">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#0e1628] transition">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3.5 align-top leading-relaxed">
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
          <div key={idx} className="space-y-3 my-5 p-4 rounded-2xl bg-[#080d1a]/80 border border-[#1a2540]">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-xs md:text-sm text-zinc-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-zinc-200">{renderFormattedText(item)}</span>
              </div>
            ))}
          </div>
        );

      case 'cards':
        return (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            {block.items.map((card, cIdx) => (
              <div
                key={cIdx}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#0c1426]/90 to-[#060a14]/90 border border-[#1e293b] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] transition-all duration-300 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                      {card.badge}
                    </span>
                  </div>
                  <h4 className="text-sm md:text-[15px] font-bold text-white tracking-tight">
                    {renderFormattedText(card.title)}
                  </h4>
                  <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-normal">
                    {renderFormattedText(card.desc)}
                  </p>
                </div>
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
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight border-b border-[#1e293b] pb-3 flex items-center gap-2">
              <span>{renderFormattedText(section.title)}</span>
            </h2>

            <div className="space-y-4 pt-1">
              {section.blocks.map((block, bIdx) => renderBlock(block, bIdx, sIdx))}
            </div>
          </section>
        );
      })}

      {/* Key Takeaways & Cheat-Sheet */}
      {lecture.keyTakeaways && lecture.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#091224] to-[#050812] border border-cyan-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-white text-base font-bold">First-Principles Key Takeaways</span>
          </div>

          <div className="space-y-3 pt-1">
            {lecture.keyTakeaways.map((takeaway, tIdx) => (
              <div
                key={tIdx}
                className="text-xs md:text-sm text-zinc-200 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{renderFormattedText(takeaway)}</span>
              </div>
            ))}
          </div>

          {/* Clean Like / Helpful Button */}
          <div className="pt-3.5 mt-3.5 border-t border-[#1e293b] flex items-center justify-end">
            <LikeButton targetId={lecture.slug} size="sm" />
          </div>
        </div>
      )}

      {/* Self-Check Questions (if provided) */}
      {lecture.selfCheckQuestions && lecture.selfCheckQuestions.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#090e1c] border border-[#1e293b] space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span className="text-white text-sm font-bold">Self-Check Reflection</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {lecture.selfCheckQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="text-xs md:text-sm text-zinc-200 flex items-start gap-2.5"
              >
                <span className="font-mono text-cyan-400 font-bold text-xs shrink-0 mt-0.5">
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

