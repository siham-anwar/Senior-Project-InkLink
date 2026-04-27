import { api } from '@/lib/api'

export interface RatingResponse {
  averageRating: number
  ratingsCount: number
  userRating: number | null
}

export const RatingsService = {
  getWorkRating: async (workId: string, userId?: string): Promise<RatingResponse> => {
    const res = await api.get(`/ratings/work/${workId}`, {
      params: userId ? { userId } : undefined,
    })
    return res.data
  },

  rateWork: async (workId: string, value: number): Promise<RatingResponse> => {
    const res = await api.post(`/ratings/work/${workId}`, { value })
    return res.data
  },
}
