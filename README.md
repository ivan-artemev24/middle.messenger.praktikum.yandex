# Messenger

Учебный проект-мессенджер, реализованный на чистом TypeScript с использованием шаблонизатора Handlebars и сборщика Vite.  
Проект выполнен в рамках курса **"Мидл-фронтенд разработчик" от Яндекс Практикума**.

## 🎨 Дизайн

Макет интерфейса: [Figma](https://www.figma.com/design/q6ALe9fipHxAYiV6ToS2Vp/Chat_design?node-id=12-35&t=z4eEVMzexzEChXg2-1)

## 📦 Основной функционал

- ✅ Аутентификация: регистрация, вход, выход  
- ✅ Профиль пользователя: просмотр, редактирование, смена пароля, смена аватара  
- ✅ Список чатов и работа с ними (создание, добавление/удаление пользователей)  
- ✅ Лента сообщений + подключение WebSocket для real-time  
- ✅ Модальное окно для загрузки аватара  
- ✅ Интерактивная валидация форм  
- ✅ Роутинг без перезагрузки (`Router` + `Route`)  
- ✅ Проверка авторизации при переходе по страницам  
- ✅ Компонентный подход (на `Block`)  
- ✅ Стилизация через PostCSS (nested, variables, preset-env)  
- ✅ Линтинг CSS и TypeScript (`stylelint`, `eslint`)  
- ✅ Поддержка шаблонов `Handlebars`  

## 🚀 Установка и запуск

```bash
npm install
npm run dev
```

Открой в браузере: `http://localhost:3000`

### Production-сборка

```bash
npm run build
npm run start
```

## 🌐 Деплой

Проект автоматически деплоится на **Netlify**.  
**Ссылка:** [https://resilient-liger-f82a71.netlify.app](https://resilient-liger-f82a71.netlify.app)

## 📄 Доступные страницы

| Путь | Назначение |
|------|------------|
| [`/`](https://resilient-liger-f82a71.netlify.app/) — Вход |
| [`/sign-up`](https://resilient-liger-f82a71.netlify.app/sign-up) — Регистрация |
| [`/messenger`](https://resilient-liger-f82a71.netlify.app/messenger) — Список чатов |
| [`/user-profile`](https://resilient-liger-f82a71.netlify.app/user-profile) — Профиль (просмотр) |
| [`/settings`](https://resilient-liger-f82a71.netlify.app/settings) — Редактирование профиля |
| [`/edit-password`](https://resilient-liger-f82a71.netlify.app/edit-password) — Смена пароля |
| [`/404`](https://resilient-liger-f82a71.netlify.app/404) — Страница 404 |
| [`/500`](https://resilient-liger-f82a71.netlify.app/500) — Страница 500 |

## 🛠️ Используемые технологии

- **TypeScript**
- **Handlebars**
- **Vite**
- **PostCSS** (`nested`, `preset-env`, `autoprefixer`)
- **Stylelint** (`stylelint-config-standard`)
- **ESLint** (`eslint-config-standard-with-typescript`)
- **Custom Router и EventBus**
- **REST API** (авторизация, чаты, пользователи)
- **WebSocket** (сообщения в реальном времени)

## 🧪 Проверка качества

```bash
npm run lint       # Проверка TypeScript + Stylelint
npm run lint:css   # Только stylelint
tsc --noEmit       # Проверка типов вручную
```




[PR Sprint 4](https://github.com/ivan-artemev24/middle.messenger.praktikum.yandex/pull/10)
