'use client';

import { useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Undo2, Redo2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({ value, onChange, placeholder = 'Start writing...' }: TextEditorProps) {
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateContent = (newContent: string) => {
    onChange(newContent);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const applyFormatting = (before: string, after: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newContent =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);
      updateContent(newContent);
    }
  };

  const wordCount = value.trim().split(/\s+/).filter(w => w).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-card border border-border">
        <Button
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('**', '**')}
          className="gap-2"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
          Bold
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('*', '*')}
          className="gap-2"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
          Italic
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('<u>', '</u>')}
          className="gap-2"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
          Underline
        </Button>

        <div className="w-px bg-border" />

        <Button
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('\n- ', '')}
          className="gap-2"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('\n1. ', '')}
          className="gap-2"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px bg-border" />

        <Button
          size="sm"
          variant="outline"
          onClick={undo}
          disabled={historyIndex === 0}
          className="gap-2"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={redo}
          disabled={historyIndex === history.length - 1}
          className="gap-2"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        value={value}
        onChange={(e) => updateContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-96 font-mono resize-none"
      />

      {/* Stats */}
      <div className="flex justify-between items-center text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
        <span>Words: {wordCount}</span>
        <span>Characters: {value.length}</span>
      </div>
    </div>
  );
}
