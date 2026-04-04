export interface Chapter {
  id: string
  title: string
  content: string // Serialized Yjs content or HTML
  createdAt: Date
  updatedAt: Date
}

export interface Work {
  id: string
  title: string
  coverImage?: string
  summary: string
  tags: string[]
  chapters: Chapter[]
  createdAt: Date
  updatedAt: Date
}

export type PostStatus = 'successful' | 'Warning' | 'Fail'
