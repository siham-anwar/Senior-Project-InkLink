'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  ArrowLeft, 
  BookOpen, 
  MessageSquare, 
  LayoutDashboard, 
  DollarSign, 
  Heart, 
  MessageCircle, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  Clock,
  Eye,
  Pencil,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileEdit,
  Loader2,
  Gift
} from 'lucide-react'
import { useWorksStore } from '@/app/store/worksStore'
import { useAuthStore } from '@/app/store/authstore'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { EditorChaptersService, ChapterDto } from '@/app/services/editor-chapters.service'
import { useRef } from 'react'
import { WalletService, WalletDto, TransactionDto } from '@/app/services/wallet.service'

import { useChatStore } from '@/app/store/chatStore'
import { collaborationService } from '@/app/services/collaboration.service'
import { PostsService, PostDto } from '@/app/services/posts.service'

type TabType = 'works' | 'posts' | 'dm' | 'earnings'

function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
    case 'approved':
      return <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md"><CheckCircle2 size={14}/> Published</span>
    case 'pending_moderation':
    case 'needs_admin_review':
      return <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md"><AlertCircle size={14}/> Pending Approval</span>
    case 'rejected':
      return <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md"><XCircle size={14}/> Rejected</span>
    default:
      return <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md"><FileEdit size={14}/> Draft</span>
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { works, fetchWorks, isLoading, deleteWork } = useWorksStore()
  const { user } = useAuthStore()
  const [sharedWorks, setSharedWorks] = useState<any[]>([])
  const [isSharedLoading, setIsSharedLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('works')
  const [mounted, setMounted] = useState(false)

  // Reader Modal State
  const [readingWork, setReadingWork] = useState<any | null>(null)
  const [readingChapters, setReadingChapters] = useState<ChapterDto[]>([])
  const [isReadingLoading, setIsReadingLoading] = useState(false)

  // Wallet State
  const [wallet, setWallet] = useState<WalletDto | null>(null)
  const [transactions, setTransactions] = useState<TransactionDto[]>([])
  const [isWalletLoading, setIsWalletLoading] = useState(false)
  // Chat Store
  const { 
    conversations, 
    activeConversation, 
    messages, 
    fetchConversations, 
    setActiveConversation, 
    sendMessage, 
    initSocket, 
    closeSocket 
  } = useChatStore()

  // Posts State
  const [posts, setPosts] = useState<PostDto[]>([])
  const [isPostsLoading, setIsPostsLoading] = useState(false)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)

  const fetchPosts = useCallback(async () => {
    if (!user) return
    setIsPostsLoading(true)
    try {
      const userId = user.sub || user.id || user._id
      if (!userId) return
      const data = await PostsService.listByAuthor(userId)
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsPostsLoading(false)
    }
  }, [user])

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return
    setIsCreatingPost(true)
    try {
      await PostsService.create(newPostContent)
      setNewPostContent('')
      setIsCreatePostOpen(false)
      toast.success('Post published and followers notified!')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to publish post')
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      await PostsService.delete(postId)
      toast.success('Post deleted')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }
  
  const handleReadWork = async (work: any) => {
    setReadingWork(work)
    setIsReadingLoading(true)
    try {
      const workId = work.id || work._id
      const chapters = await EditorChaptersService.listByWork(workId)
      setReadingChapters(chapters)
    } catch (error) {
      toast.error('Failed to load chapters')
    } finally {
      setIsReadingLoading(false)
    }
  }

  const handleDeleteWork = async (work: any) => {
    const workId = work.id || work._id
    if (!confirm(`Are you sure you want to delete "${work.title}"? This action cannot be undone.`)) return
    try {
      await deleteWork(workId)
      toast.success(`"${work.title}" has been deleted`)
    } catch (error) {
      toast.error('Failed to delete work')
    }
  }
  
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMounted(true)
    if (user?.role === 'admin' || user?.email === 'admin@gmail.com') {
      router.push('/admin')
      return
    }
    fetchWorks()
    
    // Check if we have a roomId in URL to auto-select conversation
    const searchParams = new URLSearchParams(window.location.search)
    const roomId = searchParams.get('roomId')
    const tab = searchParams.get('tab')
    
    if (tab === 'dm') setActiveTab('dm')

    fetchConversations().then(() => {
       if (roomId) {
          const conv = useChatStore.getState().conversations.find(c => (c._id || c.id) === roomId)
          if (conv) setActiveConversation(conv)
       }
    })

    // Fetch Wallet & Transactions
    setIsWalletLoading(true)
    Promise.all([
      WalletService.getWallet().then(setWallet),
      WalletService.getTransactions().then(setTransactions)
    ]).catch(err => {
      console.error('Failed to fetch wallet data:', err)
    }).finally(() => setIsWalletLoading(false))

    // Init socket if user is logged in
    initSocket('')


    // Fetch Shared Works
    setIsSharedLoading(true)
    collaborationService.getSharedWorks()
      .then(setSharedWorks)
      .catch(err => console.error('Failed to fetch shared works:', err))
      .finally(() => setIsSharedLoading(false))

    if (activeTab === 'posts') fetchPosts()

    return () => {
       closeSocket()
    }
  }, [fetchWorks, fetchConversations, initSocket, closeSocket, activeTab, fetchPosts])

  if (!mounted) return null

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'works', label: 'Works', icon: BookOpen },
    { id: 'posts', label: 'Posts', icon: LayoutDashboard },
    { id: 'dm', label: 'DM', icon: MessageSquare },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/profile" 
            className="inline-flex items-center text-sm font-medium text-primary hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Author Dashboard</h1>
            <div className="flex items-center gap-3">
               <Link href="/editor" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                 <Plus size={20} />
                 New Work
               </Link>
            </div>
          </div>

          {/* Tab Switcher */}
          <nav className="flex gap-8 mt-8 border-b border-border overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'works' && (
            <motion.div
              key="works"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Published Chapters</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <TrendingUp size={16} className="text-green-500" />
                  +12% views this week
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {works.length > 0 ? (
                    works.map((work: any) => (
                    <div key={work.id || work._id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
                        {/* Card Header & Cover */}
                        <div className="relative h-48 bg-muted overflow-hidden">
                          {work.coverImage ? (
                            <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 text-primary/40 group-hover:scale-105 transition-transform duration-500">
                              <BookOpen size={48} className="mb-2" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            {getStatusBadge(work.status)}
                          </div>
                          {/* Delete button on hover */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteWork(work) }}
                            className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            title="Delete work"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1" title={work.title}>
                            {work.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-4">
                            <span>{new Date(work.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{work.chaptersMeta?.length || 0} Chapters</span>
                          </div>

                          <div className="flex items-center justify-between text-muted-foreground mt-auto mb-6 bg-muted px-4 py-3 rounded-2xl">
                            <div className="flex flex-col items-center" title="Readers">
                              <Eye size={18} className="text-purple-500 mb-1" />
                              <span className="text-xs font-bold text-gray-600">{work.viewsCount || 0}</span>
                            </div>
                            <div className="w-px h-8 bg-border"></div>
                            <div className="flex flex-col items-center" title="Likes">
                              <Heart size={18} className="text-red-500 mb-1" />
                              <span className="text-xs font-bold text-gray-600">{work.likesCount || 0}</span>
                            </div>
                            <div className="w-px h-8 bg-border"></div>
                            <div className="flex flex-col items-center" title="Comments">
                              <MessageCircle size={18} className="text-blue-500 mb-1" />
                              <span className="text-xs font-bold text-foreground/70">{work.commentsCount || 0}</span>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="grid grid-cols-3 gap-2 mt-auto">
                            <button 
                              onClick={() => handleReadWork(work)}
                              className="w-full py-2.5 bg-muted text-foreground/80 hover:bg-muted/80 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-sm"
                            >
                              <BookOpen size={14} /> Read
                            </button>
                            <Link 
                              href={`/editor?id=${work.id || work._id}`}
                              className="w-full py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-sm"
                            >
                              <Pencil size={14} /> Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteWork(work)}
                              className="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-sm"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-muted rounded-3xl border border-dashed border-gray-200">
                      <BookOpen size={48} className="mx-auto text-muted-foreground/60 mb-4" />
                      <h3 className="text-lg font-bold text-muted-foreground">No works found</h3>
                      <p className="text-muted-foreground/80">Start your journey by creating your first story.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Shared Works Section */}
              <div className="space-y-8 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                     <Heart size={20} className="text-primary" />
                     Shared with You
                  </h2>
                  <div className="text-sm text-muted-foreground/80 font-medium italic">
                     Collaborative projects
                  </div>
                </div>

                {isSharedLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2].map(i => (
                      <div key={i} className="h-64 bg-muted animate-pulse rounded-3xl" />
                    ))}
                  </div>
                ) : sharedWorks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sharedWorks.map((work: any) => (
                      <div key={work.id || work._id} className="bg-card border-2 border-primary/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group relative">
                        <div className="absolute top-4 right-4 z-10 bg-primary text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-lg">
                           Collaborator
                        </div>
                        
                        {/* Card Header & Cover */}
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          {work.coverImage ? (
                            <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 text-primary/40 group-hover:scale-105 transition-transform duration-500">
                              <BookOpen size={48} className="mb-2" />
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-foreground/90 mb-1 line-clamp-1">
                            {work.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-4">
                            <span>By <span className="text-primary font-bold">@{work.authorId?.username}</span></span>
                            <span>•</span>
                            <span>Shared Story</span>
                          </div>

                          {/* Card Actions */}
                          <div className="grid grid-cols-2 gap-3 mt-auto">
                            <button 
                              onClick={() => handleReadWork(work)}
                              className="w-full py-2.5 bg-muted text-foreground/80 hover:bg-gray-100 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                              <BookOpen size={16} /> Read
                            </button>
                            <Link 
                              href={`/editor?id=${work.id || work._id}`}
                              className="w-full py-2.5 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                              <Pencil size={16} /> Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/50 rounded-3xl border-2 border-dashed border-border">
                    <p className="text-muted-foreground/80 font-medium italic">No shared stories yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (
             <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Posts</h2>
                <button 
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2"
                >
                  <Plus size={18} />
                  New Post
                </button>
              </div>

              {isPostsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <div key={post._id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative">
                        <button 
                          onClick={() => handleDeletePost(post._id)}
                          className="absolute top-4 right-4 p-2 text-muted-foreground/60 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                        <p className="text-foreground/80 leading-relaxed mb-4 pr-8">{post.content}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                           <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium uppercase tracking-wider">
                              <Clock size={14} />
                              Posted on {new Date(post.createdAt).toLocaleDateString()}
                           </div>
                           <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-sm">
                              <Heart size={16} className={cn(post.likesCount > 0 ? "text-red-500" : "text-muted-foreground/60")} />
                              {post.likesCount} likes
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-muted rounded-3xl border border-dashed border-gray-200">
                      <LayoutDashboard size={48} className="mx-auto text-muted-foreground/60 mb-4" />
                      <h3 className="text-lg font-bold text-muted-foreground">No posts yet</h3>
                      <p className="text-muted-foreground/80">Share updates or writing tips with your followers.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h2 className="text-xl font-bold">Earnings Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <p className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-2">AD Revenue</p>
                      <h3 className="text-3xl font-black text-foreground mb-4">{wallet?.adRevenue || 0} ETB</h3>
                      <p className="text-sm text-muted-foreground font-medium">From ad impressions and clicks</p>
                   </div>
                   <div className="absolute top-6 right-6 p-3 bg-muted rounded-2xl shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                      <DollarSign size={24} />
                   </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <p className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-2">Premium Chapters</p>
                      <h3 className="text-3xl font-black text-foreground mb-4">{wallet?.premiumRevenue || 0} ETB</h3>
                      <p className="text-sm text-muted-foreground font-medium">From paid chapter access</p>
                   </div>
                   <div className="absolute top-6 right-6 p-3 bg-muted rounded-2xl shadow-sm text-purple-500 group-hover:scale-110 transition-transform">
                      <DollarSign size={24} />
                   </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <p className="text-sm font-bold text-green-500 uppercase tracking-wider mb-2">Donations</p>
                      <h3 className="text-3xl font-black text-foreground mb-4">{wallet?.donationRevenue || 0} ETB</h3>
                      <p className="text-sm text-muted-foreground font-medium">From reader donations</p>
                   </div>
                   <div className="absolute top-6 right-6 p-3 bg-muted rounded-2xl shadow-sm text-green-500 group-hover:scale-110 transition-transform">
                      <DollarSign size={24} />
                   </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-8 mt-12">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold">Recent Transactions</h3>
                    <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                       View All <ChevronRight size={14} />
                    </button>
                 </div>
                 <div className="space-y-6">
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <div key={tx._id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/80">
                                 {tx.type === 'donation' ? <Gift size={20} /> : <DollarSign size={20} />}
                              </div>
                              <div>
                                 <p className="font-bold">{tx.description}</p>
                                 <p className="text-xs text-muted-foreground/80">{new Date(tx.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <p className={cn("font-black", tx.amount > 0 ? "text-green-500" : "text-red-500")}>
                             {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} ETB
                           </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground/80">
                        No transactions found
                      </div>
                    )}
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'dm' && (
            <motion.div
              key="dm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex h-[calc(100vh-250px)] bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm"
            >
              {/* Conversations List */}
              <div className="w-full md:w-80 border-r border-border flex flex-col">
                <div className="p-6 border-b border-gray-50 bg-muted/30">
                  <h2 className="text-xl font-bold">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground/80">
                      <p className="text-sm">No conversations yet</p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <button
                        key={conv._id || conv.id}
                        onClick={() => setActiveConversation(conv)}
                        className={cn(
                          "w-full p-4 flex gap-3 hover:bg-muted transition-all text-left border-b border-gray-50",
                          activeConversation?._id === conv._id ? "bg-primary/5 border-l-4 border-l-primary" : ""
                        )}
                      >
                        <div className="w-12 h-12 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center font-bold text-primary overflow-hidden">
                           {conv.otherParticipantAvatar ? (
                             <img src={conv.otherParticipantAvatar} alt={conv.otherParticipantName} className="w-full h-full object-cover" />
                           ) : (
                             conv.otherParticipantName?.[0] || conv.title?.[0] || 'U'
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-sm truncate">{conv.otherParticipantName || conv.title || 'Direct Chat'}</h4>
                            <span className="text-[10px] text-muted-foreground/80">
                              {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Window */}
              <div className="hidden md:flex flex-1 flex-col">
                {activeConversation ? (
                  <>
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-card sticky top-0 z-10">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary overflow-hidden">
                             {activeConversation.otherParticipantAvatar ? (
                               <img src={activeConversation.otherParticipantAvatar} alt={activeConversation.otherParticipantName} className="w-full h-full object-cover" />
                             ) : (
                               activeConversation.otherParticipantName?.[0] || activeConversation.title?.[0] || 'U'
                             )}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{activeConversation.otherParticipantName || activeConversation.title || 'Direct Chat'}</h3>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30">
                       {messages.map((msg, i) => {
                         const isMe = msg.userId === (user?.sub || user?.id)
                         return (
                           <div key={msg._id || i} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                              <div className={cn(
                                "max-w-[70%] p-4 rounded-2xl text-sm shadow-sm",
                                isMe ? "bg-primary text-white rounded-tr-none" : "bg-card text-gray-800 rounded-tl-none border border-border"
                              )}>
                                 {msg.content}
                                 <p className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-right" : "text-left")}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </p>
                              </div>
                           </div>
                         )
                       })}
                       <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-50 bg-card">
                       <form 
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (newMessage.trim()) {
                            sendMessage(newMessage)
                            setNewMessage('')
                          }
                        }}
                        className="flex gap-2"
                       >
                          <input 
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-muted border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                          <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                          >
                             <ArrowLeft className="rotate-180" size={20} />
                          </button>
                       </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/30">
                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6">
                      <MessageSquare size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground/80 max-w-xs">
                      Pick a reader or author from the list to start chatting.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Read Chapter Modal */}
        <Dialog open={!!readingWork} onOpenChange={(open) => !open && setReadingWork(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
            <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
              <DialogTitle className="text-2xl font-bold">{readingWork?.title}</DialogTitle>
              <DialogDescription>
                Preview mode for your story
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 p-6 bg-muted/50">
              {isReadingLoading ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground/80 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p>Loading chapters...</p>
                </div>
              ) : readingChapters.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen size={48} className="mx-auto text-muted-foreground/60 mb-4" />
                  <p>No chapters available to read yet.</p>
                </div>
              ) : (
                <div className="space-y-12 max-w-2xl mx-auto pb-12">
                  {readingChapters.map((chapter: ChapterDto, index: number) => (
                    <div key={chapter.id || index} className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                      <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-border">
                        {chapter.title}
                      </h2>
                      <div 
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: chapter.contentText || '<p className="text-muted-foreground/80 italic">Empty chapter...</p>' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Post Modal */}
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogContent className="max-w-md bg-card rounded-3xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create an Update</DialogTitle>
              <DialogDescription>
                Share what's happening with your followers. They'll be notified immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-6">
               <textarea
                 value={newPostContent}
                 onChange={(e) => setNewPostContent(e.target.value)}
                 placeholder="What's on your mind? (max 1000 characters)"
                 className="w-full h-40 bg-muted border border-border rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                 maxLength={1000}
               />
               <div className="flex gap-3">
                  <button 
                    onClick={() => setIsCreatePostOpen(false)}
                    className="flex-1 py-3 bg-muted text-muted-foreground rounded-xl font-bold hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || isCreatingPost}
                    className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreatingPost ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    Publish Post
                  </button>
               </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

