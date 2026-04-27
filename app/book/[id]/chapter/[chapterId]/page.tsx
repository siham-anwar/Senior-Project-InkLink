'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, MessageCircle, ChevronLeft, ChevronRight, Gift, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ReactionsService } from '@/app/services/reactions.service'
import { RatingsService, RatingResponse } from '@/app/services/ratings.service'
import { StarRating } from '@/components/star-rating'
import { useAuthStore } from '@/app/store/authstore'

export default function ChapterReadingPage({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { id, chapterId } = use(params)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [ratingData, setRatingData] = useState<RatingResponse | null>(null)
  const { user } = useAuthStore()

  const [chapter, setChapter] = useState<any>(null);
  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const { EditorWorksService } = await import('@/app/services/editor-works.service');
        const workData = await EditorWorksService.getById(id);
        setWork(workData);
        const chapterData = workData.chapters?.find((c: any) => (c.id || c._id) === chapterId);
        setChapter(chapterData);

        setLikes(Number(chapterData?.likesCount ?? 0));
        setIsLiked(Boolean(chapterData?.viewerHasLiked ?? false));
        setCommentsCount(Number(chapterData?.commentsCount ?? 0));

        const commentsPage = await ReactionsService.listComments(chapterId, { limit: 50 });
        setComments(commentsPage.items || []);

        const rating = await RatingsService.getWorkRating(id, user?.id).catch(() => null);
        setRatingData(rating);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, chapterId]);

  const handleLike = async () => {
    try {
      const res = await ReactionsService.toggleLike(chapterId);
      setIsLiked(Boolean(res.viewerHasLiked));
      setLikes(Number(res.likesCount ?? 0));
    } catch (err) {
      console.error(err);
    }
  }

  const handleAddComment = async () => {
    const text = newComment.trim();
    if (!text) return;

    try {
      const created = await ReactionsService.addComment(chapterId, { text });
      setComments((prev) => [created, ...prev]);
      setCommentsCount((prev) => prev + 1);
      setNewComment('');
      setShowComments(true);
    } catch (err) {
      console.error(err);
    }
  }

  const handleRate = async (value: number) => {
    try {
      const updatedRating = await RatingsService.rateWork(id, value)
      setRatingData(updatedRating)
    } catch (error) {
      console.error('Failed to rate work:', error)
    }
  }

  const chapters = work?.chapters || [];
  const currentIndex = chapters.findIndex((c: any) => (c.id || c._id) === chapterId);
  const previousChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  if (!mounted || loading) return null

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chapter not found.</p>
        <Link href={`/book/${id}`} className="text-primary ml-2 underline">Go back</Link>
      </div>
    );
  }

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
            <h1 className="text-lg font-bold text-center flex-1 line-clamp-1 px-4">{work?.title || 'Loading...'}</h1>
            <div className="w-12" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">Chapter {currentIndex + 1}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{chapter.title}</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{work?.authorUsername || 'Author'}</span>
            <span>{new Date(chapter.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Chapter Content */}
        <article className="prose prose-invert max-w-none mb-12">
          <div className="space-y-6 text-foreground leading-relaxed">
            {chapter.contentText ? chapter.contentText.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="text-base sm:text-lg">
                {paragraph}
              </p>
            )) : <p className="italic opacity-50">No content available.</p>}
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showComments ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            <MessageCircle size={18} />
            <span className="font-medium">{commentsCount} Comments</span>
          </button>

          <div className="flex flex-col items-center gap-1 bg-secondary px-4 py-1.5 rounded-lg border border-border/50">
            <StarRating 
              initialRating={ratingData?.userRating || Math.round(ratingData?.averageRating || 0)} 
              onRate={handleRate} 
              size={18} 
              readonly={!user}
            />
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
              {ratingData?.averageRating?.toFixed(1) || '0.0'} ({ratingData?.ratingsCount || 0})
            </span>
          </div>

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
            <h2 className="text-2xl font-bold">Comments ({commentsCount})</h2>

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
          {previousChapter ? (
            <Link
              href={`/book/${id}/chapter/${previousChapter.id || previousChapter._id}`}
              className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors font-medium"
            >
              <ChevronLeft size={20} />
              Previous Chapter
            </Link>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <Link
              href={`/book/${id}/chapter/${nextChapter.id || nextChapter._id}`}
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
            href={`/donate?author=${id}`}
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
