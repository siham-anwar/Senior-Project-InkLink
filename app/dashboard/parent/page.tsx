'use client'

import { useState, useEffect } from 'react'
import { Plus, User, Trash2, Shield, Baby, Key, Mail, BookOpen, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { libraryService, Library } from '@/app/services/library.service'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AuthService } from '@/app/services/auth.service'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ParentDashboard() {
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newChild, setNewChild] = useState({ username: '', password: '', email: '' })
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [childActivity, setChildActivity] = useState<Library | null>(null)
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const [isActivityLoading, setIsActivityLoading] = useState(false)

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      const data = await AuthService.getChildren()
      setChildren(data)
    } catch (error) {
      toast.error('Failed to load child accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChild = async () => {
    if (!newChild.username || !newChild.password) {
      toast.error('Username and password are required')
      return
    }

    try {
      await AuthService.createChild(newChild)
      toast.success('Child account created successfully')
      setIsDialogOpen(false)
      setNewChild({ username: '', password: '', email: '' })
      fetchChildren()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create child account')
    }
  }

  const handleRemoveChild = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this child account?')) return

    try {
      await AuthService.removeChild(id)
      toast.success('Child account removed')
      fetchChildren()
    } catch (error) {
      toast.error('Failed to remove child account')
    }
  }

  const handleViewActivity = async (child: any) => {
    setSelectedChild(child)
    setIsActivityOpen(true)
    setIsActivityLoading(true)
    try {
      const activity = await libraryService.getChildLibrary(child._id)
      setChildActivity(activity)
    } catch (error) {
      toast.error('Failed to load activity')
      setIsActivityOpen(false)
    } finally {
      setIsActivityLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary p-2 rounded-lg">
                    <Shield className="text-primary-foreground" size={24} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  Parent Control
                </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Manage your children's accounts and safety settings.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary-hover text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-5 w-5" />
                Add Child Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Child Account</DialogTitle>
                <DialogDescription>
                  Create a secure account for your child. They will only see child-safe content.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={newChild.username}
                    onChange={(e) => setNewChild({...newChild, username: e.target.value})}
                    placeholder="child_explorer" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newChild.password}
                    onChange={(e) => setNewChild({...newChild, password: e.target.value})}
                    placeholder="••••••••" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input 
                    id="email" 
                    value={newChild.email}
                    onChange={(e) => setNewChild({...newChild, email: e.target.value})}
                    placeholder="child@example.com" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateChild} className="bg-primary hover:bg-primary-hover text-primary-foreground">Create Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2].map(i => <div key={i} className="h-64 rounded-3xl bg-card animate-pulse shadow-sm border border-border" />)
          ) : children.length === 0 ? (
            <Card className="col-span-full py-16 flex flex-col items-center border-dashed border-2 bg-card/50">
                <Baby className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold text-foreground">No child accounts yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding an account for your child.</p>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Add your first child</Button>
            </Card>
          ) : (
            children.map((child) => (
              <Card key={child._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl bg-card">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-muted p-3 rounded-2xl">
                      <Baby className="text-muted-foreground" size={24} />
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveChild(child._id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                  <CardTitle className="mt-4 text-2xl font-bold text-foreground">@{child.username}</CardTitle>
                  <CardDescription>Created on {new Date(child.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail size={18} className="text-muted-foreground/50" />
                    <span className="text-sm">{child.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Key size={18} className="text-muted-foreground/50" />
                    <span className="text-sm italic">Role: Child (Restricted)</span>
                  </div>
                  
                  <div className="pt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl text-xs h-9 border-border"
                      onClick={() => handleViewActivity(child)}
                    >
                      View Activity
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl text-xs h-9 border-border">
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Activity Dialog */}
        <Dialog open={isActivityOpen} onOpenChange={setIsActivityOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="text-primary" />
                Activity for @{selectedChild?.username}
              </DialogTitle>
              <DialogDescription>
                Review the books and progress of your child.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              {isActivityLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-muted-foreground font-medium">Loading activity...</p>
                </div>
              ) : childActivity && (childActivity.currentlyReading.length > 0 || childActivity.bookmarked.length > 0) ? (
                <div className="space-y-8">
                  {childActivity.currentlyReading.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <Clock size={18} className="text-primary" />
                        Currently Reading
                      </h4>
                      <div className="grid gap-4">
                        {childActivity.currentlyReading.map((item) => (
                          <div key={item.workId._id} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img 
                                src={item.workId.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=130&fit=crop'} 
                                alt={item.workId.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold truncate">{item.workId.title}</h5>
                              <p className="text-xs text-muted-foreground mb-3">by {item.workId.authorId.username}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-500" 
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-black text-primary">{item.progress}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {childActivity.bookmarked.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <BookOpen size={18} className="text-primary" />
                        Bookmarked
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {childActivity.bookmarked.map((work) => (
                          <div key={work._id} className="p-3 rounded-2xl bg-muted/30 border border-border/50 flex flex-col items-center text-center">
                             <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-muted">
                                <img 
                                  src={work.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&h=200&fit=crop'} 
                                  alt={work.title}
                                  className="w-full h-full object-cover"
                                />
                             </div>
                             <h5 className="font-bold text-sm line-clamp-1">{work.title}</h5>
                             <p className="text-[10px] text-muted-foreground">by {work.authorId.username}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 px-6 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="font-bold text-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">This child hasn't started reading any stories yet.</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsActivityOpen(false)} className="rounded-xl">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Info Section */}
        <div className="mt-16 bg-primary/10 rounded-[2.5rem] p-10 relative overflow-hidden border border-primary/20">
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-primary">
                    <Shield className="text-primary" />
                    Safe Browsing Active
                </h2>
                <p className="text-foreground/70 text-lg leading-relaxed">
                    Child accounts are automatically restricted to content flagged as "Child Safe" by our moderation AI. 
                    They cannot access adult-only stories, modify their own permissions, or bypass these restrictions. 
                </p>
                <div className="mt-8 flex gap-4">
                    <div className="bg-primary/5 backdrop-blur-sm p-4 rounded-2xl border border-primary/10">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">AI Moderated</p>
                        <p className="text-sm text-foreground/60">Real-time safety checks</p>
                    </div>
                    <div className="bg-primary/5 backdrop-blur-sm p-4 rounded-2xl border border-primary/10">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Parent Scoped</p>
                        <p className="text-sm text-foreground/60">Full control over access</p>
                    </div>
                </div>
            </div>
            {/* Background elements */}
            <Baby className="absolute -bottom-10 -right-10 h-64 w-64 text-primary/5 -rotate-12" />
        </div>
      </main>
    </div>
  )
}
