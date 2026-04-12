'use client'

import { useState, useEffect } from 'react'
import { Plus, User, Trash2, Shield, Baby, Key, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <Shield className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  Parent Control
                </h1>
            </div>
            <p className="text-slate-500 text-lg">
              Manage your children's accounts and safety settings.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-105">
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
                <Button onClick={handleCreateChild} className="bg-indigo-600 hover:bg-indigo-700">Create Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2].map(i => <div key={i} className="h-64 rounded-3xl bg-white animate-pulse shadow-sm border border-slate-100" />)
          ) : children.length === 0 ? (
            <Card className="col-span-full py-16 flex flex-col items-center border-dashed border-2 bg-white/50">
                <Baby className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No child accounts yet</h3>
                <p className="text-slate-400 mb-6">Start by adding an account for your child.</p>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Add your first child</Button>
            </Card>
          ) : (
            children.map((child) => (
              <Card key={child._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl bg-white">
                <CardHeader className="bg-slate-50/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-slate-200 p-3 rounded-2xl">
                      <Baby className="text-slate-600" size={24} />
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
                  <CardTitle className="mt-4 text-2xl font-bold text-slate-800">@{child.username}</CardTitle>
                  <CardDescription>Created on {new Date(child.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm">{child.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Key size={18} className="text-slate-400" />
                    <span className="text-sm italic">Role: Child (Restricted)</span>
                  </div>
                  
                  <div className="pt-4 flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-xl text-xs h-9 border-slate-200">
                      View Activity
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl text-xs h-9 border-slate-200">
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Shield className="text-indigo-300" />
                    Safe Browsing Active
                </h2>
                <p className="text-indigo-100 text-lg leading-relaxed">
                    Child accounts are automatically restricted to content flagged as "Child Safe" by our moderation AI. 
                    They cannot access adult-only stories, modify their own permissions, or bypass these restrictions. 
                </p>
                <div className="mt-8 flex gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">AI Moderated</p>
                        <p className="text-sm">Real-time safety checks</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Parent Scoped</p>
                        <p className="text-sm">Full control over access</p>
                    </div>
                </div>
            </div>
            {/* Background elements */}
            <Baby className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 -rotate-12" />
        </div>
      </main>
    </div>
  )
}
