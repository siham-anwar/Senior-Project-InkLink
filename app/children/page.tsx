'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  Search, 
  Star, 
  Home, 
  ArrowLeft, 
  Shield, 
  LogOut, 
  Loader2, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditorWorksService, WorkDto } from '@/app/services/editor-works.service'
import { useAuthStore } from '@/app/store/authstore'
import { cn } from '@/lib/cn'
import { toast } from 'sonner'

export default function ChildrenPage() {
  const router = useRouter()
  const [works, setWorks] = useState<WorkDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')
  const { user, logout } = useAuthStore()

  const commonCategories = ['Fiction', 'Fantasy', 'Mystery', 'Adventure', 'Romance']

  const fetchWorks = async (tag?: string) => {
    try {
      setLoading(true)
      const data = await EditorWorksService.browse(tag === 'All' ? undefined : tag)
      setWorks(data)
    } catch (error) {
      console.error('Failed to fetch children works:', error)
      toast.error('Could not load magic stories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks(activeGenre)
  }, [activeGenre])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
      toast.success('See you soon!')
    } catch (err) {
      toast.error('Logout failed')
    }
  }

  const filteredWorks = works.filter(w => 
    w.title.toLowerCase().includes(search.toLowerCase())
  )

  const colors = [
    'from-pink-400 to-rose-500', 
    'from-sky-400 to-blue-500', 
    'from-amber-400 to-orange-500', 
    'from-emerald-400 to-teal-500',
    'from-violet-400 to-purple-500'
  ]

  const floatingEmojis = ['🌈', '✨', '🎈', '🎨', '📚', '🚀', '🦒', '🧸']

  if (loading && works.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center space-y-4 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-4 gap-20 p-10 transform -rotate-12 scale-150">
                {Array.from({length: 40}).map((_, i) => (
                    <div key={i} className="text-4xl opacity-20 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                        {floatingEmojis[i % floatingEmojis.length]}
                    </div>
                ))}
            </div>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="z-10"
        >
            <BookOpen size={80} className="text-primary drop-shadow-lg" />
        </motion.div>
        <p className="font-black text-3xl text-primary animate-pulse z-10">Opening Magic Box...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCF0] pb-24 font-['Outfit',sans-serif] relative overflow-hidden">
      {/* Playful background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-3xl -z-10" />
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-8 border-primary/10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/home')}>
          <div className="bg-primary p-2.5 rounded-[1.2rem] rotate-3 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
            <BookOpen className="text-primary-foreground" size={28} />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic hidden sm:block">InkLink Kids</h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden lg:flex relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a story!" 
              className="pl-10 h-12 rounded-[1.5rem] border-4 border-primary/5 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 w-64 bg-white font-bold text-base"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <div className="bg-primary/5 text-primary px-4 py-2 rounded-2xl flex items-center gap-2 hover:bg-primary/10 transition-colors border-2 border-primary/10 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'K'}
                </div>
                <span className="font-bold hidden md:inline">Profile</span>
              </div>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors border-2 border-red-100 flex items-center justify-center"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        <div className="mb-12 text-center md:text-left relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm mb-4"
          >
            <Sparkles size={18} />
            <span>Discover your next adventure</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-none tracking-tighter"
          >
            Pick Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 italic">Magic!</span> 🎨
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-xl text-slate-500 font-bold max-w-2xl"
          >
            Jump into worlds full of magic, animals, and brave heroes! All pre-checked and super safe. 🛡️
          </motion.p>
        </div>

        {/* GENRE FILTER BAR */}
        <div className="sticky top-28 z-30 bg-transparent py-4 mb-10">
           <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
              {['All', ...commonCategories].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={cn(
                    "px-6 py-3 rounded-[1.5rem] text-sm font-black transition-all border-4 shrink-0 shadow-sm",
                    activeGenre === genre 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white text-slate-500 border-primary/5 hover:border-primary/20 hover:text-primary"
                  )}
                >
                  {genre}
                </button>
              ))}
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={48} />
              <p className="font-black text-slate-400 animate-pulse">Finding stories...</p>
           </div>
        ) : filteredWorks.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[4rem] p-24 text-center border-8 border-dashed border-primary/10 overflow-hidden relative shadow-inner"
          >
             <div className="text-9xl mb-8 animate-bounce">🔍</div>
             <h3 className="text-4xl font-black text-slate-800 mb-2 uppercase italic">Not Found!</h3>
             <p className="text-slate-500 text-2xl font-bold">The magic box is empty. Try another genre or word!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredWorks.map((work, idx) => (
              <motion.div
                key={work.id || work._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/book/${EditorWorksService.idOf(work)}`} className="group block h-full">
                  <Card className="border-none shadow-2xl hover:shadow-[0_20px_50px_rgba(255,100,100,0.3)] transition-all duration-500 rounded-[3rem] overflow-hidden cursor-pointer hover:-translate-y-4 bg-white h-full flex flex-col">
                    <div className={`aspect-[4/5] bg-gradient-to-br ${colors[idx % colors.length]} relative overflow-hidden flex-shrink-0`}>
                      {work.coverImage ? (
                        <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:scale-125 transition-transform duration-500">
                          <BookOpen size={100} className="text-white drop-shadow-md" />
                        </div>
                      )}
                      
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border-2 border-primary/10">
                          <Shield className="text-primary" size={18} />
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Safe Content</span>
                      </div>
                    </div>
                    <CardContent className="p-8 bg-white flex flex-col items-center text-center flex-grow">
                      <h3 className="text-2xl font-black text-slate-900 line-clamp-2 leading-[1.1] mb-4 group-hover:text-primary transition-colors uppercase italic tracking-tighter">
                        {work.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap justify-center mt-auto">
                        {work.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-xl border-2 border-primary/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating emojis in background */}
      <div className="fixed top-20 right-10 -z-10 text-6xl opacity-10 animate-pulse delay-700">🎈</div>
      <div className="fixed bottom-20 left-10 -z-10 text-6xl opacity-10 animate-bounce">🦄</div>

      {/* Floating Action for Small Screens */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden z-50">
        <div className="bg-white/90 shadow-[0_10px_40px_rgba(139,0,0,0.3)] rounded-[2.5rem] p-2 flex gap-2 border-4 border-primary/10 backdrop-blur-xl">
             <Link href="/profile">
               <Button className="rounded-[1.5rem] h-14 w-14 bg-primary p-0 shadow-lg shadow-primary/20">
                  <Star size={24} className="fill-white" />
               </Button>
             </Link>
             <Link href="/home">
                <Button className="rounded-[1.5rem] h-14 px-8 bg-slate-900 hover:bg-slate-800 shadow-lg font-black text-lg uppercase tracking-tighter text-white">
                   Explore All
                </Button>
             </Link>
        </div>
      </div>
    </div>
  )
}
