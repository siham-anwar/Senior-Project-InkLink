'use client';

import { useState, useMemo } from 'react';
import { Search, Trash2, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Chapter {
  id: string;
  title: string;
  author: string;
  authorImage: string;
  publishedAt: string;
  status: 'success' | 'warning' | 'fail';
  content: string;
}

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: '1',
    title: 'Chapter 1: The Beginning',
    author: 'Sarah Anderson',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    publishedAt: '2024-04-15 10:30 AM',
    status: 'success',
    content: 'Chapter content goes here...',
  },
  {
    id: '2',
    title: 'Chapter 2: Rising Tension',
    author: 'James Mitchell',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    publishedAt: '2024-04-14 03:45 PM',
    status: 'warning',
    content: 'Chapter content goes here...',
  },
  {
    id: '3',
    title: 'Chapter 3: Climax',
    author: 'Emily Chen',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    publishedAt: '2024-04-13 08:15 AM',
    status: 'success',
    content: 'Chapter content goes here...',
  },
  {
    id: '4',
    title: 'Chapter 4: Unexpected Turn',
    author: 'Michael Rodriguez',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    publishedAt: '2024-04-12 02:20 PM',
    status: 'fail',
    content: 'Chapter content goes here...',
  },
  {
    id: '5',
    title: 'Chapter 5: Resolution',
    author: 'Lisa Zhang',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    publishedAt: '2024-04-11 11:00 AM',
    status: 'warning',
    content: 'Chapter content goes here...',
  },
  {
    id: '6',
    title: 'Chapter 6: New Horizons',
    author: 'David Park',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    publishedAt: '2024-04-10 04:30 PM',
    status: 'success',
    content: 'Chapter content goes here...',
  },
];

export default function ContentPage() {
  const [chapters, setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'success' | 'warning' | 'fail'>('success');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredChapters = useMemo(() => {
    return chapters.filter((chapter) => {
      const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = chapter.status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [chapters, searchTerm, activeTab]);

  const statusCounts = {
    success: chapters.filter((c) => c.status === 'success').length,
    warning: chapters.filter((c) => c.status === 'warning').length,
    fail: chapters.filter((c) => c.status === 'fail').length,
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-500/10';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-500/10';
      case 'fail':
        return 'border-l-4 border-l-red-500 bg-red-500/10';
      default:
        return '';
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapters((prevChapters) => prevChapters.filter((chapter) => chapter.id !== chapterId));
    setDeleteConfirm(null);
  };

  const handlePublishChapter = (chapterId: string) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, status: 'success' as const } : chapter
      )
    );
  };

  const ChapterCard = ({ chapter }: { chapter: Chapter }) => (
    <div className={`rounded-xl border border-border p-6 ${getStatusStyles(chapter.status)}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Chapter info */}
        <div className="flex gap-4 flex-1">
          {/* Author Image */}
          <div className="flex-shrink-0">
            <img
              src={chapter.authorImage}
              alt={chapter.author}
              className="h-14 w-14 rounded-lg object-cover border border-border"
            />
          </div>

          {/* Chapter Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">{chapter.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{chapter.author}</p>
            <p className="text-xs text-muted-foreground">{chapter.publishedAt}</p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex-shrink-0 flex gap-2">
          <button
            onClick={() => setSelectedChapter(chapter)}
            className="px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-medium transition-colors flex items-center gap-2"
            title="Read chapter"
          >
            <Eye className="h-4 w-4" />
            Read
          </button>

          {(chapter.status === 'warning' || chapter.status === 'fail') && (
            <button
              onClick={() => handlePublishChapter(chapter.id)}
              className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 font-medium transition-colors"
              title="Publish chapter"
            >
              Publish
            </button>
          )}

          <button
            onClick={() => setDeleteConfirm(chapter.id)}
            className="p-2.5 rounded-lg bg-card hover:bg-destructive/10 hover:text-accent transition-colors border border-border hover:border-accent"
            title="Delete chapter"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-20">
        <div className="w-full px-6 py-8 max-w-full">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Published Content</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Manage chapters and publications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8 max-w-full">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by chapter name or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('success')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'success'
                ? 'bg-green-500 text-background'
                : 'border border-border bg-card hover:border-green-500/70 text-foreground'
            }`}
          >
            Success ({statusCounts.success})
          </button>
          <button
            onClick={() => setActiveTab('warning')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'warning'
                ? 'bg-yellow-500 text-background'
                : 'border border-border bg-card hover:border-yellow-500/70 text-foreground'
            }`}
          >
            Warning ({statusCounts.warning})
          </button>
          <button
            onClick={() => setActiveTab('fail')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'fail'
                ? 'bg-red-500 text-background'
                : 'border border-border bg-card hover:border-red-500/70 text-foreground'
            }`}
          >
            Fail ({statusCounts.fail})
          </button>
        </div>

        {/* Chapters List */}
        <div className="space-y-4">
          {filteredChapters.length > 0 ? (
            filteredChapters.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} />)
          ) : (
            <div className="text-center py-16 rounded-xl border border-border bg-card">
              <p className="text-muted-foreground text-lg">
                No chapters found in this section matching your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Reader Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedChapter.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">by {selectedChapter.author}</p>
              </div>
              <button
                onClick={() => setSelectedChapter(null)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">{selectedChapter.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 max-w-sm">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Delete Chapter?
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this chapter? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:border-foreground transition-colors text-foreground font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteChapter(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
