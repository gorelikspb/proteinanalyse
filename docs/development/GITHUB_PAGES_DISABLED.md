# GitHub Pages отключен

## Почему

Этот проект использует **Cloudflare Pages** для деплоя, а не GitHub Pages.

GitHub Pages автоматически пытается собрать проект через Jekyll, что вызывает ошибки сборки.

## Что сделано

1. **`.github/workflows/pages.yml`** - GitHub Actions workflow, который пропускает сборку
2. **`public/.nojekyll`** - Файл, который отключает Jekyll обработку в GitHub Pages

## Результат

- ✅ GitHub Pages не пытается собирать проект
- ✅ Нет ошибок сборки в GitHub Actions
- ✅ Проект деплоится только через Cloudflare Pages
- ✅ Production сайт: https://seqanalysis.org

## Если нужно включить GitHub Pages

1. Удали `.github/workflows/pages.yml`
2. Удали `public/.nojekyll`
3. Настрой GitHub Pages в Settings > Pages
4. Выбери branch: `master`, folder: `/public`

**Но рекомендуется использовать Cloudflare Pages** - он уже настроен и работает.

