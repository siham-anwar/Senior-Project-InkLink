'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Search, MessageCircle, BookOpen, User } from 'lucide-react'

interface Update {
  id: string
  type: 'chapter' | 'announcement'
  authorName: string
  authorImage: string
  title: string
  description: string
  timestamp: string
  bookTitle?: string
  bookImage?: string
  isRead: boolean
}

interface Message {
  id: string
  senderName: string
  senderImage: string
  lastMessage: string
  timestamp: string
  unread: boolean
  isAuthor: boolean
}

const mockUpdates: Update[] = [
  {
    id: '1',
    type: 'chapter',
    authorName: 'Sarah Chen',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    title: 'New Chapter: The Journey Begins',
    description: 'Chapter 5 of "Echoes of Tomorrow" has been released!',
    bookTitle: 'Echoes of Tomorrow',
    bookImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'announcement',
    authorName: 'Marcus Reid',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    title: 'Author Announcement',
    description: 'Exciting news about the upcoming book release and special live reading event!',
    timestamp: '5 hours ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'chapter',
    authorName: 'Elena Rodriguez',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    title: 'New Chapter: Unexpected Twist',
    description: 'Chapter 12 of "Midnight Chronicles" is now available!',
    bookTitle: 'Midnight Chronicles',
    bookImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=100&h=150&fit=crop',
    timestamp: '1 day ago',
    isRead: true,
  },
]

const mockMessages: Message[] = [
  {
    id: '1',
    senderName: 'Alex Thompson',
    senderImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    lastMessage: 'Your latest chapter was amazing! When will the next one come out?',
    timestamp: '15 min ago',
    unread: true,
    isAuthor: true,
  },
  {
    id: '2',
    senderName: 'Jordan Lee',
    senderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    lastMessage: 'I have a question about the plot twist in chapter 8...',
    timestamp: '2 hours ago',
    unread: true,
    isAuthor: true,
  },
  {
    id: '3',
    senderName: 'Casey Morgan',
    senderImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    lastMessage: 'Thanks for the shout-out in your latest post!',
    timestamp: '1 day ago',
    unread: false,
    isAuthor: true,
  },
]

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'updates' | 'messages'>('updates')
  const [updates, setUpdates] = useState<Update[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    setMounted(true)
    setUpdates(mockUpdates)
    setMessages(mockMessages)
  }, [])

  const markUpdateAsRead = (id: string) => {
    setUpdates(updates.map(u => u.id === id ? { ...u, isRead: true } : u))
  }

  const markMessageAsRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, unread: false } : m))
  }

  const unreadUpdates = updates.filter(u => !u.isRead).length
  const unreadMessages = messages.filter(m => m.unread).length

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
      </div>
    </div>
  )
}
