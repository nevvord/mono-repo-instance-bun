# 🐕 Husky Setup Guide

Руководство по настройке и использованию Husky для автоматических проверок в Git hooks.

## 📋 Что такое Husky?

Husky - это инструмент для настройки Git hooks, который позволяет автоматически запускать проверки кода перед коммитами и пушем.

## 🚀 Установка

Husky уже установлен в проекте. Для установки в новом проекте:

```bash
bun add -D husky lint-staged
```

## ⚙️ Настройка

### 1. Инициализация Husky

```bash
bun run prepare
```

### 2. Создание Hooks

Hooks создаются автоматически при установке:

- `.husky/pre-commit` - проверки перед коммитом
- `.husky/pre-push` - проверки перед пушем
- `.husky/commit-msg` - проверка сообщений коммитов

## 🔧 Конфигурация

### Package.json Scripts

```json
{
  "scripts": {
    "prepare": "husky",
    "pre-commit": "lint-staged",
    "pre-push": "bun run check && bun run test"
  }
}
```

### Lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

## 📝 Правила сообщений коммитов

### Формат

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Типы коммитов

- `feat`: Новая функциональность
- `fix`: Исправление бага
- `docs`: Изменения в документации
- `style`: Изменения стиля кода
- `refactor`: Рефакторинг кода
- `test`: Добавление или обновление тестов
- `chore`: Задачи по обслуживанию

### Примеры

✅ Правильно:

- `feat(auth): add user authentication system`
- `fix(api): resolve database connection issue`
- `docs(readme): update installation instructions`
- `style(ui): format components with prettier`
- `test(core): add unit tests for config validation`

❌ Неправильно:

- `fix bug`
- `update`
- `wip`
- `stuff`

### Правила

1. Используйте только английский язык
2. Используйте настоящее время ("add" вместо "added")
3. Используйте повелительное наклонение ("move" вместо "moves")
4. Не используйте заглавную букву в начале
5. Не ставьте точку в конце
6. Максимум 72 символа для первой строки

## 🔍 Проверки

### Pre-commit Hook

Перед каждым коммитом автоматически запускается:

1. **ESLint** - проверка качества кода
2. **Prettier** - форматирование кода
3. **Lint-staged** - проверка только измененных файлов

### Pre-push Hook

Перед каждым пушем автоматически запускается:

1. **TypeScript** - проверка типов
2. **ESLint** - проверка качества кода
3. **Prettier** - проверка форматирования
4. **Tests** - запуск всех тестов

### Commit-msg Hook

Проверяет формат сообщения коммита:

1. Не пустое сообщение
2. Минимум 10 символов
3. Максимум 72 символа для первой строки
4. Не заканчивается точкой
5. Не начинается с заглавной буквы

## 🛠️ Команды

### Ручной запуск проверок

```bash
# Запуск pre-commit проверок
bun run pre-commit

# Запуск pre-push проверок
bun run pre-push

# Запуск всех проверок
bun run check

# Запуск тестов
bun run test
```

### Отключение hooks (временное)

```bash
# Отключить pre-commit hook
git commit --no-verify -m "your message"

# Отключить pre-push hook
git push --no-verify
```

## 🔧 Устранение неполадок

### Hook не работает

1. Проверьте, что файлы исполняемые:

   ```bash
   chmod +x .husky/*
   ```

2. Проверьте, что Husky установлен:
   ```bash
   bun run prepare
   ```

### Ошибки в проверках

1. Исправьте ошибки ESLint:

   ```bash
   bun run lint:fix
   ```

2. Исправьте ошибки форматирования:

   ```bash
   bun run format
   ```

3. Исправьте ошибки типов:
   ```bash
   bun run type-check
   ```

### Добавление нового hook

```bash
# Создать новый hook
npx husky add .husky/hook-name "command"

# Сделать исполняемым
chmod +x .husky/hook-name
```

## 📚 Полезные ссылки

- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
