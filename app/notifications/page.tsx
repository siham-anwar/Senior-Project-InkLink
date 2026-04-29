'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Search, MessageCircle, BookOpen, User, Users, Check, X, Loader2 } from 'lucide-react'
import { notificationsService, NotificationUpdate, NotificationMessage } from '../services/notifications.service'
import { collaborationService, CollaborationInvite } from '../services/collaboration.service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'updates' | 'messages' | 'collaborations'>('updates')
  const [updates, setUpdates] = useState<NotificationUpdate[]>([])
  const [messages, setMessages] = useState<NotificationMessage[]>([])
  const [invites, setInvites] = useState<CollaborationInvite[]>([])
  const [isLoadingInvites, setIsLoadingInvites] = useState(false)

  const fetchNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications()
      setUpdates(data.updates || [])
      setMessages(data.messages || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchInvites = async () => {
    try {
      setIsLoadingInvites(true)
      const data = await collaborationService.getInvites()
      setInvites(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingInvites(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
    fetchInvites()
  }, [])

  const markUpdateAsRead = async (id: string) => {
    setUpdates(updates.map(u => u.id === id ? { ...u, isRead: true } : u))
    try {
      await notificationsService.markAsRead(id)
    } catch(e) {}
  }

  const markMessageAsRead = async (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, unread: false } : m))
    try {
      await notificationsService.markAsRead(id)
    } catch(e) {}
  }

  const handleInviteResponse = async (id: string, accept: boolean) => {
    try {
      await collaborationService.respondToInvite(id, accept)
      toast.success(accept ? 'Invitation accepted!' : 'Invitation declined')
      fetchInvites()
    } catch (e) {
      toast.error('Failed to respond to invitation')
    }
  }

  const unreadUpdates = updates.filter(u => !u.isRead).length
  const unreadMessages = messages.filter(m => m.unread).length
  const inviteCount = invites.length

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header with Tabs */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6 mb-4">
            <div className="flex items-center gap-4">
              <Link href="/home" className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back to home">
                <ChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
              </div>
            </div>
            <Link href="/search" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Search size={24} />
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-8 border-t border-border pt-4">
            <button
              onClick={() => setActiveTab('updates')}
              className={`pb-4 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'updates'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen size={18} />
              Updates
              {unreadUpdates > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                  {unreadUpdates}
                </span>
              )}
              {activeTab === 'updates' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-4 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'messages'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageCircle size={18} />
              Messages
              {unreadMessages > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                  {unreadMessages}
                </span>
              )}
              {activeTab === 'messages' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('collaborations')}
              className={`pb-4 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'collaborations'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users size={18} />
              Collabs
              {inviteCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                  {inviteCount}
                </span>
              )}
              {activeTab === 'collaborations' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Updates Section */}
        {activeTab === 'updates' && (
          <section>
            <div className="space-y-4">
              {updates.length > 0 ? (
                updates.map((update) => (
                  <div
                    key={update.id}
                    onClick={() => markUpdateAsRead(update.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      update.isRead
                        ? 'bg-background border-border hover:border-primary/50'
                        : 'bg-primary/5 border-primary/30 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={update.authorImage}
                        alt={update.authorName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{update.authorName}</h3>
                            <p className="text-sm text-muted-foreground">{update.timestamp}</p>
                          </div>
                          {!update.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                        <h4 className="font-bold text-base mb-1">{update.title}</h4>
                        <p className="text-sm text-foreground mb-3">{update.description}</p>
                        {update.bookImage && (
                          <div className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg w-fit">
                            <img
                              src={update.bookImage}
                              alt={update.bookTitle}
                              className="w-8 h-12 object-cover rounded"
                            />
                            <span className="text-sm font-medium">{update.bookTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No updates yet</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Messages Section */}
        {activeTab === 'messages' && (
          <section>
            <div className="space-y-2">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => markMessageAsRead(message.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      message.unread
                        ? 'bg-primary/5 border-primary/30 hover:border-primary/50'
                        : 'bg-background border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={message.senderImage}
                        alt={message.senderName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{message.senderName}</h3>
                            {message.isAuthor && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                                <User size={12} />
                                Reader
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground flex-shrink-0">{message.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{message.lastMessage}</p>
                      </div>
                      {message.unread && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Collaborations Section */}
        {activeTab === 'collaborations' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              {isLoadingInvites ? (
                 <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary h-8 w-8" />
                 </div>
              ) : invites.length > 0 ? (
                invites.map((invite) => (
                  <div
                    key={invite._id}
                    className="p-6 rounded-3xl border-2 border-border/50 bg-card hover:border-primary/30 transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="relative group">
                         <img
                           src={invite.workId.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop'}
                           alt={invite.workId.title}
                           className="w-24 h-36 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
                         />
                         <div className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg">
                            <Users size={14} />
                         </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-black mb-1 line-clamp-1">{invite.workId.title}</h3>
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                             Invited by <span className="text-primary font-bold">@{invite.invitedBy.username}</span>
                          </p>
                          <div className="mt-4 p-3 bg-secondary/30 rounded-2xl border border-border/50 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User size={16} />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-widest opacity-70">Role: {invite.role}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                          <Button 
                            onClick={() => handleInviteResponse(invite._id, true)}
                            className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                          >
                            <Check size={18} className="mr-2" />
                            Accept
                          </Button>
                          <Button 
                            variant="ghost"
                            onClick={() => handleInviteResponse(invite._id, false)}
                            className="flex-1 h-12 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-500/10 font-bold"
                          >
                            <X size={18} className="mr-2" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-secondary/20 rounded-[2.5rem] border-2 border-dashed border-border/50">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-30" />
                  <p className="text-lg font-bold text-muted-foreground">No pending invites</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">When authors invite you to collaborate, they'll appear here.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
