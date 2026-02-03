# Проверка настройки Cloudflare Pages Functions

## Быстрая проверка

### 1. Проверь настройки проекта в Cloudflare Dashboard

1. Зайди в **Cloudflare Dashboard** → **Workers & Pages** → **proteinanalysis**
2. Открой вкладку **Settings** → **Functions**
3. Убедись, что **Functions** включены (должна быть галочка)

### 2. Проверь последний деплой

1. В том же проекте открой вкладку **Deployments**
2. Проверь последний деплой - должен быть успешным
3. Нажми на последний деплой и проверь, что функции видны в разделе **Functions**

### 3. Проверь структуру файлов

Убедись, что в репозитории есть:
```
functions/
└── api/
    └── database-lookup.js
```

И файл `public/_routes.json` с содержимым:
```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": []
}
```

## Если функции не работают

### Вариант 1: Включить Functions в настройках проекта

1. Cloudflare Dashboard → Pages → proteinanalysis → Settings → Functions
2. Включи **Functions** (если выключены)
3. Сохрани изменения
4. Подожди 1-2 минуты
5. Проверь снова через GET запрос

### Вариант 2: Использовать отдельный Cloudflare Worker (если Pages Functions не работают)

Если Pages Functions не работают, можно создать отдельный Worker:

1. **Создай новый Worker:**
   - Cloudflare Dashboard → Workers & Pages → **Create** → **Worker**
   - Название: `proteinanalyse-api`
   - Нажми **Deploy**

2. **Скопируй код из `functions/api/database-lookup.js`** в Worker

3. **Обнови URL в клиентском коде:**
   - Вместо `/api/database-lookup` используй `https://proteinanalyse-api.ТВОЙ_АККАУНТ.workers.dev`

4. **Или используй custom domain:**
   - Можно настроить `api.seqanalysis.org` → Worker

## Проверка работоспособности

### Тест 1: GET запрос (health check)
```javascript
fetch('/api/database-lookup')
  .then(r => r.json())
  .then(console.log)
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "message": "Database Lookup API is running",
  "endpoints": { ... }
}
```

### Тест 2: POST запрос (UniProt ID lookup)
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

**Ожидаемый результат:**
```json
{
  "success": true,
  "database": "uniprot",
  "results": [ ... ],
  "totalResults": 1
}
```

## Что делать дальше

1. **Проверь настройки проекта** (см. выше)
2. **Подожди 2-3 минуты** после изменений
3. **Проверь логи** в Cloudflare Dashboard → Pages → Functions → Logs
4. **Если не работает** - создай отдельный Worker (Вариант 2)

## Альтернатива: Использовать отдельный Worker

Если Pages Functions не работают, можно использовать отдельный Worker:

**Преимущества:**
- ✅ Работает сразу
- ✅ Не зависит от настроек Pages
- ✅ Можно использовать custom domain

**Недостатки:**
- ❌ Нужно управлять отдельным Worker
- ❌ URL отличается от `/api/...`

**Инструкция:** См. Вариант 2 выше.







