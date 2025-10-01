#!/bin/bash
# scripts/deploy-mainnet.sh
# Momentum - IC Mainnet Deployment Script
# Based on successful TradeChain deployment pattern

set -e

echo "🚀 =========================================="
echo "🚀 MOMENTUM - IC MAINNET DEPLOYMENT"
echo "🚀 =========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check identity
echo "📋 Step 1: Checking deployment identity..."
IDENTITY=$(dfx identity whoami)
echo "✅ Current identity: $IDENTITY"
echo ""

# Check balances
echo "💰 Step 2: Checking available resources..."
echo "Checking ICP balance..."
ICP_BALANCE=$(dfx ledger balance --network ic 2>/dev/null || echo "0 ICP")
echo "  ICP Balance: $ICP_BALANCE"

echo "Checking Cycles Ledger balance..."
CYCLES_BALANCE=$(dfx cycles balance --network ic 2>/dev/null || echo "0")
echo "  Cycles Ledger: $CYCLES_BALANCE"

echo "Checking Wallet balance..."
WALLET_BALANCE=$(dfx wallet balance --network ic 2>/dev/null || echo "0 cycles")
echo "  Wallet Balance: $WALLET_BALANCE"
echo ""

# Warning about cycles requirement
echo "${YELLOW}⚠️  IMPORTANT: Deploying to IC mainnet requires:${NC}"
echo "   - Minimum 800 billion cycles for new canister"
echo "   - Recommended: 1 trillion cycles for safety"
echo ""

read -p "Do you want to continue with deployment? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi
echo ""

# Deploy user_management canister
echo "🏗️  Step 3: Deploying user_management canister to IC mainnet..."
echo "Using --no-wallet approach with adequate cycles..."
echo ""

# Deploy with 800B cycles (proven successful amount from TradeChain)
dfx deploy user_management --network ic --no-wallet --with-cycles 800000000000 || {
    echo "${RED}❌ Deployment failed!${NC}"
    echo ""
    echo "Troubleshooting options:"
    echo "1. Check if you have enough cycles:"
    echo "   dfx cycles balance --network ic"
    echo ""
    echo "2. Convert ICP to cycles if needed:"
    echo "   dfx cycles convert --amount 0.2 --network ic"
    echo ""
    echo "3. Try deployment with wallet instead:"
    echo "   dfx deploy user_management --network ic"
    exit 1
}

echo ""
echo "${GREEN}✅ user_management canister deployed successfully!${NC}"
echo ""

# Get canister ID
USER_MANAGEMENT_ID=$(dfx canister id user_management --network ic)
echo "📝 Canister IDs:"
echo "   user_management: $USER_MANAGEMENT_ID"
echo ""

# Check canister status
echo "🔍 Step 4: Verifying deployment..."
dfx canister status user_management --network ic
echo ""

# Test health check
echo "🧪 Step 5: Testing canister health..."
dfx canister call user_management healthCheck --network ic && {
    echo "${GREEN}✅ Health check passed!${NC}"
} || {
    echo "${YELLOW}⚠️  Health check failed, but canister is deployed${NC}"
}
echo ""

# Generate declarations
echo "📦 Step 6: Generating Candid declarations..."
dfx generate user_management --network ic
echo ""

# Copy declarations to frontend
echo "📂 Copying declarations to frontend..."
mkdir -p src/declarations/user_management
cp -r .dfx/ic/canisters/user_management/*.{js,did,d.ts} src/declarations/user_management/ 2>/dev/null || true
echo "✅ Declarations copied"
echo ""

# Create/update .env.production
echo "⚙️  Step 7: Updating environment variables..."
cat > .env.production << EOF
# Momentum - Production Environment (IC Mainnet)
# Generated on: $(date)

# Network Configuration
VITE_DFX_NETWORK=ic
VITE_IC_HOST=https://icp-api.io

# Canister IDs - PRODUCTION
VITE_USER_MANAGEMENT_CANISTER_ID=$USER_MANAGEMENT_ID
VITE_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai

# Internet Identity URL (Production)
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app

# NFID URL (Production)
VITE_NFID_URL=https://nfid.one/authenticate

# Production Mode
NODE_ENV=production
EOF

echo "✅ .env.production created/updated"
echo ""

# Display deployment summary
echo "🎉 =========================================="
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "🎉 =========================================="
echo ""
echo "📋 Deployment Summary:"
echo "   Network: IC Mainnet"
echo "   Backend Canister: $USER_MANAGEMENT_ID"
echo "   Frontend Canister: yfmxz-kyaaa-aaaaj-a2gqq-cai (existing)"
echo ""
echo "🔗 Candid Interface:"
echo "   https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=$USER_MANAGEMENT_ID"
echo ""
echo "📝 Next Steps:"
echo "   1. Build frontend: npm run build"
echo "   2. Deploy frontend: dfx deploy frontend --network ic"
echo "   3. Access your app: https://yfmxz-kyaaa-aaaaj-a2gqq-cai.icp0.io"
echo ""
echo "💾 Save this information:"
echo "   Backend: $USER_MANAGEMENT_ID"
echo "   Frontend: yfmxz-kyaaa-aaaaj-a2gqq-cai"
echo ""
