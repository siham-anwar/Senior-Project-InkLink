'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Camera, 
  Edit2, 
  Users, 
  X, 
  BookOpen, 
  Heart, 
  Settings, 
  ChevronRight,
  LogOut,
  Shield,
  Loader2,
  Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/app/store/authstore'
import { ProfileService, ProfileData } from '@/app/services/profile.service'
import { cn } from '@/lib/cn'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  })
  const [activeTab, setActiveTab] = useState<'works' | 'about' | 'reading'>('works')
  const mainFileInputRef = useRef<HTMLInputElement>(null)
  const modalFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    if (user) {
      fetchProfile()
    } else if (mounted) {
      router.push('/auth/login')
    }
  }, [user, mounted])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await ProfileService.getProfile(user.sub || user.id)
      setProfileData(data)
      setEditForm({
        name: data.name,
        bio: data.bio || '',
        profilePicture: data.profilePicture || ''
      })
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      toast.error('Could not load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updated = await ProfileService.updateProfile(editForm)
      setProfileData(updated)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      console.error('Failed to update profile:', err)
      toast.error('Failed to update profile')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size too large (max 10MB)')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profilePicture: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (err) {
      toast.error('Logout failed')
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <button onClick={() => router.push('/home')} className="text-primary hover:underline">
            Go back home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Premium Header/Cover */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/20 via-primary/5 to-secondary/30 border-b border-border">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(t-transparent,white)]" />
        
        <div className="absolute top-4 left-4 sm:left-8 z-10">
          <Link 
            href="/home" 
            className="p-2.5 bg-background/80 backdrop-blur-md border border-border rounded-full hover:bg-background transition-all shadow-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>

        <div className="absolute top-4 right-4 sm:right-8 z-10 flex gap-2">
           <button 
            onClick={() => setIsEditing(true)}
            className="p-2.5 bg-background/80 backdrop-blur-md border border-border rounded-full hover:bg-background transition-all shadow-sm"
          >
            <Edit2 size={20} />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-background/80 backdrop-blur-md border border-border rounded-full hover:bg-red-500/10 text-red-500 transition-all shadow-sm"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Info Card */}
        <div className="relative -mt-16 sm:-mt-24 mb-8">
          <div className="flex flex-col sm:flex-row items-end gap-6 pb-6 border-b border-border">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-xl bg-secondary">
                {profileData.profilePicture ? (
                  <img src={profileData.profilePicture} alt={profileData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                    <Camera size={40} className="opacity-20" />
                  </div>
                )}
              </div>
              <input 
                type="file"
                ref={mainFileInputRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error('File size too large (max 10MB)')
                      return
                    }
                    const reader = new FileReader()
                    reader.onloadend = async () => {
                      const base64 = reader.result as string
                      try {
                        const updated = await ProfileService.updateProfile({ profilePicture: base64 })
                        setProfileData(updated)
                        setEditForm(prev => ({ ...prev, profilePicture: base64 }))
                        toast.success('Profile picture updated')
                      } catch (err) {
                        toast.error('Failed to update picture')
                      }
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={() => mainFileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={18} />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left mb-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-3xl font-bold tracking-tight">{profileData.name}</h1>
                {profileData.isCreator && <Shield size={20} className="text-primary fill-primary/10" />}
              </div>
              <p className="text-muted-foreground font-medium mb-3">@{profileData.username}</p>
              <p className="text-foreground/80 max-w-xl line-clamp-2">{profileData.bio}</p>
            </div>

            <div className="hidden lg:flex gap-4 mb-4">
              <div className="px-6 py-3 bg-card border border-border rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-bold">{profileData.followersCount}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</p>
              </div>
              <div className="px-6 py-3 bg-card border border-border rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-bold">{profileData.likes}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Likes</p>
              </div>
            </div>
          </div>

          {/* Stats Bar (Mobile/Tablet) */}
          <div className="flex lg:hidden items-center justify-around py-4 border-b border-border">
            <div className="text-center">
              <p className="font-bold">{profileData.followersCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{profileData.likes}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Likes</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{profileData.readingList?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reading</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-8">
          <aside className="hidden md:block w-64 space-y-1">
            <button 
              onClick={() => setActiveTab('works')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                activeTab === 'works' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <BookOpen size={20} />
              My Stories
            </button>
            <button 
               onClick={() => setActiveTab('about')}
               className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                activeTab === 'about' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <Users size={20} />
              About
            </button>
            <button 
               onClick={() => setActiveTab('reading')}
               className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                activeTab === 'reading' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <Heart size={20} />
              Reading List
            </button>
            
            <div className="pt-4 mt-4 border-t border-border">
               <Link 
                href="/dashboard"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary text-muted-foreground transition-all font-medium"
              >
                <div className="flex items-center gap-3">
                  <Settings size={20} />
                  Dashboard
                </div>
                <ChevronRight size={16} />
              </Link>
            </div>
          </aside>

          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'works' && (
                <motion.div 
                  key="works"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">My Published Stories</h2>
                    <Link href="/editor" className="text-primary text-sm font-semibold hover:underline">Write New</Link>
                  </div>
                  
                  {/* Empty State */}
                  <div className="p-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center bg-card/30">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <BookOpen className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
                    <p className="text-muted-foreground max-w-xs mb-6 text-sm">
                      Start your journey as an author by creating your first interactive story.
                    </p>
                    <Link href="/editor" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                      Start Writing
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div 
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <section>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                      <Users size={20} />
                      Biography
                    </h3>
                    <p className="text-foreground/80 leading-relaxed bg-card p-6 rounded-2xl border border-border">
                      {profileData.bio || "No biography provided yet. Tell the world about yourself!"}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                      <Heart size={20} />
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Interactive Fiction', 'Fantasy', 'Mystery', 'AI Stories'].map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'reading' && (
                <motion.div 
                  key="reading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-2">Reading List</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileData.readingList?.length > 0 ? (
                      profileData.readingList.map((book: any) => (
                        <Link key={book._id} href={`/book/${book._id}`} className="flex gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group">
                          <div className="w-16 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                            {book.coverImage && <img src={book.coverImage} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <h4 className="font-bold group-hover:text-primary transition-colors">{book.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{book.description}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full p-12 bg-card/30 rounded-3xl text-center border border-border border-dashed">
                        <p className="text-muted-foreground">Your reading list is empty.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-bold">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-muted-foreground">Display Name</label>
                    <input 
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-5 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-muted-foreground">Bio</label>
                    <textarea 
                      value={editForm.bio}
                      onChange={e => setEditForm({...editForm, bio: e.target.value})}
                      rows={4}
                      className="w-full px-5 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-medium"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-muted-foreground">Profile Picture</label>
                    <div className="flex items-center gap-4 p-4 bg-secondary/30 border border-border rounded-2xl">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        {editForm.profilePicture ? (
                          <img src={editForm.profilePicture} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Camera size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <input 
                          type="file"
                          ref={modalFileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          type="button"
                          onClick={() => modalFileInputRef.current?.click()}
                          className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-bold transition-all text-center"
                        >
                          Choose from device
                        </button>
                        <p className="text-[10px] text-muted-foreground">JPG, PNG or WEBP. Max 10MB.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-muted-foreground">Or Profile Picture URL</label>
                    <input 
                      type="text"
                      value={editForm.profilePicture}
                      onChange={e => setEditForm({...editForm, profilePicture: e.target.value})}
                      className="w-full px-5 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 px-6 border border-border rounded-2xl font-bold hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
