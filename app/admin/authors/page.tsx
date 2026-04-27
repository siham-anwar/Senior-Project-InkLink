'use client';

import { useState, useMemo } from 'react';
import { Search, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  username: string;
  bio: string;
  profileImage: string;
  isMonetized: boolean;
  followers: number;
}

const MOCK_AUTHORS: Author[] = [
  {
    id: '1',
    name: 'Sarah Anderson',
    username: '@sarahwrites',
    bio: 'Fiction writer and novelist. Passionate about storytelling.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    isMonetized: true,
    followers: 12543,
  },
  {
    id: '2',
    name: 'James Mitchell',
    username: '@techblogger',
    bio: 'Tech blogger and writer. Love sharing knowledge.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    isMonetized: false,
    followers: 8291,
  },
  {
    id: '3',
    name: 'Emily Chen',
    username: '@poetrylounge',
    bio: 'Poetry enthusiast and creative writing mentor.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    isMonetized: true,
    followers: 15672,
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    username: '@journalismpro',
    bio: 'Journalist covering tech and culture.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    isMonetized: false,
    followers: 9847,
  },
  {
    id: '5',
    name: 'Lisa Zhang',
    username: '@businessinsights',
    bio: 'Business analyst and economics writer.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    isMonetized: true,
    followers: 22105,
  },
  {
    id: '6',
    name: 'David Park',
    username: '@creativeminds',
    bio: 'Creative director and design thinker.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    isMonetized: false,
    followers: 7543,
  },
];

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>(MOCK_AUTHORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'monetized' | 'non-monetized'>('monetized');

  const filteredAuthors = useMemo(() => {
    return authors.filter((author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [authors, searchTerm]);

  const monetizedAuthors = filteredAuthors.filter((author) => author.isMonetized);
  const nonMonetizedAuthors = filteredAuthors.filter((author) => !author.isMonetized);

  const handleDeleteAuthor = (authorId: string) => {
    setAuthors((prevAuthors) => prevAuthors.filter((author) => author.id !== authorId));
    setDeleteConfirm(null);
  };

  const handleMonetize = (authorId: string) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.id === authorId ? { ...author, isMonetized: true } : author
      )
    );
  };

  const handleDemonetize = (authorId: string) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.id === authorId ? { ...author, isMonetized: false } : author
      )
    );
  };

  const AuthorCard = ({ author }: { author: Author }) => (
    <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div className="flex-shrink-0">
            <img
              src={author.profileImage}
              alt={author.name}
              className="h-16 w-16 rounded-lg object-cover border border-border"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">{author.name}</h3>
            <p className="text-sm text-accent font-medium mb-2">{author.username}</p>
            <p className="text-sm text-muted-foreground mb-3">{author.bio}</p>
            <p className="text-sm font-semibold text-foreground">
              {(author.followers || 0).toLocaleString()} followers
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 flex gap-2">
          {author.isMonetized ? (
            <button
              onClick={() => handleDemonetize(author.id)}
              className="px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-medium transition-colors whitespace-nowrap"
            >
              Demonetize
            </button>
          ) : (
            <button
              onClick={() => handleMonetize(author.id)}
              className="px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-medium transition-colors whitespace-nowrap"
            >
              Monetize
            </button>
          )}
          <button
            onClick={() => setDeleteConfirm(author.id)}
            className="p-2.5 rounded-lg bg-card hover:bg-destructive/10 hover:text-accent transition-colors border border-border hover:border-accent"
            title="Delete author"
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
        <div className="w-full px-6 py-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Manage Authors</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Total authors: {authors.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, username, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('monetized')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'monetized'
                ? 'bg-accent text-background'
                : 'border border-border bg-card hover:border-accent/70'
            }`}
          >
            Monetized Authors ({monetizedAuthors.length})
          </button>
          <button
            onClick={() => setActiveTab('non-monetized')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'non-monetized'
                ? 'bg-accent text-background'
                : 'border border-border bg-card hover:border-accent/70'
            }`}
          >
            Non-Monetized Authors ({nonMonetizedAuthors.length})
          </button>
        </div>

        {/* Authors List - Full Width */}
        <div className="space-y-4">
          {activeTab === 'monetized' ? (
            monetizedAuthors.length > 0 ? (
              monetizedAuthors.map((author) => (
                <AuthorCard key={author.id} author={author} />
              ))
            ) : (
              <div className="text-center py-16 rounded-xl border border-border bg-card">
                <p className="text-muted-foreground text-lg">
                  No monetized authors found matching your search.
                </p>
              </div>
            )
          ) : nonMonetizedAuthors.length > 0 ? (
            nonMonetizedAuthors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))
          ) : (
            <div className="text-center py-16 rounded-xl border border-border bg-card">
              <p className="text-muted-foreground text-lg">
                No non-monetized authors found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm">
            <h2 className="text-xl font-bold text-foreground mb-2">Delete Author?</h2>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. Are you sure you want to delete this author account?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-foreground font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAuthor(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-white font-medium"
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
