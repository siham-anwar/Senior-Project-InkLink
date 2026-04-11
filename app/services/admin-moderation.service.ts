import { api } from '@/lib/api'

export type AdminModerationQueueStatus = 'needs_admin_review' | 'rejected' | 'all'

export type AdminWorkModerationStatus =
  | 'draft'
  | 'pending_moderation'
  | 'needs_admin_review'
  | 'approved'
  | 'rejected'
  | 'published'

export interface AdminWorkQueueItemDto {
  id: string
  authorId?: string
  authorUsername?: string
  title: string
  summary?: string
  coverImage?: string
  tags?: string[]
  status: AdminWorkModerationStatus
  moderationConfidence?: number
  moderationReason?: string
  childSafe?: boolean
  adultSafe?: boolean
  reviewedBy?: string
  reviewedAt?: string
  moderationUpdatedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface AdminChapterDto {
  id: string
  workId: string
  title: string
  orderIndex?: number
  contentText?: string
  moderationStatus?: 'draft' | 'pending_moderation' | 'needs_admin_review' | 'approved' | 'rejected'
  moderationConfidence?: number
  moderationReason?: string
  childSafe?: boolean
  adultSafe?: boolean
  moderationUpdatedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface AdminWorkDetailsDto extends AdminWorkQueueItemDto {
  chapters: AdminChapterDto[]
}

const toArray = <T>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.data)) return payload.data as T[]
  if (Array.isArray(payload?.items)) return payload.items as T[]
  return []
}

const toObject = <T>(payload: any): T => {
  if (!payload || typeof payload !== 'object') return payload as T
  return (payload.data ?? payload) as T
}

export const AdminModerationService = {
  listReviewQueue: async (status: AdminModerationQueueStatus = 'needs_admin_review') => {
    const res = await api.get('/works/admin/moderation/review-queue', {
      params: status ? { status } : undefined,
    })
    return toArray<AdminWorkQueueItemDto>(res.data)
  },

  getWorkDetails: async (id: string) => {
    const res = await api.get(`/works/admin/${id}`)
    return toObject<AdminWorkDetailsDto>(res.data)
  },

  approveWork: async (id: string) => {
    const res = await api.post(`/works/admin/${id}/moderation/approve`)
    return toObject<AdminWorkQueueItemDto>(res.data)
  },

  rejectWork: async (id: string) => {
    const res = await api.post(`/works/admin/${id}/moderation/reject`)
    return toObject<AdminWorkQueueItemDto>(res.data)
  },

  flagWork: async (id: string) => {
    const res = await api.post(`/works/admin/${id}/moderation/flag`)
    return toObject<AdminWorkQueueItemDto>(res.data)
  },
}

