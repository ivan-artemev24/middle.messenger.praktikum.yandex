import Handlebars from 'handlebars'
import * as Components from './components'
import * as Pages from './pages'
import { registerRoute, navigate, startRouter } from './core/router'
import './style.css'

import './helpers/handlebarsHelpers.js'

import arrowIcon from './assets/arrow-icon.svg?raw'
import searchIcon from './assets/search-icon.svg?raw'
import { chatsMockData, userMockData } from './mockData.js'

// === Регистрация только шаблонов как partials ===
Object.entries(Components).forEach(([name, template]) => {
  if (typeof template === 'string') {
    Handlebars.registerPartial(name, template)
  }
})

// === Общий контекст для профиля ===
const baseUserContext = {
  arrowIcon,
  user: userMockData
}

// === Роутинг ===
registerRoute('/login', () => {
  const page = new Pages.LoginPage()
  return page.getContent() ?? document.createElement('div')
})

registerRoute('/registration', () => {
  const page = new Pages.RegistrationPage()
  return page.getContent() ?? document.createElement('div')
})

registerRoute('/chats', () => {
  const page = new Pages.ChatsPage({
    arrowIcon,
    searchIcon,
    showDialog: true,
    data: chatsMockData
  })
  return page.getContent() ?? document.createElement('div')
})

registerRoute('/user-profile', () => {
  const page = new Pages.UserProfilePage({
    ...baseUserContext,
    disableEdit: true
  })
  return page.getContent() ?? document.createElement('div')
})

registerRoute('/edit-user-profile', () => {
  const page = new Pages.UserProfilePage({
    ...baseUserContext,
    disableEdit: false
  })
  return page.getContent() ?? document.createElement('div')
})

registerRoute('/edit-password', () => {
  const page = new Pages.EditPasswordPage({
    ...baseUserContext
  })
  return page.getContent() ?? document.createElement('div')
})

// === Навигация по data-page="..." ===
document.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest('[data-page]')
  if (!target) return

  const page = target.getAttribute('data-page')
  if (page) {
    event.preventDefault()
    navigate('/' + page)
  }
})

// Запуск роутера
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname
  if (currentPath === '/') {
    navigate('/login')
  }
  startRouter()
})
