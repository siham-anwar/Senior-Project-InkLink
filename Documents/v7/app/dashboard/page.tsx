'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Trash2, X, DollarSign } from 'lucide-react'

export default function AuthorDashboard() {
  // Mock data - replace with backend API call
  const hasPublishedWorks = true
  
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [premiumModal, setPremiumModal] = useState<{ chapterId: number; price: string } | null>(null)
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
        { id: 3, author: 'Alex Chen', text: 'Can\'t wait for more' },
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
        { id: 1, author: 'Emma Davis', text: 'Didn\'t see that coming!' },
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
            <Link href="/home" className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Explore the Platform
            </Link>
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

        {/* Works Section */}
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
      </div>

      {/* Premium Modal */}
      {premiumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-sm w-full shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold">Set Premium Price</h3>
              <button
                onClick={() => setPremiumModal(null)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
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

              {/* Modal Actions */}
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
