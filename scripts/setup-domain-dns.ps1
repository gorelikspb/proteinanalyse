# Скрипт для настройки DNS и подключения домена к Cloudflare Pages

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [string]$PagesProject = "proteinanalyse",
    [string]$PagesSubdomain = "proteinanalysis"
)

Write-Host "⚙️  Настройка DNS для домена: $Domain" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия Cloudflare API токена
$configPath = "instructions\.cloudflare-config.local"
if (Test-Path $configPath) {
    $config = Get-Content $configPath | ConvertFrom-StringData
    $apiToken = $config.CLOUDFLARE_API_TOKEN
    $accountId = $config.CLOUDFLARE_ACCOUNT_ID
} else {
    Write-Host "❌ Файл конфигурации не найден" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

try {
    # 1. Получить Zone ID для домена
    Write-Host "1️⃣  Получаю Zone ID для $Domain..." -ForegroundColor Cyan
    $zoneUrl = "https://api.cloudflare.com/client/v4/zones?name=$Domain"
    $zoneResponse = Invoke-RestMethod -Uri $zoneUrl -Method Get -Headers $headers
    
    if ($zoneResponse.result.Count -eq 0) {
        Write-Host "❌ Домен не найден в Cloudflare. Убедись, что домен добавлен в Cloudflare." -ForegroundColor Red
        exit 1
    }
    
    $zoneId = $zoneResponse.result[0].id
    Write-Host "   ✅ Zone ID: $zoneId" -ForegroundColor Green
    Write-Host ""
    
    # 2. Получить информацию о Cloudflare Pages проекте
    Write-Host "2️⃣  Получаю информацию о Cloudflare Pages проекте..." -ForegroundColor Cyan
    $pagesUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$PagesProject"
    
    try {
        $pagesResponse = Invoke-RestMethod -Uri $pagesUrl -Method Get -Headers $headers
        $pagesSubdomain = $pagesResponse.result.subdomain
        Write-Host "   ✅ Проект найден: $pagesSubdomain.pages.dev" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Проект не найден автоматически. Используй subdomain из Cloudflare Dashboard." -ForegroundColor Yellow
        $pagesSubdomain = $PagesSubdomain
    }
    Write-Host ""
    
    # 3. Создать CNAME запись для корневого домена
    Write-Host "3️⃣  Создаю CNAME запись для $Domain → $pagesSubdomain.pages.dev..." -ForegroundColor Cyan
    
    $dnsUrl = "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records"
    $dnsBody = @{
        type = "CNAME"
        name = "@"
        content = "$pagesSubdomain.pages.dev"
        ttl = 1 # Auto
    } | ConvertTo-Json
    
    try {
        $dnsResponse = Invoke-RestMethod -Uri $dnsUrl -Method Post -Headers $headers -Body $dnsBody
        Write-Host "   ✅ CNAME запись создана" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Возможно, запись уже существует. Проверь вручную." -ForegroundColor Yellow
    }
    Write-Host ""
    
    # 4. Настроить Custom Domain в Cloudflare Pages
    Write-Host "4️⃣  Настраиваю Custom Domain в Cloudflare Pages..." -ForegroundColor Cyan
    
    $customDomainUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$PagesProject/domains"
    $customDomainBody = @{
        domain = $Domain
    } | ConvertTo-Json
    
    try {
        $customDomainResponse = Invoke-RestMethod -Uri $customDomainUrl -Method Post -Headers $headers -Body $customDomainBody
        Write-Host "   ✅ Custom Domain добавлен в Pages проект" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Возможно, домен уже добавлен. Проверь вручную в Cloudflare Dashboard." -ForegroundColor Yellow
    }
    Write-Host ""
    
    Write-Host "═══════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ НАСТРОЙКА ЗАВЕРШЕНА" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Следующие шаги:" -ForegroundColor Cyan
    Write-Host "   1. Подожди 5-30 минут для распространения DNS" -ForegroundColor White
    Write-Host "   2. Проверь доступность: https://$Domain" -ForegroundColor White
    Write-Host "   3. Обнови Google Search Console (добавь новое свойство)" -ForegroundColor White
    Write-Host "   4. Обнови sitemap.xml с новым доменом" -ForegroundColor White
    Write-Host "   5. Запусти скрипт обновления: .\scripts\update-site-domain.ps1 -NewDomain $Domain" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Ошибка при настройке DNS:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Альтернатива: Настрой DNS вручную через Cloudflare Dashboard:" -ForegroundColor Yellow
    Write-Host "   1. Cloudflare Dashboard → DNS → Records" -ForegroundColor White
    Write-Host "   2. Добавь CNAME: @ → $PagesSubdomain.pages.dev" -ForegroundColor White
    Write-Host "   3. Cloudflare Pages → Project → Custom Domains → Add domain" -ForegroundColor White
}
