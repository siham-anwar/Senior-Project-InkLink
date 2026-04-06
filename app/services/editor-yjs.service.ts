import { api } from '@/lib/api'

export const EditorYjsService = {
  appendUpdate: async (docId: string, updateBase64: string) => {
    const res = await api.post(`/yjs/docs/${docId}/updates`, { update: updateBase64 })
    return res.data
  },

  getState: async (docId: string) => {
    const res = await api.get(`/yjs/docs/${docId}/state`)
    return res.data as { state: string; sv: string }
  },

  getDiff: async (docId: string, svBase64: string) => {
    const res = await api.get(`/yjs/docs/${docId}/diff`, { params: { sv: svBase64 } })
    return res.data as { update: string }
  },
}

