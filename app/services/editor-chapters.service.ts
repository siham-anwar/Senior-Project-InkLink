import { api } from '@/lib/api'

export interface ChapterDto {
  _id?: string
  id?: string
  workId?: string
  title: string
  contentText?: string
  orderIndex?: number
  price?: number
  moderationStatus?: 'draft' | 'pending_moderation' | 'needs_admin_review' | 'approved' | 'rejected'
  moderationConfidence?: number
  moderationReason?: string
  childSafe?: boolean
  adultSafe?: boolean
  moderationUpdatedAt?: string
  createdAt?: string
  updatedAt?: string
}

const toChapter = (payload: any): ChapterDto => {
  if (!payload || typeof payload !== 'object') return payload as ChapterDto
  return (payload.chapter ?? payload.data?.chapter ?? payload.data ?? payload) as ChapterDto
}

const toChapters = (payload: any): ChapterDto[] => {
  if (Array.isArray(payload)) return payload as ChapterDto[]
  if (Array.isArray(payload?.chapters)) return payload.chapters as ChapterDto[]
  if (Array.isArray(payload?.data?.chapters)) return payload.data.chapters as ChapterDto[]
  if (Array.isArray(payload?.data)) return payload.data as ChapterDto[]
  return []
}

const chapterIdOf = (chapter: ChapterDto) => {
  const nested = chapter as any
  return (
    chapter.id ??
    chapter._id ??
    nested?.chapterId ??
    nested?.chapter?.id ??
    nested?.chapter?._id ??
    nested?.data?.id ??
    nested?.data?._id ??
    ''
  )
}

export const EditorChaptersService = {
  listByWork: async (workId: string) => {
    const res = await api.get(`/works/${workId}/chapters`)
    return toChapters(res.data)
  },

  create: async (
    workId: string,
    dto: { title: string; contentText?: string; orderIndex?: number; price?: number }
  ) => {
    const res = await api.post(`/works/${workId}/chapters`, dto)
    return toChapter(res.data)
  },

  update: async (id: string, dto: { title?: string; contentText?: string; price?: number }) => {
    const res = await api.patch(`/chapters/${id}`, dto)
    return toChapter(res.data)
  },

  remove: async (id: string) => {
    const res = await api.delete(`/chapters/${id}`)
    return res.data
  },

  reorder: async (
    workId: string,
    dto: {
      chapterIds?: string[]
      orders?: { id: string; orderIndex: number }[]
    }
  ) => {
    const res = await api.post(`/works/${workId}/chapters/reorder`, dto)
    return res.data
  },

  idOf: chapterIdOf,
}

