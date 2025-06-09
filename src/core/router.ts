type Page = () => HTMLElement

const routes: Record<string, Page> = {}

// Регистрируем путь и функцию, которая вернёт содержимое
export function registerRoute (path: string, render: Page) {
  routes[path] = render
}

// Навигация по пути
export function navigate (path: string) {
  window.history.pushState({}, '', path)
  renderPage(path)
}

// Внутренняя функция отрисовки
function renderPage (path: string) {
  const root = document.getElementById('app')
  if (!root) return

  root.innerHTML = ''
  const render = routes[path]

  if (render) {
    root.appendChild(render())
  } else {
    root.innerHTML = '<h1>404 — Страница не найдена</h1>'
  }
}

// Поддержка кнопок "назад" / "вперёд" в браузере
window.addEventListener('popstate', () => {
  renderPage(window.location.pathname)
})

// Инициализация роутера
export function startRouter () {
  const path = window.location.pathname
  // если корень — редиректим на login
  renderPage(path === '/' ? '/login' : path)
}
