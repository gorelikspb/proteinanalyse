# Инструкция: Создание Cloudflare Worker для Protein Analyse

## Подход: Один Worker = Один проект

**Принцип:**
- Каждый проект имеет свой Worker (чистое разделение)
- Все Worker'ы используют **один и тот же** RESEND_API_KEY и ADMIN_EMAIL
- Это проще для поддержки и отладки

## Создать новый Worker для proteinanalyse

### Шаг 1: Создай новый Worker в Cloudflare

1. Зайди в Cloudflare Dashboard → Workers & Pages → **Create Worker**
2. Название: `proteinanalyse-email` (или `proteinanalyse`)
3. Нажми **Deploy**
4. **Скопируй URL Worker'а** (например: `https://proteinanalyse-email.gorelikgo.workers.dev`)

### Шаг 2: Добавь код Worker

Замени код в Worker на:

```javascript
export default {
  async fetch(request, env) {
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method === 'POST') {
      try {
        const data = await request.json();
        
        // Advanced Analysis Request (Protein Sequence Analysis)
        if (data.type === 'advanced_analysis') {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Protein Analyse <onboarding@resend.dev>',
              to: env.ADMIN_EMAIL,
              reply_to: data.user_email,
              subject: `Advanced Analysis Request - Protein Sequence`,
              html: `
                <h2>New Advanced Analysis Request</h2>
                <p><strong>User Email:</strong> ${data.user_email}</p>
                <p><strong>Sequence:</strong></p>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">${data.sequence}</pre>
                <p><strong>Request Time:</strong> ${data.timestamp}</p>
                <hr>
                <p><em>Reply to this email to contact the user directly.</em></p>
                <p style="color: #666; font-size: 12px;">This is a request for advanced protein/DNA sequence analysis using ML models and advanced methods.</p>
              `
            })
          });
          
          const emailResult = await emailResponse.json();
          
          if (!emailResponse.ok) {
            console.error('Resend API error:', emailResult);
            return new Response(JSON.stringify({ 
              success: false, 
              error: emailResult.message || 'Failed to send email' 
            }), {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        return new Response(JSON.stringify({ success: false, error: 'Unknown request type' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  }
}
```

### Шаг 3: Добавь Secrets (те же самые, что и в printacopy Worker)

1. В Worker → Settings → Variables → Environment Variables
2. Добавь два **Secret** переменных (используй те же значения, что и в printacopy Worker):

   **RESEND_API_KEY**
   - Value: `re_EXpNX9RS_5ad8xQ2yn3ihD26Dtk8JmDJH` (тот же ключ!)
   - Type: **Secret**

   **ADMIN_EMAIL**
   - Value: `gorelikgo@gmail.com` (тот же email!)
   - Type: **Secret**

**Важно:** Можно использовать один и тот же ключ и email в разных Worker'ах!

### Шаг 4: Обнови код в ai-feasibility.html

Замени `WORKER_URL` в `ai-feasibility.html` на URL твоего нового Worker (из шага 1).

---

## Почему один Worker = один проект?

**Преимущества:**
- ✅ Чистое разделение проектов
- ✅ Легче отлаживать (логи отдельно для каждого проекта)
- ✅ Можно деплоить независимо
- ✅ Проще понять, откуда пришел запрос
- ✅ Один ключ и email используются везде (не нужно дублировать)

**Недостатки:**
- ❌ Больше Worker'ов для управления (но это не проблема)

---

## Альтернатива: Один Worker для всех проектов (не рекомендуется)

Если хочешь использовать один Worker для всех проектов (printacopy + proteinanalyse):

### Преимущества:
- ✅ Один Worker для управления
- ✅ Один набор Secrets (RESEND_API_KEY, ADMIN_EMAIL)
- ✅ Проще поддерживать
- ✅ Не нужно создавать новый Worker

### Обновить существующий Worker

1. Открой Cloudflare Dashboard → Workers & Pages → **printacopy** → Edit code
2. В секции `if (request.method === 'POST')` после обработки `contact` формы (после строки ~140) добавь:

```javascript
// Advanced Analysis Request (Protein Sequence Analysis)
if (data.type === 'advanced_analysis') {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Protein Analyse <onboarding@resend.dev>',
      to: env.ADMIN_EMAIL,
      reply_to: data.user_email,
      subject: `Advanced Analysis Request - Protein Sequence`,
      html: `
        <h2>New Advanced Analysis Request</h2>
        <p><strong>User Email:</strong> ${data.user_email}</p>
        <p><strong>Sequence:</strong></p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">${data.sequence}</pre>
        <p><strong>Request Time:</strong> ${data.timestamp}</p>
        <hr>
        <p><em>Reply to this email to contact the user directly.</em></p>
        <p style="color: #666; font-size: 12px;">This is a request for advanced protein/DNA sequence analysis using ML models and advanced methods.</p>
      `
    })
  });
  
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

3. Сохрани и задеплой (Save and deploy)

### URL уже настроен

В `ai-feasibility.html` уже используется правильный URL: `https://printacopy.gorelikgo.workers.dev`

---

## Рекомендация

**Используй Вариант 2 (общий Worker)** - проще и удобнее для нескольких проектов!

