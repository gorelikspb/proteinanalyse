# Скрипт для покупки домена через Cloudflare
# Требует: Cloudflare API Token с правами на Domain Registration

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [int]$Years = 1
)

# Проверка наличия Cloudflare API токена
$configPath = "instructions\.cloudflare-config.local"
if (Test-Path $configPath) {
    $config = Get-Content $configPath | ConvertFrom-StringData
    $apiToken = $config.CLOUDFLARE_API_TOKEN
    $accountId = $config.CLOUDFLARE_ACCOUNT_ID
} else {
    Write-Host "❌ Файл конфигурации не найден: $configPath" -ForegroundColor Red
    Write-Host "   Создай файл с CLOUDFLARE_API_TOKEN и CLOUDFLARE_ACCOUNT_ID" -ForegroundColor Yellow
    exit 1
}

if (-not $apiToken) {
    Write-Host "❌ CLOUDFLARE_API_TOKEN не найден в конфигурации" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Проверяю доступность домена: $Domain" -ForegroundColor Cyan

# Проверка доступности через Cloudflare API
$checkUrl = "https://api.cloudflare.com/client/v4/registrar/domains/check"
$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

$body = @{
    domains = @($Domain)
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $checkUrl -Method Post -Headers $headers -Body $body
    
    if ($response.result[0].available) {
        Write-Host "✅ Домен $Domain доступен!" -ForegroundColor Green
        Write-Host ""
        Write-Host "💰 Цена: ~$($response.result[0].price)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⚠️  ВНИМАНИЕ: Автоматическая покупка домена требует:" -ForegroundColor Yellow
        Write-Host "   1. Настроенный платежный метод в Cloudflare" -ForegroundColor White
        Write-Host "   2. Подтверждение покупки" -ForegroundColor White
        Write-Host ""
        
        $confirm = Read-Host "Продолжить покупку? (yes/no)"
        if ($confirm -ne "yes") {
            Write-Host "Покупка отменена." -ForegroundColor Yellow
            exit 0
        }
        
        # Покупка домена
        Write-Host "🛒 Покупаю домен $Domain..." -ForegroundColor Cyan
        
        $purchaseUrl = "https://api.cloudflare.com/client/v4/registrar/domains"
        $purchaseBody = @{
            domain = $Domain
            years = $Years
        } | ConvertTo-Json
        
        $purchaseResponse = Invoke-RestMethod -Uri $purchaseUrl -Method Post -Headers $headers -Body $purchaseBody
        
        if ($purchaseResponse.success) {
            Write-Host "✅ Домен $Domain успешно куплен!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📝 Следующие шаги:" -ForegroundColor Cyan
            Write-Host "   1. Домен автоматически подключен к Cloudflare" -ForegroundColor White
            Write-Host "   2. Запусти скрипт настройки: .\scripts\setup-domain-dns.ps1 -Domain $Domain" -ForegroundColor White
            Write-Host "   3. Обнови настройки Cloudflare Pages проекта" -ForegroundColor White
        } else {
            Write-Host "❌ Ошибка при покупке домена" -ForegroundColor Red
            Write-Host $purchaseResponse | ConvertTo-Json -Depth 3
        }
        
    } else {
        Write-Host "❌ Домен $Domain недоступен (занят)" -ForegroundColor Red
        Write-Host "   Попробуй другой вариант домена." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Ошибка при проверке домена:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host ""
        Write-Host "💡 Возможно, нужен API токен с правами на Domain Registration" -ForegroundColor Yellow
        Write-Host "   Создай токен здесь: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
        Write-Host "   Нужны права: Account → Domain Registration → Edit" -ForegroundColor Yellow
    }
}







