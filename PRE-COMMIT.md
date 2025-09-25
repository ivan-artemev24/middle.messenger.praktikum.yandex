# Pre-commit Configuration

## 🚀 Настроенные хуки

### Pre-commit хук (`.husky/pre-commit`)
Автоматически запускается при каждом `git commit` и выполняет:

1. **TypeScript проверка типов** (`tsc --noEmit`)
2. **ESLint** с автофиксом для JS/TS файлов
3. **Stylelint** с автофиксом для CSS файлов  
4. **Jest тесты** для измененных файлов

### Lint-staged конфигурация
```json
{
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "jest --bail --findRelatedTests", 
    "git add"
  ],
  "*.css": [
    "stylelint --fix",
    "git add"
  ]
}
```

## 🔧 Установленные инструменты

- **Husky** - Git хуки
- **lint-staged** - Запуск команд только на staged файлах
- **ESLint** - Линтинг JavaScript/TypeScript
- **Stylelint** - Линтинг CSS
- **Jest** - Тестирование
- **ts-jest** - TypeScript поддержка для Jest

## 📋 Доступные команды

```bash
# Запуск всех тестов
npm run test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage

# Линтинг кода
npm run lint

# Линтинг CSS
npm run lint:css

# Проверка безопасности
npm run audit

# Автоисправление уязвимостей
npm run audit:fix
```

## ⚡ Как это работает

1. При `git commit` запускается pre-commit хук
2. Выполняется проверка TypeScript типов
3. Запускается lint-staged для staged файлов:
   - ESLint с автофиксом для JS/TS
   - Stylelint с автофиксом для CSS
   - Jest тесты для измененных файлов
4. Если все проверки пройдены - коммит создается
5. Если есть ошибки - коммит блокируется

## 🛠️ Настройка для разработчиков

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Инициализация Husky:**
   ```bash
   npx husky install
   ```

3. **Проверка работы:**
   ```bash
   git add .
   git commit -m "Test commit"
   ```

## 🔍 Отладка

Если pre-commit хук не работает:

1. Проверьте, что Husky установлен: `ls .husky/`
2. Проверьте права на выполнение: `chmod +x .husky/pre-commit`
3. Запустите вручную: `npx lint-staged`
4. Проверьте логи: `git commit -v`

## 📝 Исключения

Некоторые файлы исключены из ESLint проверки:
- `jest.setup.ts`
- `scripts/**/*.js`
- `test/**/*.js`
- `*.css` (проверяются Stylelint)
