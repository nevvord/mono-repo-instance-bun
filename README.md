# 🚀 Mono Repository

Современный монорепозиторий для разработки веб-приложений с использованием Bun, React, TypeScript и других современных технологий.

## 📚 Документация

Вся документация проекта находится в папке [`docs/`](./docs/):

- **[Обзор проекта](./docs/project-overview.md)** - Основная информация о проекте, архитектуре и технологиях
- **[PM2 развертывание](./docs/pm2-deployment.md)** - Руководство по развертыванию с PM2
- **[Web UI](./docs/web-ui-readme.md)** - Документация веб-интерфейса
- **[Admin UI](./docs/admin-ui-readme.md)** - Документация админ панели
- **[Core](./docs/core-readme.md)** - Документация основного пакета
- **[Конфигурация](./docs/config-readme.md)** - Документация системы конфигурации
- **[Husky Setup](./docs/husky-setup.md)** - Настройка Git hooks

## 🚀 Быстрый старт

```bash
# Установка зависимостей
bun install

# Запуск всех сервисов в режиме разработки
bun run dev:all

# Проверка кода
bun run check

# Запуск тестов
bun test
```

## 📦 Структура проекта

```
mono-repo/
├── docs/                    # 📚 Документация
├── packages/                # 📦 Пакеты приложений
│   ├── core/               # 🔧 Общие типы и утилиты
│   ├── backend/            # 🖥️ API сервер (Hono)
│   ├── web-ui/             # 🌐 Веб-интерфейс (React + Radix UI)
│   └── admin-ui/           # ⚙️ Админ панель (React + Radix UI)
├── prisma/                 # 🗄️ База данных (PostgreSQL)
├── config/                 # ⚙️ Конфигурация
└── ecosystem.config.cjs    # 🔄 PM2 конфигурация
```

## 🛠️ Технологии

- **Runtime**: Bun
- **Frontend**: React 18 + Radix UI + Tailwind CSS
- **Backend**: Hono (Fast web framework)
- **Database**: PostgreSQL + Prisma ORM
- **Testing**: Bun test + Testing Library
- **Code Quality**: ESLint + Prettier + TypeScript
- **Process Management**: PM2

## 🔗 Полезные ссылки

- [Bun](https://bun.sh/) - JavaScript runtime
- [Hono](https://hono.dev/) - Fast web framework
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Prisma](https://www.prisma.io/) - Database toolkit
- [PM2](https://pm2.keymetrics.io/) - Process manager

## 📄 Лицензия

MIT
