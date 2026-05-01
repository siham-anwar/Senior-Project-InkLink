'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UserPlus, X, User, Shield, CheckCircle2, Mail } from 'lucide-react'
import { collaborationService, Collaborator } from '@/app/services/collaboration.service'
import { toast } from 'sonner'

interface CollaboratorsModalProps {
  workId: string
  isOpen: boolean
  onClose: () => void
}

export function CollaboratorsModal({ workId, isOpen, onClose }: CollaboratorsModalProps) {
  const [email, setEmail] = useState('')
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const fetchCollaborators = async () => {
    try {
      setIsLoading(true)
      const data = await collaborationService.listForWork(workId)
      setCollaborators(data)
    } catch (err) {
      console.error('Failed to fetch collaborators:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && workId) {
      fetchCollaborators()
    }
  }, [isOpen, workId])

  const handleInvite = async () => {
    if (!email.trim()) return
    try {
      setIsInviting(true)
      await collaborationService.invite(workId, email)
      toast.success('Invitation sent!')
      setEmail('')
      fetchCollaborators()
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send invite'
      toast.error(message)
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemove = async (userId: string) => {
    try {
      await collaborationService.remove(workId, userId)
      toast.success('Collaborator removed')
      fetchCollaborators()
    } catch (err) {
      toast.error('Failed to remove collaborator')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <UserPlus className="text-primary" />
            Manage Collaborators
          </DialogTitle>
          <DialogDescription>
            Invite other authors to write this book with you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invite Section */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 group">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
               <Input
                 placeholder="Enter email or username..."
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="pl-10 h-12 rounded-xl border-2 border-border/50 focus:border-primary/50 transition-all"
                 onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
               />
            </div>
            <Button 
              onClick={handleInvite} 
              disabled={isInviting || !email.trim()}
              className="h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
            >
              {isInviting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Invite'}
            </Button>
          </div>

          {/* List Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Team Members</h3>
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : collaborators.length === 0 ? (
                <div className="text-center py-8 bg-secondary/20 rounded-2xl border-2 border-dashed border-border/50">
                  <p className="text-sm text-muted-foreground">No collaborators yet.</p>
                </div>
              ) : (
                collaborators.map((collab) => (
                  <div 
                    key={collab._id} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/50 group hover:bg-secondary/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {collab.userId.profilePicture ? (
                           <img src={collab.userId.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                           <User size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">@{collab.userId.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${
                            collab.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {collab.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Shield size={10} /> {collab.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemove(collab.userId._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-full"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="rounded-xl">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
