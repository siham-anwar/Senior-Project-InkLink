'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowLeft, Loader2 } from 'lucide-react'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock search data - replace with backend API call
  const mockAllBooks = [
    { id: 1, title: 'The Midnight Kingdom', author: 'Sarah Chen', image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop', reads: '2.4M' },
    { id: 2, title: 'Hearts Intertwined', author: 'Maya Rodriguez', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop', reads: '5.1M' },
    { id: 3, title: 'Summer of Stars', author: 'Jessica Williams', image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop', reads: '4.5M' },
    { id: 4, title: 'Echoes of Yesterday', author: 'Alex Turner', image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop', reads: '3.8M' },
    { id: 5, title: 'Whispers in the Wind', author: 'Emma Stone', image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop', reads: '6.2M' },
    { id: 6, title: 'Beyond the Horizon', author: 'Daniel Brooks', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop', reads: '4.9M' },
    { id: 7, title: 'Midnight Chronicles', author: 'Sophie Laurent', image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop', reads: '5.5M' },
    { id: 8, title: 'Ocean\'s Call', author: 'Lucas Park', image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop', reads: '3.2M' },
  ]

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // TODO: Replace this with actual backend API call:
      // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      // const data = await response.json()
      
      const filtered = mockAllBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
      )

      setResults(filtered)
      setIsLoading(false)
    }, 300)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold">Search Books</h1>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-b from-background to-background/50 sticky top-16 z-30 py-6 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : searchQuery.trim() === '' ? (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Start typing to search for books...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No books found for "{searchQuery}"</p>
            <p className="text-sm text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Found <span className="font-semibold text-foreground">{results.length}</span> result{results.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 bg-muted">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-sm line-clamp-2 leading-tight">{book.title}</h3>
                  <p className="text-muted-foreground text-xs">{book.author}</p>
                  <p className="text-muted-foreground text-xs mt-1">{book.reads} reads</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
