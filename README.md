# Messenger

Учебный проект-мессенджер, реализованный на чистом TypeScript с использованием шаблонизатора Handlebars и сборщика Vite.  
Проект выполнен в рамках курса **"Мидл-фронтенд разработчик" от Яндекс Практикума**.

## 🎯 Sprint 4 - Тестирование и качество кода

- ✅ **Jest тестирование** - покрытие роутера, компонентов и HTTP модуля
- ✅ **Pre-commit хуки** - автоматическая проверка качества кода
- ✅ **Аудит безопасности** - обновление пакетов до актуальных версий
- ✅ **CI/CD готовность** - полная автоматизация проверок

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

### Требования
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Разработка
```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev
```

Открой в браузере: `http://localhost:3000`

### Production-сборка
```bash
npm run build
npm run start
```

### Тестирование
```bash
# Запуск всех тестов
npm run test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage
```

### Проверка качества кода
```bash
# Линтинг TypeScript/JavaScript
npm run lint

# Линтинг CSS
npm run lint:css

# Проверка безопасности
npm run audit

# Автоисправление уязвимостей
npm run audit:fix
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

### Основной стек
- **TypeScript** ^5.7.2 - типизированный JavaScript
- **Handlebars** ^4.7.8 - шаблонизатор
- **Vite** ^6.0.1 - сборщик и dev-сервер
- **PostCSS** ^8.4.49 - обработка CSS (`nested`, `preset-env`, `autoprefixer`)

### Тестирование и качество кода
- **Jest** ^29.7.0 - фреймворк для тестирования
- **ts-jest** ^29.2.5 - TypeScript поддержка для Jest
- **jest-environment-jsdom** ^29.7.0 - DOM окружение для тестов
- **ESLint** ^8.57.0 - линтинг JavaScript/TypeScript
- **Stylelint** ^16.10.0 - линтинг CSS
- **Husky** ^9.1.7 - Git хуки
- **lint-staged** ^15.2.10 - запуск линтеров на staged файлах

### Архитектура
- **Custom Router и EventBus** - собственная система роутинга
- **REST API** - авторизация, чаты, пользователи
- **WebSocket** - сообщения в реальном времени
- **Component-based architecture** - модульная архитектура на Block

## 🧪 Тестирование

### Покрытие тестами
Проект покрыт тестами для ключевых модулей:

- **`src/core/router.test.ts`** - тестирование роутера
- **`src/api/http.test.ts`** - тестирование HTTP модуля
- **`src/components/button/button.test.ts`** - тестирование компонентов

### Pre-commit хуки
При каждом коммите автоматически запускаются:
- ✅ TypeScript проверка типов
- ✅ ESLint с автофиксом
- ✅ Stylelint с автофиксом  
- ✅ Jest тесты для измененных файлов

### Безопасность
- 🔒 Регулярный аудит пакетов (`npm audit`)
- 🔒 Автоматическое обновление зависимостей
- 🔒 Проверка уязвимостей в pre-commit хуках

## 📁 Структура проекта

```
src/
├── api/                    # HTTP модули и API
│   ├── http.ts            # HTTP транспорт
│   └── http.test.ts       # Тесты HTTP модуля
├── components/             # UI компоненты
│   └── button/
│       ├── button.ts      # Компонент кнопки
│       └── button.test.ts # Тесты компонента
├── core/                   # Ядро приложения
│   ├── router.ts          # Роутер
│   ├── router.test.ts     # Тесты роутера
│   ├── route.ts           # Маршрут
│   └── Block.ts           # Базовый класс компонента
├── pages/                  # Страницы приложения
└── utils/                  # Утилиты
```

## 🚀 CI/CD

Проект готов к интеграции с CI/CD системами:
- Pre-commit хуки обеспечивают качество кода
- Автоматическое тестирование при коммитах
- Проверка безопасности зависимостей
- Линтинг и форматирование кода

---

[PR Sprint 3](https://github.com/ivan-artemev24/middle.messenger.praktikum.yandex/pull/3) | [PR Sprint 4](https://github.com/ivan-artemev24/middle.messenger.praktikum.yandex/pull/4)
