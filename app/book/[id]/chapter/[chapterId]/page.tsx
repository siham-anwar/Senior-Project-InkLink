'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, MessageCircle, ChevronLeft, ChevronRight, Gift, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default async function ChapterReadingPage({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { id, chapterId } = use(params)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(1250)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex Reader', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop', text: 'Amazing chapter! The plot twist was incredible!' },
    { id: 2, author: 'Jordan Books', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop', text: 'Can\'t wait for the next chapter. This story is addictive!' },
  ])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock chapter data - Replace with backend API call
  const mockChapter = {
    id: chapterId,
    bookId: id,
    title: 'Chapter 2: Shadows Rise',
    bookTitle: 'The Midnight Kingdom',
    author: 'Sarah Chen',
    publishedDate: 'Mar 18, 2024',
    content: `The night had settled over the kingdom like a thick veil. Aria stood at the edge of the cliff, watching the stars dance across the dark sky. She could feel something stirring in the air—a presence she couldn't quite name.

Behind her, the sound of footsteps echoed through the stone corridors. She didn't need to turn around to know who it was. The scent of jasmine and ancient magic was unmistakable.

"You shouldn't be here," came a familiar voice, smooth as silk and twice as dangerous.

Aria turned slowly, her hand instinctively moving to the hilt of her sword. Standing before her was the figure she'd been dreading and anticipating in equal measure. The Shadow Knight, draped in robes of midnight and starlight.

"Neither should you," she replied, her voice steady despite the storm of emotions raging within her.

The knight took a step forward, and the very shadows seemed to bend to his will. "I've been watching you, Aria. You have potential. Power that could reshape the very fabric of reality itself."

Aria's breath caught. How did he know her name? She'd been so careful, so hidden away in the tower. Only a handful of people knew her true identity.

"What do you want?" she demanded, drawing her blade. The weapon gleamed with an ethereal light, reacting to the proximity of dark magic.

"I want to offer you something," the Shadow Knight said, his form becoming clearer as he stepped closer. "A choice. You can remain here, trapped in this existence, or you can come with me and discover what you're truly meant to be."

The proposition hung between them like a blade suspended over water. Aria knew this was a test. Everything in the Kingdom was a test. She'd learned that lesson years ago, when she'd lost everything and everyone she'd ever loved.

"And if I refuse?" she asked, her eyes narrowing.

A smile played at the corners of the knight's hidden face. "Then the shadows will come for you anyway. You cannot escape your destiny, young one. The only question is whether you'll meet it with power or weakness."

The night seemed to hold its breath. Above them, a meteor streaked across the sky, leaving a trail of silver fire. It was a sign—Aria had learned to read the omens long ago. The old magic was stirring. Change was coming, whether she welcomed it or not.

She lowered her sword slightly, her mind racing. "I need time to think."

"You have until the moon reaches its zenith," the Shadow Knight replied. Then, like a wisp of smoke, he was gone, leaving only the faint scent of magic and the lingering echo of his words.

Aria stood alone once more, the weight of destiny pressing down upon her shoulders. The sky above seemed darker than before, and somewhere in the distance, she could hear the sound of thunder—a warning, or perhaps a promise.`,
    chapterNumber: 2,
    totalChapters: 7,
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: 'You',
          avatar: 'https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=40&h=40&fit=crop',
          text: newComment,
        },
      ])
      setNewComment('')
    }
  }

  const previousChapterExists = mockChapter.chapterNumber > 1
  const nextChapterExists = mockChapter.chapterNumber < mockChapter.totalChapters

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              href={`/book/${id}`}
              className="p-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2"
              title="Back to book"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </Link>
          </div>
            <h1 className="text-lg font-bold text-center flex-1 line-clamp-1 px-4">{mockChapter.bookTitle}</h1>
            <div className="w-12" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">Chapter {mockChapter.chapterNumber}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{mockChapter.title}</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{mockChapter.author}</span>
            <span>{mockChapter.publishedDate}</span>
          </div>
        </div>

        {/* Chapter Content */}
        <article className="prose prose-invert max-w-none mb-12">
          <div className="space-y-6 text-foreground leading-relaxed">
            {mockChapter.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Interaction Buttons */}
        <div className="flex flex-wrap gap-4 mb-12 pb-8 border-b border-border">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="font-medium">{likes} Likes</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            <MessageCircle size={18} />
            <span className="font-medium">{comments.length} Comments</span>
          </button>

          <Link
            href="#donate"
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors ml-auto"
          >
            <Gift size={18} />
            <span className="font-medium">Donate</span>
          </Link>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

            {/* Add Comment */}
            <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-secondary/20 rounded-lg border border-border">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1">{comment.author}</p>
                    <p className="text-foreground text-sm break-words">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between mb-12">
          {previousChapterExists ? (
            <Link
              href={`/book/${(await params).id}/chapter/${mockChapter.chapterNumber - 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors font-medium"
            >
              <ChevronLeft size={20} />
              Previous Chapter
            </Link>
          ) : (
            <div />
          )}

          {nextChapterExists ? (
            <Link
              href={`/book/${(await params).id}/chapter/${mockChapter.chapterNumber + 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-medium"
            >
              Next Chapter
              <ChevronRight size={20} />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Donate Section */}
        <section id="donate" className="bg-secondary/30 border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Support the Author</h2>
          <p className="text-muted-foreground mb-6">Love this story? Show your support by donating to help the author continue writing amazing chapters.</p>
          <Link
            href={`/donate?author=${mockChapter.bookId}`}
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Gift size={18} className="inline mr-2" />
            Donate
          </Link>
        </section>
      </main>
    </div>
  )
}
