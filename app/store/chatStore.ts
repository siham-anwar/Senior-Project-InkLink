import { create } from 'zustand'
import { ChatService, ChatRoomDto, ChatMessageDto } from '../services/chat.service'

interface ChatState {
  conversations: ChatRoomDto[]
  activeConversation: ChatRoomDto | null
  messages: ChatMessageDto[]
  isLoading: boolean
  socket: WebSocket | null

  fetchConversations: () => Promise<void>
  setActiveConversation: (conversation: ChatRoomDto) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  initSocket: (token: string) => void
  closeSocket: () => void
}

const PROD_WS_URL = 'wss://inklink-backend-y0p5.onrender.com/chat-ws'

const isLocalUrl = (value?: string) =>
  typeof value === 'string' && /^(wss?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(value)

const resolveWsUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_WS_URL?.trim()
  const isLocalHost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')

  if (envUrl) {
    // Never allow a localhost WS URL when the frontend is running on a non-local hostname.
    if (isLocalUrl(envUrl)) {
      return isLocalHost ? envUrl : PROD_WS_URL
    }

    return envUrl
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return PROD_WS_URL
    }
  }

  return PROD_WS_URL
}

const WS_URL = resolveWsUrl()

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  socket: null,

  fetchConversations: async () => {
    set({ isLoading: true })
    try {
      const conversations = await ChatService.getInbox()
      set({ conversations })
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  setActiveConversation: async (conversation) => {
    set({ activeConversation: conversation, isLoading: true })
    try {
      const roomId = conversation._id || conversation.id
      if (roomId) {
        const messages = await ChatService.getMessages(roomId)
        set({ messages })
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  sendMessage: async (content) => {
    const { activeConversation, socket } = get()
    if (!activeConversation) return

    const roomId = activeConversation._id || activeConversation.id
    if (!roomId) return

    // If socket is available, send via socket for real-time
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        event: 'sendMessage',
        data: { roomId, content }
      }))
    } else {
      // Fallback to REST
      try {
        const newMessage = await ChatService.sendMessage(roomId, content)
        set((state) => ({ messages: [...state.messages, newMessage] }))
      } catch (error) {
        console.error('Failed to send message via REST:', error)
      }
    }
  },

  initSocket: (token) => {
    const existingSocket = get().socket
    if (existingSocket) existingSocket.close()

    const url = token ? `${WS_URL}?token=${token}` : WS_URL
    const socket = new WebSocket(url)


    socket.onmessage = (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data)
        if (eventName === 'newMessage') {
          const { activeConversation } = get()
          const activeRoomId = activeConversation?._id || activeConversation?.id
          
          if (activeRoomId === data.chatRoomId) {
            set((state) => ({ messages: [...state.messages, data] }))
          }
          
          // Update conversations list (move to top, update last message)
          set((state) => {
            const updatedConversations = state.conversations.map(c => {
              const roomId = c._id || c.id
              if (roomId === data.chatRoomId) {
                return { ...c, lastMessage: data }
              }
              return c
            }).sort((a, b) => {
               const timeA = new Date(a.lastMessage?.createdAt || a.createdAt).getTime()
               const timeB = new Date(b.lastMessage?.createdAt || b.createdAt).getTime()
               return timeB - timeA
            })
            return { conversations: updatedConversations }
          })
        }
      } catch (e) {
        console.error('Error parsing WS message:', e)
      }
    }

    socket.onclose = () => {
      console.log('Chat socket closed')
      set({ socket: null })
    }

    set({ socket })
  },

  closeSocket: () => {
    const { socket } = get()
    if (socket) socket.close()
    set({ socket: null })
  }
}))
