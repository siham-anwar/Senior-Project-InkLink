import { api } from '@/lib/api'

export type ChapterReactionSummary = {
  chapterId: string
  likesCount: number
  commentsCount: number
  viewerHasLiked: boolean
}

export type ChapterCommentDto = {
  id: string
  chapterId: string
  userId: string
  author: string
  avatar: string
  text: string
  createdAt: string
}

const toSummary = (payload: any): ChapterReactionSummary => {
  if (!payload || typeof payload !== 'object') return payload as ChapterReactionSummary
  return (payload.data?.summary ?? payload.data ?? payload) as ChapterReactionSummary
}

const toCommentsPage = (payload: any): { items: ChapterCommentDto[]; nextCursor: string | null } => {
  if (!payload || typeof payload !== 'object') {
    return { items: [], nextCursor: null }
  }
  return (payload.data ?? payload) as { items: ChapterCommentDto[]; nextCursor: string | null }
}

export const ReactionsService = {
  getSummary: async (chapterId: string) => {
    const res = await api.get(`/chapters/${chapterId}/reactions`)
    return toSummary(res.data)
  },

  toggleLike: async (chapterId: string) => {
    const res = await api.post(`/chapters/${chapterId}/like`)
    return toSummary(res.data)
  },

  listComments: async (chapterId: string, params?: { limit?: number; cursor?: string }) => {
    const res = await api.get(`/chapters/${chapterId}/comments`, { params })
    return toCommentsPage(res.data)
  },

  addComment: async (chapterId: string, dto: { text: string }) => {
    const res = await api.post(`/chapters/${chapterId}/comments`, dto)
    return (res.data?.data ?? res.data) as ChapterCommentDto
  },
}

