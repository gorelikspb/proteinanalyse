# Cloudflare Pages Setup Script
# Requires Cloudflare API Token with Pages permissions

param(
    [Parameter(Mandatory=$true)]
    [string]$CloudflareToken,
    
    [Parameter(Mandatory=$false)]
    [string]$AccountID = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectName = "seq-tools",
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "gorelikspb/proteinanalyse",
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "master"
)

Write-Host "🚀 Setting up Cloudflare Pages for $ProjectName" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Account ID if not provided
if ([string]::IsNullOrEmpty($AccountID)) {
    Write-Host "📋 Getting Cloudflare Account ID..." -ForegroundColor Yellow
    try {
        $accountsResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts" `
            -Method GET `
            -Headers @{
                "Authorization" = "Bearer $CloudflareToken"
                "Content-Type" = "application/json"
            }
        
        if ($accountsResponse.result.Count -eq 0) {
            Write-Host "❌ No Cloudflare accounts found" -ForegroundColor Red
            exit 1
        }
        
        $AccountID = $accountsResponse.result[0].id
        Write-Host "✅ Found Account ID: $AccountID" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error getting Account ID: $_" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Check if project name is available
Write-Host ""
Write-Host "🔍 Checking if project name '$ProjectName' is available..." -ForegroundColor Yellow

try {
    $projectsResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountID/pages/projects" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $CloudflareToken"
            "Content-Type" = "application/json"
        }
    
    $existingProject = $projectsResponse.result | Where-Object { $_.name -eq $ProjectName }
    
    if ($existingProject) {
        Write-Host "⚠️  Project name '$ProjectName' already exists!" -ForegroundColor Yellow
        Write-Host "   Existing project URL: $($existingProject.subdomain)" -ForegroundColor Yellow
        $useExisting = Read-Host "   Use existing project? (y/n)"
        if ($useExisting -ne "y") {
            Write-Host "❌ Please choose a different project name" -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ Using existing project" -ForegroundColor Green
        $projectId = $existingProject.name
    } else {
        Write-Host "✅ Project name '$ProjectName' is available" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not check project availability (might be first project)" -ForegroundColor Yellow
}

# Step 3: Get GitHub connection info
Write-Host ""
Write-Host "📦 Getting GitHub repository information..." -ForegroundColor Yellow

# Note: Cloudflare Pages API requires GitHub to be connected first
# This script assumes GitHub is already connected via dashboard

# Step 4: Create project (if doesn't exist)
if (-not $existingProject) {
    Write-Host ""
    Write-Host "🔨 Creating Cloudflare Pages project..." -ForegroundColor Yellow
    
    $projectConfig = @{
        name = $ProjectName
        production_branch = $Branch
        build_config = @{
            build_command = ""
            destination_dir = "public"
            root_dir = ""
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $createResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountID/pages/projects" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $CloudflareToken"
                "Content-Type" = "application/json"
            } `
            -Body $projectConfig
        
        Write-Host "✅ Project created successfully!" -ForegroundColor Green
        Write-Host "   Project name: $($createResponse.result.name)" -ForegroundColor Cyan
        Write-Host "   Subdomain: $($createResponse.result.subdomain)" -ForegroundColor Cyan
        
        $projectUrl = "https://$($createResponse.result.subdomain)"
        Write-Host ""
        Write-Host "🌐 Your site will be available at:" -ForegroundColor Green
        Write-Host "   $projectUrl" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Error creating project: $_" -ForegroundColor Red
        Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Note: You may need to connect GitHub repository first via dashboard:" -ForegroundColor Yellow
        Write-Host "   1. Go to https://dash.cloudflare.com/pages" -ForegroundColor Yellow
        Write-Host "   2. Click 'Create a project' → 'Connect to Git'" -ForegroundColor Yellow
        Write-Host "   3. Authorize GitHub and select repository" -ForegroundColor Yellow
        Write-Host "   4. Then run this script again" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "✅ Using existing project" -ForegroundColor Green
    $projectUrl = "https://$($existingProject.subdomain)"
    Write-Host "🌐 Site URL: $projectUrl" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Connect GitHub repository via dashboard (if not already connected)" -ForegroundColor White
Write-Host "   2. Configure build settings:" -ForegroundColor White
Write-Host "      - Build output directory: public" -ForegroundColor White
Write-Host "      - Build command: (empty)" -ForegroundColor White
Write-Host "   3. Deploy and verify site is accessible" -ForegroundColor White
Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green

