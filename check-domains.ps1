# Quick domain availability check
$token = "GLfM43P0u8FFEq7wK83FKd6cjxx6_nZfWSfo-frr"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$domainNames = @(
    "seq-tools",
    "bioseq",
    "sequence-lab",
    "protein-tools",
    "dna-analysis",
    "seqanalysis"
)

Write-Host "Checking Cloudflare Account..." -ForegroundColor Yellow
try {
    $accounts = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts" -Method GET -Headers $headers
    if ($accounts.success -and $accounts.result.Count -gt 0) {
        $accountId = $accounts.result[0].id
        Write-Host "Account ID: $accountId" -ForegroundColor Green
    } else {
        Write-Host "No accounts found" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Checking existing projects..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects" -Method GET -Headers $headers
    $existing = @()
    if ($projects.result) {
        $existing = $projects.result | ForEach-Object { $_.name }
    }
    Write-Host "Found $($existing.Count) existing project(s)" -ForegroundColor Green
} catch {
    Write-Host "Could not get projects (might be first project)" -ForegroundColor Yellow
    $existing = @()
}

Write-Host ""
Write-Host "Domain Availability Check:" -ForegroundColor Cyan
Write-Host ""

foreach ($domain in $domainNames) {
    if ($existing -contains $domain) {
        Write-Host "  ❌ $domain.pages.dev - TAKEN" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $domain.pages.dev - AVAILABLE" -ForegroundColor Green
    }
}

Write-Host ""

