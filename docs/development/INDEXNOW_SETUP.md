# Настройка IndexNow для Bing

## Что сделано:

✅ Создан файл с ключом: `public/655c8e40f6a842a786e1e04583469b14.txt`

## IndexNow Key:
`655c8e40f6a842a786e1e04583469b14`

## Настройка Cloudflare Crawler Hints:

### Вариант 1: Включить Crawler Hints в Cloudflare Dashboard (рекомендуется)

1. Зайдите в Cloudflare Dashboard
2. Выберите ваш сайт: `proteinanalysis.pages.dev`
3. Перейдите в **Speed** → **Optimization**
4. Найдите **Crawler Hints**
5. Включите **Crawler Hints**
6. Cloudflare автоматически будет отправлять уведомления в IndexNow при обновлении страниц

### Вариант 2: Ручная отправка через API (если Crawler Hints недоступно)

Можно создать Cloudflare Worker для автоматической отправки в IndexNow API при обновлении страниц.

**IndexNow API endpoint:**
```
POST https://api.indexnow.org/IndexNow
Content-Type: application/json

{
  "host": "proteinanalysis.pages.dev",
  "key": "655c8e40f6a842a786e1e04583469b14",
  "urlList": [
    "https://proteinanalysis.pages.dev/",
    "https://proteinanalysis.pages.dev/index.html"
  ]
}
```

## Проверка:

1. После деплоя проверьте доступность файла:
   `https://proteinanalysis.pages.dev/655c8e40f6a842a786e1e04583469b14.txt`
   
2. Должен открыться файл с ключом: `655c8e40f6a842a786e1e04583469b14`

3. В Bing Webmaster Tools:
   - Перейдите в настройки сайта
   - Проверьте, что IndexNow активирован
   - После обновления страниц они должны индексироваться быстрее

## Преимущества IndexNow:

- ✅ Мгновенное уведомление поисковиков об обновлениях
- ✅ Поддерживается Bing, Yandex, Seznam
- ✅ Работает автоматически через Cloudflare Crawler Hints
- ✅ Ускоряет индексацию новых страниц

## Примечание:

IndexNow работает только для обновлений существующих страниц и новых страниц. Для первоначальной индексации все еще нужен sitemap и запрос через Search Console.

