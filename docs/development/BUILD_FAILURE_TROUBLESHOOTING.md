# Troubleshooting Build Failure

## Проблема
Build job failed в GitHub Actions, функции не развернуты, API возвращает HTML вместо JSON.

## Проверка структуры

Убедись, что структура правильная:
```
project-root/
├── functions/          ← В корне репозитория!
│   └── api/
│       └── database-lookup.js
├── public/            ← Build output directory
│   ├── _routes.json
│   └── index.html
└── README.md
```

## Что проверить в Cloudflare Dashboard

### 1. Проверь настройки проекта
- Cloudflare Dashboard → Pages → `proteinanalysis` → **Settings** → **Builds & deployments**
- Проверь:
  - **Production branch**: `master` (или `main`)
  - **Build command**: должен быть **пустым** (или не указан)
  - **Build output directory**: `public` ← Это правильно!
  - **Root directory**: должен быть **ПУСТЫМ** или `/` ← ВАЖНО!

**КРИТИЧНО:** 
- **Root directory** и **Build output directory** - это РАЗНЫЕ вещи!
- **Root directory** = корень репозитория (откуда Cloudflare ищет `functions/`)
- **Build output directory** = папка со статическими файлами (`public`)
- Если Root directory = `public`, то Cloudflare будет искать `functions/` в `public/functions/`, а не в корне репозитория!
- **Решение:** Root directory должен быть ПУСТЫМ, Build output directory = `public`

### 2. Проверь последний деплой
- Cloudflare Dashboard → Pages → `proteinanalysis` → **Deployments**
- Проверь последний деплой:
  - Должен быть успешным (зеленая галочка)
  - Нажми на деплой и проверь раздел **Functions**
  - Должны быть видны функции: `api/database-lookup`, `api/analyze`, `api/benchmark`

### 3. Проверь логи сборки
- В том же деплое открой **Build Logs**
- Ищи ошибки связанные с:
  - `functions/` directory not found
  - Syntax errors в функциях
  - Missing exports

### 4. Проверь настройки Functions
- Cloudflare Dashboard → Pages → `proteinanalysis` → **Settings** → **Functions**
- Убедись, что **Functions** включены (должна быть галочка)

## Возможные проблемы и решения

### Проблема 1: Root directory указан неправильно (САМАЯ ЧАСТАЯ ПРОБЛЕМА!)
**Симптом:** Build проходит, но функции не видны. API возвращает HTML вместо JSON.

**Решение:**
- Settings → Builds & deployments → **Root directory**
- Должно быть **ПУСТО** (не заполнено) или `/`
- Если указано `public/` или любое другое значение - **УДАЛИ ЕГО** (оставь пустым)
- **Build output directory** должен остаться `public` (это правильно!)

**Почему это важно:**
- Root directory = откуда Cloudflare ищет `functions/` (должен быть корень репозитория)
- Build output directory = откуда брать статические файлы (`public`)
- Это РАЗНЫЕ настройки!

### Проблема 2: Build command выполняет что-то лишнее
**Симптом:** Build падает с ошибкой.

**Решение:**
- Settings → Builds & deployments → **Build command**
- Должно быть **пусто** для статического сайта
- Если там что-то есть (например, `npm run build`), удали

### Проблема 3: Functions не включены
**Симптом:** Build проходит, но функции не работают.

**Решение:**
- Settings → Functions
- Включи **Functions** (если выключены)

### Проблема 4: Синтаксическая ошибка в функциях
**Симптом:** Build падает с ошибкой синтаксиса.

**Решение:**
- Проверь логи сборки
- Убедись, что все файлы в `functions/api/` экспортируют `export default { async fetch(...) }`
- Проверь синтаксис JavaScript

## Проверка после исправления

После исправления настроек:

1. **Подожди 2-3 минуты** после изменений
2. **Проверь новый деплой** в Cloudflare Dashboard
3. **Протестируй API:**
   ```javascript
   fetch('/api/database-lookup')
     .then(r => r.json())
     .then(console.log)
   ```

## Если все еще не работает

1. Проверь логи в Cloudflare Dashboard → Pages → Functions → Logs
2. Попробуй создать отдельный Cloudflare Worker (см. `FUNCTIONS_SETUP_CHECK.md`)
3. Проверь, что `_routes.json` правильно настроен в `public/`







