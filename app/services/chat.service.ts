import { api } from '@/lib/api'

export interface ChatRoomDto {
  _id: string
  id?: string
  type: 'author' | 'direct' | 'group'
  authorId?: string
  directKey?: string
  title?: string
  lastMessage?: ChatMessageDto
  otherParticipantId?: string
  otherParticipantName?: string
  otherParticipantAvatar?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessageDto {
  _id: string
  id?: string
  chatRoomId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
}

export const ChatService = {
  getInbox: async (): Promise<ChatRoomDto[]> => {
    const res = await api.get('/chat/inbox')
    return res.data
  },

  getMessages: async (roomId: string): Promise<ChatMessageDto[]> => {
    const res = await api.get(`/chat/${roomId}/messages`)
    return res.data
  },

  getOrCreateDirectRoom: async (targetUserId: string): Promise<ChatRoomDto> => {
    const res = await api.post('/chat/direct', { targetUserId })
    return res.data
  },

  sendMessage: async (roomId: string, content: string): Promise<ChatMessageDto> => {
    const res = await api.post(`/chat/${roomId}/messages`, { content })
    return res.data
  },
}
