# Cloudflare Pages Functions Setup

## Структура

**ВАЖНО:** `functions/` должна быть в **корне репозитория**, а НЕ в build output directory:

```
project-root/
├── functions/              ← В корне репозитория!
│   └── api/
│       ├── database-lookup.js  → /api/database-lookup
│       ├── analyze.js          → /api/analyze
│       └── benchmark.js        → /api/benchmark
├── public/                 ← Build output directory
│   ├── _routes.json
│   └── index.html
└── README.md
```

**Причина:** Согласно документации Cloudflare Pages, `functions/` должна быть в корне проекта, а не в build output directory. Cloudflare автоматически находит `functions/` в корне репозитория независимо от настройки build output directory.

## Автоматический деплой

Cloudflare Pages автоматически развертывает функции при каждом push в репозиторий.

**Важно:** После push нужно подождать 1-2 минуты, пока Cloudflare Pages соберет и развернет функции.

## Проверка работоспособности

### 1. Проверь статус деплоя
- Зайди в Cloudflare Dashboard → Pages → `proteinanalysis`
- Проверь последний деплой (должен быть успешным)
- Убедись, что функции видны в разделе "Functions"

### 2. Проверь через GET запрос
```javascript
// В консоли браузера на сайте
fetch('/api/database-lookup')
  .then(r => r.json())
  .then(console.log)
```

Должен вернуться JSON с информацией об API.

### 3. Проверь через POST запрос
```javascript
fetch('/api/database-lookup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sequence: 'P12345',
    database: 'uniprot',
    action: 'id'
  })
})
.then(r => r.json())
.then(console.log)
```

## Если функции не работают

### Проблема: 405 Method Not Allowed
**Причина:** Функции не развернуты или не настроены правильно.

**Решение:**
1. Проверь, что файлы в `functions/api/` существуют
2. Проверь, что `_routes.json` в `public/` настроен правильно
3. Подожди 2-3 минуты после push
4. Проверь логи в Cloudflare Dashboard → Pages → Functions → Logs

### Проблема: 404 Not Found
**Причина:** Неправильная структура файлов или маршрутизация.

**Решение:**
- Убедись, что файл называется `database-lookup.js` (не `database_lookup.js`)
- Проверь, что файл экспортирует `export default { async fetch(...) }`

### Проблема: CORS ошибки
**Причина:** Неправильные CORS заголовки.

**Решение:**
- Функции уже настроены с CORS заголовками
- Проверь, что `corsHeaders` правильно применяются

## Ручной деплой (если нужно)

Если автоматический деплой не работает:

1. Установи Wrangler CLI:
```bash
npm install -g wrangler
```

2. Войди в Cloudflare:
```bash
wrangler login
```

3. Деплой функций:
```bash
cd d:\dev\proteinanalyse
wrangler pages deploy public --project-name=proteinanalysis
```

## Структура _routes.json

Файл `public/_routes.json` настроен так:
```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": []
}
```

Это означает, что все запросы к `/api/*` будут обрабатываться функциями.

## Проверка после деплоя

После успешного деплоя проверь:
1. GET `/api/database-lookup` - должен вернуть информацию об API
2. POST `/api/database-lookup` - должен обработать запрос
3. OPTIONS `/api/database-lookup` - должен вернуть CORS заголовки







