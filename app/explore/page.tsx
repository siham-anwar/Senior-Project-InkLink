'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Star, ChevronRight, Gift, Heart, Sparkles, ArrowLeft, ArrowRight, Search, X, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/app/store/authstore'
import { EditorWorksService, WorkDto } from '@/app/services/editor-works.service'
import { cn } from '@/lib/cn'

export default function ExplorePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ name: string; books: WorkDto[] }[]>([])
  const [allBooks, setAllBooks] = useState<WorkDto[]>([])
  const [activeGenre, setActiveGenre] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 4

  // Search State (same behavior as /home)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<WorkDto[]>([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const commonCategories = ['Fiction', 'Fantasy', 'Mystery', 'Adventure', 'Romance']

  const fetchData = async () => {
    try {
      setLoading(true)

      const all = await EditorWorksService.browse()
      setAllBooks(all)

      const results = await Promise.all(
        commonCategories.map(async (cat) => {
          const books = await EditorWorksService.browse(cat)
          return { name: cat, books: books.slice(0, 4) } // Limit genre rows to 4 too for consistency
        })
      )
      setCategories(results.filter(c => c.books.length > 0))
    } catch (error) {
      console.error('Failed to fetch explore data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    if (user?.role === 'admin' || user?.email === 'admin@gmail.com') {
      router.push('/admin')
      return
    }
    fetchData()
  }, [user, router])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        setIsSearchLoading(true)
        try {
          const results = await EditorWorksService.search(searchQuery)
          setSearchResults(results)
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setIsSearchLoading(false)
        }
      } else {
        setIsSearching(false)
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = allBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(allBooks.length / booksPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    const element = document.getElementById('all-books-header')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!mounted) return null

  const BookCard = ({ book }: { book: WorkDto }) => {
    const bookId = book.id || book._id;
    return (
      <Link href={`/book/${bookId}`} className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl mb-3 bg-muted aspect-3/4 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=533&fit=crop'}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black">{book.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-muted-foreground text-[12px]">{book.authorUsername || 'InkLink Author'}</p>
      </Link>
    )
  }

  const DonateSection = () => (
    <section className="mt-20 mb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -z-10" />
      <div className="max-w-4xl mx-auto px-8 py-16 text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-6 text-primary animate-bounce">
          <Gift size={40} />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tight">Support Our Creators</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
          InkLink is built on the passion of writers. Your contribution helps ensure high-quality, safe content for the whole community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/donate" className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary-hover hover:scale-105 transition-all flex items-center gap-2">
            <Heart size={20} className="fill-current" />
            Donate Now
          </Link>
          <button className="px-10 py-4 bg-background border-2 border-border rounded-2xl font-bold text-lg hover:bg-secondary transition-all">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-background text-foreground pb-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-4">

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1 text-primary font-black uppercase tracking-widest text-sm">
            <Sparkles size={18} />
            <span>Discover your next story</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
            Explore <span className="text-primary italic">Infinity</span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
            Browse through thousands of safe, hand-picked stories categorized by the genres you love.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by book name or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border-2 border-border/50 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-background transition-all shadow-sm"
              />
              {searchQuery.length > 0 && !isSearchLoading && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
              {isSearchLoading && (
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Loader2 size={20} className="animate-spin text-primary" />
                </div>
              )}
            </div>

            {isSearching && (
              <div className="text-sm font-bold text-muted-foreground">
                {searchResults.length} result{searchResults.length === 1 ? '' : 's'}
              </div>
            )}
          </div>
        </div>

        {isSearching && (
          <section className="mb-16 animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
              <h2 className="text-3xl font-black tracking-tight">Search Results</h2>
            </div>

            {searchResults.length === 0 && !isSearchLoading ? (
              <div className="rounded-3xl border border-border bg-secondary/30 p-10 text-center">
                <p className="text-lg font-bold">No results found</p>
                <p className="text-sm text-muted-foreground mt-2">Try another title or author name.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {searchResults.slice(0, 8).map((book) => (
                  <BookCard key={book.id || (book as any)._id} book={book} />
                ))}
              </div>
            )}
          </section>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="font-bold text-muted-foreground animate-pulse">Loading categories...</p>
          </div>
        ) : (
          <div className="space-y-32">
            {/* GENRE FILTER BAR */}
            <div className="py-4 -mx-4 px-4 border-b border-border mb-8">
              <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                {['All', ...commonCategories].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setActiveGenre(genre)}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-black transition-all border shrink-0",
                      activeGenre === genre
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        : "bg-secondary/50 text-muted-foreground border-transparent hover:border-border"
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* GENRE SECTIONS (Conditional based on filter) */}
            {categories
              .filter(cat => activeGenre === 'All' || cat.name === activeGenre)
              .map((cat) => (
                <section key={cat.name} className="animate-in fade-in duration-700">
                  <div className="flex items-center justify-between mb-10 pb-4 border-b border-border/50">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic">
                      {cat.name}
                    </h2>
                    <Link
                      href={`/library?tag=${cat.name}`}
                      className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all underline underline-offset-8 decoration-2"
                    >
                      View All {cat.name} <ChevronRight size={18} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {cat.books.map((book) => (
                      <BookCard key={book.id || (book as any)._id} book={book} />
                    ))}
                  </div>
                </section>
              ))}

            {/* ALL BOOKS SECTION (Moved to final) */}
            <section id="all-books" className="animate-in fade-in slide-in-from-bottom-6 duration-700 pt-16">
              <div id="all-books-header" className="flex items-center justify-between mb-12 pb-6 border-b border-border">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black tracking-tight ">Browse All Stories</h2>
                  <p className="text-muted-foreground font-medium">Discover gems from every corner of InkLink.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border/50 text-sm font-bold">
                  <BookOpen size={16} className="text-primary" />
                  <span>{allBooks.length} Total Published</span>
                </div>
              </div>

              {/* Only one row (4 books) as requested */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {currentBooks.map((book) => (
                  <BookCard key={book.id || (book as any)._id} book={book} />
                ))}
              </div>

              {/* PREMIUM PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-20 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-border disabled:opacity-30 disabled:hover:bg-secondary transition-all font-bold"
                    >
                      <ArrowLeft size={18} /> Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 2 + i;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={cn(
                              "w-12 h-12 rounded-xl font-black transition-all duration-300",
                              currentPage === pageNum
                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-110"
                                : "bg-secondary hover:bg-border text-foreground/60"
                            )}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-border disabled:opacity-30 disabled:hover:bg-secondary transition-all font-bold"
                    >
                      Next <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </section>

            <DonateSection />
          </div>
        )}
      </main>
    </div>
  )
}
