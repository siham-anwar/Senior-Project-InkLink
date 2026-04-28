'use client'

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react'
import { useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import * as Y from 'yjs'
import axios from 'axios'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { TagInput } from '@/components/editor/tag-input'
import { ChapterList } from '@/components/editor/chapter-list'
import { CoverUpload } from '@/components/editor/cover-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useWorksStore } from '@/app/store/worksStore'
import { useChaptersStore } from '@/app/store/chaptersStore'
import { EditorWorksService } from '@/app/services/editor-works.service'
import { EditorChaptersService } from '@/app/services/editor-chapters.service'
import { useChapterSync } from '@/hooks/use-chapter-sync'
import { ArrowLeft, Send, Loader2, BookOpen, Plus, Save, UserPlus } from 'lucide-react'
import { CollaboratorsModal } from '@/components/editor/collaborators-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from 'sonner'
import { extractApiErrorMessage } from '@/lib/api'

type EditorStep = 'book-details' | 'chapter-editor'

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  )
}

function EditorPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const {
    currentWork,
    fetchWorkById,
    createWork,
    updateWork,
    publishWork,
    setCurrentWork,
    isLoading: isWorkLoading,
  } = useWorksStore()
  const { chapters, fetchChapters, createChapter, updateChapter, deleteChapter, isLoading: isChaptersLoading } = useChaptersStore()

  // Book details
  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState<string | undefined>()
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)

  // Step and navigation
  const [step, setStep] = useState<EditorStep>(editId ? 'chapter-editor' : 'book-details')
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
  const [chapterTitle, setChapterTitle] = useState('')
  const [chapterPrice, setChapterPrice] = useState<number>(0)
  const [chapterContent, setChapterContent] = useState('')
  const [showChapterEditor, setShowChapterEditor] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false)
  const draftSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Document for the current chapter
  const ydoc = useMemo(() => new Y.Doc(), [selectedChapterId])
  const selectedChapter = useMemo(
    () => chapters.find((chapter) => (chapter.id === selectedChapterId || chapter._id === selectedChapterId)),
    [chapters, selectedChapterId],
  )
  
  // Real-time synchronization
  useChapterSync(selectedChapterId, ydoc)

  const handleEditorApiError = useCallback(
    (err: unknown, actionLabel: string) => {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const backendMessage = extractApiErrorMessage(err, `Failed to ${actionLabel}`)

        if (status === 401 || status === 403) {
          toast.error(
            `Authentication required while trying to ${actionLabel}. Your auth cookie is missing/expired or blocked by CORS. Please log in again.`,
          )
          router.push('/auth/login')
          return
        }

        toast.error(`Failed to ${actionLabel}${status ? ` (${status})` : ''}: ${backendMessage}`)
        return
      }

      toast.error(extractApiErrorMessage(err, `Failed to ${actionLabel}`))
    },
    [router],
  )

  // Load existing work if editing
  useEffect(() => {
    if (editId) {
      const isNew = searchParams.get('created') === 'true'
      fetchWorkById(editId).then(work => {
        setTitle(work.title)
        setCoverImage(work.coverImage)
        setSummary(work.summary || '')
        setTags(work.tags || [])
        fetchChapters(editId).then((loadedChapters) => {
          if (isNew && loadedChapters && loadedChapters.length > 0) {
            const firstChapter = loadedChapters[0]
            const firstChapterId = EditorChaptersService.idOf(firstChapter)
            if (firstChapterId) {
              setSelectedChapterId(firstChapterId)
              setChapterTitle(firstChapter.title || 'Chapter 1')
              setShowChapterEditor(true)
            }
          }
        })
      }).catch((err) => {
        handleEditorApiError(err, 'load book data')
      })
    }
  }, [editId, searchParams, fetchWorkById, fetchChapters, handleEditorApiError])

  useEffect(() => {
    if (editId) {
      setStep('chapter-editor')
    }
  }, [editId])

  const handleSaveBookDetails = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      if (editId) {
        await updateWork(editId, { title, summary, coverImage, tags })
        toast.success('Book details updated')
      } else {
        try {
          const newWork = await createWork({ title, summary, coverImage, tags, status: 'draft' })
          const newWorkId = EditorWorksService.idOf(newWork)

          if (!newWorkId) {
            throw new Error('Missing work ID from create response')
          }

          const firstChapter = await createChapter(newWorkId, { title: 'Chapter 1', contentText: '' })
          const firstChapterId = EditorChaptersService.idOf(firstChapter)

          // Immediately open the editor without depending on a re-fetch.
          setStep('chapter-editor')
          if (firstChapterId) {
            setSelectedChapterId(firstChapterId)
            setChapterTitle(firstChapter.title || 'Chapter 1')
            setChapterContent(firstChapter.contentText || '')
            setShowChapterEditor(true)
          }

          router.replace(`/editor?id=${newWorkId}&created=true`)
          toast.success('Book created. You can start writing now.')
        } catch (innerErr) {
          // If the backend routes are missing (common in early integration),
          // allow users to start writing locally so the editor still appears.
          if (axios.isAxiosError(innerErr) && innerErr.response?.status === 404) {
            const workId =
              (typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `local-${Date.now()}`) as string

            const chapterId =
              (typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `local-ch-${Date.now()}`) as string

            setCurrentWork({ id: workId, title, summary, coverImage, tags } as any)

            setStep('chapter-editor')
            setSelectedChapterId(chapterId)
            setChapterTitle('Chapter 1')
            setShowChapterEditor(true)

            router.replace(`/editor?id=${workId}&created=true`)
            toast.warning('Backend not available (404). Opened editor in local-only mode.')
            return
          }

          throw innerErr
        }
      }
    } catch (err) {
      handleEditorApiError(err, 'save book')
    }
  }

  const handleSelectChapter = useCallback((chapterId: string) => {
    setSelectedChapterId(chapterId)
    const chapter = chapters.find(c => (c.id === chapterId || c._id === chapterId))
    if (chapter) {
      setChapterTitle(chapter.title)
      setChapterPrice(chapter.price || 0)
      setChapterContent(chapter.contentText || '')
    }
    setShowChapterEditor(true)
  }, [chapters])

  const handleDraftContentChange = useCallback(
    (contentHtml: string) => {
      if (!selectedChapterId) return

      setChapterContent(contentHtml)

      if (draftSaveTimeoutRef.current) {
        clearTimeout(draftSaveTimeoutRef.current)
      }

      draftSaveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSavingDraft(true)
          await updateChapter(selectedChapterId, { contentText: contentHtml })
        } catch (err) {
          console.warn('Failed to save chapter draft content:', err)
        } finally {
          setIsSavingDraft(false)
        }
      }, 800)
    },
    [selectedChapterId, updateChapter],
  )

  const handleSaveDraft = useCallback(async () => {
    const workId = editId || (currentWork?.id || currentWork?._id)

    if (!workId) {
      toast.error('Create a book first!')
      return
    }

    if (!selectedChapterId) {
      toast.error('Select a chapter first')
      return
    }

    try {
      setIsSavingDraft(true)
      await updateWork(workId, { title, summary, coverImage, tags, status: 'draft' })
      await updateChapter(selectedChapterId, { title: chapterTitle, contentText: chapterContent, price: chapterPrice })
      toast.success('Draft saved')
    } catch (err) {
      handleEditorApiError(err, 'save draft')
    } finally {
      setIsSavingDraft(false)
    }
  }, [
    editId,
    currentWork,
    selectedChapterId,
    updateWork,
    updateChapter,
    title,
    summary,
    coverImage,
    tags,
    chapterTitle,
    chapterContent,
    handleEditorApiError,
  ])

  useEffect(() => {
    return () => {
      if (draftSaveTimeoutRef.current) {
        clearTimeout(draftSaveTimeoutRef.current)
      }
    }
  }, [])

  const handleAddChapter = useCallback(async () => {
    const workId = editId || (currentWork?.id || currentWork?._id)
    if (!workId) {
      toast.error('Create a book first!')
      return
    }

    try {
      const newChapter = await createChapter(workId, { title: 'Untitled Chapter' })
      toast.success('Chapter added')
      const newId = newChapter.id || newChapter._id
      if (newId) handleSelectChapter(newId)
    } catch (err) {
      handleEditorApiError(err, 'create chapter')
    }
  }, [editId, currentWork, createChapter, handleSelectChapter, handleEditorApiError])

  const handleUpdateChapterTitle = async () => {
    if (!selectedChapterId) return
    try {
      await updateChapter(selectedChapterId, { title: chapterTitle, price: chapterPrice })
      toast.success('Chapter settings updated')
    } catch (err) {
      handleEditorApiError(err, 'update chapter title')
    }
  }

  const handleBackToChapters = useCallback(() => {
    setShowChapterEditor(false)
    setSelectedChapterId(null)
  }, [])

  const handleDeleteChapter = useCallback(async (chapterId: string) => {
      const confirmed = window.confirm('Are you sure you want to delete this chapter?')
      if (!confirmed) return
      try {
        await deleteChapter(chapterId)
        toast.success('Chapter deleted')
        if (selectedChapterId === chapterId) {
          handleBackToChapters()
        }
      } catch (err) {
        handleEditorApiError(err, 'delete chapter')
      }
    },
    [deleteChapter, selectedChapterId, handleBackToChapters, handleEditorApiError]
  )

  const handlePost = async () => {
    const workId = editId || (currentWork?.id || currentWork?._id)
    if (!workId) return

    setIsPosting(true)
    try {
      await publishWork(workId)
      toast.success('Work published successfully!')
      router.push('/dashboard')
    } catch (err) {
      handleEditorApiError(err, 'publish book')
    } finally {
      setIsPosting(false)
    }
  }

  const getHeaderTitle = () => {
    if (editId) return 'Edit Story'
    if (step === 'book-details') return 'Create New Book'
    return 'Write Chapter'
  }

  if (editId && isWorkLoading && !currentWork) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="text-lg font-medium text-primary">{getHeaderTitle()}</span>
        </div>
        <div className="flex items-center gap-4">
          {editId && (
             <>
               <Button variant="ghost" size="sm" onClick={() => setIsCollabModalOpen(true)} className="flex items-center gap-2">
                 <UserPlus size={18} />
                 <span className="hidden sm:inline">Collaborators</span>
               </Button>
               <Button variant="outline" size="sm" onClick={handleSaveBookDetails}>
                 Save Details
               </Button>
             </>
          )}
          <ThemeToggle />
        </div>
      </header>

      {editId && (
        <CollaboratorsModal
          workId={editId}
          isOpen={isCollabModalOpen}
          onClose={() => setIsCollabModalOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Step 1: Book Details */}
        {step === 'book-details' && !editId && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Cover Upload */}
              <div className="flex flex-col gap-3">
                <Label className="text-sm font-semibold">Book Cover</Label>
                <CoverUpload value={coverImage} onChange={setCoverImage} />
              </div>

              {/* Title and Summary */}
              <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Book Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. The Last Whisper"
                    className="text-lg font-medium h-12"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="summary" className="text-sm font-semibold">
                    Summary
                  </Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="What is your story about?"
                    rows={6}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold text-foreground">Genre Tags</Label>
              <TagInput tags={tags} onChange={setTags} />
            </div>

            {/* Create Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveBookDetails}
                disabled={!title.trim() || isWorkLoading}
                size="lg"
                className="min-w-40 shadow-lg shadow-primary/20"
              >
                {isWorkLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Book
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Chapter Editor */}
        {(step === 'chapter-editor' || editId) && (
          <div className="flex flex-col gap-8">
            {/* Book Info Section (Collapsible or visible when not in chapter editor) */}
            {!showChapterEditor && editId && (
              <div className="animate-in fade-in duration-500 space-y-6 bg-card/30 p-6 rounded-xl border border-border/50">
                <div className="flex flex-col md:flex-row gap-6">
                  <CoverUpload value={coverImage} onChange={setCoverImage} />
                  <div className="flex flex-1 flex-col gap-4">
                    <Input
                      title="Book Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-2xl font-bold border-none bg-transparent hover:bg-muted/50 transition-colors px-0 h-auto"
                      placeholder="Enter book title"
                    />
                    <Textarea
                      title="Summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="border-none bg-transparent hover:bg-muted/50 transition-colors px-0 resize-none"
                      placeholder="Add a summary..."
                      rows={3}
                    />
                    <TagInput tags={tags} onChange={setTags} />
                  </div>
                </div>
              </div>
            )}

            {showChapterEditor ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-6">
                {/* Chapter Title */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chapterTitle" className="text-sm font-semibold">
                      Chapter Title
                    </Label>
                    <Button variant="ghost" size="sm" onClick={handleBackToChapters} className="text-muted-foreground hover:text-primary">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Back to Chapters
                    </Button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <Label htmlFor="chapterTitle" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Chapter Title
                      </Label>
                      <Input
                        id="chapterTitle"
                        type="text"
                        value={chapterTitle}
                        onChange={(e) => setChapterTitle(e.target.value)}
                        placeholder="E.g. Prologue: The Awakening"
                        className="h-12 font-medium"
                      />
                    </div>
                    <div className="w-full md:w-40 flex flex-col gap-2">
                      <Label htmlFor="chapterPrice" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Price (ETB)
                      </Label>
                      <div className="relative">
                        <Input
                          id="chapterPrice"
                          type="number"
                          value={chapterPrice}
                          onChange={(e) => setChapterPrice(Number(e.target.value))}
                          placeholder="0"
                          className="h-12 pl-12 font-medium"
                          min="0"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-xs">
                          ETB
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button variant="secondary" onClick={handleUpdateChapterTitle} className="h-12 px-6" title="Save Title & Price">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                  {isSavingDraft && (
                    <p className="text-xs text-muted-foreground">Saving draft...</p>
                  )}
                </div>

                {/* Chapter Editor */}
                <div className="flex flex-col gap-3">
                  <Label className="text-sm font-semibold">Content</Label>
                  <TiptapEditor
                    ydoc={ydoc}
                    initialContent={selectedChapter?.contentText ?? ''}
                    onContentChange={handleDraftContentChange}
                  />
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-between gap-2 pt-4">
                  <Button variant="outline" onClick={handleBackToChapters}>
                    Done Editing
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={isSavingDraft}
                      className="min-w-30"
                    >
                      {isSavingDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save Draft
                    </Button>
                    <Button 
                      variant="default"
                      onClick={handlePost} 
                      disabled={isPosting}
                      className="min-w-30 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Publish Book
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500 flex flex-col gap-6">
                {/* Chapter List */}
                <ChapterList
                  chapters={chapters as any}
                  selectedChapterId={selectedChapterId}
                  onSelectChapter={handleSelectChapter}
                  onAddChapter={handleAddChapter}
                  onDeleteChapter={handleDeleteChapter}
                />

                {/* Final Publish Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    onClick={handlePost}
                    disabled={isPosting || !title.trim() || chapters.length === 0}
                    size="lg"
                    className="px-8 py-6 rounded-full shadow-xl shadow-primary/30"
                  >
                    {isPosting ? (
                      <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        <span className="text-lg">Publish Masterpiece</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
