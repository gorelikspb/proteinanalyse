/**
 * Cloudflare Worker для редиректа со старого домена на новый
 * 
 * Редиректит все запросы с proteinanalysis.pages.dev на seqanalysis.org
 * Использует 301 редирект для передачи SEO веса
 * 
 * ВАЖНО: Этот Worker должен быть настроен ТОЛЬКО для route: proteinanalysis.pages.dev/*
 * НЕ должен применяться к seqanalysis.org/*
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Строгая проверка: редиректим ТОЛЬКО со старого .pages.dev домена
    // Игнорируем все остальные домены (включая seqanalysis.org)
    if (url.hostname === 'proteinanalysis.pages.dev') {
      // Сохраняем путь и query параметры
      const path = url.pathname;
      const search = url.search;
      
      // Редирект на новый домен с сохранением пути
      const newUrl = `https://seqanalysis.org${path}${search}`;
      
      // 301 Permanent Redirect - передает SEO вес
      return Response.redirect(newUrl, 301);
    }
    
    // Для всех остальных запросов (включая seqanalysis.org) - пропускаем без изменений
    // Это важно: Worker не должен влиять на запросы к новому домену
    // Если запрос к seqanalysis.org - просто возвращаем оригинальный запрос
    if (url.hostname === 'seqanalysis.org') {
      // Для нового домена - не делаем никаких изменений
      return fetch(request);
    }
    
    // Для всех остальных доменов - пропускаем как обычно
    return fetch(request);
  }
};

