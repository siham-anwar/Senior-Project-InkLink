'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, Plus, User, BookOpen, Crown, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/app/store/authstore'
import { EditorWorksService, WorkDto } from '@/app/services/editor-works.service'
import { libraryService } from '@/app/services/library.service'

export default function HomePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [continueReading, setContinueReading] = useState<any[]>([])
  const [topPicks, setTopPicks] = useState<WorkDto[]>([])
  const [topRated, setTopRated] = useState<WorkDto[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [lib, works] = await Promise.all([
        libraryService.getLibrary().catch(() => null),
        EditorWorksService.browse(),
      ])

      if (lib?.currentlyReading) {
        setContinueReading(lib.currentlyReading.map((item: any) => ({
          id: item.workId?._id || item.workId,
          title: item.workId?.title || 'Unknown',
          author: item.workId?.authorId?.username || 'Author',
          image: item.workId?.coverImage || 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=450&fit=crop',
          progress: item.progress || 0,
        })))
      }

      if (works) {
        setTopPicks(works.slice(0, 6))
        setTopRated(works.slice().reverse().slice(0, 6))
      }
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const usernameDisplay = user?.username || user?.name || 'Guest'

  const BookCard = ({ book }: { book: WorkDto }) => {
    const bookId = book.id || book._id;
    return (
      <Link href={`/book/${bookId}`} className="flex-shrink-0 w-40 group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-3 bg-muted">
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop'}
            alt={book.title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
        <h3 className="font-bold text-sm line-clamp-2 leading-tight">{book.title}</h3>
        <p className="text-muted-foreground text-xs">{book.authorUsername || 'InkLink Author'}</p>
      </Link>
    )
  }

  const RatedBookCard = ({ book }: { book: WorkDto }) => {
    const bookId = book.id || book._id;
    return (
      <Link href={`/book/${bookId}`} className="flex-shrink-0 w-40 group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-3 bg-muted">
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop'}
            alt={book.title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
            ⭐ 4.9
          </div>
        </div>
        <h3 className="font-bold text-sm line-clamp-2 leading-tight">{book.title}</h3>
        <p className="text-muted-foreground text-xs">{book.authorUsername || 'InkLink Author'}</p>
      </Link>
    )
  }

  const ContinueReadingCard = ({ book }: { book: any }) => (
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
            <Link href="/library" className="text-primary text-sm font-medium hover:underline">See all</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {continueReading.length > 0 ? (
              continueReading.map((book) => (
                <ContinueReadingCard key={book.id} book={book} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm italic">No books in progress.</p>
            )}
          </div>
        </section>

        {/* Top Picks for You Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top Picks for You</h2>
            <Link href="/library" className="text-primary text-sm font-medium hover:underline">See all</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {topPicks.map((book) => (
              <BookCard key={book.id || (book as any)._id} book={book} />
            ))}
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top Rated</h2>
            <Link href="/library" className="text-primary text-sm font-medium hover:underline">See all</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {topRated.map((book) => (
              <RatedBookCard key={book.id || (book as any)._id} book={book} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
