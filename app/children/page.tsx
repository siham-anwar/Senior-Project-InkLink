'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Star, Home, ArrowLeft, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditorWorksService, WorkDto } from '@/app/services/editor-works.service'
import { useAuthStore } from '@/app/store/authstore'

export default function ChildrenPage() {
  const [works, setWorks] = useState<WorkDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const data = await EditorWorksService.browse()
        setWorks(data)
      } catch (error) {
        console.error('Failed to fetch children works:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWorks()
  }, [])

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

  if (loading) {
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
        <div className="animate-bounce z-10">
            <BookOpen size={80} className="text-primary drop-shadow-lg" />
        </div>
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
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-8 border-primary/10 px-6 py-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-primary p-3 rounded-[1.5rem] rotate-3 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
            <BookOpen className="text-primary-foreground" size={32} />
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">InkLink Kids</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={24} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a story!" 
              className="pl-12 h-14 rounded-[2rem] border-4 border-primary/5 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 w-80 bg-white font-bold text-lg"
            />
          </div>
          <Link href="/home">
            <Button variant="ghost" className="rounded-2xl text-primary hover:bg-primary/5 h-14 w-14 p-0">
              <Home size={32} />
            </Button>
          </Link>
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-[1.5rem] flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <div className="bg-white/20 p-1 rounded-full">
                <Star className="text-white fill-white" size={20} />
            </div>
            <span className="font-black text-lg">Hi, {user?.username}!</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-14 relative">
        <div className="mb-16 text-center md:text-left relative">
          <div className="absolute -top-10 -left-6 text-6xl opacity-20 pointer-events-none">✨</div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-none">
            Pick Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Adventure!</span> 🎨
          </h2>
          <p className="text-2xl text-slate-500 font-bold max-w-2xl">
            Jump into worlds full of magic, animals, and brave heroes! All pre-checked by your parents. 🛡️
          </p>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-24 text-center border-8 border-dashed border-primary/10 overflow-hidden relative shadow-inner">
             <div className="text-9xl mb-8 animate-bounce">🔍</div>
             <h3 className="text-4xl font-black text-slate-800 mb-2 uppercase">Uh oh!</h3>
             <p className="text-slate-500 text-2xl font-bold">The magic box is empty. Try another keyword!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredWorks.map((work, idx) => (
              <Link href={`/book/${EditorWorksService.idOf(work)}`} key={work.id || work._id} className="group">
                <Card className="border-none shadow-2xl hover:shadow-[0_20px_50px_rgba(255,100,100,0.3)] transition-all duration-500 rounded-[3rem] overflow-hidden cursor-pointer hover:-translate-y-4 bg-white">
                  <div className={`aspect-[4/5] bg-gradient-to-br ${colors[idx % colors.length]} relative overflow-hidden`}>
                    {work.coverImage ? (
                      <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:scale-125 transition-transform duration-500">
                        <BookOpen size={120} className="text-white drop-shadow-md" />
                      </div>
                    )}
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                        <Shield className="text-primary" size={18} />
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Super Safe</span>
                    </div>
                  </div>
                  <CardContent className="p-8 bg-white flex flex-col items-center text-center">
                    <h3 className="text-2xl font-black text-slate-900 line-clamp-2 leading-[1.1] mb-4 group-hover:text-primary transition-colors uppercase">
                      {work.title}
                    </h3>
                    <div className="flex gap-2 flex-wrap justify-center">
                       {work.tags?.slice(0, 2).map(tag => (
                         <span key={tag} className="text-[12px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-xl border-2 border-primary/10">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Floating emojis in background */}
      <div className="fixed top-20 right-10 -z-10 text-6xl opacity-10 animate-pulse delay-700">🎈</div>
      <div className="fixed bottom-20 left-10 -z-10 text-6xl opacity-10 animate-bounce">🦄</div>

      {/* Floating Action for Small Screens */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 md:hidden z-50">
        <div className="bg-white/90 shadow-[0_10px_40px_rgba(139,0,0,0.3)] rounded-[2.5rem] p-3 flex gap-4 border-4 border-primary/10 backdrop-blur-xl">
             <Button variant="ghost" className="rounded-2xl h-16 w-16 text-primary hover:bg-primary/5 transition-colors">
                <Search size={32} />
             </Button>
             <Link href="/home">
                <Button className="rounded-[1.5rem] h-16 px-10 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 font-black text-xl uppercase tracking-tighter text-white">
                   Home
                </Button>
             </Link>
        </div>
      </div>
    </div>
  )
}
