import { HTTPTransport } from './http'

const http = new HTTPTransport()

export interface UserShort {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  email: string
  phone: string
  avatar: string | null
}

export const usersApi = {
  /** Ищем пользователей по логину. Возвращает массив (может быть пустым). */
  async searchByLogin (login: string) {
    console.log('🔍 [usersApi] Поиск пользователей по логину:', login)
    return await http.post<UserShort[]>('/user/search', { login })
      .then(result => {
        console.log('✅ [usersApi] Результат поиска:', result)
        return result
      })
      .catch(error => {
        console.error('❌ [usersApi] Ошибка поиска:', error)
        throw error
      })
  }
}
