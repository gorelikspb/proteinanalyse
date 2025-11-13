# Script to get Cloudflare Account ID
# Usage: .\get-cloudflare-account-id.ps1 [TOKEN]

param(
    [Parameter(Mandatory=$false)]
    [string]$Token = ""
)

# Try to read from config file if token not provided
if ([string]::IsNullOrEmpty($Token)) {
    $configPath = "instructions\.cloudflare-config.local"
    if (Test-Path $configPath) {
        $config = Get-Content $configPath | Where-Object { $_ -match "^CLOUDFLARE_API_TOKEN=(.+)$" }
        if ($config) {
            $Token = ($config -split "=")[1].Trim()
        }
    }
    
    if ([string]::IsNullOrEmpty($Token)) {
        Write-Host "❌ Cloudflare API Token required" -ForegroundColor Red
        Write-Host ""
        Write-Host "Usage:" -ForegroundColor Yellow
        Write-Host "  .\get-cloudflare-account-id.ps1 -Token 'your-token'" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Or add token to instructions\.cloudflare-config.local:" -ForegroundColor Yellow
        Write-Host "  CLOUDFLARE_API_TOKEN=your-token" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host "🔍 Getting Cloudflare Account ID..." -ForegroundColor Yellow
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

try {
    $accounts = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts" -Method GET -Headers $headers
    
    if ($accounts.success -and $accounts.result -and $accounts.result.Count -gt 0) {
        $accountId = $accounts.result[0].id
        $accountName = $accounts.result[0].name
        
        Write-Host "✅ Account ID found!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Account Name: $accountName" -ForegroundColor Cyan
        Write-Host "Account ID:   $accountId" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 Add this to instructions\.cloudflare-config.local:" -ForegroundColor Yellow
        Write-Host "CLOUDFLARE_ACCOUNT_ID=$accountId" -ForegroundColor Green
        
        # Try to update config file
        $configPath = "instructions\.cloudflare-config.local"
        if (Test-Path $configPath) {
            $configContent = Get-Content $configPath -Raw
            if ($configContent -match "CLOUDFLARE_ACCOUNT_ID=") {
                $configContent = $configContent -replace "CLOUDFLARE_ACCOUNT_ID=.*", "CLOUDFLARE_ACCOUNT_ID=$accountId"
                Set-Content $configPath -Value $configContent -NoNewline
                Write-Host ""
                Write-Host "✅ Updated instructions\.cloudflare-config.local automatically" -ForegroundColor Green
            } else {
                Add-Content $configPath -Value "`nCLOUDFLARE_ACCOUNT_ID=$accountId"
                Write-Host ""
                Write-Host "✅ Added Account ID to instructions\.cloudflare-config.local" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠️  No accounts found" -ForegroundColor Yellow
        Write-Host "Response: $($accounts | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}
