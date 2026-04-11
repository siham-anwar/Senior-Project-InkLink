import { create } from 'zustand'
import { EditorWorksService, WorkDto } from '../services/editor-works.service'

interface WorksState {
  works: WorkDto[]
  currentWork: WorkDto | null
  isLoading: boolean
  error: string | null

  fetchWorks: (authorId?: string) => Promise<void>
  fetchWorkById: (id: string) => Promise<WorkDto>
  createWork: (dto: {
    title: string
    summary?: string
    coverImage?: string
    tags?: string[]
    status?: 'draft' | 'pending_moderation'
  }) => Promise<WorkDto>
  updateWork: (id: string, dto: Partial<WorkDto>) => Promise<WorkDto>
  publishWork: (id: string) => Promise<void>
  deleteWork: (id: string) => Promise<void>
  setCurrentWork: (work: WorkDto | null) => void
}

export const useWorksStore = create<WorksState>((set, get) => ({
  works: [],
  currentWork: null,
  isLoading: false,
  error: null,

  fetchWorks: async (authorId) => {
    set({ isLoading: true, error: null })
    try {
      const works = await EditorWorksService.list(authorId)
      set({ works })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch works' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchWorkById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const work = await EditorWorksService.getById(id)
      set({ currentWork: work })
      return work
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch work' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  createWork: async (dto) => {
    set({ isLoading: true, error: null })
    try {
      const newWork = await EditorWorksService.create(dto)
      set((state) => ({ works: [newWork, ...state.works], currentWork: newWork }))
      return newWork
    } catch (err: any) {
      set({ error: err.message || 'Failed to create work' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  updateWork: async (id, dto) => {
    set({ isLoading: true, error: null })
    try {
      const updatedWork = await EditorWorksService.update(id, dto as any)
      set((state) => ({
        works: state.works.map((w) => (EditorWorksService.idOf(w) === id ? updatedWork : w)),
        currentWork: state.currentWork && EditorWorksService.idOf(state.currentWork) === id ? updatedWork : state.currentWork,
      }))
      return updatedWork
    } catch (err: any) {
      set({ error: err.message || 'Failed to update work' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  publishWork: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const updatedWork = await EditorWorksService.publish(id)
      set((state) => ({
        works: state.works.map((w) =>
          EditorWorksService.idOf(w) === id ? { ...w, ...updatedWork } : w,
        ),
        currentWork:
          state.currentWork && EditorWorksService.idOf(state.currentWork) === id
            ? { ...state.currentWork, ...updatedWork }
            : state.currentWork,
      }))
      return updatedWork
    } catch (err: any) {
      set({ error: err.message || 'Failed to publish work' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  deleteWork: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await EditorWorksService.delete(id)
      set((state) => ({
        works: state.works.filter((w) => EditorWorksService.idOf(w) !== id),
        currentWork: state.currentWork && EditorWorksService.idOf(state.currentWork) === id ? null : state.currentWork,
      }))
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete work' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  setCurrentWork: (work) => set({ currentWork: work }),
}))
