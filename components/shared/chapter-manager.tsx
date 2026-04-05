'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export interface Chapter {
  id: string;
  title: string;
  orderNumber: number;
}

interface ChapterManagerProps {
  chapters: Chapter[];
  onAddChapter: (chapter: Chapter) => void;
  onDeleteChapter: (id: string) => void;
  onSelectChapter: (id: string) => void;
  selectedChapterId?: string;
  onReorderChapters?: (chapters: Chapter[]) => void;
}

export function ChapterManager({
  chapters,
  onAddChapter,
  onDeleteChapter,
  onSelectChapter,
  selectedChapterId,
  onReorderChapters,
}: ChapterManagerProps) {
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      const newChapter: Chapter = {
        id: `ch-${Date.now()}`,
        title: newChapterTitle,
        orderNumber: chapters.length + 1,
      };
      onAddChapter(newChapter);
      setNewChapterTitle('');
    }
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    if (!onReorderChapters) return;

    const newChapters = [...chapters];
    if (direction === 'up' && index > 0) {
      [newChapters[index], newChapters[index - 1]] = [
        newChapters[index - 1],
        newChapters[index],
      ];
    } else if (direction === 'down' && index < newChapters.length - 1) {
      [newChapters[index], newChapters[index + 1]] = [
        newChapters[index + 1],
        newChapters[index],
      ];
    }

    const reorderedChapters = newChapters.map((ch, i) => ({
      ...ch,
      orderNumber: i + 1,
    }));

    onReorderChapters(reorderedChapters);
  };

  return (
    <div className="space-y-4">
      {/* Add Chapter */}
      <div className="flex gap-2">
        <Input
          placeholder="Chapter title..."
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddChapter()}
        />
        <Button onClick={handleAddChapter} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Chapters List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {chapters.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No chapters yet. Create one to get started!
          </p>
        ) : (
          chapters.map((chapter, index) => (
            <Card
              key={chapter.id}
              className={`cursor-pointer transition-all border-0 ${
                selectedChapterId === chapter.id
                  ? 'bg-primary/10 ring-2 ring-primary'
                  : 'hover:bg-card/80'
              }`}
              onClick={() => onSelectChapter(chapter.id)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Chapter {chapter.orderNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">{chapter.title}</p>
                </div>

                <div className="flex gap-1">
                  {onReorderChapters && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveChapter(index, 'up');
                        }}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveChapter(index, 'down');
                        }}
                        disabled={index === chapters.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChapter(chapter.id);
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Total chapters: {chapters.length}
      </p>
    </div>
  );
}
