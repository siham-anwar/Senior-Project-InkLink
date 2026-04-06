export interface Chapter {
  id: string
  _id?: string
  title: string
  content: string // Serialized Yjs content or HTML
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Work {
  id: string
  _id?: string
  title: string
  coverImage?: string
  summary: string
  tags: string[]
  chapters: Chapter[]
  status?: 'draft' | 'published'
  createdAt: Date | string
  updatedAt: Date | string
}

export type PostStatus = 'successful' | 'Warning' | 'Fail'
