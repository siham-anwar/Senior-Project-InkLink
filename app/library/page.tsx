'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, Bookmark } from 'lucide-react'
import { libraryService, LibraryWork, CurrentlyReading } from '../services/library.service'

export default function LibraryPage() {
  const [mounted, setMounted] = useState(false)
  const [currentReadBooks, setCurrentReadBooks] = useState<CurrentlyReading[]>([])
  const [bookmarkedBooks, setBookmarkedBooks] = useState<LibraryWork[]>([])
  
  const [activeTab, setActiveTab] = useState<'current' | 'bookmarks'>('current')
  
  const [isLoading, setIsLoading] = useState(true)

  const fetchLibrary = useCallback(async () => {
    try {
      setIsLoading(true)
      const lib = await libraryService.getLibrary()
      setCurrentReadBooks(lib.currentlyReading || [])
      setBookmarkedBooks(lib.bookmarked || [])
    } catch (error) {
      console.error('Failed to fetch library:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchLibrary()
  }, [fetchLibrary])


  const handleToggleBookmark = async (workId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const updatedLib = await libraryService.toggleBookmark(workId)
      setBookmarkedBooks(updatedLib.bookmarked || [])
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header with Tabs */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6 mb-4">
            <div className="flex items-center gap-4">
              <Link href="/home" className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back to home">
                <ChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">My Library</h1>
              </div>
            </div>
            <Link href="/search" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Search size={24} />
            </Link>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-8 border-t border-border pt-4">
            <button
              onClick={() => setActiveTab('current')}
              className={`pb-4 font-medium transition-colors relative ${
                activeTab === 'current'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Currently Reading
              {activeTab === 'current' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`pb-4 font-medium transition-colors relative ${
                activeTab === 'bookmarks'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bookmarked
              {activeTab === 'bookmarks' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Currently Reading Section */}
        {activeTab === 'current' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Currently Reading</h2>
              <span className="text-sm text-muted-foreground">{currentReadBooks.length} books</span>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {currentReadBooks.length > 0 ? (
                currentReadBooks.map((item) => {
                  const book = item.workId;
                  if (!book) return null;
                  return (
                  <Link key={book._id} href={`/book/${book._id}`} className="group cursor-pointer block">
                    <div className="flex gap-4 p-4 bg-secondary/30 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex-shrink-0 w-24 h-32">
                        <img
                          src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop'}
                          alt={book.title}
                          className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{book.authorId?.username || 'Unknown Author'}</p>
                        </div>
                        {item.progress !== undefined && (
                          <div>
                            <div className="w-full bg-muted/30 rounded-full h-2 mb-1">
                              <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">{item.progress}% done</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )})
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No books in your current reading list</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Bookmarks Section */}
        {activeTab === 'bookmarks' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Bookmarked</h2>
              <span className="text-sm text-muted-foreground">{bookmarkedBooks.length} books</span>
            </div>
            {bookmarkedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bookmarkedBooks.map((book) => (
                  <Link key={book._id} href={`/book/${book._id}`} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg mb-3 bg-muted h-56">
                      <img
                        src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop'}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-2 right-2">
                        <button onClick={(e) => handleToggleBookmark(book._id, e)} className="p-2 bg-primary/90 hover:bg-primary rounded-full transition-colors">
                          <Bookmark size={16} className="text-primary-foreground fill-current" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
                    <p className="text-muted-foreground text-xs">{book.authorId?.username || 'Unknown Author'}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookmarked books yet</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
