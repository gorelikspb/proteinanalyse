# Pre-push hook for PowerShell to check if private files are being pushed to public repo

# Check if repo is public
$repoVisibility = gh repo view gorelikspb/proteinanalyse --json visibility -q .visibility

if ($repoVisibility -eq "PUBLIC") {
    Write-Host "⚠️  WARNING: Repository is PUBLIC" -ForegroundColor Yellow
    
    # Check if instructions/ is being pushed
    $stagedFiles = git diff --cached --name-only
    if ($stagedFiles -match "^instructions/") {
        Write-Host "❌ ERROR: Attempting to push 'instructions/' directory to PUBLIC repository!" -ForegroundColor Red
        Write-Host "   This directory contains private instructions and should not be public." -ForegroundColor Red
        Write-Host ""
        Write-Host "   To fix:" -ForegroundColor Yellow
        Write-Host "   1. Unstage instructions/: git reset HEAD instructions/" -ForegroundColor Yellow
        Write-Host "   2. Add to .gitignore if not already there" -ForegroundColor Yellow
        Write-Host "   3. Try pushing again" -ForegroundColor Yellow
        exit 1
    }
    
    # Check if .gitignore excludes instructions/
    $gitignoreContent = Get-Content .gitignore -Raw
    if ($gitignoreContent -notmatch "^\s*instructions/") {
        Write-Host "⚠️  WARNING: 'instructions/' is not in .gitignore" -ForegroundColor Yellow
        Write-Host "   Consider adding it to prevent accidental commits" -ForegroundColor Yellow
    }
    
    Write-Host "✅ Pre-push check passed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Repository is private, skipping public repo checks" -ForegroundColor Cyan
}

exit 0

