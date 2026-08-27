# Деплой Worker для редиректа со старого домена

## 🔍 Важно

**`workers/redirect-old-domain.js`** - это **отдельный Cloudflare Worker**, который нужно задеплоить **вручную**.

**Отличие от Pages Functions:**
- `functions/api/*` - это **Pages Functions**, деплоятся автоматически с Pages
- `workers/redirect-old-domain.js` - это **отдельный Worker**, нужен ручной деплой

## ✅ Способ 1: Через Cloudflare Dashboard (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Создай Worker

1. Зайди в **Cloudflare Dashboard** → **Workers & Pages** → **Create** → **Worker**
2. Имя Worker: `redirect-old-domain` (или любое другое)
3. Нажми **Deploy**

### Шаг 2: Скопируй код

1. Открой созданный Worker → **Edit code**
2. Удали весь код по умолчанию
3. Скопируй код из `workers/redirect-old-domain.js` (redirects only `proteinanalysis.pages.dev`; returns 404 for every other host so it cannot loop on seqanalysis.org or proteinanalyse.pages.dev).

4. Нажми **Save and deploy**

### Шаг 3: Настрой Route

1. В правом меню Worker нажми **"Domains & Routes"** (выделено желтым)
2. Или через **Settings** → **Triggers** → **Routes**
3. Нажми **"Add route"** или **"Add custom domain"**
4. **Route:** `proteinanalysis.pages.dev/*` ✅
   - Это правильно - Worker будет применяться ко всем путям старого домена
5. **Zone:** можно оставить пустым для `.pages.dev` доменов
   - Если домен добавлен в Cloudflare, можно выбрать зону
6. **Failure Mode:** выбери **"Fail open (proceed)"** ⚠️
   - Это важно: если Worker упадет, запросы все равно будут работать
   - "Fail closed" блокирует запросы при ошибке - не подходит для редиректа
7. Нажми **Add route** или **Save**

**⚠️ ВАЖНО:** 
- Route должен быть **ТОЛЬКО** для `proteinanalysis.pages.dev/*`
- **НЕ** добавляй route для `seqanalysis.org/*` - это вызовет ошибки редиректа
- **Failure Mode:** лучше "Fail open" для редиректа (если Worker упадет, сайт продолжит работать)

**Если не можешь добавить route для `.pages.dev`:**
- `.pages.dev` домены управляются Cloudflare Pages
- Worker может не работать для `.pages.dev` доменов через Routes
- В этом случае используй альтернативный способ (см. ниже)

### Шаг 4: Проверь работу

1. Открой в браузере: `https://proteinanalysis.pages.dev/`
2. Должен редиректить на `https://seqanalysis.org/` с кодом 301
3. Проверь в DevTools → Network → видно редирект 301

---

## ✅ Способ 2: Через Wrangler CLI

### Шаг 1: Установи Wrangler

```bash
npm install -g wrangler
```

### Шаг 2: Войди в Cloudflare

```bash
wrangler login
```

### Шаг 3: Создай Worker

```bash
cd d:\dev\proteinanalyse
wrangler init redirect-old-domain --yes
```

### Шаг 4: Скопируй код

1. Скопируй код из `workers/redirect-old-domain.js` в `redirect-old-domain/src/index.js`

### Шаг 5: Настрой `wrangler.toml`

Создай файл `redirect-old-domain/wrangler.toml`:

```toml
name = "redirect-old-domain"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[routes]]
pattern = "proteinanalysis.pages.dev/*"
```

### Шаг 6: Задеплой

```bash
cd redirect-old-domain
wrangler deploy
```

### Шаг 7: Настрой Route в Dashboard

1. Cloudflare Dashboard → Workers & Pages → `redirect-old-domain`
2. Settings → Triggers → Routes
3. Добавь route: `proteinanalysis.pages.dev/*`

---

## 🔍 Проверка работы

### Проверь редирект:

```bash
curl -I https://proteinanalysis.pages.dev/
```

**Должно быть:**
```
HTTP/2 301
Location: https://seqanalysis.org/
```

### Проверь, что новый домен не редиректится:

```bash
curl -I https://seqanalysis.org/dna-gc-calculator.html
```

**Должно быть:**
```
HTTP/2 200
```

**НЕ должно быть:**
```
HTTP/2 301
Location: ...
```

---

## ⚠️ Важные моменты

1. **Worker должен быть настроен ТОЛЬКО для старого домена:**
   - Route: `proteinanalysis.pages.dev/*` ✅
   - Route: `seqanalysis.org/*` ❌ (НЕ ДОЛЖНО БЫТЬ)

2. **Если не можешь добавить route для `.pages.dev`:**
   - `.pages.dev` домены управляются Cloudflare Pages, не через Workers Routes
   - Worker может не работать для `.pages.dev` доменов через стандартные Routes
   - **Решение:** Используй **Cloudflare Pages Functions** вместо отдельного Worker (см. Альтернатива ниже)

3. **Если Worker не работает:**
   - Проверь, что route настроен правильно в "Domains & Routes"
   - Проверь, что домен `proteinanalysis.pages.dev` добавлен в Cloudflare Pages
   - Попробуй альтернативный способ через Pages Functions

## ✅ РЕШЕНИЕ: Использовать Pages Functions вместо отдельного Worker

**Проблема:** Домен `proteinanalysis.pages.dev` не отображается в списке зон, потому что `.pages.dev` домены управляются через Cloudflare Pages, а не как отдельные зоны.

**Решение:** Используй **Pages Functions** (`_middleware.js`) вместо отдельного Worker - это работает автоматически для `.pages.dev` доменов.

### Шаги:

1. **Создай файл:** `functions/_middleware.js` (уже создан в проекте)

2. **Код уже готов** - файл `functions/_middleware.js` содержит правильный код для редиректа

3. **Закоммить и запушить:**
```bash
git add functions/_middleware.js
git commit -m "Add middleware for old domain redirect"
git push
```

4. **Cloudflare Pages автоматически задеплоит middleware** при следующем деплое

5. **Проверь работу:**
   - Открой `https://proteinanalysis.pages.dev/` в браузере
   - Должен редиректить на `https://seqanalysis.org/` с кодом 301

**Преимущества:**
- ✅ Работает автоматически с Pages
- ✅ Не нужно настраивать Routes вручную
- ✅ Работает для `.pages.dev` доменов
- ✅ Не требует выбора зоны

---

## 🔄 Альтернатива: Через Cloudflare Pages Functions (если Worker Routes не работает)

Если не можешь настроить route для `.pages.dev` через Workers Routes, используй Pages Functions:

### Способ: Добавь функцию в `functions/` папку

1. **Создай файл:** `functions/_middleware.js` (или `functions/_middleware.ts`)

```javascript
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Редирект со старого .pages.dev домена на новый домен
  if (url.hostname === 'proteinanalysis.pages.dev') {
    const path = url.pathname;
    const search = url.search;
    const newUrl = `https://seqanalysis.org${path}${search}`;
    return Response.redirect(newUrl, 301);
  }
  
  // Для всех остальных запросов - пропускаем как обычно
  return context.next();
}
```

2. **Закоммить и запушить:**
```bash
git add functions/_middleware.js
git commit -m "Add middleware for old domain redirect"
git push
```

3. **Cloudflare Pages автоматически задеплоит функцию** при следующем деплое

**Преимущества:**
- ✅ Работает автоматически с Pages
- ✅ Не нужно настраивать Routes вручную
- ✅ Работает для `.pages.dev` доменов

**Недостатки:**
- ⚠️ Применяется ко всем запросам (но код проверяет hostname)

---

## 📝 Обновление Worker

Если нужно обновить код Worker:

### Через Dashboard:
1. Workers & Pages → `redirect-old-domain` → Edit code
2. Внеси изменения
3. Save and deploy

### Через Wrangler:
```bash
cd redirect-old-domain
# Внеси изменения в src/index.js
wrangler deploy
```

---

## 🎯 Итог

После деплоя Worker:
- ✅ `proteinanalysis.pages.dev/*` → редиректит на `seqanalysis.org/*` (301)
- ✅ `seqanalysis.org/*` → работает нормально (200), без редиректов
- ✅ SEO вес передается со старого домена на новый
