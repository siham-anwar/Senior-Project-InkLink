import { api } from '@/lib/api'

export interface SubscriptionPlan {
  plan: 'weekly' | 'monthly' | 'yearly'
  price: number
  days: number
  currency: string
}

export interface ActiveSubscription {
  id: string
  plan: 'weekly' | 'monthly' | 'yearly'
  price: number
  status: 'active' | 'expired' | 'cancelled'
  startDate: string
  endDate: string
}

export interface ChapterAccess {
  hasAccess: boolean
  accessType: 'free' | 'purchase' | 'subscription' | 'author' | 'none'
  price: number
  isPremiumSubscriber: boolean
}

export interface PurchaseResult {
  id: string
  chapterId: string
  price: number
  authorShare: number
  platformShare: number
  message: string
}

const unwrap = (res: any) => res.data?.data ?? res.data ?? res

export const SubscriptionService = {
  /** Get available subscription plans */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const res = await api.get('/subscriptions/plans')
    return unwrap(res)
  },

  /** Get current user's active subscription */
  getMySubscription: async (): Promise<ActiveSubscription | null> => {
    const res = await api.get('/subscriptions/me')
    return unwrap(res) || null
  },

  /** Subscribe to a plan */
  subscribe: async (plan: 'weekly' | 'monthly' | 'yearly', returnUrl?: string): Promise<ActiveSubscription | void> => {
    const fallbackUrl = typeof window !== 'undefined' ? window.location.href : '';
    const res = await api.post('/subscriptions', { plan, returnUrl: returnUrl || fallbackUrl })
    const data = unwrap(res)
    if (data?.checkoutUrl && typeof window !== 'undefined') {
      window.location.href = data.checkoutUrl
      return;
    }
    return data
  },

  /** Cancel active subscription */
  cancel: async () => {
    const res = await api.post('/subscriptions/cancel')
    return unwrap(res)
  },

  /** Check if user can read a chapter */
  checkAccess: async (chapterId: string): Promise<ChapterAccess> => {
    const res = await api.get(`/chapters/${chapterId}/access`)
    return unwrap(res)
  },

  /** Purchase a single chapter */
  purchaseChapter: async (chapterId: string, returnUrl?: string): Promise<PurchaseResult | void> => {
    const fallbackUrl = typeof window !== 'undefined' ? window.location.href : '';
    const res = await api.post(`/chapters/${chapterId}/purchase`, { returnUrl: returnUrl || fallbackUrl })
    const data = unwrap(res)
    if (data?.checkoutUrl && typeof window !== 'undefined') {
      window.location.href = data.checkoutUrl
      return;
    }
    return data
  },

  /** Log read progress */
  logReadProgress: async (chapterId: string, readPercentage: number) => {
    const res = await api.post(`/chapters/${chapterId}/read-progress`, { readPercentage })
    return unwrap(res)
  },

  /** Get user's purchased chapters */
  getMyPurchases: async () => {
    const res = await api.get('/purchases/me')
    return unwrap(res)
  },

  /** Donate to an author */
  donate: async (authorId: string, amount: number, returnUrl?: string): Promise<void> => {
    const fallbackUrl = typeof window !== 'undefined' ? window.location.href : '';
    const res = await api.post('/donations', { authorId, amount, returnUrl: returnUrl || fallbackUrl })
    const data = unwrap(res)
    if (data?.checkoutUrl && typeof window !== 'undefined') {
      window.location.href = data.checkoutUrl
      return;
    }
  },
}
