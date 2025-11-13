# Create Cloudflare Pages project automatically
$token = "GLfM43P0u8FFEq7wK83FKd6cjxx6_nZfWSfo-frr"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$domainNames = @("seq-tools", "bioseq", "sequence-lab", "protein-tools", "dna-analysis", "seqanalysis")

Write-Host "Getting Account ID..." -ForegroundColor Yellow
try {
    $accounts = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts" -Method GET -Headers $headers
    if ($accounts.success -and $accounts.result -and $accounts.result.Count -gt 0) {
        $accountId = $accounts.result[0].id
        Write-Host "Account ID: $accountId" -ForegroundColor Green
    } else {
        Write-Host "No accounts found. Response: $($accounts | ConvertTo-Json)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error getting accounts: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
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
    Write-Host "Could not get projects: $_" -ForegroundColor Yellow
    $existing = @()
}

Write-Host ""
Write-Host "Checking domain availability..." -ForegroundColor Cyan
$available = @()
foreach ($domain in $domainNames) {
    if ($existing -contains $domain) {
        Write-Host "  ❌ $domain.pages.dev - TAKEN" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $domain.pages.dev - AVAILABLE" -ForegroundColor Green
        $available += $domain
    }
}

if ($available.Count -eq 0) {
    Write-Host ""
    Write-Host "All domains are taken!" -ForegroundColor Red
    exit 1
}

Write-Host ""
$selectedDomain = $available[0]
Write-Host "Using first available: $selectedDomain.pages.dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "Creating project..." -ForegroundColor Yellow
$body = @{
    name = $selectedDomain
    production_branch = "master"
    build_config = @{
        build_command = ""
        destination_dir = "public"
        root_dir = ""
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    if ($response.success) {
        Write-Host "✅ Project created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Project: $($response.result.name)" -ForegroundColor Cyan
        Write-Host "URL: https://$($response.result.subdomain)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next: Connect GitHub repo in dashboard and deploy!" -ForegroundColor Yellow
    } else {
        Write-Host "Failed: $($response | ConvertTo-Json)" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

