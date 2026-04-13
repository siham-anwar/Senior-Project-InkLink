'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Gift, MessageCircle, Heart, Share2, Send, X } from 'lucide-react'

export default function AuthorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<'works' | 'posts'>('works')
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'author', text: 'Hi! Thanks for reading my work. How are you enjoying it so far?' },
    { id: 2, sender: 'user', text: 'Absolutely love it! The character development is amazing.' },
    { id: 3, sender: 'author', text: 'Thank you so much! That means a lot. More chapters coming soon!' },
  ])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'user', text: newMessage }])
      setNewMessage('')
      // TODO: Send message to backend API
    }
  }

  // Mock author data - Replace with backend API call
  const mockAuthor = {
    id: username,
    username: username,
    name: 'Sarah Chen',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    bio: 'Fantasy writer and world-builder. Lover of epic adventures, magic systems, and complex characters. Always exploring new stories and pushing creative boundaries.',
    followers: 125400,
    following: 342,
  }

  // Mock author works
  const mockWorks = [
    {
      id: 1,
      title: 'The Midnight Kingdom',
      cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=200&h=300&fit=crop',
      status: 'Completed',
      views: '2.4M',
    },
    {
      id: 2,
      title: 'Echoes of Destiny',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
      status: 'Ongoing',
      views: '1.8M',
    },
    {
      id: 3,
      title: 'Shadow\'s Embrace',
      cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=200&h=300&fit=crop',
      status: 'Completed',
      views: '950K',
    },
    {
      id: 4,
      title: 'The Lost Chronicles',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
      status: 'Ongoing',
      views: '650K',
    },
  ]

  // Mock author posts
  const mockPosts = [
    {
      id: 1,
      content: 'Just finished writing an intense battle scene for Chapter 32 of The Midnight Kingdom. Really happy with how the character development turned out!',
      timestamp: '2 days ago',
      likes: 1250,
      comments: 45,
      isLiked: false,
    },
    {
      id: 2,
      content: 'Writing tip: Always develop your antagonist as thoroughly as your protagonist. The best villains are those who believe they\'re the heroes of their own story.',
      timestamp: '1 week ago',
      likes: 3420,
      comments: 89,
      isLiked: false,
    },
    {
      id: 3,
      content: 'Thank you all for 125K followers! Your support means everything. Chapter 15 of Echoes of Destiny is coming this Friday!',
      timestamp: '2 weeks ago',
      likes: 5890,
      comments: 234,
      isLiked: true,
    },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="p-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2"
              title="Back to home"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </Link>
            <h1 className="text-xl font-bold">Author Profile</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Author Profile Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-secondary/30 border border-border rounded-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
            <img
              src={mockAuthor.profileImage}
              alt={mockAuthor.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-1">{mockAuthor.name}</h2>
              <p className="text-muted-foreground mb-4">@{mockAuthor.username}</p>
              <p className="text-foreground mb-6 max-w-2xl">{mockAuthor.bio}</p>
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <p className="font-bold text-lg">{(mockAuthor.followers / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{mockAuthor.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? 'bg-secondary border border-border text-foreground hover:bg-secondary/80'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
                  title="Send message"
                >
                  <MessageCircle size={18} />
                  <span className="hidden sm:inline">Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('works')}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === 'works'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Works
            {activeTab === 'works' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === 'posts'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Posts
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Works Section */}
        {activeTab === 'works' && (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockWorks.map((work) => (
              <Link key={work.id} href={`/book/${work.id}`} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3 bg-muted h-64">
                  <img
                    src={work.cover}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded">
                      {work.status}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-1">
                  {work.title}
                </h4>
                <p className="text-xs text-muted-foreground">{work.views} views</p>
              </Link>
            ))}
            </div>
          </section>
        )}

        {/* Posts Section */}
        {activeTab === 'posts' && (
          <section className="mb-12">
            <div className="space-y-4">
            {mockPosts.map((post) => (
              <div key={post.id} className="bg-secondary/30 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <p className="text-foreground mb-4">{post.content}</p>
                <p className="text-xs text-muted-foreground mb-4">{post.timestamp}</p>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Heart size={16} className={post.isLiked ? 'fill-current text-primary' : ''} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            </div>
          </section>
        )}

        {/* Donate Section */}
        <section className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Support This Author</h3>
          <p className="text-muted-foreground mb-6">
            Love their stories? Support their work and help them keep creating amazing content!
          </p>
          <Link href={`/donate?author=${mockAuthor.username}`} className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            <Gift size={20} />
            Donate
          </Link>
        </section>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-end sm:justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg w-full sm:w-96 h-screen sm:h-[500px] flex flex-col shadow-lg">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <img
                  src={mockAuthor.profileImage}
                  alt={mockAuthor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">{mockAuthor.name}</h3>
                  <p className="text-xs text-muted-foreground">@{mockAuthor.username}</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                title="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
