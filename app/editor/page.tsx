'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import * as Y from 'yjs'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { TagInput } from '@/components/editor/tag-input'
import { ChapterList } from '@/components/editor/chapter-list'
import { CoverUpload } from '@/components/editor/cover-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { mockPostStory } from '@/lib/mock-post'
import { Work, Chapter } from '@/lib/types'
import { ArrowLeft, Send, Loader2, BookOpen, Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

type EditorStep = 'book-details' | 'chapter-editor'

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  // Book details
  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState<string | undefined>()
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)

  // For new books: track if book has been created
  const [currentWorkId, setCurrentWorkId] = useState<string | null>(editId)
  const [step, setStep] = useState<EditorStep>(editId ? 'chapter-editor' : 'book-details')

  // Chapter state
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
  const [chapterTitle, setChapterTitle] = useState('')
  const [showChapterEditor, setShowChapterEditor] = useState(false)

  // Create Yjs document - this is the source of truth
  const ydoc = useMemo(() => new Y.Doc(), [selectedChapterId])

  // Load existing work if editing
  useEffect(() => {
    if (editId) {
      const savedWorks = localStorage.getItem('inklink-works')
      if (savedWorks) {
        try {
          const works: Work[] = JSON.parse(savedWorks)
          const work = works.find((w) => w.id === editId)
          if (work) {
            setTitle(work.title)
            setCoverImage(work.coverImage)
            setSummary(work.summary || '')
            setTags(work.tags)
            setChapters(work.chapters || [])
          }
        } catch (e) {
          console.error('Failed to load work:', e)
        }
      }
    }
  }, [editId])

  // Load chapter content when selected
  useEffect(() => {
    if (selectedChapterId && chapters.length > 0) {
      const chapter = chapters.find((c) => c.id === selectedChapterId)
      if (chapter) {
        setChapterTitle(chapter.title)
        const ytext = ydoc.getText('content')
        ydoc.transact(() => {
          ytext.delete(0, ytext.length)
          if (chapter.content) {
            ytext.insert(0, chapter.content)
          }
        })
      }
    }
  }, [selectedChapterId, chapters, ydoc])

  // Create book and go to chapter editor
  const handleCreateBook = useCallback(() => {
    if (!title.trim()) return

    const newWorkId = crypto.randomUUID()
    const newWork: Work = {
      id: newWorkId,
      title,
      coverImage,
      summary,
      tags,
      chapters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to localStorage
    const savedWorks = localStorage.getItem('inklink-works')
    const works: Work[] = savedWorks ? JSON.parse(savedWorks) : []
    works.push(newWork)
    localStorage.setItem('inklink-works', JSON.stringify(works))

    setCurrentWorkId(newWorkId)
    setStep('chapter-editor')
  }, [title, coverImage, summary, tags])

  const handleSelectChapter = useCallback((chapterId: string) => {
    setSelectedChapterId(chapterId)
    setShowChapterEditor(true)
  }, [])

  const handleAddChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setChapters((prev) => [...prev, newChapter])
    setSelectedChapterId(newChapter.id)
    setChapterTitle('')
    setShowChapterEditor(true)
  }, [])

  const handleSaveChapter = useCallback(() => {
    if (!selectedChapterId) return

    const ytext = ydoc.getText('content')
    const content = ytext.toString()

    setChapters((prev) =>
      prev.map((c) =>
        c.id === selectedChapterId
          ? { ...c, title: chapterTitle, content, updatedAt: new Date() }
          : c
      )
    )
    setShowChapterEditor(false)
    setSelectedChapterId(null)
  }, [selectedChapterId, chapterTitle, ydoc])

  const handleBackToChapters = useCallback(() => {
    if (selectedChapterId) {
      const ytext = ydoc.getText('content')
      const content = ytext.toString()

      setChapters((prev) =>
        prev.map((c) =>
          c.id === selectedChapterId
            ? { ...c, title: chapterTitle, content, updatedAt: new Date() }
            : c
        )
      )
    }
    setShowChapterEditor(false)
    setSelectedChapterId(null)
  }, [selectedChapterId, chapterTitle, ydoc])

  const handleDeleteChapter = useCallback(
    (chapterId: string) => {
      const confirmed = window.confirm(
        'Are you sure you want to delete this chapter? This cannot be undone.'
      )
      if (!confirmed) return

      setChapters((prev) => prev.filter((c) => c.id !== chapterId))

      if (selectedChapterId === chapterId) {
        setShowChapterEditor(false)
        setSelectedChapterId(null)
      }
    },
    [selectedChapterId]
  )

  const handlePost = async () => {
    const workId = currentWorkId || editId
    if (!workId) return

    setIsPosting(true)

    try {
      const status = await mockPostStory()

      if (status === 'successful') {
        const savedWorks = localStorage.getItem('inklink-works')
        const works: Work[] = savedWorks ? JSON.parse(savedWorks) : []

        const index = works.findIndex((w) => w.id === workId)
        if (index !== -1) {
          works[index] = {
            ...works[index],
            title,
            coverImage,
            summary,
            tags,
            chapters,
            updatedAt: new Date(),
          }
          localStorage.setItem('inklink-works', JSON.stringify(works))
        }
      }

      switch (status) {
        case 'successful':
          router.push('/status/success')
          break
        case 'Warning':
          router.push('/status/warning')
          break
        case 'Fail':
          router.push('/status/fail')
          break
      }
    } catch (error) {
      console.error('Post failed:', error)
      router.push('/status/fail')
    }
  }

  const getHeaderTitle = () => {
    if (editId) return 'Edit Story'
    if (step === 'book-details') return 'Create New Book'
    return 'Write Chapter'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="text-lg font-medium text-primary">{getHeaderTitle()}</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Step 1: Book Details (for new books only) */}
        {step === 'book-details' && !editId && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {/* Cover Upload */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">Book Cover</Label>
                <CoverUpload value={coverImage} onChange={setCoverImage} />
              </div>

              {/* Title and Summary */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Book Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your book title..."
                    className="text-lg"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="summary" className="text-sm font-medium text-foreground">
                    Summary
                  </Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Write a brief summary of your book..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">Tags</Label>
              <TagInput tags={tags} onChange={setTags} />
            </div>

            {/* Create Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleCreateBook}
                disabled={!title.trim()}
                size="lg"
                className="min-w-[140px]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Book
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Chapter Editor (for new books after creation, or editing existing) */}
        {(step === 'chapter-editor' || editId) && (
          <div className="flex flex-col gap-6">
            {/* Book info header when editing */}
            {editId && (
              <>
                <div className="flex gap-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-foreground">Book Cover</Label>
                    <CoverUpload value={coverImage} onChange={setCoverImage} />
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="title" className="text-sm font-medium text-foreground">
                        Book Title
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your book title..."
                        className="text-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="summary" className="text-sm font-medium text-foreground">
                        Summary
                      </Label>
                      <Textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write a brief summary of your book..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-foreground">Tags</Label>
                  <TagInput tags={tags} onChange={setTags} />
                </div>
              </>
            )}

            {showChapterEditor ? (
              <>
                {/* Chapter Title */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chapterTitle" className="text-sm font-medium text-foreground">
                      Chapter Title
                    </Label>
                    <Button variant="ghost" size="sm" onClick={handleBackToChapters}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Back to Chapters
                    </Button>
                  </div>
                  <Input
                    id="chapterTitle"
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Enter chapter title..."
                  />
                </div>

                {/* Chapter Editor */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-foreground">Chapter Content</Label>
                  <TiptapEditor ydoc={ydoc} />
                </div>

                {/* Save/Post Chapter Button */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleBackToChapters}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChapter}>Save Chapter</Button>
                  <Button onClick={handlePost} disabled={isPosting}>
                    {isPosting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Chapter List */}
                <ChapterList
                  chapters={chapters}
                  selectedChapterId={selectedChapterId}
                  onSelectChapter={handleSelectChapter}
                  onAddChapter={handleAddChapter}
                  onDeleteChapter={handleDeleteChapter}
                />

                {/* Post Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handlePost}
                    disabled={isPosting || !title.trim()}
                    size="lg"
                    className="min-w-[120px]"
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
