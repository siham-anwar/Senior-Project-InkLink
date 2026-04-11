import { api } from '@/lib/api'

export type ModerateTextVerdict = 'safe' | 'unsafe' | 'needs_admin_review'

export interface ModerateTextResponse {
  verdict: ModerateTextVerdict
  confidence: number
  childSafe: boolean
  adultSafe: boolean
  reason: string
}

export const ModerationApiService = {
  analyzeText: async (text: string): Promise<ModerateTextResponse> => {
    const res = await api.post<ModerateTextResponse>('/moderation/analyze-text', { text })
    return res.data
  },
}
