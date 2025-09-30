#!/bin/bash
# scripts/deploy-local-dev.sh - Fixed version

set -e

echo "⏹️ Stopping current replica..."
dfx stop

echo "🧹 Cleaning old state..."
rm -rf .dfx

echo "🚀 Starting replica with clean state..."
dfx start --background --clean

# Wait for replica to start
echo "⏳ Waiting for replica to initialize..."
sleep 10

# Stop and clean any existing deployment
echo "🧹 Cleaning existing Internet Identity deployment..."
dfx canister stop internet_identity 2>/dev/null || true
dfx canister delete internet_identity 2>/dev/null || true

# Create all necessary directories first
echo "📁 Setting up directories..."
mkdir -p canisters/internet_identity

echo "📥 Downloading Internet Identity files..."

# Download the Candid interface
echo "  - Downloading Candid interface..."
curl -sSL https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did \
     -o canisters/internet_identity/internet_identity.did

# Download and extract the WASM file to the correct location
echo "  - Downloading and extracting WASM..."
curl -L "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz" \
     -o canisters/internet_identity/internet_identity.wasm.gz

# Extract the WASM file
gunzip -f canisters/internet_identity/internet_identity.wasm.gz

# Verify WASM file exists
if [ -f "canisters/internet_identity/internet_identity.wasm" ]; then
    echo "✅ WASM file ready for deployment"
    echo "   Size: $(du -h canisters/internet_identity/internet_identity.wasm | cut -f1)"
else
    echo "❌ WASM file not found after extraction!"
    exit 1
fi

echo "🏗️ Deploying Internet Identity..."
# Deploy Internet Identity using dfx deploy with the extracted WASM
dfx deploy internet_identity --network local --argument '(null)' || {
    echo "⚠️ Standard deploy failed, trying alternative method..."
    
    # Alternative: Use dfx canister install directly
    II_CANISTER_ID=$(dfx canister create internet_identity --network local --no-wallet 2>/dev/null || echo "")
    if [ -n "$II_CANISTER_ID" ]; then
        dfx canister install internet_identity --network local \
            --wasm canisters/internet_identity/internet_identity.wasm \
            --argument '(null)' --mode install || {
            echo "⚠️ Manual installation also failed, but continuing..."
        }
    fi
}

# Get the Internet Identity canister ID
II_CANISTER_ID=$(dfx canister id internet_identity --network local 2>/dev/null || echo "rdmx6-jaaaa-aaaaa-aaadq-cai")
echo "✅ Internet Identity canister ID: $II_CANISTER_ID"

# Deploy other canisters
echo "🏗️ Deploying Momentum canisters..."
echo "🔧 Deploying user management..."
dfx deploy user_management --network local

echo "🔗 Regenerating declarations..."
dfx generate user_management --network local
dfx generate internet_identity --network local 2>/dev/null || echo "⚠️ Could not generate II declarations, but continuing..."

# Move declarations to correct location
if [ -d "src/declarations" ]; then
    cp -r src/declarations/* src/declarations/ 2>/dev/null || true
fi

echo "⚙️ Updating environment variables..."
USER_MANAGEMENT_ID=$(dfx canister id user_management --network local)
INTERNET_IDENTITY_ID=$(dfx canister id internet_identity --network local 2>/dev/null || echo "$II_CANISTER_ID")

cat > .env.development << EOF
# Network Configuration
VITE_DFX_NETWORK=local
VITE_IC_HOST=http://localhost:4943

# Canister IDs (updated)
VITE_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
VITE_INTERNET_IDENTITY_CANISTER_ID=${INTERNET_IDENTITY_ID}

# Use local Internet Identity
VITE_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}

# Development Configuration
NODE_ENV=development

# CRITICAL: Disable signature validation in development
VITE_DISABLE_SIGNATURE_VALIDATION=false

# Disable mock mode
VITE_ENABLE_MOCK_AUTH=false
EOF

# Test canister connectivity
echo "🔍 Testing canister connectivity..."
if dfx canister call user_management healthCheck --network local 2>/dev/null; then
    echo "✅ User management canister is responding correctly"
else
    echo "⚠️ User management canister not responding - check deployment"
fi

# Test Internet Identity
echo "🧪 Testing Internet Identity..."
if dfx canister status internet_identity --network local >/dev/null 2>&1; then
    echo "✅ Internet Identity canister is running"
    
    # Try to call a basic method
    if dfx canister call internet_identity stats --network local 2>/dev/null; then
        echo "✅ Internet Identity API is responding"
    else
        echo "⚠️ Internet Identity API might not be fully ready yet"
    fi
else
    echo "⚠️ Internet Identity canister status unknown"
fi

echo ""
echo "✅ Deployment complete! URLs:"
echo "- Internet Identity: http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}"
echo "- User Management Candid: http://localhost:4943/?canisterId=$(dfx canister id __Candid_UI --network local 2>/dev/null || echo 'CANDID_UI_ID')&id=${USER_MANAGEMENT_ID}"
echo ""
echo "📋 Canister IDs:"
echo "- User Management: ${USER_MANAGEMENT_ID}"
echo "- Internet Identity: ${INTERNET_IDENTITY_ID}"
echo ""
echo "🚀 Next steps:"
echo "1. npm install"
echo "2. npm run dev"
echo "3. Test Internet Identity at: http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}"
echo "4. 🔄 Clear browser cache and try authentication"
echo ""
echo "🔧 Troubleshooting commands:"
echo "- Check II status: dfx canister status internet_identity --network local"
echo "- Reinstall II: dfx canister uninstall-code internet_identity --network local && dfx deploy internet_identity --network local --argument '(null)'"
echo "- Use well-known II: http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai"