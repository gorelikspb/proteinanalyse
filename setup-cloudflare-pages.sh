#!/bin/bash
# Cloudflare Pages Setup Script
# Requires Cloudflare API Token with Pages permissions

set -e

CLARITY_TOKEN="${1:-}"
ACCOUNT_ID="${2:-}"
PROJECT_NAME="${3:-seq-tools}"
REPO_NAME="${4:-gorelikspb/proteinanalyse}"
BRANCH="${5:-master}"

if [ -z "$CLARITY_TOKEN" ]; then
    echo "❌ Error: Cloudflare API Token required"
    echo ""
    echo "Usage: ./setup-cloudflare-pages.sh <CLOUDFLARE_TOKEN> [ACCOUNT_ID] [PROJECT_NAME] [REPO_NAME] [BRANCH]"
    echo ""
    echo "Get token: https://dash.cloudflare.com/profile/api-tokens"
    exit 1
fi

echo "🚀 Setting up Cloudflare Pages for $PROJECT_NAME"
echo ""

# Get Account ID if not provided
if [ -z "$ACCOUNT_ID" ]; then
    echo "📋 Getting Cloudflare Account ID..."
    ACCOUNT_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
        -H "Authorization: Bearer $CLARITY_TOKEN" \
        -H "Content-Type: application/json")
    
    ACCOUNT_ID=$(echo $ACCOUNT_RESPONSE | jq -r '.result[0].id')
    
    if [ "$ACCOUNT_ID" = "null" ] || [ -z "$ACCOUNT_ID" ]; then
        echo "❌ No Cloudflare accounts found"
        exit 1
    fi
    
    echo "✅ Found Account ID: $ACCOUNT_ID"
fi

# Check if project exists
echo ""
echo "🔍 Checking if project name '$PROJECT_NAME' is available..."

PROJECTS_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
    -H "Authorization: Bearer $CLARITY_TOKEN" \
    -H "Content-Type: application/json")

EXISTING_PROJECT=$(echo $PROJECTS_RESPONSE | jq -r ".result[] | select(.name == \"$PROJECT_NAME\")")

if [ -n "$EXISTING_PROJECT" ]; then
    echo "⚠️  Project name '$PROJECT_NAME' already exists!"
    SUBDOMAIN=$(echo $EXISTING_PROJECT | jq -r '.subdomain')
    echo "   Existing project URL: $SUBDOMAIN"
    read -p "   Use existing project? (y/n) " USE_EXISTING
    if [ "$USE_EXISTING" != "y" ]; then
        echo "❌ Please choose a different project name"
        exit 1
    fi
    echo "✅ Using existing project"
else
    echo "✅ Project name '$PROJECT_NAME' is available"
fi

# Create project
if [ -z "$EXISTING_PROJECT" ]; then
    echo ""
    echo "🔨 Creating Cloudflare Pages project..."
    
    CREATE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
        -H "Authorization: Bearer $CLARITY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"$PROJECT_NAME\",
            \"production_branch\": \"$BRANCH\",
            \"build_config\": {
                \"build_command\": \"\",
                \"destination_dir\": \"public\",
                \"root_dir\": \"\"
            }
        }")
    
    SUCCESS=$(echo $CREATE_RESPONSE | jq -r '.success')
    
    if [ "$SUCCESS" = "true" ]; then
        PROJECT_NAME_RESULT=$(echo $CREATE_RESPONSE | jq -r '.result.name')
        SUBDOMAIN=$(echo $CREATE_RESPONSE | jq -r '.result.subdomain')
        echo "✅ Project created successfully!"
        echo "   Project name: $PROJECT_NAME_RESULT"
        echo "   Subdomain: $SUBDOMAIN"
        echo ""
        echo "🌐 Your site will be available at:"
        echo "   https://$SUBDOMAIN"
    else
        ERRORS=$(echo $CREATE_RESPONSE | jq -r '.errors[]?.message' | head -1)
        echo "❌ Error creating project: $ERRORS"
        echo ""
        echo "💡 Note: You may need to connect GitHub repository first via dashboard"
        exit 1
    fi
fi

echo ""
echo "✨ Setup complete!"

