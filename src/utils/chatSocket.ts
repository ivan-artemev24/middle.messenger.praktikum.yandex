// src/utils/chatSocket.ts

export type MessageType = 'message' | 'pong'

export interface ChatMessage {
  id?: number
  content: string
  type: MessageType
  time?: string
  user_id?: number
  isMine?: boolean
}

export class ChatSocket {
  private socket: WebSocket | null = null
  private pingInterval: number | null = null
  private readonly chatId: number
  private readonly userId: number
  private readonly token: string

  constructor (chatId: number, userId: number, token: string) {
    this.chatId = chatId
    this.userId = userId
    this.token = token
  }

  connect (onMessage: (msg: ChatMessage) => void, onHistory?: (messages: ChatMessage[]) => void) {
    const url = `wss://ya-praktikum.tech/ws/chats/${this.userId}/${this.chatId}/${this.token}`
    this.socket = new WebSocket(url)

    this.socket.addEventListener('open', () => {
      console.log('[WebSocket] Соединение открыто')
      this.getOldMessages()
      this.startPing()
    })

    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data as string) as unknown
        if (Array.isArray(data)) {
          // Это история сообщений
          const messages: ChatMessage[] = (data).map((msg: any) => ({
            id: msg.id,
            content: String(msg.content),
            type: msg.type,
            time: msg.time,
            user_id: msg.user_id,
            isMine: msg.user_id === this.userId
          }))
          onHistory?.(messages)
        } else {
          // Это новое сообщение
          const payload = data as any
          const message: ChatMessage = {
            id: payload.id,
            content: String(payload.content),
            type: payload.type,
            time: payload.time,
            user_id: payload.user_id,
            isMine: payload.user_id === this.userId
          }
          onMessage(message)
        }
      } catch (e) {
        console.error('Ошибка парсинга сообщения:', e)
      }
    })

    this.socket.addEventListener('close', () => {
      console.log('[WebSocket] Соединение закрыто')
      this.stopPing()
    })

    this.socket.addEventListener('error', (e) => {
      console.error('[WebSocket] Ошибка:', e)
    })
  }

  send (content: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        content,
        type: 'message'
      }))
    }
  }

  getOldMessages () {
    this.socket?.send(JSON.stringify({
      content: '0',
      type: 'get old'
    }))
  }

  private startPing () {
    this.pingInterval = window.setInterval(() => {
      this.socket?.send(JSON.stringify({ type: 'ping' }))
    }, 10000)
  }

  private stopPing () {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
    }
  }

  close () {
    this.stopPing()
    this.socket?.close()
  }
}

console.log('✅ ChatMessage доступен')
