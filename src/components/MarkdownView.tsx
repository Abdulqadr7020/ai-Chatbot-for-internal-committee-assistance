import React from 'react';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  // Split into lines and render structured elements
  const lines = content.split('\n');

  const renderedElements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (keyPrefix: number) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      renderedElements.push(
        <ul key={`list-${keyPrefix}`} className="my-2 space-y-1.5 pl-5 list-disc marker:text-teal-600 dark:marker:text-teal-400">
          {currentList.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {formatInlineText(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      renderedElements.push(
        <ol key={`list-${keyPrefix}`} className="my-2 space-y-1.5 pl-5 list-decimal marker:font-semibold marker:text-teal-700 dark:marker:text-teal-400">
          {currentList.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {formatInlineText(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  const formatInlineText = (text: string) => {
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-slate-700 dark:text-slate-300">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 rounded font-mono text-teal-800 dark:text-teal-300">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check header level 3
    if (trimmed.startsWith('### ')) {
      flushList(index);
      renderedElements.push(
        <h4 key={index} className="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {formatInlineText(trimmed.replace('### ', ''))}
        </h4>
      );
      return;
    }

    // Check header level 2
    if (trimmed.startsWith('## ')) {
      flushList(index);
      renderedElements.push(
        <h3 key={index} className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 flex items-center gap-2">
          {formatInlineText(trimmed.replace('## ', ''))}
        </h3>
      );
      return;
    }

    // Check header level 1
    if (trimmed.startsWith('# ')) {
      flushList(index);
      renderedElements.push(
        <h2 key={index} className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-3">
          {formatInlineText(trimmed.replace('# ', ''))}
        </h2>
      );
      return;
    }

    // Unordered bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.substring(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList(index);
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Ordered number list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const itemText = numMatch[2];
      if (!currentList || currentList.type !== 'ol') {
        flushList(index);
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // If empty line, flush list and add spacer
    if (!trimmed) {
      flushList(index);
      renderedElements.push(<div key={index} className="h-2" />);
      return;
    }

    // Regular paragraph
    flushList(index);
    renderedElements.push(
      <p key={index} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 my-1">
        {formatInlineText(line)}
      </p>
    );
  });

  // Flush any remaining list
  flushList(lines.length);

  return <div className="space-y-1">{renderedElements}</div>;
};
