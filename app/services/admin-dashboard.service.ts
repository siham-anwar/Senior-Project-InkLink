import { api } from '@/lib/api'

export interface AdminOverviewDto {
  users: number
  authors: number
  content: number
  premiumSubscriptions: number
  platformHealth: number
  serverStatus: string
}

export interface AdminUserDto {
  id: string
  name: string
  email: string
  bio: string
  joinDate: string
  profileImage: string
}

export interface AdminAuthorDto {
  id: string
  name: string
  username: string
  bio: string
  profileImage: string
  isMonetized: boolean
  followers: number
  worksCount: number
}

export interface AdminContentDto {
  id: string
  title: string
  workTitle: string
  author: string
  publishedAt: string
  status: 'success' | 'warning' | 'fail'
  content: string
}

export interface AdminPricingPlanDto {
  id: string
  name: string
  price: number
  currency: string
  period: string
}

export const AdminDashboardService = {
  getOverview: async () => {
    const res = await api.get('/admin/overview')
    return res.data as AdminOverviewDto
  },

  getUsers: async (search?: string) => {
    const res = await api.get('/admin/users', {
      params: search ? { search } : undefined,
    })
    return res.data as AdminUserDto[]
  },

  deleteUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`)
  },

  getAuthors: async (search?: string, monetized?: boolean) => {
    const res = await api.get('/admin/authors', {
      params: {
        ...(search ? { search } : {}),
        ...(typeof monetized === 'boolean' ? { monetized } : {}),
      },
    })
    return res.data as AdminAuthorDto[]
  },

  updateAuthorMonetization: async (id: string, isMonetized: boolean) => {
    const res = await api.patch(`/admin/authors/${id}/monetization`, {
      isMonetized,
    })
    return res.data as { id: string; isMonetized: boolean }
  },

  deleteAuthor: async (id: string) => {
    await api.delete(`/admin/authors/${id}`)
  },

  getContent: async (
    search?: string,
    status?: 'success' | 'warning' | 'fail',
  ) => {
    const res = await api.get('/admin/content', {
      params: {
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      },
    })
    return res.data as AdminContentDto[]
  },

  publishContent: async (id: string) => {
    const res = await api.patch(`/admin/content/${id}/publish`)
    return res.data as { id: string; status: 'success' }
  },

  deleteContent: async (id: string) => {
    await api.delete(`/admin/content/${id}`)
  },

  getPricing: async () => {
    const res = await api.get('/admin/pricing')
    return (res.data?.plans || []) as AdminPricingPlanDto[]
  },

  updatePricing: async (plans: AdminPricingPlanDto[]) => {
    const res = await api.put('/admin/pricing', { plans })
    return (res.data?.plans || []) as AdminPricingPlanDto[]
  },

  getRevenue: async () => {
    const res = await api.get('/admin/revenue')
    return res.data
  },

  getSubscriptions: async () => {
    const res = await api.get('/admin/subscriptions')
    return res.data as AdminSubscriptionDto[]
  },
}

export interface AdminSubscriptionDto {
  id: string
  userId: string
  username: string
  email: string
  plan: string
  price: number
  status: string
  startDate: string
  endDate: string
}
