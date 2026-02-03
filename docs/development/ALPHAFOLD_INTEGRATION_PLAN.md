# 🧪 План интеграции AlphaFold - 3D визуализация структур

## 🎯 Цель

Добавить возможность просмотра 3D структур белков из AlphaFold Database прямо на сайте.

---

## 📋 Вариант реализации: Показ готовых структур (САМЫЙ ПРОСТОЙ)

### Почему этот вариант:
- ✅ Бесплатно (AlphaFold Database API)
- ✅ Быстро (структуры уже предсказаны)
- ✅ Простая интеграция (REST API)
- ✅ Работает для большинства белков в UniProt

---

## 🔧 Технические детали

### API для использования:
- **AlphaFold Database API**: `https://alphafold.ebi.ac.uk/api/prediction/{uniprot_id}`
- **Формат ответа**: JSON с URL к PDB/CIF файлам
- **Бесплатно**: Да, публичный API

### Библиотека для визуализации:
- **3Dmol.js** (рекомендуется)
  - Легкая (~200KB)
  - Работает в браузере
  - Простая интеграция
  - CDN: `https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.1.0/3Dmol-min.js`

### Альтернатива:
- **Molstar** (более продвинутый)
  - Больше функций (~1MB)
  - Более детальная визуализация
  - CDN: `https://unpkg.com/molstar@latest/build/viewer/molstar.min.js`

---

## 📝 План реализации

### Шаг 1: Добавить кнопку "View 3D Structure" в comprehensive-analysis.html

**Где:** В секции результатов анализа, рядом с кнопкой "Generate PDF Report"

**Условие показа:**
- Кнопка видна только если есть UniProt ID
- Или если пользователь ввел UniProt ID при анализе

**Код:**
```html
<button id="view-3d-btn" class="btn-secondary" style="display: none;">
    View 3D Structure (AlphaFold)
</button>
```

---

### Шаг 2: Добавить контейнер для 3D визуализации

**Где:** В секции результатов, после всех анализов

**Код:**
```html
<div id="structure-viewer-container" style="display: none; margin-top: 30px;">
    <h3>3D Protein Structure (AlphaFold)</h3>
    <div id="structure-viewer" style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 5px;"></div>
    <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
        Structure predicted by AlphaFold. Data from AlphaFold Database.
    </p>
</div>
```

---

### Шаг 3: Подключить 3Dmol.js библиотеку

**Где:** В `<head>` или перед закрывающим `</body>` в comprehensive-analysis.html

**Код:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.1.0/3Dmol-min.js"></script>
```

---

### Шаг 4: Реализовать функцию загрузки структуры

**Где:** В JavaScript секции comprehensive-analysis.html

**Код:**
```javascript
async function fetchAlphaFoldStructure(uniprotId) {
    try {
        const response = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${uniprotId}`);
        if (!response.ok) {
            throw new Error('Structure not found in AlphaFold Database');
        }
        const data = await response.json();
        
        // Найти первую модель (обычно это основная структура)
        if (data && data.length > 0) {
            // Предпочитаем PDB формат (проще для 3Dmol.js)
            const pdbUrl = data[0].pdbUrl || data[0].cifUrl;
            return pdbUrl;
        }
        throw new Error('No structure data found');
    } catch (error) {
        console.error('AlphaFold API error:', error);
        throw error;
    }
}

async function load3DStructure(uniprotId) {
    const container = document.getElementById('structure-viewer-container');
    const viewerDiv = document.getElementById('structure-viewer');
    const btn = document.getElementById('view-3d-btn');
    
    // Показать контейнер
    container.style.display = 'block';
    btn.disabled = true;
    btn.textContent = 'Loading structure...';
    
    try {
        // Получить URL структуры
        const structureUrl = await fetchAlphaFoldStructure(uniprotId);
        
        // Загрузить PDB файл
        const pdbResponse = await fetch(structureUrl);
        const pdbData = await pdbResponse.text();
        
        // Инициализировать 3Dmol.js
        const viewer = $3Dmol.createViewer(viewerDiv, {
            defaultcolors: $3Dmol.getElementColors()
        });
        
        // Загрузить структуру
        viewer.addModel(pdbData, "pdb");
        viewer.setStyle({}, {cartoon: {color: "spectrum"}});
        viewer.zoomTo();
        viewer.render();
        
        btn.disabled = false;
        btn.textContent = 'View 3D Structure (AlphaFold)';
        
    } catch (error) {
        alert('Could not load 3D structure: ' + error.message);
        container.style.display = 'none';
        btn.disabled = false;
        btn.textContent = 'View 3D Structure (AlphaFold)';
    }
}
```

---

### Шаг 5: Подключить обработчик кнопки

**Где:** В `DOMContentLoaded` секции

**Код:**
```javascript
document.getElementById('view-3d-btn').addEventListener('click', () => {
    const uniprotId = currentAnalysisResults?.uniprotId;
    if (uniprotId) {
        load3DStructure(uniprotId);
    } else {
        alert('UniProt ID required for 3D structure visualization');
    }
});
```

---

### Шаг 6: Показывать кнопку когда есть UniProt ID

**Где:** В функции `displayResults()`

**Код:**
```javascript
// После отображения результатов
if (results.uniprotId) {
    document.getElementById('view-3d-btn').style.display = 'inline-block';
} else {
    document.getElementById('view-3d-btn').style.display = 'none';
}
```

---

## 🎨 Дополнительные улучшения (опционально)

### 1. Поддержка последовательностей без UniProt ID

**Идея:** Если пользователь ввел только последовательность, можно:
- Попробовать найти UniProt ID через BLAST (уже есть в API)
- Или показать сообщение "3D structure available only for proteins with UniProt ID"

### 2. Стилизация визуализатора

**Идея:** Добавить кнопки управления:
- Zoom in/out
- Rotate
- Change representation (cartoon, sticks, surface)
- Color scheme (spectrum, hydrophobicity, charge)

### 3. Экспорт структуры

**Идея:** Кнопка "Download PDB" для скачивания структуры

---

## ⏱️ Время реализации

- **Базовый вариант:** 2-3 часа
- **С улучшениями:** 4-5 часов

---

## 🧪 Тестирование

### Тестовые UniProt ID для проверки:

1. **P00533** (EGFR) - большая структура, хороший тест
2. **P61626** (Lysozyme C) - маленькая структура, быстрая загрузка
3. **Q96LB9** (PGLYRP3) - средний размер

### Что проверить:

1. ✅ Загрузка структуры работает
2. ✅ 3D визуализация отображается
3. ✅ Обработка ошибок (если структуры нет)
4. ✅ Кнопка показывается только при наличии UniProt ID
5. ✅ Работает на мобильных устройствах (3Dmol.js адаптивный)

---

## 📚 Полезные ссылки

- **AlphaFold API Docs**: https://alphafold.ebi.ac.uk/api-docs
- **3Dmol.js Documentation**: http://3dmol.csb.pitt.edu/
- **AlphaFold Database**: https://alphafold.ebi.ac.uk/

---

## 🚀 Следующие шаги (после базовой реализации)

1. Добавить поддержку последовательностей без UniProt ID (через BLAST поиск)
2. Добавить больше опций визуализации (разные представления, цветовые схемы)
3. Добавить экспорт структуры (PDB, CIF форматы)
4. Добавить сравнение структур (если несколько вариантов)
5. Интеграция в другие страницы (protein-mw-calculator, ai-feasibility)

---

**Готово к реализации!** Начни с базового варианта (Шаги 1-6), потом можно добавить улучшения. 🧪






