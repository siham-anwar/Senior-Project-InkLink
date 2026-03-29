'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Plus, Search, Library, User, Crown, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Mock data for books
const mockBooks = {
  continueReading: [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', cover: '/book-1.jpg', progress: 65, color: 'bg-blue-500' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', cover: '/book-2.jpg', progress: 42, color: 'bg-green-500' },
    { id: 3, title: 'The Silent Patient', author: 'Alex Michaelides', cover: '/book-3.jpg', progress: 88, color: 'bg-purple-500' },
    { id: 4, title: 'Educated', author: 'Tara Westover', cover: '/book-4.jpg', progress: 30, color: 'bg-orange-500' },
    { id: 5, title: 'Project Hail Mary', author: 'Andy Weir', cover: '/book-5.jpg', progress: 55, color: 'bg-indigo-500' },
    { id: 16, title: 'The Thursday Murder Club', author: 'Richard Osman', cover: '/book-16.jpg', progress: 72, color: 'bg-rose-500' },
    { id: 17, title: 'Verity', author: 'Colleen Hoover', cover: '/book-17.jpg', progress: 91, color: 'bg-amber-500' },
    { id: 18, title: 'Daisy Jones & The Six', author: 'Taylor Jenkins Reid', cover: '/book-18.jpg', progress: 38, color: 'bg-pink-500' },
  ],
  topPicks: [
    { id: 6, title: 'Lessons in Chemistry', author: 'Bonnie Garmus', cover: '/book-6.jpg', rating: 4.8, color: 'bg-cyan-500' },
    { id: 7, title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', cover: '/book-7.jpg', rating: 4.9, color: 'bg-fuchsia-500' },
    { id: 8, title: 'Remarkably Bright', author: 'Catherine Blyth', cover: '/book-8.jpg', rating: 4.7, color: 'bg-sky-500' },
    { id: 9, title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', cover: '/book-9.jpg', rating: 4.6, color: 'bg-teal-500' },
    { id: 10, title: 'The House in the Cerulean Sea', author: 'TJ Klune', cover: '/book-10.jpg', rating: 4.8, color: 'bg-emerald-500' },
    { id: 19, title: 'Piranesi', author: 'Susanna Clarke', cover: '/book-19.jpg', rating: 4.9, color: 'bg-violet-500' },
    { id: 20, title: 'Hamnet', author: 'Maggie O\'Farrell', cover: '/book-20.jpg', rating: 4.7, color: 'bg-lime-500' },
    { id: 21, title: 'The Invisible Life of Addie LaRue', author: 'V.E. Schwab', cover: '/book-21.jpg', rating: 4.8, color: 'bg-red-500' },
  ],
  topRated: [
    { id: 11, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '/book-11.jpg', rating: 5.0, color: 'bg-slate-500' },
    { id: 12, title: '1984', author: 'George Orwell', cover: '/book-12.jpg', rating: 4.9, color: 'bg-gray-500' },
    { id: 13, title: 'Pride and Prejudice', author: 'Jane Austen', cover: '/book-13.jpg', rating: 4.9, color: 'bg-red-400' },
    { id: 14, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '/book-14.jpg', rating: 4.8, color: 'bg-yellow-500' },
    { id: 15, title: 'Dune', author: 'Frank Herbert', cover: '/book-15.jpg', rating: 4.8, color: 'bg-orange-600' },
    { id: 22, title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: '/book-22.jpg', rating: 4.8, color: 'bg-blue-600' },
    { id: 23, title: 'Beloved', author: 'Toni Morrison', cover: '/book-23.jpg', rating: 4.9, color: 'bg-red-600' },
    { id: 24, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', cover: '/book-24.jpg', rating: 5.0, color: 'bg-green-600' },
  ],
}

// Book card component
const BookCard = ({ book, showProgress = false, showRating = false }) => (
  <div className="flex-shrink-0 w-40">
    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer bg-card border border-red-600/20 hover:border-red-600/50">
      <div className={`aspect-square ${book.color} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📖</div>
          <p className="text-xs font-medium text-white/90 truncate px-2">{book.title}</p>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate text-foreground">{book.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
        {showProgress && (
          <div className="mt-2">
            <div className="w-full bg-border rounded-full h-1.5">
              <div
                className="bg-red-600 h-1.5 rounded-full transition-all"
                style={{ width: `${book.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{book.progress}%</p>
          </div>
        )}
        {showRating && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-medium text-red-600">★ {book.rating}</span>
          </div>
        )}
      </div>
    </Card>
  </div>
)

// Horizontal scroll section component
const BookSection = ({ title, books, showProgress = false, showRating = false }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-foreground mb-4 border-l-4 border-red-600 pl-3">{title}</h2>
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            showProgress={showProgress}
            showRating={showRating}
          />
        ))}
      </div>
    </div>
  </div>
)

export default function HomePage() {
  const [username] = useState('@sarah_reader')
  const [notificationCount] = useState(3)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if dark mode is already set
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      setIsDark(false)
      localStorage.setItem('theme', 'light')
    } else {
      html.classList.add('dark')
      setIsDark(true)
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <nav className="border-b border-red-600/20 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-2xl font-bold text-foreground">InkLink</span>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-red-600/10"
                onClick={toggleTheme}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-red-600" />
                ) : (
                  <Moon className="w-5 h-5 text-red-600" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-red-600/10"
              >
                <Crown className="w-5 h-5 text-red-600" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center overflow-hidden border-2 border-red-600/30 hover:border-red-600/60 transition-colors cursor-pointer">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Hi, <span className="text-red-600">{username}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back! Let&apos;s find your next great read</p>
        </div>

        {/* Quick Navigation Bar */}
        <div className="mb-8 flex items-center gap-2 pb-4 border-b border-red-600/20 overflow-x-auto">
          <Button
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap hover:bg-red-600/10 border-red-600/20 hover:border-red-600/50"
          >
            <Library className="w-4 h-4" />
            <span>Library</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap hover:bg-red-600/10 border-red-600/20 hover:border-red-600/50"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap hover:bg-red-600/10 border-red-600/20 hover:border-red-600/50 relative"
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                {notificationCount}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap hover:bg-red-600/10 border-red-600/20 hover:border-red-600/50"
          >
            <Plus className="w-4 h-4" />
            <span>Author Profile</span>
          </Button>
        </div>

        {/* Book Sections */}
        <BookSection
          title="Continue Reading"
          books={mockBooks.continueReading}
          showProgress={true}
        />

        <BookSection
          title="Top Picks For You"
          books={mockBooks.topPicks}
          showRating={true}
        />

        <BookSection
          title="Top Rated"
          books={mockBooks.topRated}
          showRating={true}
        />
      </main>
    </div>
  )
}
