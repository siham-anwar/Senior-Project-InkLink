'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Bookmark, BookMarked, Heart, X, ChevronLeft } from 'lucide-react'

interface Book {
  id: number
  title: string
  author: string
  image: string
  progress?: number
  reads?: string
}

interface ReadList {
  id: number
  name: string
  description: string
  bookCount: number
  books: number[]
}

export default function LibraryPage() {
  const [mounted, setMounted] = useState(false)
  const [currentReadBooks, setCurrentReadBooks] = useState<Book[]>([])
  const [bookmarkedBooks, setBookmarkedBooks] = useState<Book[]>([])
  const [readLists, setReadLists] = useState<ReadList[]>([])
  const [showCreateReadList, setShowCreateReadList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [activeTab, setActiveTab] = useState<'current' | 'bookmarks' | 'lists'>('current')

  useEffect(() => {
    setMounted(true)
    // Mock data - Replace with backend API calls
    const mockCurrentRead: Book[] = [
      {
        id: 1,
        title: 'The Midnight Kingdom',
        author: 'Sarah Chen',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
        progress: 65,
        reads: '2.4M',
      },
      {
        id: 2,
        title: 'Hearts Intertwined',
        author: 'Maya Rodriguez',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
        progress: 42,
        reads: '5.1M',
      },
      {
        id: 3,
        title: 'Summer of Stars',
        author: 'Jessica Williams',
        image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
        progress: 78,
        reads: '4.5M',
      },
      {
        id: 4,
        title: 'Echoes of Yesterday',
        author: 'Alex Turner',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
        progress: 30,
        reads: '3.8M',
      },
      {
        id: 5,
        title: 'Whispers in the Wind',
        author: 'Emma Stone',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
        progress: 55,
        reads: '6.2M',
      },
      {
        id: 6,
        title: 'Beyond the Horizon',
        author: 'Daniel Brooks',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
        progress: 20,
        reads: '4.9M',
      },
      {
        id: 7,
        title: 'Midnight Chronicles',
        author: 'Sophie Laurent',
        image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
        progress: 88,
        reads: '5.5M',
      },
      {
        id: 8,
        title: 'Love in the City',
        author: 'James Wilson',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
        progress: 45,
        reads: '3.2M',
      },
    ]

    const mockBookmarked: Book[] = [
      {
        id: 10,
        title: 'The Lost Library',
        author: 'Amanda Price',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
        reads: '1.8M',
      },
      {
        id: 11,
        title: 'Starlight Dreams',
        author: 'Michael Chen',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
        reads: '2.9M',
      },
      {
        id: 12,
        title: 'Ocean\'s Call',
        author: 'Lisa Anderson',
        image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
        reads: '3.1M',
      },
      {
        id: 13,
        title: 'Mountain Echoes',
        author: 'David Miller',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
        reads: '2.4M',
      },
    ]

    const mockReadLists: ReadList[] = [
      {
        id: 1,
        name: 'Romantic Reads',
        description: 'My favorite romance novels',
        bookCount: 5,
        books: [1, 2, 5, 10, 11],
      },
      {
        id: 2,
        name: 'Sci-Fi Adventures',
        description: 'Epic space and futuristic stories',
        bookCount: 4,
        books: [3, 4, 6, 12],
      },
    ]

    setCurrentReadBooks(mockCurrentRead)
    setBookmarkedBooks(mockBookmarked)
    setReadLists(mockReadLists)
  }, [])

  const handleCreateReadList = () => {
    if (newListName.trim()) {
      const newList: ReadList = {
        id: readLists.length + 1,
        name: newListName,
        description: newListDescription,
        bookCount: 0,
        books: [],
      }
      setReadLists([...readLists, newList])
      setNewListName('')
      setNewListDescription('')
      setShowCreateReadList(false)
    }
  }

  const handleDeleteReadList = (id: number) => {
    setReadLists(readLists.filter((list) => list.id !== id))
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
            <button
              onClick={() => setActiveTab('lists')}
              className={`pb-4 font-medium transition-colors relative ${
                activeTab === 'lists'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Reading Lists
              {activeTab === 'lists' && (
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
                currentReadBooks.map((book) => (
                  <Link key={book.id} href={`/book/${book.id}`} className="group cursor-pointer block">
                    <div className="flex gap-4 p-4 bg-secondary/30 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex-shrink-0 w-24 h-32">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{book.author}</p>
                        </div>
                        {book.progress && (
                          <div>
                            <div className="w-full bg-muted/30 rounded-full h-2 mb-1">
                              <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${book.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">{book.progress}% done</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
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
                  <Link key={book.id} href={`/book/${book.id}`} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg mb-3 bg-muted h-56">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-2 right-2">
                        <button className="p-2 bg-primary/90 hover:bg-primary rounded-full transition-colors">
                          <Bookmark size={16} className="text-primary-foreground fill-current" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
                    <p className="text-muted-foreground text-xs">{book.author}</p>
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

        {/* Read Lists Section */}
        {activeTab === 'lists' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Reading Lists</h2>
              <button
                onClick={() => setShowCreateReadList(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                <span className="text-sm font-medium">Create List</span>
              </button>
            </div>

            {/* Create Read List Modal */}
            {showCreateReadList && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Create Reading List</h3>
                    <button
                      onClick={() => setShowCreateReadList(false)}
                      className="p-1 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">List Name</label>
                      <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="e.g., Sci-Fi Adventures"
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description (optional)</label>
                      <textarea
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                        placeholder="Describe your reading list..."
                        rows={3}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowCreateReadList(false)}
                        className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateReadList}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Read Lists Grid */}
            {readLists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {readLists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-secondary/50 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg line-clamp-2">{list.name}</h3>
                      <button
                        onClick={() => handleDeleteReadList(list.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded-lg transition-all"
                      >
                        <X size={18} className="text-destructive" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{list.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{list.bookCount} books</span>
                      <Link
                        href={`/library/list/${list.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No reading lists yet</p>
                <button
                  onClick={() => setShowCreateReadList(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus size={18} />
                  Create Your First List
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
