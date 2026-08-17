import React from 'react';

interface CodeHighlighterProps {
  code: string;
  language?: string;
}

export default function CodeHighlighter({ code, language = 'typescript' }: CodeHighlighterProps) {
  const lines = code ? code.split('\n') : [];

  const highlightLine = (line: string): React.ReactNode[] => {
    if (!line) {
      return [<span key="empty" className="text-zinc-500 font-mono"> </span>];
    }

    // Regular expression matching comments, strings, keywords, types, numbers, functions
    const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|export|from|const|let|var|function|return|if|else|switch|case|default|break|async|await|try|catch|finally|throw|class|extends|new|this|typeof|instanceof|interface|type|enum|as|pub|fn|struct|impl|use|mut|let|match|package|func|go|defer|select|range)\b|\b(?:string|number|boolean|any|void|null|undefined|never|unknown|Promise|Array|Record|int|int64|float64|bool|byte|error|u8|u16|u32|u64|i8|i16|i32|i64|usize|isize|String|Option|Result|Vec|StatusCode|Json|Extension|Response|Request|NextFunction)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z0-9_$]+(?=\())/g;

    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      const matchStart = match.index;
      const matchText = match[0];

      // Add text before the match
      if (matchStart > lastIndex) {
        nodes.push(
          <span key={`text-${lastIndex}`} className="text-zinc-300">
            {line.substring(lastIndex, matchStart)}
          </span>
        );
      }

      // Determine token type
      if (matchText.startsWith('//') || matchText.startsWith('/*')) {
        // Comment
        nodes.push(
          <span key={`tok-${matchStart}`} className="text-slate-500 italic">
            {matchText}
          </span>
        );
      } else if (
        (matchText.startsWith('"') && matchText.endsWith('"')) ||
        (matchText.startsWith("'") && matchText.endsWith("'")) ||
        (matchText.startsWith('`') && matchText.endsWith('`'))
      ) {
        // String
        nodes.push(
          <span key={`tok-${matchStart}`} className="text-emerald-400 font-medium">
            {matchText}
          </span>
        );
      } else if (
        /^(import|export|from|const|let|var|function|return|if|else|switch|case|default|break|async|await|try|catch|finally|throw|class|extends|new|this|typeof|instanceof|interface|type|enum|as|pub|fn|struct|impl|use|mut|match|package|func|go|defer|select|range)$/.test(
          matchText
        )
      ) {
        // Keyword
        nodes.push(
          <span key={`tok-${matchStart}`} className="text-purple-400 font-semibold">
            {matchText}
          </span>
        );
      } else if (
        /^(string|number|boolean|any|void|null|undefined|never|unknown|Promise|Array|Record|int|int64|float64|bool|byte|error|u8|u16|u32|u64|i8|i16|i32|i64|usize|isize|String|Option|Result|Vec|StatusCode|Json|Extension|Response|Request|NextFunction)$/.test(
          matchText
        )
      ) {
        // Type
        nodes.push(
          <span key={`tok-${matchStart}`} className="text-cyan-400 font-semibold">
            {matchText}
          </span>
        );
      } else if (/^\d+(?:\.\d+)?$/.test(matchText)) {
        // Number
        nodes.push(
          <span key={`tok-${matchStart}`} className="text-amber-300 font-medium">
            {matchText}
          </span>
        );
      } else {
        // Function call / identifier
        nodes.push(
          <span key={`tok-${matchStart}`} className="text-blue-400">
            {matchText}
          </span>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    // Add trailing text
    if (lastIndex < line.length) {
      nodes.push(
        <span key={`text-end`} className="text-zinc-300">
          {line.substring(lastIndex)}
        </span>
      );
    }

    return nodes.length > 0 ? nodes : [<span key="empty" className="text-zinc-300">{line}</span>];
  };

  return (
    <div className="w-full font-mono text-[12px] sm:text-[13px] leading-6 select-text overflow-x-auto py-1">
      {lines.map((line, lIdx) => (
        <div
          key={lIdx}
          className="flex items-baseline hover:bg-[#131b2e]/60 px-2 py-0.5 rounded transition group min-w-fit"
        >
          <span className="select-none text-zinc-600 group-hover:text-zinc-400 text-right pr-4 font-mono text-xs w-9 shrink-0 font-medium">
            {lIdx + 1}
          </span>
          <span className="font-mono whitespace-pre text-zinc-200">
            {highlightLine(line)}
          </span>
        </div>
      ))}
    </div>
  );
}
