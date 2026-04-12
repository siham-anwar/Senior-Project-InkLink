export type ModerationVerdict =
  | 'draft'
  | 'pending_moderation'
  | 'needs_admin_review'
  | 'approved'
  | 'rejected'
  | 'published'

export interface Chapter {
  id: string
  _id?: string
  workId?: string
  title: string
  contentText?: string
  moderationStatus?: 'draft' | 'pending_moderation' | 'needs_admin_review' | 'approved' | 'rejected'
  moderationConfidence?: number
  moderationReason?: string
  childSafe?: boolean
  adultSafe?: boolean
  moderationUpdatedAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Work {
  id: string
  _id?: string
  authorId?: string
  authorUsername?: string
  title: string
  coverImage?: string
  summary?: string
  tags: string[]
  chapters?: Chapter[]
  status?: ModerationVerdict
  moderationConfidence?: number
  moderationReason?: string
  childSafe?: boolean
  adultSafe?: boolean
  reviewedBy?: string
  reviewedAt?: Date | string
  moderationUpdatedAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export type PostStatus = 'successful' | 'Warning' | 'Fail'
