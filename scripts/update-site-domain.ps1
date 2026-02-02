# Скрипт для обновления домена во всех файлах сайта

param(
    [Parameter(Mandatory=$true)]
    [string]$NewDomain,
    
    [string]$OldDomain = "seqanalysis.org"  # Current production domain (see SITE_DOMAIN.md)
)

Write-Host "🔄 Обновление домена в файлах сайта..." -ForegroundColor Cyan
Write-Host "   Старый домен: $OldDomain" -ForegroundColor Yellow
Write-Host "   Новый домен: $NewDomain" -ForegroundColor Green
Write-Host ""

$filesToUpdate = @(
    "public\sitemap.xml",
    "public\robots.txt",
    "GOOGLE_INDEXING_STATUS.md",
    "SEO_FLUCTUATIONS_ANALYSIS.md"
)

$updatedCount = 0

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "Обновляю: $file" -NoNewline
        
        $content = Get-Content $file -Raw
        $newContent = $content -replace [regex]::Escape($OldDomain), $NewDomain
        
        if ($content -ne $newContent) {
            Set-Content -Path $file -Value $newContent -NoNewline
            Write-Host " ✅" -ForegroundColor Green
            $updatedCount++
        } else {
            Write-Host " (без изменений)" -ForegroundColor Gray
        }
    } else {
        Write-Host "Пропускаю: $file (не найден)" -ForegroundColor Yellow
    }
}

# Обновление sitemap.xml с новым доменом
if (Test-Path "public\sitemap.xml") {
    Write-Host ""
    Write-Host "Обновляю sitemap.xml..." -ForegroundColor Cyan
    $sitemap = [xml](Get-Content "public\sitemap.xml")
    foreach ($url in $sitemap.urlset.url) {
        $url.loc = $url.loc -replace [regex]::Escape($OldDomain), $NewDomain
    }
    $sitemap.Save("$PWD\public\sitemap.xml")
    Write-Host "   ✅ sitemap.xml обновлен" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ ОБНОВЛЕНО ФАЙЛОВ: $updatedCount" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Важно: Также нужно обновить вручную:" -ForegroundColor Cyan
Write-Host "   1. Google Search Console - добавь новое свойство" -ForegroundColor White
Write-Host "   2. Microsoft Clarity - обнови URL сайта (если нужно)" -ForegroundColor White
Write-Host "   3. Все внешние ссылки (если есть)" -ForegroundColor White
Write-Host ""







