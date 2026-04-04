'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Moon, Sun, Share2, Flag, MoreVertical, Heart, Eye, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'summary' | 'parts'>('summary')
  const [showMenu, setShowMenu] = useState(false)
  const [hasStartedReading, setHasStartedReading] = useState(false)

  useEffect(() => {
    setMounted(true)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(prefersDark)
    if (prefersDark) document.documentElement.classList.add('dark')
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Mock book data
  const mockBook = {
    id: params.id,
    title: 'The Midnight Kingdom',
    author: 'Sarah Chen',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=450&fit=crop',
    views: '2.4M',
    likes: '850K',
    parts: 45,
    ageRange: '16+',
    status: 'Completed',
    publishedDate: 'March 15, 2024',
    tags: ['Fantasy', 'Adventure', 'Magic', 'Dark Fantasy', 'Epic'],
    synopsis: 'Journey through a world of shadows and secrets in The Midnight Kingdom. Follow Aria, a young warrior, as she uncovers the truth about her past and discovers her true power. With stunning world-building and unforgettable characters, this epic fantasy will keep you on the edge of your seat.',
    chapters: [
      { id: 1, name: 'Chapter 1: The Beginning', publishedDate: 'Mar 15, 2024', views: '1.2M' },
      { id: 2, name: 'Chapter 2: Shadows Rise', publishedDate: 'Mar 18, 2024', views: '980K' },
      { id: 3, name: 'Chapter 3: Lost and Found', publishedDate: 'Mar 22, 2024', views: '850K' },
      { id: 4, name: 'Chapter 4: Whispers in the Dark', publishedDate: 'Mar 25, 2024', views: '720K' },
      { id: 5, name: 'Chapter 5: The Truth Revealed', publishedDate: 'Mar 29, 2024', views: '650K' },
      { id: 6, name: 'Chapter 6: Power Within', publishedDate: 'Apr 1, 2024', views: '580K' },
      { id: 7, name: 'Chapter 7: Final Battle', publishedDate: 'Apr 5, 2024', views: '520K' },
    ],
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary">
              InkLink
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-3 relative">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Toggle dark mode"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="More options"
                >
                  <MoreVertical size={20} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors text-foreground text-left">
                      <Share2 size={16} />
                      Share
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors text-foreground text-left">
                      <Flag size={16} />
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Header Section */}
        <div className="flex gap-6 mb-8">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <img
              src={mockBook.cover}
              alt={mockBook.title}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{mockBook.title}</h1>

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={mockBook.authorImage}
                alt={mockBook.author}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-muted-foreground">@{mockBook.author}</span>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-muted-foreground" />
                <span className="text-sm">{mockBook.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-muted-foreground" />
                <span className="text-sm">{mockBook.likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-muted-foreground" />
                <span className="text-sm">{mockBook.parts} parts</span>
              </div>
            </div>

            {/* Metadata Line */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="inline-block">Age: {mockBook.ageRange}</span>
              <span className="inline-block">•</span>
              <span className="inline-block">Status: {mockBook.status}</span>
              <span className="inline-block">•</span>
              <span className="inline-block">Published: {mockBook.publishedDate}</span>
            </div>

            {/* Action Button */}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8">
              {hasStartedReading ? 'Continue Reading' : 'Start Reading'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-8 border-b border-border">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'summary'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('parts')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'parts'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Parts ({mockBook.parts})
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockBook.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full hover:bg-secondary/80 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Synopsis */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Synopsis</h3>
                  <p className="text-muted-foreground leading-relaxed">{mockBook.synopsis}</p>
                </div>
              </div>
            )}

            {activeTab === 'parts' && (
              <div className="space-y-3">
                {mockBook.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary transition-colors rounded-lg cursor-pointer border border-border"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{chapter.name}</h4>
                      <p className="text-sm text-muted-foreground">{chapter.views} views</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {chapter.publishedDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 InkLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
