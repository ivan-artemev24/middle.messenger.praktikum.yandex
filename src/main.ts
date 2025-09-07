import Handlebars from 'handlebars'
import * as ComponentPartials from './components'

import {
  LoginPage,
  RegistrationPage,
  ChatsPageWithData,
  UserProfilePageReadOnly,
  UserProfilePageEdit,
  EditPasswordPageWithContext,
  Error404Page,
  Error500Page
} from './pages'

import './style.css'
import './helpers/handlebarsHelpers.js'

import { Router } from './core/router'
import { authApi } from './api/authApi'

// === Регистрация partial'ов (Avatar, Button, Input и пр.)
Object.entries(ComponentPartials).forEach(([name, value]) => {
  if (typeof value === 'string') {
    Handlebars.registerPartial(name, value)
  }
})

// === Инициализация роутера
const router = new Router('#app')
window.router = router

router
  .use('/', LoginPage)
  .use('/sign-up', RegistrationPage)
  .use('/messenger', ChatsPageWithData)
  .use('/user-profile', UserProfilePageReadOnly)
  .use('/settings', UserProfilePageEdit)
  .use('/edit-password', EditPasswordPageWithContext)
  .use('/404', Error404Page)
  .use('/500', Error500Page)

// === Проверка авторизации и редиректы
const protectedRoutes = [
  '/messenger',
  '/user-profile',
  '/settings',
  '/edit-password'
]

let isAuthed: boolean | null = null

function applyAuthRedirects (pathname: string): string | null {
  // Авторизован: редиректим со страниц авторизации на мессенджер
  if (isAuthed === true && (pathname === '/' || pathname === '/sign-up')) {
    return '/messenger'
  }

  // Не авторизован: защищённые роуты отправляем на логин
  if (isAuthed === false && protectedRoutes.includes(pathname)) {
    return '/'
  }

  return null
}

function startWithGuards () {
  const current = window.location.pathname
  const redirect = applyAuthRedirects(current)
  if (redirect && redirect !== current) {
    router.go(redirect)
    return
  }
  router.start()
}

authApi.getUser()
  .then(() => {
    isAuthed = true
    startWithGuards()
  })
  .catch((err: any) => {
    if (err && (err.status === 401 || err.reason === 'Cookie is not valid')) {
      isAuthed = false
      startWithGuards()
    } else {
      console.error('Ошибка при получении пользователя:', err)
      router.go('/500')
    }
  })

// Глобальный способ обновить состояние авторизации из страниц
;(window as any).setAuthState = (value: boolean) => {
  isAuthed = value
}

// Оборачиваем router.go для применения гардов при программной навигации
const originalGo = router.go.bind(router)
router.go = (pathname: string) => {
  const redirect = applyAuthRedirects(pathname)
  if (redirect && redirect !== pathname) {
    originalGo(redirect)
    return
  }
  originalGo(pathname)
}

// === Навигация по data-page
document.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest('[data-page]')
  if (!target) return

  const page = target.getAttribute('data-page')
  if (page) {
    event.preventDefault()
    router.go(page.startsWith('/') ? page : `/${page}`)
  }
})
