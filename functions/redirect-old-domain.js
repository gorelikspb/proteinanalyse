/**
 * Cloudflare Worker для редиректа со старого домена на новый
 * 
 * Редиректит все запросы с proteinanalysis.pages.dev на seqanalysis.org
 * Использует 301 редирект для передачи SEO веса
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Редирект со старого .pages.dev домена на новый домен
    if (url.hostname === 'proteinanalysis.pages.dev') {
      // Сохраняем путь и query параметры
      const path = url.pathname;
      const search = url.search;
      
      // Редирект на новый домен с сохранением пути
      const newUrl = `https://seqanalysis.org${path}${search}`;
      
      // 301 Permanent Redirect - передает SEO вес
      return Response.redirect(newUrl, 301);
    }
    
    // Для всех остальных запросов - пропускаем как обычно
    return fetch(request);
  }
};

