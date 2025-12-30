# Cloudflare Pages Functions - Автоматическое включение

## Важно: Functions включаются автоматически!

Согласно документации Cloudflare Pages:
- **Functions включаются автоматически** при наличии папки `functions/` в корне репозитория
- **Не нужно** включать их вручную в настройках
- Раздел "Functions" в Settings может появиться только **после успешного деплоя** с функциями

## Что проверить

### 1. Проверь последний деплой
- Cloudflare Dashboard → Pages → `proteinanalysis` → **Deployments**
- Открой последний деплой (нажми на него)
- Проверь:
  - **Статус деплоя** (успешен/неуспешен)
  - **Раздел "Functions"** в деталях деплоя - должны быть видны функции:
    - `api/database-lookup`
    - `api/analyze`
    - `api/benchmark`
  - **Build Logs** - есть ли ошибки

### 2. Если функции НЕ видны в деплое

Возможные причины:
1. **Build failed** - проверь Build Logs на ошибки
2. **Functions не найдены** - проверь, что `functions/` в корне репозитория
3. **Синтаксическая ошибка** - проверь логи сборки

### 3. Если build успешен, но функции не работают

Проверь:
- **Functions → Logs** (если раздел доступен)
- Попробуй создать простой тест: `functions/test.js`:
  ```javascript
  export default {
    async fetch(request) {
      return new Response('Test function works!', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  };
  ```
- Деплой и проверь `/test` - должен вернуть "Test function works!"

## Что делать если ничего не помогает

1. **Проверь структуру в GitHub:**
   - Зайди на GitHub → `gorelikspb/proteinanalyse`
   - Убедись, что папка `functions/` видна в корне репозитория
   - Убедись, что файлы `functions/api/database-lookup.js` существуют

2. **Проверь логи последнего деплоя:**
   - Cloudflare Dashboard → Pages → `proteinanalysis` → Deployments
   - Открой последний деплой → Build Logs
   - Ищи ошибки типа:
     - "functions directory not found"
     - "Syntax error"
     - "Missing export"

3. **Попробуй создать отдельный Worker** (см. `FUNCTIONS_SETUP_CHECK.md`)
