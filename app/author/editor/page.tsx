'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Trash2, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { TextEditor } from '@/components/shared/text-editor';
import { ChapterManager, Chapter } from '@/components/shared/chapter-manager';

export default function EditorPage() {
  const [storyTitle, setStoryTitle] = useState('Untitled Story');
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: 'ch-1', title: 'Introduction', orderNumber: 1 },
  ]);
  const [selectedChapterId, setSelectedChapterId] = useState('ch-1');
  const [chapterContent, setChapterContent] = useState<Record<string, string>>({
    'ch-1': 'Start writing your story here...',
  });
  const [saved, setSaved] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const currentChapter = chapters.find((ch) => ch.id === selectedChapterId);

  // Auto-save feature
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveTimer = setTimeout(() => {
      console.log('[v0] Auto-saving story...');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [chapterContent, storyTitle, autoSaveEnabled]);

  const handleAddChapter = (chapter: Chapter) => {
    setChapters([...chapters, chapter]);
    setChapterContent({
      ...chapterContent,
      [chapter.id]: '',
    });
    setSelectedChapterId(chapter.id);
  };

  const handleDeleteChapter = (id: string) => {
    if (chapters.length === 1) {
      alert('You must have at least one chapter');
      return;
    }
    const updatedChapters = chapters.filter((ch) => ch.id !== id);
    setChapters(updatedChapters);
    const { [id]: _, ...rest } = chapterContent;
    setChapterContent(rest);
    setSelectedChapterId(updatedChapters[0].id);
  };

  const handleReorderChapters = (reorderedChapters: Chapter[]) => {
    setChapters(reorderedChapters);
  };

  const handleSave = () => {
    console.log('[v0] Saving story:', { storyTitle, chapters, chapterContent });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalWords = Object.values(chapterContent)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(w => w).length;

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-background via-background to-secondary/10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/author/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Story Title</label>
            <Input
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              className="mt-2 text-2xl font-bold h-12"
              placeholder="Enter story title..."
            />
          </div>

          <div className="flex gap-2">
            {autoSaveEnabled && (
              <Button variant="outline" size="sm" disabled>
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Auto-saving
              </Button>
            )}
            <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
          </div>
        </div>

        {saved && (
          <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-950/20">
            <FileText className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-400">
              Story saved successfully!
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapters Sidebar */}
        <div>
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
              <CardTitle className="text-lg">Chapters</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ChapterManager
                chapters={chapters}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onSelectChapter={setSelectedChapterId}
                selectedChapterId={selectedChapterId}
                onReorderChapters={handleReorderChapters}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-4">
          {currentChapter && (
            <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Chapter {currentChapter.orderNumber}: {currentChapter.title}
                    </CardTitle>
                    <CardDescription>
                      Word count: {chapterContent[selectedChapterId]?.trim().split(/\s+/).filter(w => w).length || 0}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <TextEditor
                  value={chapterContent[selectedChapterId] || ''}
                  onChange={(value) =>
                    setChapterContent({
                      ...chapterContent,
                      [selectedChapterId]: value,
                    })
                  }
                />
              </CardContent>
            </Card>
          )}

          {/* Story Stats */}
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="text-lg">Story Statistics</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <p className="text-3xl font-bold text-primary">{chapters.length}</p>
                <p className="text-sm text-muted-foreground">Chapters</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/5">
                <p className="text-3xl font-bold text-secondary">{totalWords}</p>
                <p className="text-sm text-muted-foreground">Total Words</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/5">
                <p className="text-3xl font-bold text-accent">
                  {Object.values(chapterContent).join('').length}
                </p>
                <p className="text-sm text-muted-foreground">Characters</p>
              </div>
            </CardContent>
          </Card>

          {/* Publish Section */}
          <Card className="border-0 shadow-md border-l-4 border-l-primary">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle>Ready to Publish?</CardTitle>
              <CardDescription>
                Review your story and publish when ready
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex gap-3">
              <Button variant="outline" className="gap-2 flex-1">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button className="gap-2 flex-1 bg-primary hover:bg-primary/90">
                <FileText className="h-4 w-4" />
                Publish Story
              </Button>
              <Button variant="destructive" size="icon" className="flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
