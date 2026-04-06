'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, User, Bell, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'like' | 'follow' | 'comment' | 'release' | 'system' | 'recommendation'
  title: string
  message: string
  avatar?: string
  user?: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

type NotificationType = 'all' | 'releases' | 'social' | 'system' | 'recommendations'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<NotificationType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch notifications from backend - replace with your API
    const fetchNotifications = async () => {
      try {
        // const res = await fetch('/api/users/notifications')
        // const data = await res.json()
        // setNotifications(data)

        // Mock data - remove when backend is ready
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'like',
            title: 'Sarah liked your review',
            message: 'Sarah Chen liked your review of "The Midnight Library"',
            user: 'Sarah Chen',
            avatar: '',
            read: false,
            createdAt: '2024-03-20T10:30:00',
          },
          {
            id: '2',
            type: 'follow',
            title: 'Alex started following you',
            message: 'Alex Johnson started following you',
            user: 'Alex Johnson',
            avatar: '',
            read: false,
            createdAt: '2024-03-20T09:15:00',
          },
          {
            id: '3',
            type: 'comment',
            title: 'New comment on your review',
            message: 'Emma replied to your review of "Fourth Wing"',
            user: 'Emma Wilson',
            avatar: '',
            read: true,
            createdAt: '2024-03-19T14:20:00',
          },
          {
            id: '4',
            type: 'release',
            title: 'New book release in Fantasy',
            message: '"Winds of Fate" by Sarah J. Maas is now available',
            read: false,
            createdAt: '2024-03-19T12:00:00',
          },
          {
            id: '5',
            type: 'release',
            title: 'New book release in Sci-Fi',
            message: '"The Expanse: Leviathan Wakes" sequel is out now',
            read: true,
            createdAt: '2024-03-18T08:30:00',
          },
          {
            id: '6',
            type: 'system',
            title: 'Milestone achieved!',
            message: 'You have completed 25 books! 🎉',
            read: false,
            createdAt: '2024-03-17T11:45:00',
          },
          {
            id: '7',
            type: 'recommendation',
            title: 'Recommended for you',
            message: 'Based on your reading history, you might enjoy "Project Hail Mary"',
            read: true,
            createdAt: '2024-03-16T15:20:00',
          },
          {
            id: '8',
            type: 'recommendation',
            title: 'Recommended for you',
            message: 'Readers who loved "The Hobbit" also enjoyed "Game of Thrones"',
            read: false,
            createdAt: '2024-03-15T10:00:00',
          },
        ]

        setNotifications(mockNotifications)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const getNotificationsByType = (type: NotificationType) => {
    if (type === 'all') return notifications
    if (type === 'releases') return notifications.filter((n) => n.type === 'release')
    if (type === 'social') return notifications.filter((n) => ['like', 'follow', 'comment'].includes(n.type))
    if (type === 'system') return notifications.filter((n) => n.type === 'system')
    if (type === 'recommendations') return notifications.filter((n) => n.type === 'recommendation')
    return []
  }

  const getUnreadCount = (type: NotificationType) => {
    const filtered = getNotificationsByType(type)
    return filtered.filter((n) => !n.read).length
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // await fetch(`/api/users/notifications/${notificationId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ read: true }),
      // })
      setNotifications(
        notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // await fetch(`/api/users/notifications/${notificationId}`, {
      //   method: 'DELETE',
      // })
      setNotifications(notifications.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // await fetch('/api/users/notifications/mark-all-read', {
      //   method: 'PATCH',
      // })
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-600" />
      case 'follow':
        return <User className="w-5 h-5 text-blue-600" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-purple-600" />
      case 'release':
        return <Bell className="w-5 h-5 text-orange-600" />
      case 'recommendation':
        return <Heart className="w-5 h-5 text-pink-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const renderNotification = (notification: Notification) => {
    const displayedNotifications = getNotificationsByType(activeTab)
    if (!displayedNotifications.find((n) => n.id === notification.id)) return null

    return (
      <Card
        key={notification.id}
        className={cn(
          'p-4 hover:shadow-md transition-shadow',
          !notification.read && 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
        )}
      >
        <div className="flex items-start gap-4">
          {notification.user ? (
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={notification.avatar} alt={notification.user} />
              <AvatarFallback>{notification.user.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-foreground">{notification.title}</p>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(new Date(notification.createdAt))}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!notification.read && (
              <Button
                onClick={() => handleMarkAsRead(notification.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </Button>
            )}
            <Button
              onClick={() => handleDeleteNotification(notification.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const currentTabNotifications = getNotificationsByType(activeTab)

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              You have {getUnreadCount('all')} unread notification{getUnreadCount('all') !== 1 ? 's' : ''}
            </p>
          </div>
          {getUnreadCount('all') > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              Mark all as read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All
              {getUnreadCount('all') > 0 && (
                <span className="ml-2 text-xs font-semibold text-red-600">
                  {getUnreadCount('all')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="releases">
              Releases
              {getUnreadCount('releases') > 0 && (
                <span className="ml-2 text-xs font-semibold text-orange-600">
                  {getUnreadCount('releases')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="social">
              Social
              {getUnreadCount('social') > 0 && (
                <span className="ml-2 text-xs font-semibold text-blue-600">
                  {getUnreadCount('social')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="system">
              System
              {getUnreadCount('system') > 0 && (
                <span className="ml-2 text-xs font-semibold text-purple-600">
                  {getUnreadCount('system')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              Recommendations
              {getUnreadCount('recommendations') > 0 && (
                <span className="ml-2 text-xs font-semibold text-pink-600">
                  {getUnreadCount('recommendations')}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value={activeTab} className="space-y-3 mt-6">
            {currentTabNotifications.length > 0 ? (
              currentTabNotifications.map((notification) => renderNotification(notification))
            ) : (
              <Card className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications in this category</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Footer */}
        {notifications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-8 border-t">
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-xs mb-1">Total</p>
              <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-xs mb-1">Unread</p>
              <p className="text-2xl font-bold text-blue-600">{getUnreadCount('all')}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-xs mb-1">Social</p>
              <p className="text-2xl font-bold text-blue-600">{getUnreadCount('social')}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-xs mb-1">Releases</p>
              <p className="text-2xl font-bold text-orange-600">{getUnreadCount('releases')}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-xs mb-1">Recommended</p>
              <p className="text-2xl font-bold text-pink-600">{getUnreadCount('recommendations')}</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString()
}
