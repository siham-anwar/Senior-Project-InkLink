'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Sun, Search, Home, BookOpen, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  // Mock data that can be received from backend
  const mockBooksData = [
    {
      id: 1,
      title: 'The Midnight Kingdom',
      author: 'Sarah Chen',
      reads: '2.4M',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Hearts Intertwined',
      author: 'Maya Rodriguez',
      reads: '5.1M',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Summer of Stars',
      author: 'Jessica Williams',
      reads: '4.5M',
      image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Echoes of Yesterday',
      author: 'Alex Turner',
      reads: '3.8M',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
      rating: 4.6,
    },
    {
      id: 5,
      title: 'Whispers in the Wind',
      author: 'Emma Stone',
      reads: '6.2M',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
      rating: 4.8,
    },
    {
      id: 6,
      title: 'Beyond the Horizon',
      author: 'Daniel Brooks',
      reads: '4.9M',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
      rating: 4.5,
    },
  ]

  // These sections can be populated with backend data
  const topPicksBooks = mockBooksData.slice(0, 4)
  const trendingBooks = mockBooksData.slice(1, 5)
  const bestRatedBooks = mockBooksData.slice(2, 6)

  const BookCard = ({ book }: { book: typeof mockBooksData[0] }) => (
    <Link href={`/book/${book.id}`} className="flex-shrink-0 w-40 group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <h3 className="font-bold text-sm line-clamp-2 leading-tight">{book.title}</h3>
      <p className="text-muted-foreground text-xs mb-1">{book.author}</p>
      <p className="text-muted-foreground text-xs">{book.reads} reads</p>
    </Link>
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">InkLink</span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-3 md:gap-6">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Search">
                <Search size={20} />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Toggle dark mode"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Picks Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top Picks</h2>
            <a href="#" className="text-primary text-sm font-medium hover:underline">See all</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {topPicksBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <a href="#" className="text-primary text-sm font-medium hover:underline">See all</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {trendingBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Best Rated Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Best Rated</h2>
            <a href="#" className="text-primary text-sm font-medium hover:underline">See all</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {bestRatedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card border-t border-border">
        <div className="flex items-center justify-around h-16">
          <a href="/" className="flex flex-col items-center justify-center w-full h-full text-primary gap-1">
            <Home size={24} />
            <span className="text-xs font-medium">Home</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground gap-1 transition-colors">
            <BookOpen size={24} />
            <span className="text-xs font-medium">Library</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground gap-1 transition-colors">
            <Bell size={24} />
            <span className="text-xs font-medium">Notifications</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground gap-1 transition-colors">
            <User size={24} />
            <span className="text-xs font-medium">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  )
}

