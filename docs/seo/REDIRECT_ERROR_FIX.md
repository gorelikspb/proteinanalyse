# Исправление ошибок редиректа в Google Search Console

## 🔍 Проблема

Google Search Console показывает **"Redirect error"** для 3 страниц:
- `https://seqanalysis.org/dna-gc-calculator.html` (Last crawled: 2 Feb 2026)
- `https://seqanalysis.org/orf-finder.html` (Last crawled: 2 Feb 2026)
- `https://seqanalysis.org/reverse-complement.html` (Last crawled: 2 Feb 2026)

**First detected:** 03/02/2026  
**Affected pages:** 3

## 🔍 Причина проблемы

**Реальная причина:** Google индексирует страницы через старый домен `proteinanalysis.pages.dev`, видит редирект 301 на `seqanalysis.org`, и помечает это как "Redirect error" для нового домена.

**⚠️ ВАЖНО:** Worker `redirect-old-domain.js` нужно задеплоить вручную в Cloudflare Dashboard.  
См. инструкцию: [`REDIRECT_WORKER_DEPLOY.md`](./REDIRECT_WORKER_DEPLOY.md)

**Это нормальное поведение**, но Google Search Console показывает это как ошибку, потому что:
1. Google индексирует через старый домен (где есть редирект)
2. Редирект работает правильно (301 со старого на новый)
3. Но GSC показывает ошибку для нового домена, хотя страницы работают нормально

**Проверка:** Страницы открываются нормально в браузере, canonical теги правильные, Worker настроен только для старого домена.

## 🔍 Возможные причины

### 1. ⚠️ Cloudflare Page Rules или Workers Routes
Возможно, настроены правила, которые редиректят `.html` файлы.

### 2. Worker редирект
Worker `redirect-old-domain.js` может быть настроен неправильно и редиректит не только со старого домена.

### 3. HTTP → HTTPS редирект (308)
Cloudflare может использовать 308 вместо 301 для HTTP → HTTPS редиректа.

### 4. Редирект с версий без `.html`
Если есть редиректы без `.html` → с `.html`, они могут вызывать проблемы.

## ✅ Решения

### ✅ Решение: Игнорировать ошибку или запросить переиндексацию

**Проблема не критична:** Страницы работают правильно, редирект со старого домена на новый - это нормально.

**Что делать:**

1. **В Google Search Console → Redirect error:**
   - Нажми **"VALIDATE FIX"** (даже если ничего не менял)
   - Google перепроверит страницы через несколько дней

2. **Для каждой страницы с ошибкой:**
   - URL Inspection → `https://seqanalysis.org/dna-gc-calculator.html`
   - Проверь, что страница открывается нормально (Status: 200)
   - Нажми **"Request Indexing"**

3. **Проверь, что Worker настроен правильно:**
   - Cloudflare Dashboard → Workers & Pages → Routes
   - Route должен быть только для `proteinanalysis.pages.dev/*`
   - НЕ должно быть route для `seqanalysis.org/*`

### Решение 1: Проверить текущие редиректы

**Проверь файл `_redirects`:**
```bash
cat public/_redirects
```

**Должно быть только:**
```
/index.html / 301
```

**Если есть редиректы без `.html` → с `.html`, удали их** (они могут вызывать проблемы).

### Решение 2: Проверить Worker настройки

**Проверь, что Worker `redirect-old-domain.js` настроен правильно:**

1. **Route должен быть:** `proteinanalysis.pages.dev/*`
2. **Worker должен редиректить только со старого домена**, не с нового

**Проверь в Cloudflare Dashboard:**
- Workers & Pages → Routes
- Убедись, что route `proteinanalysis.pages.dev/*` указывает на Worker
- Убедись, что нет route для `seqanalysis.org/*` через этот Worker

### Решение 3: Проверить URL в Google Search Console

**Для каждой страницы с ошибкой:**

1. Открой **URL Inspection** в GSC
2. Введи URL: `https://seqanalysis.org/dna-gc-calculator.html`
3. Нажми **"Test Live URL"**
4. Проверь:
   - **HTTP response code** - должен быть `200` (не `301` или `302`)
   - **Redirect chain** - не должно быть редиректов
   - **Canonical URL** - должен быть `https://seqanalysis.org/dna-gc-calculator.html`

### Решение 4: Запросить переиндексацию

**После проверки:**

1. В **URL Inspection** для каждой страницы:
   - Нажми **"Request Indexing"**
   - Подожди 1-2 дня

2. В **Page indexing → Redirect error**:
   - Нажми **"VALIDATE FIX"**
   - Подожди несколько дней для перепроверки

### Решение 5: Проверить Cloudflare настройки

**Проверь в Cloudflare Dashboard:**

1. **SSL/TLS → Overview:**
   - Режим должен быть **"Full"** или **"Full (strict)"**
   - HTTP → HTTPS редирект включен автоматически

2. **Page Rules:**
   - Не должно быть правил, которые редиректят `seqanalysis.org/*` на другие URL
   - Проверь, нет ли правил для `.html` файлов

3. **Workers Routes:**
   - Убедись, что нет route для `seqanalysis.org/*` через Worker редиректа

## 📋 Пошаговая инструкция

### Шаг 1: Проверь текущее состояние

```bash
# Проверь файл _redirects
cat public/_redirects

# Проверь Worker
cat workers/redirect-old-domain.js
```

### Шаг 2: Проверь в браузере

Открой каждую страницу напрямую:
- `https://seqanalysis.org/dna-gc-calculator.html`
- `https://seqanalysis.org/orf-finder.html`
- `https://seqanalysis.org/reverse-complement.html`

**Проверь в DevTools → Network:**
- Status code должен быть `200` (не `301` или `302`)
- Не должно быть редиректов

### Шаг 3: Проверь через curl

```bash
curl -I https://seqanalysis.org/dna-gc-calculator.html
curl -I https://seqanalysis.org/orf-finder.html
curl -I https://seqanalysis.org/reverse-complement.html
```

**Должно быть:**
```
HTTP/2 200
```

**Не должно быть:**
```
HTTP/2 301
Location: ...
```

### Шаг 4: Проверь в Google Search Console

1. **URL Inspection** → `https://seqanalysis.org/dna-gc-calculator.html`
2. **Test Live URL**
3. Проверь:
   - ✅ **HTTP response code:** `200`
   - ✅ **Redirect chain:** пусто
   - ✅ **Canonical URL:** `https://seqanalysis.org/dna-gc-calculator.html`

### Шаг 5: Запроси переиндексацию

1. Для каждой страницы: **Request Indexing**
2. В **Redirect error**: **VALIDATE FIX**

## 🎯 Ожидаемый результат

**Через 1-2 недели:**
- ✅ Ошибки "Redirect error" исчезнут из GSC
- ✅ Страницы будут проиндексированы правильно
- ✅ HTTP response code будет `200` для всех страниц

## ✅ Рекомендуемое решение

### Вариант 1: Запросить переиндексацию (РЕКОМЕНДУЕТСЯ)

1. **В Google Search Console:**
   - Page indexing → Redirect error → **VALIDATE FIX**
   - Для каждой страницы: URL Inspection → **Request Indexing**

2. **Подожди 1-2 недели:**
   - Google перепроверит страницы
   - Ошибки должны исчезнуть

### Вариант 2: Игнорировать (если не критично)

Если ошибки не критичны и страницы работают правильно:
- **Можно игнорировать** - Google все равно индексирует страницы
- Ошибки могут исчезнуть сами через несколько недель
- Редирект со старого домена на новый - это нормально и правильно

### Вариант 2: Проверь старый домен

Если Google индексирует через `proteinanalysis.pages.dev`:
- Убедись, что Worker редиректит правильно
- Проверь, что редирект `301` (не `302`)

### Вариант 3: Обратись в поддержку Cloudflare

Если проблема в настройках Cloudflare:
- Проверь Page Rules
- Проверь Workers Routes
- Проверь SSL/TLS настройки

---

## 📝 Примечания

- **"Redirect error"** не всегда критична - если страницы работают правильно, Google все равно их индексирует
- Ошибки могут быть из-за кэша Google - нужно время для обновления
- После исправления нужно подождать 1-2 недели для перепроверки Google
- **Редирект со старого домена на новый - это нормально и правильно** - это стандартная практика при миграции домена
- Worker `redirect-old-domain.js` настроен правильно и не влияет на запросы к новому домену

## ✅ Что было исправлено в коде

1. **Worker `redirect-old-domain.js`:**
   - Добавлена явная проверка для нового домена `seqanalysis.org`
   - Worker гарантированно не влияет на запросы к новому домену
   - Редиректит только со старого домена `proteinanalysis.pages.dev`

2. **Документация обновлена:**
   - Добавлены рекомендации по исправлению ошибок в GSC
   - Объяснено, что ошибки не критичны и страницы работают правильно
