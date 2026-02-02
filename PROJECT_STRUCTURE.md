# 📁 Структура проекта

## Корневая директория

```
proteinanalyse/
├── docs/                    # 📚 Вся документация
│   ├── seo/                # SEO и Google Search Console
│   ├── domain/             # Настройка домена
│   ├── development/        # Разработка
│   ├── README.md           # Описание документации
│   └── QUICK_ACTIONS.md    # Быстрые действия ⭐
├── public/                 # 🌐 Веб-сайт (деплоится в Cloudflare Pages)
├── functions/              # ⚙️ Cloudflare Functions (API)
├── scripts/                # 🔧 PowerShell скрипты
├── proteinanalyse_log/     # 📝 Детальные логи этапов
├── input/                  # 📥 Входные материалы
├── README.md               # 📖 Основной README
└── QUICK_SETUP.md          # ⚡ Быстрая настройка
```

---

## 📚 Документация (`docs/`)

### SEO (`docs/seo/`)
- **URL_INSPECTION_QUICK_GUIDE.md** ⭐ - **ЧТО ДЕЛАТЬ СЕЙЧАС**
- GOOGLE_SEARCH_CONSOLE_SETUP.md
- GOOGLE_SEARCH_CONSOLE_INDEXING_FIX.md
- GOOGLE_INDEXING_STATUS.md
- SEO_FLUCTUATIONS_ANALYSIS.md
- CLARITY_NEW_DOMAIN_SETUP.md

### Домен (`docs/domain/`)
- SITE_DOMAIN.md - Production домен (seqanalysis.org)
- CLOUDFLARE_DOMAIN_SETUP.md
- CLOUDFLARE_PAGES_FUNCTIONS.md
- DOMAIN_PRIVACY_GUIDE.md
- DOMAIN_PURCHASE_TROUBLESHOOTING.md

### Разработка (`docs/development/`)
- COMPREHENSIVE_ANALYSIS_GUIDE.md
- TESTING_GUIDE.md
- IMPLEMENTATION_STATUS.md
- ALPHAFOLD_INTEGRATION_PLAN.md
- FUNCTIONS_AUTO_ENABLE.md
- FUNCTIONS_SETUP_CHECK.md
- BUILD_FAILURE_TROUBLESHOOTING.md
- INDEXNOW_SETUP.md

### Логи (`docs/`)
- PROJECT_LOG.md
- AUTOMATION_LOG.md
- PROJECT_LOG_TEMPLATE.md

---

## 🌐 Веб-сайт (`public/`)

- HTML страницы инструментов
- `articles/` - Статьи и гайды
- `common.js` - Общие функции
- `styles.css` - Стили
- `sitemap.xml` - Sitemap для SEO
- `robots.txt` - Robots.txt
- `_redirects` - Редиректы для Cloudflare Pages
- `_routes.json` - Маршруты для Cloudflare Functions

**Файлы верификации (можно оставить):**
- `googlef3f3c11e41734504.html` - Google Search Console
- `655c8e40f6a842a786e1e04583469b14.txt` - Другая верификация

---

## ⚙️ API Functions (`functions/`)

- `api/database-lookup.js` - Поиск в базах данных
- `api/analyze.js` - Анализ последовательностей
- `api/benchmark.js` - Бенчмаркинг

---

## 🔧 Скрипты (`scripts/`)

- `check-domains.ps1` - Проверка доменов
- `purchase-domain-cloudflare.ps1` - Покупка домена
- `setup-domain-dns.ps1` - Настройка DNS
- `update-site-domain.ps1` - Обновление домена в файлах

---

**Готово!** Проект упорядочен и готов к работе. 🚀
