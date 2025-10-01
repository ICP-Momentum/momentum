#!/bin/bash
# scripts/deploy-frontend-mainnet.sh
# Deploy Momentum frontend to existing IC canister

set -e

echo "🎨 =========================================="
echo "🎨 MOMENTUM - FRONTEND DEPLOYMENT"
echo "🎨 =========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FRONTEND_CANISTER="yfmxz-kyaaa-aaaaj-a2gqq-cai"

echo "📋 Target frontend canister: $FRONTEND_CANISTER"
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "${YELLOW}⚠️  Warning: .env.production not found${NC}"
    echo "   Make sure backend is deployed first!"
    echo "   Run: ./scripts/deploy-mainnet.sh"
    exit 1
fi

echo "✅ .env.production found"
echo ""

# Build frontend
echo "🏗️  Step 1: Building frontend for production..."
echo "Using production environment variables..."
npm run build || {
    echo "❌ Frontend build failed!"
    exit 1
}

echo "${GREEN}✅ Frontend built successfully!${NC}"
echo ""

# Verify dist folder
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found!"
    echo "   Build may have failed"
    exit 1
fi

echo "✅ dist folder verified"
echo ""

# Deploy to IC
echo "🚀 Step 2: Deploying to IC mainnet..."
echo "Deploying to canister: $FRONTEND_CANISTER"
echo ""

dfx deploy frontend --network ic || {
    echo "❌ Frontend deployment failed!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check canister cycles:"
    echo "   dfx canister status frontend --network ic"
    echo ""
    echo "2. Top up if needed:"
    echo "   dfx cycles top-up 100000000000 $FRONTEND_CANISTER --network ic"
    echo ""
    exit 1
}

echo ""
echo "${GREEN}✅ Frontend deployed successfully!${NC}"
echo ""

# Check canister status
echo "🔍 Step 3: Verifying deployment..."
dfx canister status frontend --network ic
echo ""

# Display success info
echo "🎉 =========================================="
echo "🎉 FRONTEND DEPLOYED!"
echo "🎉 =========================================="
echo ""
echo "🌐 Your Momentum app is live at:"
echo "   https://$FRONTEND_CANISTER.icp0.io"
echo ""
echo "Alternative URLs:"
echo "   https://$FRONTEND_CANISTER.raw.icp0.io"
echo "   https://$FRONTEND_CANISTER.ic0.app"
echo ""
echo "✅ Deployment complete!"
echo ""
