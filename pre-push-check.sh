#!/bin/bash
# Pre-push hook to check if private files are being pushed to public repo

# Check if repo is public
REPO_VISIBILITY=$(gh repo view gorelikspb/proteinanalyse --json visibility -q .visibility)

if [ "$REPO_VISIBILITY" = "PUBLIC" ]; then
    echo "⚠️  WARNING: Repository is PUBLIC"
    
    # Check if instructions/ is being pushed
    if git diff --cached --name-only | grep -q "^instructions/"; then
        echo "❌ ERROR: Attempting to push 'instructions/' directory to PUBLIC repository!"
        echo "   This directory contains private instructions and should not be public."
        echo ""
        echo "   To fix:"
        echo "   1. Unstage instructions/: git reset HEAD instructions/"
        echo "   2. Add to .gitignore if not already there"
        echo "   3. Try pushing again"
        exit 1
    fi
    
    # Check if .gitignore excludes instructions/
    if ! grep -q "^instructions/" .gitignore; then
        echo "⚠️  WARNING: 'instructions/' is not in .gitignore"
        echo "   Consider adding it to prevent accidental commits"
    fi
    
    echo "✅ Pre-push check passed"
else
    echo "ℹ️  Repository is private, skipping public repo checks"
fi

exit 0

