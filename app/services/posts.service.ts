import { api } from '@/lib/api'

export interface PostDto {
  _id: string
  authorId: any // Could be populated or just ID
  content: string
  likes: string[]
  likesCount: number
  createdAt: string
  updatedAt: string
}

export const PostsService = {
  create: async (content: string): Promise<PostDto> => {
    const res = await api.post('/posts', { content })
    return res.data
  },

  listByAuthor: async (authorId: string): Promise<PostDto[]> => {
    const res = await api.get(`/posts/author/${authorId}`)
    return res.data
  },

  getFeed: async (): Promise<PostDto[]> => {
    const res = await api.get('/posts/feed')
    return res.data
  },

  like: async (postId: string): Promise<PostDto> => {
    const res = await api.post(`/posts/${postId}/like`)
    return res.data
  },

  dismiss: async (postId: string): Promise<void> => {
    await api.post(`/posts/${postId}/dismiss`)
  },

  delete: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`)
  }
}
