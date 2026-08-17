'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  User,
  Globe,
  Trash2,
  Copy,
  Check,
  ArrowUp
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';
import CodeHighlighter from '@/components/common/CodeHighlighter';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const QUICK_PROMPTS = [
  { label: '3-Layer Architecture', prompt: 'Explain the 3-layer architecture (Controller-Service-Repository) from first principles.' },
  { label: 'PUT vs PATCH', prompt: 'What is the architectural difference between PUT and PATCH in API design?' },
  { label: 'Request-Response Cycle', prompt: 'How does the HTTP request-response cycle work in backend engineering?' },
  { label: 'Idempotency Keys', prompt: 'How do idempotency keys prevent duplicate payments in backend systems?' }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! 👋 I am **Neo AI**.\n\nI can help you with backend architecture, API design, code debugging, system scaling, or general software engineering. What are you building or exploring today?'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside message thread
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Adjust textarea height dynamically like ChatGPT
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputPrompt]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt.trim();
    if (!promptToSend || isStreaming) return;

    const userMessageId = `user_${Date.now()}`;
    const botMessageId = `bot_${Date.now()}`;

    const newMessages: Message[] = [
      ...messages,
      { id: userMessageId, role: 'user', content: promptToSend }
    ];

    setMessages([
      ...newMessages,
      { id: botMessageId, role: 'assistant', content: '', isStreaming: true }
    ]);

    setInputPrompt('');
    setIsStreaming(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          enableWebSearch
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) {
        throw new Error('No readable stream returned by server');
      }

      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          if (trimmed === 'data: [DONE]') {
            setIsStreaming(false);
            break;
          }

          try {
            const data = JSON.parse(trimmed.replace(/^data:\s*/, ''));
            if (data.content) {
              accumulatedText += data.content;
              setMessages(prev =>
                prev.map(m =>
                  m.id === botMessageId
                    ? { ...m, content: accumulatedText, isStreaming: true }
                    : m
                )
              );
            }
            if (data.error) {
              accumulatedText += `\n\n⚠️ **Error:** ${data.error}`;
              setMessages(prev =>
                prev.map(m =>
                  m.id === botMessageId
                    ? { ...m, content: accumulatedText, isStreaming: false }
                    : m
                )
              );
            }
          } catch {
            // ignore chunk parse errors
          }
        }
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === botMessageId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (err: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === botMessageId
            ? {
                ...m,
                content: `⚠️ **Connection Error:** Could not reach AI service. (${err.message})`,
                isStreaming: false
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! 👋 I am **Neo AI**.\n\nI can help you with backend architecture, API design, code debugging, system scaling, or general software engineering. What are you building or exploring today?'
      }
    ]);
  };

  const isInitialState = messages.length <= 1;

  // ChatGPT & Claude style Markdown renderer
  const renderFormattedBlock = (text: string) => {
    if (!text) return null;

    // Clean any accidental raw HTML tags
    const sanitizedText = text.replace(/<(?!\/?code)(?!span)[^>]+>/g, '');

    // Split on code fences (```)
    const parts = sanitizedText.split(/```/);
    const segments: React.ReactNode[] = [];

    for (let i = 0; i < parts.length; i++) {
      const chunk = parts[i];

      if (i % 2 === 0) {
        // Regular Markdown text
        if (chunk) {
          segments.push(
            <div key={`md-${i}`} className="space-y-2">
              {renderMarkdownParagraphs(chunk)}
            </div>
          );
        }
      } else {
        // Code block
        const firstNewLine = chunk.indexOf('\n');
        let lang = 'typescript';
        let code = chunk;

        if (firstNewLine !== -1) {
          const possibleLang = chunk.substring(0, firstNewLine).trim().toLowerCase();
          if (possibleLang) {
            lang = possibleLang;
          }
          code = chunk.substring(firstNewLine + 1);
        }

        code = code.trimEnd();

        segments.push(
          <div
            key={`code-${i}`}
            className="my-4 rounded-xl overflow-hidden border border-[#1e2640] bg-[#070b14] shadow-lg"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-[#0d1322] border-b border-[#1e2640] text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/70" />
                </div>
                <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] ml-1">{lang}</span>
              </div>
              <button
                onClick={() => handleCopy(code, `code-${i}`)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141c30] hover:bg-[#1c2742] hover:text-white transition cursor-pointer text-zinc-300 text-xs font-sans"
              >
                {copiedId === `code-${i}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <CodeHighlighter code={code} language={lang} />
            </div>
          </div>
        );
      }
    }

    return segments;
  };

  const renderMarkdownParagraphs = (chunk: string) => {
    const lines = chunk.split('\n');
    const nodes: React.ReactNode[] = [];
    let tableRows: string[] = [];
    let quoteLines: string[] = [];

    const flushTable = (keyIdx: number) => {
      if (tableRows.length === 0) return null;
      const rowsToRender = [...tableRows];
      tableRows = [];

      const parsedRows = rowsToRender
        .filter(r => !r.includes('---'))
        .map(r => r.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1));

      if (parsedRows.length === 0) return null;

      const headerRow = parsedRows[0];
      const bodyRows = parsedRows.slice(1);

      return (
        <div key={`tbl-${keyIdx}`} className="my-3.5 overflow-x-auto rounded-xl border border-[#1e2638] bg-[#0c1220] shadow-sm">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#11182c] border-b border-[#1e2638] text-zinc-200">
              <tr>
                {headerRow.map((h, hIdx) => (
                  <th key={hIdx} className="px-3.5 py-2.5 font-semibold">
                    {renderInlineText(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182136] text-zinc-300">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#141b2e]/60 transition">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2.5 leading-relaxed">
                      {renderInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const flushQuote = (keyIdx: number) => {
      if (quoteLines.length === 0) return null;
      const combined = quoteLines.join(' ');
      quoteLines = [];
      return (
        <p
          key={`quote-${keyIdx}`}
          className="my-2 pl-3 border-l-2 border-zinc-700 text-sm text-zinc-300 italic leading-relaxed"
        >
          {renderInlineText(combined)}
        </p>
      );
    };

    lines.forEach((line, lIdx) => {
      const trimmed = line.trim();

      // Collect Table Rows
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (quoteLines.length > 0) {
          const quoteEl = flushQuote(lIdx);
          if (quoteEl) nodes.push(quoteEl);
        }
        tableRows.push(trimmed);
        return;
      } else if (tableRows.length > 0) {
        const tableElement = flushTable(lIdx);
        if (tableElement) nodes.push(tableElement);
      }

      // Collect Blockquotes
      if (trimmed.startsWith('>')) {
        quoteLines.push(trimmed.replace(/^>\s*/, ''));
        return;
      } else if (quoteLines.length > 0) {
        const quoteEl = flushQuote(lIdx);
        if (quoteEl) nodes.push(quoteEl);
      }

      if (!trimmed) return;

      // Horizontal rules
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        nodes.push(<hr key={lIdx} className="my-4 border-[#1e2640]" />);
        return;
      }

      // Headings (H1 to H5 support) with crisp hierarchy & accents
      if (trimmed.startsWith('#### ') || trimmed.startsWith('##### ')) {
        nodes.push(
          <h4 key={lIdx} className="text-sm sm:text-base font-bold text-zinc-100 mt-4 mb-1.5 font-sans tracking-tight">
            {renderInlineText(trimmed.replace(/^#{4,5}\s*/, ''))}
          </h4>
        );
        return;
      } else if (trimmed.startsWith('### ')) {
        nodes.push(
          <h3 key={lIdx} className="text-base sm:text-lg font-bold text-white mt-5 mb-2 font-sans tracking-tight">
            {renderInlineText(trimmed.replace('### ', ''))}
          </h3>
        );
        return;
      } else if (trimmed.startsWith('## ')) {
        nodes.push(
          <h2 key={lIdx} className="text-lg sm:text-xl font-bold text-white mt-6 mb-2.5 font-sans tracking-tight">
            {renderInlineText(trimmed.replace('## ', ''))}
          </h2>
        );
        return;
      } else if (trimmed.startsWith('# ')) {
        nodes.push(
          <h1 key={lIdx} className="text-xl sm:text-2xl font-black text-white mt-6 mb-3 font-sans tracking-tight">
            {renderInlineText(trimmed.replace('# ', ''))}
          </h1>
        );
        return;
      }

      // Detect indentation from original un-trimmed line
      const leadingSpaces = line.search(/\S/);
      const isIndented = leadingSpaces >= 2;

      // Bullet Points (Main bullets and indented sub-bullets)
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.substring(2);
        if (isIndented) {
          nodes.push(
            <div key={lIdx} className="flex items-start gap-2 my-1 pl-5 sm:pl-6 text-zinc-300 text-sm leading-relaxed">
              <span className="text-zinc-500 font-medium text-xs shrink-0 mt-0.5 select-none">–</span>
              <span className="leading-relaxed">{renderInlineText(bulletText)}</span>
            </div>
          );
        } else {
          nodes.push(
            <div key={lIdx} className="flex items-start gap-2.5 my-1.5 pl-1 text-zinc-200 text-sm leading-relaxed">
              <span className="text-zinc-500 font-bold select-none text-sm leading-relaxed shrink-0">•</span>
              <span className="leading-relaxed">{renderInlineText(bulletText)}</span>
            </div>
          );
        }
        return;
      }

      // Numbered List items
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s(.*)/);
        nodes.push(
          <div key={lIdx} className="flex items-start gap-2.5 my-1.5 pl-1 text-zinc-200 text-sm leading-relaxed">
            <span className="text-zinc-400 font-mono font-medium text-xs shrink-0 mt-0.5 select-none">
              {match ? match[1] : '1'}.
            </span>
            <span className="leading-relaxed">{renderInlineText(match ? match[2] : trimmed)}</span>
          </div>
        );
        return;
      }

      // Default Paragraph
      nodes.push(
        <p key={lIdx} className="text-sm md:text-[15px] leading-7 text-zinc-200 my-1.5">
          {renderInlineText(line)}
        </p>
      );
    });

    if (quoteLines.length > 0) {
      const quoteEl = flushQuote(lines.length);
      if (quoteEl) nodes.push(quoteEl);
    }

    if (tableRows.length > 0) {
      const tableElement = flushTable(lines.length);
      if (tableElement) nodes.push(tableElement);
    }

    return nodes;
  };

  const renderInlineText = (text: string): React.ReactNode => {
    if (!text) return null;
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      // Inline Code & HTTP Method Badges
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const inner = part.slice(1, -1);
        const upperInner = inner.toUpperCase();

        if (upperInner === 'GET') {
          return (
            <span key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-semibold text-[11px]">
              GET
            </span>
          );
        }
        if (upperInner === 'POST') {
          return (
            <span key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono font-semibold text-[11px]">
              POST
            </span>
          );
        }
        if (upperInner === 'PUT') {
          return (
            <span key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-semibold text-[11px]">
              PUT
            </span>
          );
        }
        if (upperInner === 'PATCH') {
          return (
            <span key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 font-mono font-semibold text-[11px]">
              PATCH
            </span>
          );
        }
        if (upperInner === 'DELETE') {
          return (
            <span key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono font-semibold text-[11px]">
              DELETE
            </span>
          );
        }

        return (
          <code
            key={i}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-[#131b2e] border border-[#223052] font-mono text-[12px] text-cyan-300 font-medium"
          >
            {inner}
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
  };

  return (
    <div className="h-[calc(100dvh-4.25rem)] max-w-3xl mx-auto flex flex-col px-3 sm:px-6 overflow-hidden">
      
      {/* Clean Minimal Header Bar */}
      <div className="py-3 border-b border-[#1a2238]/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Neo AI
          </h1>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-[#141b2d] transition cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Main Message Thread */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto py-5 space-y-5 scrollbar-thin pr-1"
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-blue/30 to-brand-purple/30 border border-brand-blue/40 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              </div>
            )}

            <div
              className={`text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#1a2236] border border-[#2b3859] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm'
                  : 'text-zinc-100 flex-1 max-w-full bg-[#0a1020]/75 border border-[#18233c] rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div>
                  {renderFormattedBlock(msg.content)}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-4 bg-brand-blue animate-pulse ml-1 align-middle" />
                  )}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (Only on initial state) */}
      {isInitialState && (
        <div className="pb-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.prompt)}
                disabled={isStreaming}
                className="px-3.5 py-1.5 rounded-full bg-[#0e1424] hover:bg-[#162038] border border-[#1e2640] hover:border-brand-blue/40 text-xs text-zinc-300 hover:text-white whitespace-nowrap transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sleek ChatGPT-Style Bottom Input Capsule */}
      <div className="pb-5 pt-2 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center rounded-3xl bg-[#0d1220] border border-[#1e2840] focus-within:border-brand-blue/60 focus-within:ring-1 focus-within:ring-brand-blue/30 shadow-2xl transition px-4 py-2"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Neo AI anything about backend engineering, APIs, code..."
            disabled={isStreaming}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none resize-none max-h-32 pr-20 py-1.5 leading-6"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {/* Minimal Web Search Toggle */}
            <button
              type="button"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                enableWebSearch
                  ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/50'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title={enableWebSearch ? "Live Web Search: Enabled" : "Live Web Search: Disabled"}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Circular Send Button */}
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isStreaming}
              className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              title="Send Message"
            >
              <ArrowUp className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
