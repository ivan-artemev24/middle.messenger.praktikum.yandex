// src/api/chatsApi.ts

import { HTTPTransport } from './http'

const http = new HTTPTransport()

export const chatsApi = {
  // Получить список чатов
  async getChats () {
    return await http.get<Array<{ id: number, title: string, avatar: string | null, unread_count?: number, last_message?: { content: string, time: string } | null }>>('/chats')
  },

  // Создать новый чат
  async createChat (data: { title: string }) {
    return await http.post('/chats', data)
  },

  // Удалить чат
  async deleteChat (chatId: number) {
    return await http.delete('/chats', { chatId })
  },

  // Получить пользователей чата
  async getChatUsers (chatId: number) {
    return await http.get(`/chats/${chatId}/users`)
  },

  // Добавить пользователя(ей) в чат по ID
  async addUserToChat (data: { users: number[], chatId: number }) {
    console.log('📤 [chatsApi] Добавление пользователей в чат:', data)
    return await http.put('/chats/users', data)
      .then(result => {
        console.log('✅ [chatsApi] Пользователи добавлены:', result)
        return result
      })
      .catch(error => {
        console.error('❌ [chatsApi] Ошибка добавления пользователей:', error)
        throw error
      })
  },

  // Удалить пользователя(ей) из чата по ID
  async removeUserFromChat (data: { users: number[], chatId: number }) {
    console.log('📤 [chatsApi] Удаление пользователей из чата:', data)
    return await http.delete('/chats/users', data)
      .then(result => {
        console.log('✅ [chatsApi] Пользователи удалены:', result)
        return result
      })
      .catch(error => {
        console.error('❌ [chatsApi] Ошибка удаления пользователей:', error)
        throw error
      })
  },

  // Получить токен для WebSocket
  async getToken (chatId: number) {
    return await http.post<{ token: string }>(`/chats/token/${chatId}`)
  }
}
