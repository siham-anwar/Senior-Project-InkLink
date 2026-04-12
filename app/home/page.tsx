'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, Plus, User, BookOpen, Crown, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/app/store/authstore'

export default function HomePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const usernameDisplay = user?.username || user?.name || 'Guest'
  const userEmail = user?.email || ''

  // Mock data that can be replaced with backend data
  const mockContinueReadingBooks = [
    {
      id: 1,
      title: 'The Midnight Kingdom',
      author: 'Sarah Chen',
      reads: '2.4M',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
      progress: 65,
    },
    {
      id: 2,
      title: 'Hearts Intertwined',
      author: 'Maya Rodriguez',
      reads: '5.1M',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
      progress: 42,
    },
    {
      id: 3,
      title: 'Summer of Stars',
      author: 'Jessica Williams',
      reads: '4.5M',
      image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
      progress: 78,
    },
    {
      id: 4,
      title: 'Echoes of Yesterday',
      author: 'Alex Turner',
      reads: '3.8M',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
      progress: 30,
    },
    {
      id: 5,
      title: 'Whispers in the Wind',
      author: 'Emma Stone',
      reads: '6.2M',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
      progress: 55,
    },
  ]

  const mockTopPicksBooks = [
    {
      id: 6,
      title: 'Beyond the Horizon',
      author: 'Daniel Brooks',
      reads: '4.9M',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    },
    {
      id: 7,
      title: 'Midnight Chronicles',
      author: 'Sophie Laurent',
      reads: '5.5M',
      image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
    },
    {
      id: 8,
      title: 'The Last Paradise',
      author: 'Michael Chen',
      reads: '3.2M',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
    },
    {
      id: 9,
      title: 'Rising Sun',
      author: 'Lisa Park',
      reads: '7.8M',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
    },
    {
      id: 10,
      title: 'Infinite Dreams',
      author: 'James Morrison',
      reads: '6.5M',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    },
    {
      id: 11,
      title: 'Echoes of Time',
      author: 'Rachel Green',
      reads: '5.9M',
      image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
    },
  ]

  const mockTopRatedBooks = [
    {
      id: 12,
      title: 'Lost in Translation',
      author: 'Carlos Rodriguez',
      reads: '4.3M',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
    },
    {
      id: 13,
      title: 'The Eternal Garden',
      author: 'Victoria Swan',
      reads: '3.9M',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
    },
    {
      id: 14,
      title: 'Nightfall Chronicles',
      author: 'Nathan Cross',
      reads: '5.2M',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    },
    {
      id: 15,
      title: 'Beneath the Stars',
      author: 'Isabella Moon',
      reads: '6.1M',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4f0d?w=300&h=400&fit=crop',
    },
    {
      id: 16,
      title: 'Memories of Tomorrow',
      author: 'Alexander James',
      reads: '4.6M',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e01c869?w=300&h=400&fit=crop',
    },
    {
      id: 17,
      title: 'The Forgotten Path',
      author: 'Emma Watson',
      reads: '3.7M',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop',
    },
  ]

  const ContinueReadingCard = ({ book }: { book: typeof mockContinueReadingBooks[0] }) => (
    <Link href={`/book/${book.id}`} className="flex-shrink-0 w-40 group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div className="w-full bg-muted/30 rounded-full h-1.5 mb-1">
            <div 
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${book.progress}%` }}
            />
          </div>
          <p className="text-white text-xs font-medium">{book.progress}% done</p>
        </div>
      </div>
      <h3 className="font-bold text-sm line-clamp-2 leading-tight">{book.title}</h3>
      <p className="text-muted-foreground text-xs">{book.author}</p>
    </Link>
  )

  const BookCard = ({ book }: { book: typeof mockTopPicksBooks[0] }) => (
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
      <p className="text-muted-foreground text-xs">{book.author}</p>
    </Link>
  )

  const RatedBookCard = ({ book }: { book: typeof mockTopRatedBooks[0] }) => (
    <div className="flex-shrink-0 w-40 group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
          ⭐ {book.rating}
        </div>
      </div>
      <h3 className="font-bold text-sm line-clamp-2 leading-tight">{book.title}</h3>
      <p className="text-muted-foreground text-xs">{book.author}</p>
    </div>
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              Hi, @{usernameDisplay}
            </h1>
            <p className="text-muted-foreground mt-2">Welcome back! Keep exploring amazing stories.</p>
          </div>

          {user?.role === 'child' && (
            <Link href="/children" className="group">
                <div className="bg-gradient-to-r from-rose-400 to-orange-400 p-[2px] rounded-2xl transition-transform group-hover:scale-105">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl px-6 py-3 flex items-center gap-3">
                        <span className="text-2xl">🎨</span>
                        <div>
                            <p className="font-black text-rose-500 text-sm leading-tight">KIDS MODE</p>
                            <p className="text-slate-500 text-xs font-medium">Enter your magic library</p>
                        </div>
                    </div>
                </div>
            </Link>
          )}

          {user?.role === 'parent' && (
            <Link href="/dashboard/parent" className="group">
                <div className="bg-primary rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl shadow-primary/10 transition-all group-hover:-translate-y-1">
                    <Shield className="text-primary-foreground/80" size={28} />
                    <div>
                        <p className="font-bold text-primary-foreground text-sm leading-tight">Parent Dashboard</p>
                        <p className="text-primary-foreground/80 text-xs font-medium">Manage your children's safety</p>
                    </div>
                    <Plus className="text-primary bg-white rounded-full p-1" size={24} />
                </div>
            </Link>
          )}
        </div>

        {/* Quick Navigation Bar */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors flex-shrink-0">
            <Search size={18} />
            <span className="text-sm font-medium">Search</span>
          </button>
          <Link href="/library" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-full transition-colors flex-shrink-0">
            <BookOpen size={18} />
            <span className="text-sm font-medium">Library</span>
          </Link>
          <Link href="/notifications" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-full transition-colors flex-shrink-0">
            <Bell size={18} />
            <span className="text-sm font-medium">Notifications</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-full transition-colors flex-shrink-0">
            <Plus size={18} />
            <span className="text-sm font-medium">Create</span>
          </Link>
        </div>

        {/* Continue Reading Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Continue Reading</h2>
            <a href="#" className="text-primary text-sm font-medium hover:underline">See all</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {mockContinueReadingBooks.map((book) => (
              <ContinueReadingCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Top Picks for You Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top Picks for You</h2>
            <a href="#" className="text-primary text-sm font-medium hover:underline">See all</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {mockTopPicksBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top Rated</h2>
            <a href="#" className="text-primary text-sm font-medium hover:underline">See all</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {mockTopRatedBooks.map((book) => (
              <RatedBookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
