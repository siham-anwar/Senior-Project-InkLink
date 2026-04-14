'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, Plus, User, BookOpen, Crown, LogOut, Shield, Star } from 'lucide-react'
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
        // Updated to show 4 books per section
        setTopPicks(works.slice(0, 4))
        setTopRated(works.slice().reverse().slice(0, 4))
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
      <Link href={`/book/${bookId}`} className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-muted aspect-[3/4] shadow-md transition-shadow hover:shadow-xl">
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=533&fit=crop'}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
        <h3 className="font-bold text-base line-clamp-1 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{book.authorUsername || 'InkLink Author'}</p>
      </Link>
    )
  }

  const RatedBookCard = ({ book }: { book: WorkDto }) => {
    const bookId = book.id || book._id;
    return (
      <Link href={`/book/${bookId}`} className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-muted aspect-[3/4] shadow-md transition-shadow hover:shadow-xl">
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=533&fit=crop'}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Enhanced Premium Rating Badge */}
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md border border-border/50 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg transform group-hover:scale-110 transition-transform">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-foreground">4.9</span>
          </div>
        </div>
        <h3 className="font-bold text-base line-clamp-1 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{book.authorUsername || 'InkLink Author'}</p>
      </Link>
    )
  }

  const ContinueReadingCard = ({ book }: { book: any }) => (
    <Link href={`/book/${book.id}`} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl mb-4 bg-muted aspect-[3/4] shadow-md transition-shadow hover:shadow-xl">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-1.5 mb-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${book.progress}%` }}
            />
          </div>
          <p className="text-white text-xs font-bold">{book.progress}% mastered</p>
        </div>
      </div>
      <h3 className="font-bold text-base line-clamp-1 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
      <p className="text-muted-foreground text-sm mt-1">{book.author}</p>
    </Link>
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Greeting */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-balance">
              Hi, @{usernameDisplay}
            </h1>
            <p className="text-muted-foreground text-lg mt-2 font-medium">Ready for your next adventure?</p>
          </div>

          {user?.role === 'child' && (
            <Link href="/children" className="group">
              <div className="bg-gradient-to-r from-rose-400 to-orange-400 p-[2px] rounded-2xl transition-transform group-hover:scale-105 shadow-lg">
                <div className="bg-white dark:bg-slate-900 rounded-2xl px-6 py-3 flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <p className="font-black text-rose-500 text-sm leading-tight uppercase tracking-tight">Kids Mode</p>
                    <p className="text-slate-500 text-xs font-semibold">The magic library</p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {user?.role === 'parent' && (
            <Link href="/dashboard/parent" className="group">
              <div className="bg-primary rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl shadow-primary/20 transition-all group-hover:-translate-y-1">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Shield className="text-primary-foreground" size={24} />
                </div>
                <div>
                  <p className="font-black text-primary-foreground text-sm leading-tight uppercase">Parent Control</p>
                  <p className="text-primary-foreground/80 text-xs font-medium">Keep it safe</p>
                </div>
                <Plus className="text-primary bg-white rounded-full p-1 ml-2" size={20} />
              </div>
            </Link>
          )}
        </div>

        {/* Quick Navigation Bar */}
        <div className="flex items-center gap-4 mb-12 pb-6 border-b border-border/50 overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-secondary rounded-full hover:bg-secondary/80 transition-all flex-shrink-0 font-bold border border-border/50 shadow-sm">
            <Search size={20} />
            <span className="text-sm">Explore</span>
          </button>
          <Link href="/library" className="flex items-center gap-2 px-6 py-2.5 hover:bg-secondary rounded-full transition-all flex-shrink-0 font-bold text-muted-foreground hover:text-foreground">
            <BookOpen size={20} />
            <span className="text-sm">Library</span>
          </Link>
          <Link href="/notifications" className="flex items-center gap-2 px-6 py-2.5 hover:bg-secondary rounded-full transition-all flex-shrink-0 font-bold text-muted-foreground hover:text-foreground">
            <Bell size={20} />
            <span className="text-sm">Updates</span>
          </Link>
          <Link href="/editor" className="flex items-center gap-2 px-6 py-2.5 hover:bg-secondary rounded-full transition-all flex-shrink-0 font-bold text-muted-foreground hover:text-foreground">
            <Plus size={20} />
            <span className="text-sm">Write</span>
          </Link>
        </div>

        {/* Continue Reading Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight">Keep Reading</h2>
            <Link href="/library" className="text-primary text-sm font-bold hover:underline underline-offset-4">View All</Link>
          </div>
          {/* Changed to 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {continueReading.length > 0 ? (
              continueReading.map((book) => (
                <ContinueReadingCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full py-12 bg-secondary/20 rounded-3xl border-2 border-dashed border-border flex items-center justify-center">
                <p className="text-muted-foreground font-medium italic">No books in progress just yet.</p>
              </div>
            )}
          </div>
        </section>
 
        {/* Top Picks for You Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight">Editor's Picks</h2>
            <Link href="/library" className="text-primary text-sm font-bold hover:underline underline-offset-4">Discover</Link>
          </div>
          {/* Changed to 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {topPicks.map((book) => (
              <BookCard key={book.id || (book as any)._id} book={book} />
            ))}
          </div>
        </section>
 
        {/* Top Rated Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight">Trending Now</h2>
            <Link href="/library" className="text-primary text-sm font-bold hover:underline underline-offset-4">Full List</Link>
          </div>
          {/* Changed to 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {topRated.map((book) => (
              <RatedBookCard key={book.id || (book as any)._id} book={book} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
