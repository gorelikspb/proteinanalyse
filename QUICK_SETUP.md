# 🚀 Быстрая настройка Cloudflare Pages

GitHub уже подключен к Cloudflare. Следующие шаги:

## Шаг 1: Создать проект

1. Откройте: https://dash.cloudflare.com/pages
2. Нажмите **"Create a project"**
3. Выберите **"Import an existing Git repository"**
4. Выберите репозиторий: **`gorelikspb/proteinanalyse`**

## Шаг 2: Настроить проект

**Важные настройки:**

- **Project name**: Выберите одно из доступных:
  - `seq-tools` (если доступно)
  - `bioseq` (если доступно)
  - `sequence-lab` (если доступно)
  - `protein-tools` (если доступно)
  - `dna-analysis` (если доступно)
  - `seqanalysis` (если доступно)

- **Production branch**: `master`

- **Framework preset**: **"None"** (или оставьте пустым)

- **Build command**: **ОСТАВЬТЕ ПУСТЫМ**

- **Build output directory**: `public` ⚠️ **ВАЖНО!**

- **Root directory**: оставьте пустым

## Шаг 3: Деплой

1. Нажмите **"Save and Deploy"**
2. Дождитесь завершения деплоя (1-2 минуты)
3. Сайт будет доступен по адресу: `https://[выбранное-имя].pages.dev`

## Готово! ✅

После деплоя сайт автоматически обновляется при каждом `git push` в ветку `master`.

