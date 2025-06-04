# Messenger

Учебный проект-мессенджер, реализованный на чистом TypeScript с использованием шаблонизатора Handlebars и сборщика Vite.

## 🎨 Дизайн

[Макет в Figma](https://www.figma.com/design/q6ALe9fipHxAYiV6ToS2Vp/Chat_design?node-id=12-35&t=z4eEVMzexzEChXg2-0)

## 📦 Функции

- Аутентификация (вход и регистрация)
- Профиль пользователя
- Список чатов и лента сообщений
- Модальное окно для смены аватара
- Стилизация с помощью PostCSS (nested, preset-env)
- Роутинг без перезагрузки
- Поддержка шаблонов и компонентов

## 🚀 Установка и запуск

```bash
npm install
npm run dev
```

Проект откроется на `http://localhost:3000`

Для production-сборки:

```bash
npm run build
npm run start
```

## 🌐 Деплой

Проект автоматически деплоится через Netlify.  
**Ссылка:** [https://your-project-name.netlify.app](https://your-project-name.netlify.app)

## 📄 Страницы

- `/login` — Вход
- `/registration` — Регистрация
- `/chats` — Список чатов
- `/user-profile` — Профиль (только чтение)
- `/edit-user-profile` — Редактирование профиля
- `/edit-password` — Смена пароля
- `/404`, `/500` — Служебные страницы

## 🛠️ Технологии

- TypeScript
- Handlebars
- Vite
- PostCSS (nested, preset-env, autoprefixer)
- stylelint

## 🔗 Pull request

[PR Sprint 1](https://github.com/ivan-artemev24/middle.messenger.praktikum.yandex/pull/1)
