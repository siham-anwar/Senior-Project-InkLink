import { create } from 'zustand'
import { EditorChaptersService, ChapterDto } from '../services/editor-chapters.service'

interface ChaptersState {
  chapters: ChapterDto[]
  isLoading: boolean
  error: string | null

  fetchChapters: (workId: string) => Promise<ChapterDto[]>

  createChapter: (workId: string, dto: { title: string; contentText?: string; orderIndex?: number; price?: number }) => Promise<ChapterDto>
  updateChapter: (id: string, dto: { title?: string; contentText?: string; price?: number }) => Promise<ChapterDto>
  deleteChapter: (id: string) => Promise<void>
  reorderChapters: (workId: string, chapterIds: string[]) => Promise<void>
}

export const useChaptersStore = create<ChaptersState>((set, get) => ({
  chapters: [],
  isLoading: false,
  error: null,

  fetchChapters: async (workId) => {
    set({ isLoading: true, error: null })
    try {
      const chapters = await EditorChaptersService.listByWork(workId)
      set({ chapters })
      return chapters
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch chapters' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  createChapter: async (workId, dto) => {
    set({ isLoading: true, error: null })
    try {
      const newChapter = await EditorChaptersService.create(workId, dto)
      set((state) => ({ chapters: [...state.chapters, newChapter] }))
      return newChapter
    } catch (err: any) {
      set({ error: err.message || 'Failed to create chapter' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  updateChapter: async (id, dto) => {
    set({ isLoading: true, error: null })
    try {
      const updatedChapter = await EditorChaptersService.update(id, dto)
      set((state) => ({
        chapters: state.chapters.map((c) => (EditorChaptersService.idOf(c) === id ? updatedChapter : c)),
      }))
      return updatedChapter
    } catch (err: any) {
      set({ error: err.message || 'Failed to update chapter' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  deleteChapter: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await EditorChaptersService.remove(id)
      set((state) => ({
        chapters: state.chapters.filter((c) => EditorChaptersService.idOf(c) !== id),
      }))
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete chapter' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  reorderChapters: async (workId, chapterIds) => {
    set({ isLoading: true, error: null })
    try {
       // Optimistic update
       const oldChapters = [...get().chapters];
       const reordered = chapterIds.map(id => oldChapters.find(c => EditorChaptersService.idOf(c) === id)!).filter(Boolean);
       set({ chapters: reordered });

      await EditorChaptersService.reorder(workId, { chapterIds })
    } catch (err: any) {
      set({ error: err.message || 'Failed to reorder chapters' })
      // Revert or re-fetch
      await get().fetchChapters(workId);
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
}))
