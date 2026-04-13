'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Trash2, X, DollarSign, Plus } from 'lucide-react'

export default function AuthorDashboard() {
  const hasPublishedWorks = true
  
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [premiumModal, setPremiumModal] = useState<{ chapterId: number; price: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'works' | 'posts' | 'dm' | 'earnings'>('works')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [showReplyModal, setShowReplyModal] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const [dms, setDms] = useState([
    {
      id: 1,
      sender: 'Alex Reader',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
      message: "Hey! I absolutely loved Chapter 3! When's the next one coming?",
      date: '2024-04-11',
      replied: false,
    },
    {
      id: 2,
      sender: 'Jordan Books',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
      message: "Your writing style is amazing. I've recommended your work to all my friends!",
      date: '2024-04-10',
      replied: true,
      reply: 'Thank you so much! That means the world to me!',
    },
    {
      id: 3,
      sender: 'Sam Writer',
      senderAvatar: 'https://images.unsplash.com/photo-1516534775068-bb149c177c47?w=40&h=40&fit=crop',
      message: "Quick question - what's your writing process like?",
      date: '2024-04-09',
      replied: false,
    },
  ])

  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Just finished writing an intense chapter! Can't wait to share it with you all next week.",
      date: '2024-04-10',
      likes: 342,
    },
    {
      id: 2,
      content: "Writing tip: Sometimes the best ideas come when you're not trying. Took a walk today and plotted out the next 3 chapters!",
      date: '2024-04-08',
      likes: 287,
    },
    {
      id: 3,
      content: "Thank you all for the amazing support! We've reached 10k readers! 🎉",
      date: '2024-04-05',
      likes: 925,
    },
  ])

  const earnings = {
    adRevenue: 1250.50,
    premiumChapters: 3456.75,
    donations: 892.25,
  }

  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: 'Chapter 1: The Beginning',
      bookTitle: 'The Lost Kingdom',
      publishedDate: '2024-04-10',
      likes: 1250,
      isPremium: false,
      price: 0,
      comments: [
        { id: 1, author: 'John Doe', text: 'Amazing start!' },
        { id: 2, author: 'Jane Smith', text: 'Love the world building' },
        { id: 3, author: 'Alex Chen', text: "Can't wait for more" },
      ],
    },
    {
      id: 2,
      title: 'Chapter 2: Rising Tension',
      bookTitle: 'The Lost Kingdom',
      publishedDate: '2024-04-08',
      likes: 980,
      isPremium: false,
      price: 0,
      comments: [
        { id: 1, author: 'Mike Johnson', text: 'Plot twist!' },
        { id: 2, author: 'Sarah Williams', text: 'This is getting good' },
      ],
    },
    {
      id: 3,
      title: 'Chapter 3: Betrayal',
      bookTitle: 'The Lost Kingdom',
      publishedDate: '2024-04-05',
      likes: 1120,
      isPremium: false,
      price: 0,
      comments: [
        { id: 1, author: 'Emma Davis', text: "Didn't see that coming!" },
      ],
    },
  ])

  const handleDeleteComment = (chapterId: number, commentId: number) => {
    setChapters(chapters.map(ch => 
      ch.id === chapterId 
        ? { ...ch, comments: ch.comments.filter(c => c.id !== commentId) }
        : ch
    ))
  }

  const handleSetPremium = (chapterId: number, price: string) => {
    const priceNum = parseInt(price) || 0
    setChapters(chapters.map(ch =>
      ch.id === chapterId
        ? { ...ch, isPremium: priceNum > 0, price: priceNum }
        : ch
    ))
    setPremiumModal(null)
  }

  const handleAddPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        content: newPostContent,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
      }
      setPosts([newPost, ...posts])
      setNewPostContent('')
      setShowNewPostModal(false)
    }
  }

  const handleReplyToDm = (dmId: number) => {
    if (replyContent.trim()) {
      setDms(dms.map(dm =>
        dm.id === dmId
          ? { ...dm, replied: true, reply: replyContent }
          : dm
      ))
      setReplyContent('')
      setShowReplyModal(null)
    }
  }

  if (!hasPublishedWorks) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/profile" className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft size={20} />
            Back to Profile
          </Link>
          
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">No Published Work</h1>
            <p className="text-muted-foreground text-lg mb-8">
              You haven't published any works yet. Start writing and share your stories with the world!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/profile" className="flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft size={20} />
              Back to Profile
            </Link>
            <h1 className="text-4xl font-bold">Author Dashboard</h1>
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
          <button
            onClick={() => setActiveTab('dm')}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === 'dm'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            DM
            {activeTab === 'dm' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === 'earnings'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Earnings
            {activeTab === 'earnings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Works Section */}
        {activeTab === 'works' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Works</h2>
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="bg-secondary/30 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{chapter.title}</h3>
                      <p className="text-sm text-muted-foreground">{chapter.bookTitle} • Published {chapter.publishedDate}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Heart size={18} className="text-red-500" />
                      <span className="text-sm font-medium">{chapter.likes} likes</span>
                    </div>
                    <button
                      onClick={() => setSelectedChapter(selectedChapter === chapter.id ? null : chapter.id)}
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span>{chapter.comments.length} comments</span>
                    </button>
                    <button
                      onClick={() => setPremiumModal({ chapterId: chapter.id, price: chapter.price.toString() })}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        chapter.isPremium 
                          ? 'text-primary hover:text-primary/80' 
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                      title={chapter.isPremium ? `Premium: ${chapter.price} ETB` : 'Make Premium'}
                    >
                      <DollarSign size={18} />
                      {chapter.isPremium && <span>{chapter.price} ETB</span>}
                    </button>
                  </div>

                  {/* Comments Section */}
                  {selectedChapter === chapter.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="font-semibold mb-3">Comments</h4>
                      {chapter.comments.length > 0 ? (
                        <div className="space-y-3">
                          {chapter.comments.map((comment) => (
                            <div key={comment.id} className="bg-background/50 rounded p-3 flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{comment.author}</p>
                                <p className="text-sm text-muted-foreground">{comment.text}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteComment(chapter.id, comment.id)}
                                className="p-1 hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                                title="Delete comment"
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No comments yet</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Posts Section */}
        {activeTab === 'posts' && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Posts</h2>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus size={18} />
                New Post
              </button>
            </div>
            
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-secondary/30 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <p className="text-foreground mb-4">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Posted on {post.date}</span>
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="text-red-500" />
                        <span className="text-sm font-medium">{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 rounded-lg border border-border">
                <p className="text-muted-foreground mb-4">No posts yet. Share your thoughts with your community!</p>
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Plus size={18} />
                  Create Your First Post
                </button>
              </div>
            )}
          </section>
        )}

        {/* DM Section */}
        {activeTab === 'dm' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Direct Messages</h2>
            
            {dms.length > 0 ? (
              <div className="space-y-4">
                {dms.map((dm) => (
                  <div key={dm.id} className="bg-secondary/30 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={dm.senderAvatar}
                        alt={dm.sender}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{dm.sender}</h3>
                          <span className="text-xs text-muted-foreground">{dm.date}</span>
                        </div>
                        <p className="text-foreground mt-2">{dm.message}</p>
                      </div>
                    </div>

                    {dm.replied ? (
                      <div className="ml-14 mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                        <p className="text-sm text-foreground">Your reply: {dm.reply}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowReplyModal(dm.id)}
                        className="ml-14 text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 rounded-lg border border-border">
                <p className="text-muted-foreground">No messages yet. Engage with your readers!</p>
              </div>
            )}
          </section>
        )}

        {/* Earnings Section */}
        {activeTab === 'earnings' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-8">Earnings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AD Revenue Card */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">AD Revenue</p>
                    <h3 className="text-3xl font-bold text-foreground">{earnings.adRevenue.toFixed(2)} ETB</h3>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <DollarSign size={24} className="text-blue-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">From ad impressions and clicks</p>
              </div>

              {/* Premium Chapters Card */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Premium Chapters</p>
                    <h3 className="text-3xl font-bold text-foreground">{earnings.premiumChapters.toFixed(2)} ETB</h3>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <DollarSign size={24} className="text-purple-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">From paid chapter access</p>
              </div>

              {/* Donations Card */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Donations</p>
                    <h3 className="text-3xl font-bold text-foreground">{earnings.donations.toFixed(2)} ETB</h3>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <DollarSign size={24} className="text-green-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">From reader donations</p>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="mt-8 bg-secondary/50 border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                  <h3 className="text-4xl font-bold text-primary">{(earnings.adRevenue + earnings.premiumChapters + earnings.donations).toFixed(2)} ETB</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-2">This Month</p>
                  <p className="text-sm font-medium text-foreground">Pending Withdrawal</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-lg w-full shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold">Create New Post</h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts with your community..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={5}
              />
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPost}
                disabled={!newPostContent.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-lg w-full shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold">Reply to Message</h3>
              <button
                onClick={() => setShowReplyModal(null)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowReplyModal(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReplyToDm(showReplyModal)}
                disabled={!replyContent.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {premiumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-sm w-full shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold">Set Premium Price</h3>
              <button
                onClick={() => setPremiumModal(null)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Set the price for readers to access this chapter. Enter 0 to make it free.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="number"
                  min="0"
                  value={premiumModal.price}
                  onChange={(e) => setPremiumModal({ ...premiumModal, price: e.target.value })}
                  placeholder="0"
                  className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium">ETB</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPremiumModal(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSetPremium(premiumModal.chapterId, premiumModal.price)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
