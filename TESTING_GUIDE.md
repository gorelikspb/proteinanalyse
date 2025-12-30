  # Руководство по тестированию текущего состояния проекта

## Что реально реализовано и работает

### ✅ Client-side инструменты (работают полностью)
Все эти инструменты работают в браузере без сервера:

1. **GC Content Calculator** (`/dna-gc-calculator.html`)
   - ✅ Работает полностью
   - ✅ Анализирует GC%, AT%, состав нуклеотидов

2. **ORF Finder** (`/orf-finder.html`)
   - ✅ Работает полностью
   - ✅ Находит открытые рамки считывания

3. **Protein MW Calculator** (`/protein-mw-calculator.html`)
   - ✅ Работает полностью
   - ✅ Вычисляет молекулярный вес, состав аминокислот

4. **DNA Translation** (`/sequence-translation.html`)
   - ✅ Работает полностью
   - ✅ Переводит DNA в белок

5. **Reverse Complement** (`/reverse-complement.html`)
   - ✅ Работает полностью

6. **AI Feasibility Check** (`/ai-feasibility.html`)
   - ✅ Работает полностью (client-side анализ)

7. **Все остальные инструменты** - работают полностью

### ⚠️ Backend API (частично реализовано, нужно тестировать)

#### API Endpoint 1: `/api/database-lookup`

**Что реализовано:**
- ✅ GET запрос (health check) - работает
- ✅ POST запрос с UniProt ID lookup - работает
- ⚠️ POST запрос с BLAST search - частично (возвращает job ID, но не обрабатывает результаты)
- ⚠️ POST запрос с text search - работает, но упрощенно (поиск по длине последовательности)

**Что НЕ реализовано:**
- ❌ Полноценный BLAST поиск с обработкой результатов
- ❌ PDB lookup - только placeholder
- ❌ NCBI lookup - только placeholder

#### API Endpoint 2: `/api/analyze`

**Что реализовано:**
- ✅ GET запрос (health check) - работает
- ⚠️ POST запрос - возвращает placeholder ответы

**Что НЕ реализовано:**
- ❌ ML predictions - только placeholder ("ML predictions endpoint - integration pending")
- ❌ Database lookup через этот endpoint - только placeholder
- ❌ Benchmark comparison - только placeholder

#### API Endpoint 3: `/api/benchmark`

**Что реализовано:**
- ✅ GET/POST запросы - работают
- ⚠️ Возвращает placeholder ответы ("D1 database integration pending")

**Что НЕ реализовано:**
- ❌ D1 база данных не создана
- ❌ Нет реальных benchmark данных
- ❌ Нет логики сравнения

---

## Инструкции по тестированию

### Тест 1: Проверка базовых инструментов (client-side)

**Шаги:**
1. Открой `https://proteinanalysis.pages.dev/dna-gc-calculator.html`
2. Вставь пример последовательности: `ATGCGATCGATCGATCG`
3. Нажми "Analyze"
4. **Ожидаемый результат:** Должны показаться результаты (GC%, длина и т.д.)

**Проверь все инструменты:**
- [ ] GC Calculator работает
- [ ] ORF Finder работает
- [ ] Protein MW Calculator работает
- [ ] DNA Translation работает
- [ ] AI Feasibility работает

---

### Тест 2: Проверка Backend API (GET запросы)

**Шаги:**
1. Открой `https://proteinanalysis.pages.dev/test-api.html`
2. Нажми кнопку **"Test GET /api/database-lookup"**
3. **Ожидаемый результат:** Должен вернуться JSON:
   ```json
   {
     "success": true,
     "message": "Database Lookup API is running",
     "endpoints": { ... }
   }
   ```

**Проверь:**
- [ ] GET `/api/database-lookup` возвращает JSON (не HTML, не 405)
- [ ] GET `/api/analyze` возвращает JSON

**Как проверить вручную в консоли браузера:**
```javascript
// Тест 1: Database Lookup API
fetch('/api/database-lookup')
  .then(r => r.json())
  .then(console.log)

// Тест 2: Analyze API
fetch('/api/analyze')
  .then(r => r.json())
  .then(console.log)

// Тест 3: Benchmark API
fetch('/api/benchmark?action=list')
  .then(r => r.json())
  .then(console.log)
```

---

### Тест 3: Проверка UniProt ID Lookup (POST запрос)

**Шаги:**
1. Открой `https://proteinanalysis.pages.dev/test-api.html`
2. Нажми кнопку **"Test POST /api/database-lookup"**
3. **Ожидаемый результат:** Должен вернуться JSON с данными UniProt записи или ошибкой "not found"

**Проверь с разными UniProt ID:**
```javascript
// Тест с реальным UniProt ID
fetch('/api/database-lookup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sequence: 'P12345',  // UniProt ID
    database: 'uniprot',
    action: 'id'
  })
})
.then(r => r.json())
.then(console.log)

// Тест с другим ID (например, P04637 - p53)
fetch('/api/database-lookup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sequence: 'P04637',
    database: 'uniprot',
    action: 'id'
  })
})
.then(r => r.json())
.then(console.log)
```

**Ожидаемый результат:**
- Если ID найден: JSON с данными белка (name, organism, length, sequence и т.д.)
- Если ID не найден: JSON с ошибкой 404

---

### Тест 4: Проверка Text Search (POST запрос)

**Шаги:**
```javascript
// Поиск по длине последовательности (упрощенный поиск)
fetch('/api/database-lookup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sequence: 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWYVMQSNDNLKHRLTRDLALRFAVYTHNQRD',
    database: 'uniprot',
    action: 'search'
  })
})
.then(r => r.json())
.then(console.log)
```

**Ожидаемый результат:**
- JSON с результатами поиска (приблизительные совпадения по длине)
- Может быть пустой массив, если ничего не найдено

---

### Тест 5: Проверка BLAST Search (POST запрос - частично работает)

**Шаги:**
```javascript
// BLAST поиск (возвращает job ID, но не обрабатывает результаты)
fetch('/api/database-lookup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sequence: 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWYVMQSNDNLKHRLTRDLALRFAVYTHNQRD',
    database: 'uniprot',
    action: 'blast'
  })
})
.then(r => r.json())
.then(console.log)
```

**Ожидаемый результат:**
- JSON с job ID и сообщением о том, что BLAST требует асинхронной обработки
- Или fallback на text search

**⚠️ Важно:** Полноценный BLAST поиск НЕ реализован - это только заглушка.

---

### Тест 6: Проверка Analyze API (POST запрос - только placeholders)

**Шаги:**
```javascript
// ML Predictions (placeholder)
fetch('/api/analyze', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sequence: 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWYVMQSNDNLKHRLTRDLALRFAVYTHNQRD',
    analysisType: 'ml_predictions'
  })
})
.then(r => r.json())
.then(console.log)
```

**Ожидаемый результат:**
- JSON с сообщением "ML predictions endpoint - integration pending"
- Это placeholder, реальной ML интеграции нет

---

### Тест 7: Проверка Benchmark API (POST запрос - только placeholders)

**Шаги:**
```javascript
// Benchmark comparison (placeholder)
fetch('/api/benchmark?action=compare&sequence=MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWYVMQSNDNLKHRLTRDLALRFAVYTHNQRD')
  .then(r => r.json())
  .then(console.log)
```

**Ожидаемый результат:**
- JSON с сообщением "D1 database integration pending"
- Это placeholder, реальной базы данных нет

---

## Чеклист тестирования

### ✅ Что должно работать:

- [ ] Все client-side инструменты работают
- [ ] GET `/api/database-lookup` возвращает JSON
- [ ] GET `/api/analyze` возвращает JSON
- [ ] GET `/api/benchmark` возвращает JSON
- [ ] POST `/api/database-lookup` с UniProt ID возвращает данные или ошибку 404
- [ ] POST `/api/database-lookup` с text search возвращает результаты (может быть пустой массив)

### ⚠️ Что работает частично:

- [ ] POST `/api/database-lookup` с BLAST - возвращает job ID, но не обрабатывает результаты
- [ ] POST `/api/analyze` - возвращает placeholder ответы
- [ ] POST `/api/benchmark` - возвращает placeholder ответы

### ❌ Что НЕ реализовано:

- [ ] Полноценный BLAST поиск с обработкой результатов
- [ ] ML predictions (ESM, AlphaFold)
- [ ] D1 база данных с benchmark данными
- [ ] PDB lookup
- [ ] NCBI lookup
- [ ] Генерация PDF отчетов
- [ ] Работа с приватными базами данных

---

## Что делать дальше

После тестирования определи, что работает, а что нет. Затем можно:

1. **Если API не работает** - проверить логи деплоя в Cloudflare Dashboard
2. **Если API работает** - можно начинать реализацию нового функционала
3. **Если нужны улучшения** - расширить существующие endpoints

---

## Быстрая проверка (все в одном)

Открой консоль браузера на сайте и выполни:

```javascript
// Быстрая проверка всех API
async function testAllAPIs() {
  console.log('=== Testing All APIs ===\n');
  
  // Test 1: Database Lookup GET
  console.log('1. Testing GET /api/database-lookup...');
  try {
    const r1 = await fetch('/api/database-lookup');
    const d1 = await r1.json();
    console.log('✓ GET /api/database-lookup:', d1.success ? 'OK' : 'FAILED');
  } catch (e) {
    console.log('✗ GET /api/database-lookup: ERROR', e.message);
  }
  
  // Test 2: Analyze GET
  console.log('2. Testing GET /api/analyze...');
  try {
    const r2 = await fetch('/api/analyze');
    const d2 = await r2.json();
    console.log('✓ GET /api/analyze:', d2.service ? 'OK' : 'FAILED');
  } catch (e) {
    console.log('✗ GET /api/analyze: ERROR', e.message);
  }
  
  // Test 3: Benchmark GET
  console.log('3. Testing GET /api/benchmark...');
  try {
    const r3 = await fetch('/api/benchmark?action=list');
    const d3 = await r3.json();
    console.log('✓ GET /api/benchmark:', d3.success !== undefined ? 'OK' : 'FAILED');
  } catch (e) {
    console.log('✗ GET /api/benchmark: ERROR', e.message);
  }
  
  // Test 4: UniProt ID Lookup
  console.log('4. Testing POST /api/database-lookup (UniProt ID)...');
  try {
    const r4 = await fetch('/api/database-lookup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({sequence: 'P04637', database: 'uniprot', action: 'id'})
    });
    const d4 = await r4.json();
    console.log('✓ POST /api/database-lookup (ID):', d4.success ? 'OK' : 'FAILED');
  } catch (e) {
    console.log('✗ POST /api/database-lookup (ID): ERROR', e.message);
  }
  
  console.log('\n=== Testing Complete ===');
}

// Запустить тесты
testAllAPIs();
```

Скопируй этот код в консоль браузера на сайте и выполни - увидишь, что работает, а что нет.
