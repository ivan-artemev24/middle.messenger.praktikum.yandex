# Messenger

Учебный проект-мессенджер, реализованный на чистом TypeScript с использованием шаблонизатора Handlebars и сборщика Vite.  
Проект выполнен в рамках курса **"Мидл-фронтенд разработчик" от Яндекс Практикума**.

## 🎨 Дизайн

Макет интерфейса: [Figma](https://www.figma.com/design/q6ALe9fipHxAYiV6ToS2Vp/Chat_design?node-id=12-35&t=z4eEVMzexzEChXg2-1)

## 📦 Основной функционал

- ✅ Аутентификация: вход, регистрация
- ✅ Профиль пользователя с редактированием
- ✅ Список чатов, отображение сообщений
- ✅ Модальное окно смены аватара
- ✅ Интерактивная валидация форм
- ✅ Роутинг без перезагрузки (`HashRouter`)
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
- [`/login`](https://resilient-liger-f82a71.netlify.app/login) — Вход
- [`/registration`](https://resilient-liger-f82a71.netlify.app/registration) — Регистрация
- [`/chats`](https://resilient-liger-f82a71.netlify.app/chats) — Список чатов
- [`/user-profile`](https://resilient-liger-f82a71.netlify.app/user-profile) — Профиль (только чтение)
- [`/edit-user-profile`](https://resilient-liger-f82a71.netlify.app/edit-user-profile) — Редактирование профиля
- [`/edit-password`](https://resilient-liger-f82a71.netlify.app/edit-password) — Смена пароля
- [`/404`](https://resilient-liger-f82a71.netlify.app/404) — Страница 404
- [`/500`](https://resilient-liger-f82a71.netlify.app/500) — Страница 500

## 🛠️ Используемые технологии

- **TypeScript**
- **Handlebars**
- **Vite**
- **PostCSS** (`nested`, `preset-env`, `autoprefixer`)
- **Stylelint** (`stylelint-config-standard`)
- **ESLint** (`eslint-config-standard-with-typescript`)
- **Custom Router и EventBus**

## 🧪 Проверка качества

```bash
npm run lint       # Проверка TypeScript + Stylelint
npm run lint:css   # Только stylelint
tsc --noEmit       # Проверка типов вручную
```
