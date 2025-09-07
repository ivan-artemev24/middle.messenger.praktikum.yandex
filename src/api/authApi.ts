import { HTTPTransport } from './http'

const http = new HTTPTransport()

// Типы для входа и регистрации
export interface SignUpData {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export interface SignInData {
  login: string
  password: string
}

// API для авторизации
export const authApi = {
  // Регистрация пользователя
  async signup (data: SignUpData) {
    return await http.post('/auth/signup', data)
  },

  // Вход в систему
  async signin (data: SignInData) {
    return await http.post('/auth/signin', data)
  },

  // Выход из системы
  async logout () {
    return await http.post('/auth/logout')
  },

  // Получение текущего пользователя
  async getUser () {
    return await http.get<{ id: number, [key: string]: unknown }>('/auth/user')
  },

  // Смена пароля
  async changePassword (data: { oldPassword: string, newPassword: string }) {
    return await http.put('/user/password', data)
  },

  async updateProfile (data: Record<string, string>) {
    return await http.put('/user/profile', data)
  },

  async updateAvatar (data: FormData) {
    return await http.put('/user/profile/avatar', data)
  }

}
