# Деплой FlightLounge на Timeweb App Platform

## Подготовка проекта

Проект уже подготовлен для деплоя на Timeweb App Platform со следующими файлами:

- ✅ `Dockerfile` - Multi-stage Docker сборка для оптимизации
- ✅ `.dockerignore` - Исключение ненужных файлов
- ✅ `next.config.ts` - Настроен standalone режим
- ✅ `/api/health` - Health check endpoint для мониторинга

## Шаги деплоя на Timeweb App Platform

### 1. Подключите Git репозиторий

1. Загрузите код в Git репозиторий (GitHub, GitLab или Bitbucket)
2. Зайдите в личный кабинет Timeweb
3. Перейдите в раздел "App Platform"
4. Нажмите "Создать приложение"
5. Выберите "Из Git репозитория"
6. Подключите ваш репозиторий

### 2. Настройте приложение

**Основные настройки:**
- **Тип приложения**: Docker
- **Dockerfile путь**: `Dockerfile` (в корне проекта)
- **Порт**: 3000
- **Health check**: `/api/health`

**Переменные окружения:**
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
```

### 3. Настройки ресурсов

Рекомендуемые настройки для старта:
- **CPU**: 1 vCPU
- **RAM**: 1 GB
- **Диск**: 10 GB

При росте нагрузки можно масштабировать ресурсы.

### 4. Деплой

1. Проверьте настройки
2. Нажмите "Создать приложение"
3. Дождитесь сборки (обычно 5-10 минут)
4. После успешной сборки приложение будет доступно по выданному URL

## Проверка работы

После деплоя проверьте:

1. **Главная страница**: `https://your-app.timeweb.cloud`
2. **Health check**: `https://your-app.timeweb.cloud/api/health`
   - Должен вернуть: `{"status":"ok","timestamp":"...","uptime":...}`

## Автоматический деплой

При настроенном Git репозитории, каждый push в выбранную ветку будет автоматически деплоить новую версию.

## Мониторинг

Timeweb App Platform предоставляет:
- Логи приложения в реальном времени
- Метрики использования CPU/RAM
- Health check мониторинг
- История деплоев

## Troubleshooting

### Приложение не запускается

1. Проверьте логи в панели Timeweb
2. Убедитесь, что порт 3000 указан правильно
3. Проверьте переменные окружения

### Health check не проходит

1. Убедитесь, что endpoint `/api/health` доступен
2. Проверьте, что приложение слушает на `0.0.0.0:3000`

### Медленная сборка

1. Проверьте размер образа
2. Убедитесь, что `.dockerignore` настроен правильно
3. Рассмотрите увеличение ресурсов для сборки

## Локальная проверка Docker образа

Перед деплоем можно протестировать локально:

```bash
# Сборка образа
docker build -t flight-lounge .

# Запуск контейнера
docker run -p 3000:3000 flight-lounge

# Проверка health check
curl http://localhost:3000/api/health
```

## Дополнительная информация

- [Документация Timeweb App Platform](https://timeweb.cloud/help/app-platform)
- [Next.js Docker документация](https://nextjs.org/docs/app/building-your-application/deploying#docker-image)
