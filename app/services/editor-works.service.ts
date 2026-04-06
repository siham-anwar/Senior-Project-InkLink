import { api } from '@/lib/api'

export interface WorkDto {
  _id?: string
  id?: string
  authorId?: string
  title: string
  summary?: string
  coverImage?: string
  tags?: string[]
  status?: 'draft' | 'published'
  createdAt?: string
  updatedAt?: string
  chapters?: any[]
}

const toWork = (payload: any): WorkDto => {
  if (!payload || typeof payload !== 'object') return payload as WorkDto
  return (payload.work ?? payload.data?.work ?? payload.data ?? payload) as WorkDto
}

const toWorks = (payload: any): WorkDto[] => {
  if (Array.isArray(payload)) return payload as WorkDto[]
  if (Array.isArray(payload?.works)) return payload.works as WorkDto[]
  if (Array.isArray(payload?.data?.works)) return payload.data.works as WorkDto[]
  if (Array.isArray(payload?.data)) return payload.data as WorkDto[]
  return []
}

const workIdOf = (work: WorkDto) => {
  const nested = work as any
  return (
    work.id ??
    work._id ??
    nested?.workId ??
    nested?.work?.id ??
    nested?.work?._id ??
    nested?.data?.id ??
    nested?.data?._id ??
    ''
  )
}

export const EditorWorksService = {
  list: async (authorId?: string) => {
    const res = await api.get('/works', { params: authorId ? { authorId } : undefined })
    return toWorks(res.data)
  },

  create: async (dto: { title: string; summary?: string; coverImage?: string; tags?: string[]; status?: 'draft' | 'published' }) => {
    const res = await api.post('/works', dto)
    return toWork(res.data)
  },

  getById: async (id: string) => {
    const res = await api.get(`/works/${id}`)
    return toWork(res.data)
  },

  update: async (
    id: string,
    dto: {
      title?: string
      summary?: string
      coverImage?: string
      tags?: string[]
      status?: 'draft' | 'published'
    }
  ) => {
    const res = await api.patch(`/works/${id}`, dto)
    return toWork(res.data)
  },

  publish: async (id: string) => {
    const res = await api.post(`/works/${id}/publish`)
    return res.data
  },

  idOf: workIdOf,
}

