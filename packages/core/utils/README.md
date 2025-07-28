# Core Utils

Утилиты для использования во всех пакетах монорепозитория.

## Logger

Универсальный логгер с различными уровнями логирования и форматированием.

### Основные возможности

- **Уровни логирования**: ERROR, WARN, INFO, DEBUG
- **Форматирование**: Временная метка, уровень, сервис, сообщение
- **Контекст**: Поддержка дополнительных данных в JSON формате
- **Удобные методы**: Специальные методы для разных типов операций
- **Эмодзи**: Визуальные индикаторы для разных типов сообщений

### Использование

#### Создание логгера

```typescript
import { createLogger, LogLevel } from '@mono-repo/core/utils';

// Создание логгера для сервиса
const logger = createLogger('UserService');

// Создание логгера с кастомным уровнем
const debugLogger = createLogger('DebugService', LogLevel.DEBUG);
```

#### Базовые методы

```typescript
// Разные уровни логирования
logger.error('Критическая ошибка', {
  userId: '123',
  error: 'Database connection failed',
});
logger.warn('Предупреждение', { email: 'user@example.com' });
logger.info('Информационное сообщение', { action: 'user_login' });
logger.debug('Отладочная информация', { query: 'SELECT * FROM users' });
```

#### Удобные методы

```typescript
// Запуск приложения
logger.start('Application starting on port 3000');

// Успешные операции
logger.success('User registered successfully', { userId: '123' });

// Ошибки
logger.fail('Registration failed', { error: 'Email already exists' });

// База данных
logger.database('Connected to PostgreSQL', { host: 'localhost', port: 5432 });

// Сеть
logger.network('Server listening', { port: 3000, host: '0.0.0.0' });

// Безопасность
logger.security('Authentication required', { endpoint: '/api/protected' });
```

### Формат логов

```
[2025-07-29T18:47:34.638Z] INFO | AuthController | Registration request received | {"email":"user@example.com"}
[2025-07-29T18:47:34.639Z] INFO | UserService | 🚀 Attempting to register new user | {"email":"user@example.com"}
[2025-07-29T18:47:35.218Z] INFO | UserService | ✅ User registered successfully | {"userId":"123","email":"user@example.com"}
[2025-07-29T18:47:35.218Z] INFO | AuthController | ✅ Registration completed successfully | {"email":"user@example.com","userId":"123"}
```

### Уровни логирования

```typescript
enum LogLevel {
  ERROR = 0, // Только ошибки
  WARN = 1, // Предупреждения и ошибки
  INFO = 2, // Информация, предупреждения и ошибки (по умолчанию)
  DEBUG = 3, // Все сообщения
}
```

### Управление уровнем логирования

```typescript
// Изменение уровня во время выполнения
logger.setLevel(LogLevel.DEBUG);

// Получение текущего уровня
const currentLevel = logger.getLevel();
```

### Контекст

Логгер поддерживает передачу дополнительного контекста в виде объекта:

```typescript
logger.info('User action', {
  userId: '123',
  action: 'login',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
});
```

Контекст автоматически сериализуется в JSON и добавляется к сообщению.

### Интеграция в проекты

#### Backend

```typescript
// app.ts
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('Backend');
logger.start('Initializing Prisma client...');

// services/user-service.ts
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('UserService');
logger.info('Attempting to register new user', { email });
```

#### Frontend

```typescript
// components/UserForm.tsx
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('UserForm');
logger.info('Form submitted', { formData });
```

### Преимущества

1. **Единообразие**: Одинаковый формат логов во всех пакетах
2. **Читаемость**: Понятные сообщения с эмодзи и контекстом
3. **Производительность**: Фильтрация по уровням логирования
4. **Гибкость**: Настраиваемые уровни и контекст
5. **Типизация**: Полная поддержка TypeScript
