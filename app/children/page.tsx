'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Star, Home, ArrowLeft } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center space-y-4">
        <div className="animate-bounce">
            <BookOpen size={64} className="text-rose-500" />
        </div>
        <p className="font-bold text-2xl text-rose-600 animate-pulse">Opening the magic box...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCF0] pb-24 font-['Outfit',sans-serif]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b-4 border-rose-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500 p-2 rounded-2xl rotate-3">
            <BookOpen className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-rose-600 tracking-tight">InkLink Kids</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search adventures..." 
              className="pl-10 rounded-full border-2 border-rose-100 focus:border-rose-400 focus:ring-0 w-64 bg-rose-50/50"
            />
          </div>
          <Link href="/home">
            <Button variant="ghost" className="rounded-full text-rose-600 hover:bg-rose-50">
              <Home size={24} />
            </Button>
          </Link>
          <div className="bg-rose-100 px-4 py-2 rounded-full flex items-center gap-2">
            <Star className="text-rose-500 fill-rose-500" size={20} />
            <span className="font-bold text-rose-700">Hi, {user?.username}!</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">Pick Your Adventure! 🎨</h2>
          <p className="text-xl text-slate-500 font-medium italic">Only the best and safest stories for you.</p>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center border-4 border-dashed border-rose-100">
             <div className="text-8xl mb-6">🔍</div>
             <h3 className="text-3xl font-bold text-slate-700 mb-2">No stories found</h3>
             <p className="text-slate-400 text-lg">Try searching for something else!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredWorks.map((work, idx) => (
              <Link href={`/book/${EditorWorksService.idOf(work)}`} key={work.id || work._id}>
                <Card className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] overflow-hidden cursor-pointer hover:-translate-y-2">
                  <div className={`aspect-[4/5] bg-gradient-to-br ${colors[idx % colors.length]} relative`}>
                    {work.coverImage ? (
                      <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30">
                        <BookOpen size={100} className="text-white" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="text-yellow-400 fill-yellow-400" size={14} />
                        <span className="text-xs font-black text-slate-700">SAFE</span>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white flex flex-col items-center text-center">
                    <h3 className="text-xl font-black text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-rose-500 transition-colors">
                      {work.title}
                    </h3>
                    <div className="flex gap-2 flex-wrap justify-center">
                       {work.tags?.slice(0, 2).map(tag => (
                         <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md">
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

      {/* Floating Action for Small Screens */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden z-50">
        <div className="bg-white shadow-2xl rounded-full p-2 flex border-2 border-rose-100 backdrop-blur-md bg-white/90">
             <Button variant="ghost" className="rounded-full h-14 w-14 text-rose-500">
                <Search size={28} />
             </Button>
             <Link href="/home">
                <Button className="rounded-full h-14 w-14 bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200">
                    <Home size={28} />
                </Button>
             </Link>
        </div>
      </div>
    </div>
  )
}
