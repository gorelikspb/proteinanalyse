# Скрипт для проверки доступности доменов
# Проверяет доступность доменов через WHOIS или Cloudflare API

param(
    [string[]]$Domains = @(
        "proteinanalysis.com",
        "proteinanalysis.org",
        "seqanalysis.com",
        "seqanalysis.org",
        "biosequence.com",
        "biosequence.org",
        "protein-tools.com",
        "protein-tools.org",
        "proteinanalysis.science",
        "seqanalysis.science",
        "seqanalysis.de",
        "proteinanalysis.de",
        "biosequence.de",
        "protein-tools.de"
    )
)

Write-Host "Checking domain availability..." -ForegroundColor Cyan
Write-Host ""

$availableDomains = @()
$unavailableDomains = @()
$errorDomains = @()

foreach ($domain in $Domains) {
    Write-Host "Checking: $domain" -NoNewline
    
    try {
        # Простая проверка через nslookup
        $result = nslookup $domain 2>&1 | Select-String "Name:"
        
        if ($result -and $result.ToString() -match $domain) {
            Write-Host " - TAKEN" -ForegroundColor Red
            $unavailableDomains += $domain
        } else {
            Write-Host " - AVAILABLE" -ForegroundColor Green
            $availableDomains += $domain
        }
    } catch {
        Write-Host " - CHECK ERROR" -ForegroundColor Yellow
        $errorDomains += $domain
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "RESULTS" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

if ($availableDomains.Count -gt 0) {
    Write-Host "AVAILABLE DOMAINS:" -ForegroundColor Green
    foreach ($domain in $availableDomains) {
        Write-Host "  - $domain" -ForegroundColor Green
    }
    Write-Host ""
}

if ($unavailableDomains.Count -gt 0) {
    Write-Host "TAKEN DOMAINS:" -ForegroundColor Red
    foreach ($domain in $unavailableDomains) {
        Write-Host "  - $domain" -ForegroundColor Red
    }
    Write-Host ""
}

if ($errorDomains.Count -gt 0) {
    Write-Host "CHECK ERRORS:" -ForegroundColor Yellow
    foreach ($domain in $errorDomains) {
        Write-Host "  - $domain" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "RECOMMENDATIONS" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

if ($availableDomains.Count -eq 0) {
    Write-Host "All checked domains are taken." -ForegroundColor Yellow
    Write-Host "Try other variants or use current .pages.dev domain." -ForegroundColor Yellow
} else {
    Write-Host "Recommended purchase order:" -ForegroundColor Green
    $priority = 1
    
    # .com domains first
    foreach ($domain in $availableDomains) {
        if ($domain -match "\.com$") {
            Write-Host "  $priority. $domain (.com - best for SEO)" -ForegroundColor Green
            $priority++
        }
    }
    
    # .org domains
    foreach ($domain in $availableDomains) {
        if ($domain -match "\.org$") {
            Write-Host "  $priority. $domain (.org - good for science)" -ForegroundColor Green
            $priority++
        }
    }
    
    # .science domains
    foreach ($domain in $availableDomains) {
        if ($domain -match "\.science$") {
            Write-Host "  $priority. $domain (.science - specific)" -ForegroundColor Green
            $priority++
        }
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check domains manually at: https://dash.cloudflare.com/domains" -ForegroundColor White
Write-Host "  2. Or use purchase script: .\scripts\purchase-domain-cloudflare.ps1" -ForegroundColor White
Write-Host ""
