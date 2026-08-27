# Исправление редиректа со старого домена через Middleware

## 🔍 Проблема

Редирект с `proteinanalysis.pages.dev` на `seqanalysis.org` не работает, хотя `functions/_middleware.js` создан и задеплоен.

## 🔍 Возможные причины

1. **Middleware не применяется к статическим файлам**
   - Cloudflare Pages middleware может не работать для `.pages.dev` доменов
   - Или middleware не выполняется из-за конфигурации `_routes.json`

2. **Middleware не задеплоен**
   - Нужно проверить статус деплоя в Cloudflare Dashboard

3. **Ограничения Cloudflare Pages**
   - `.pages.dev` домены могут иметь ограничения на middleware

## ✅ Решение 1: Проверка деплоя middleware

### Шаг 1: Проверь статус деплоя

1. Зайди в **Cloudflare Dashboard** → **Workers & Pages** → твой проект
2. Проверь последний деплой - должен быть после коммита `28d1490`
3. Убедись, что файл `functions/_middleware.js` присутствует в деплое

### Шаг 2: Проверь логи

1. Cloudflare Dashboard → Workers & Pages → твой проект → **Functions**
2. Проверь логи выполнения middleware
3. Если ошибок нет, но редирект не работает - см. Решение 2

## ✅ Решение 2: Использовать Cloudflare Page Rules (РЕКОМЕНДУЕТСЯ)

**⚠️ Middleware не работает для `.pages.dev` доменов. Используй Cloudflare Page Rules.**

📖 **Подробная инструкция:** См. [`PAGE_RULES_SETUP.md`](./PAGE_RULES_SETUP.md)

### Краткая инструкция:

1. **Cloudflare Dashboard** → **Rules** → **Page Rules** → **Create Page Rule**
2. **URL pattern:** `proteinanalysis.pages.dev/*`
3. **Setting:** **Forwarding URL** → **301 - Permanent Redirect**
4. **Destination URL:** `https://seqanalysis.org/$1`
5. **Save and Deploy**

### Проверка:

```bash
curl -I https://proteinanalysis.pages.dev/
```

**Должно быть:**
```
HTTP/2 301
Location: https://seqanalysis.org/
```

## ✅ Решение 3: Использовать отдельный Worker

Если Page Rules не подходят, используй отдельный Cloudflare Worker:

### Шаг 1: Создай Worker через Dashboard

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Worker**
2. Имя: `redirect-old-domain`
3. Скопируй код из `workers/redirect-old-domain.js`
4. Нажми **Deploy**

### Шаг 2: Настрой Route

1. Worker → **Settings** → **Triggers** → **Routes**
2. Нажми **Add route**
3. **Route:** `proteinanalysis.pages.dev/*`
4. **Zone:** оставь пустым (для `.pages.dev` доменов)
5. **Failure Mode:** **Fail open (proceed)**
6. Нажми **Add route**

**⚠️ Проблема:** `.pages.dev` домены могут не отображаться в списке зон для Routes. В этом случае используй Решение 2 (Page Rules).

## ✅ Решение 4: Обновить middleware с логированием

Добавь логирование в middleware для отладки:

```javascript
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Логирование для отладки
  console.log('Middleware executed:', url.hostname);
  
  // Редирект со старого .pages.dev домена на новый домен
  if (url.hostname === 'proteinanalysis.pages.dev') {
    const path = url.pathname;
    const search = url.search;
    const newUrl = `https://seqanalysis.org${path}${search}`;
    
    console.log('Redirecting:', url.href, '→', newUrl);
    
    return Response.redirect(newUrl, 301);
  }
  
  return context.next();
}
```

Затем проверь логи в Cloudflare Dashboard → Workers & Pages → Functions → Logs.

## 🎯 Рекомендуемое решение

**⚠️ ВАЖНО: Middleware (`_middleware.js`) НЕ РАБОТАЕТ для `.pages.dev` доменов!**

**Используй Cloudflare Page Rules** (Решение 2) - это **ЕДИНСТВЕННЫЙ** надежный способ для редиректа `.pages.dev` доменов:

1. ✅ Работает гарантированно (в отличие от middleware)
2. ✅ Не зависит от middleware или Workers
3. ✅ Простая настройка через Dashboard
4. ✅ Работает для всех запросов к домену
5. ✅ Активируется сразу после сохранения

📖 **Подробная пошаговая инструкция:** [`PAGE_RULES_SETUP.md`](./PAGE_RULES_SETUP.md)

## 📝 Проверка после исправления

После применения любого решения:

1. Открой `https://proteinanalysis.pages.dev/index.html` в браузере
2. Должен произойти автоматический редирект на `https://seqanalysis.org/index.html`
3. Проверь в DevTools → Network → статус должен быть `301 Moved Permanently`

---

**Последнее обновление:** Февраль 2026
