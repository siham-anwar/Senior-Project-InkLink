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
      <Link href={`/book/${bookId}`} className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-xl mb-3 bg-muted aspect-[3/4] shadow-sm transition-all group-hover:shadow-md">
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop'}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-border/50">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-foreground">4.9</span>
          </div>
        </div>
        <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-muted-foreground text-xs mt-1">{book.authorUsername || 'InkLink Author'}</p>
      </Link>
    )
  }

  const ContinueReadingCard = ({ book }: { book: any }) => (
    <Link href={`/book/${book.id}`} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl mb-3 bg-muted aspect-[3/4] shadow-sm transition-all group-hover:shadow-md">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute bottom-3 left-3 right-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black text-white drop-shadow-md">
               <span className="bg-primary/90 px-2 py-0.5 rounded-sm uppercase tracking-tighter">In Progress</span>
               <span>{book.progress}%</span>
            </div>
            <div className="w-full bg-white/20 backdrop-blur-md rounded-full h-1.5 p-[1px] border border-white/10">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000"
                style={{ width: `${book.progress}%` }}
              />
            </div>
        </div>
      </div>
      <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
      <p className="text-muted-foreground text-xs mt-1">{book.author}</p>
    </Link>
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Dynamic Sub-header */}
      <div className="bg-secondary/30 border-b border-border/50 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <p className="text-sm font-medium opacity-70">Dashboard for <span className="text-primary font-bold">@{usernameDisplay}</span></p>
            <div className="hidden sm:flex items-center gap-4 text-xs font-bold uppercase tracking-wider opacity-60">
               <span>Reading List</span>
               <span className="h-1 w-1 rounded-full bg-border" />
               <span>Writing Drafts</span>
               <span className="h-1 w-1 rounded-full bg-border" />
               <span>Settings</span>
            </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Personalized Welcome */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Feed your <span className="text-primary italic">imagination</span>.
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl">
             You currently have <span className="text-foreground font-bold">{continueReading.length} stories</span> in your queue.
          </p>
        </div>

        {/* Roles Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {user?.role === 'child' && (
            <Link href="/children" className="group p-8 rounded-3xl bg-gradient-to-br from-rose-400 to-orange-400 text-white shadow-xl shadow-rose-500/10 transition-transform active:scale-95">
               <div className="flex items-center justify-between font-black">
                  <div>
                     <p className="text-xs opacity-80 uppercase tracking-widest mb-1">Authenticated Magic</p>
                     <p className="text-3xl">Go to Kids Mode</p>
                  </div>
                  <span className="text-5xl">🎨</span>
               </div>
            </Link>
          )}

          {user?.role === 'parent' && (
            <Link href="/dashboard/parent" className="group p-8 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/10 transition-transform active:scale-95">
               <div className="flex items-center justify-between font-bold">
                  <div>
                     <p className="text-xs opacity-80 uppercase tracking-widest mb-1">Administrative Access</p>
                     <p className="text-3xl">Safety Dashboard</p>
                  </div>
                  <Shield size={48} className="opacity-80" />
               </div>
            </Link>
          )}
        </div>

        {/* My Reading Section (4-Column Grid) */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-1">
               <h2 className="text-3xl font-black">My Reading</h2>
               <p className="text-sm text-muted-foreground">Stories you are still exploring.</p>
            </div>
            <Link href="/library" className="text-primary text-sm font-bold hover:underline mb-1">Browse All</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {continueReading.length > 0 ? (
              continueReading.map((book) => (
                <ContinueReadingCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-secondary/20">
                 <p className="text-muted-foreground font-medium">Your reading list is empty.</p>
                 <Link href="/explore" className="text-primary text-sm font-bold mt-2">Find a story</Link>
              </div>
            )}
          </div>
        </section>

        {/* Top Picks Section (Grid) */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8 px-1">
            <h2 className="text-3xl font-black tracking-tight">Top Picks for You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {topPicks.map((book) => (
              <BookCard key={book.id || (book as any)._id} book={book} />
            ))}
          </div>
        </section>

        {/* Top Rated Section (Improved) */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8 px-1">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Highest Quality</h2>
              <h3 className="text-3xl font-black">Top Rated</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {topRated.map((book) => (
              <RatedBookCard key={book.id || (book as any)._id} book={book} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
