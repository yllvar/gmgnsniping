#!/bin/bash

echo "🚀 Deploying GMGN Trading Bot to Production..."

# Check if required tools are installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Run pre-deployment checks
echo "🔍 Running pre-deployment checks..."
npm run security-audit

if [ $? -ne 0 ]; then
    echo "❌ Security audit failed. Please fix issues before deploying."
    exit 1
fi

# Build the application
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🔗 Your trading bot is now live!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "□ Test all API endpoints"
    echo "□ Verify wallet connectivity"
    echo "□ Check GMGN API integration"
    echo "□ Monitor application logs"
    echo "□ Set up alerts and monitoring"
else
    echo "❌ Deployment failed. Check the logs above."
    exit 1
fi
