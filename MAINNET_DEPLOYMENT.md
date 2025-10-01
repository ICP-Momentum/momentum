## 🚀 Momentum - IC Mainnet Deployment Guide

Complete guide for deploying Momentum to Internet Computer mainnet, based on proven successful TradeChain deployment.

---

## 📋 Prerequisites

### Required Resources
- **Cycles**: Minimum 800 billion cycles (1 trillion recommended for safety)
- **ICP**: 0.2-0.3 ICP for cycle conversion if needed
- **DFX**: Latest version installed
- **Identity**: Mainnet deployment identity configured

### Check Your Resources

```bash
# Check ICP balance
dfx ledger balance --network ic

# Check cycles ledger
dfx cycles balance --network ic

# Check wallet balance
dfx wallet balance --network ic

# Check current identity
dfx identity whoami
```

### Convert ICP to Cycles (if needed)

```bash
# Convert 0.25 ICP to ~800B cycles
dfx cycles convert --amount 0.25 --network ic

# Verify cycles balance
dfx cycles balance --network ic
```

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend (user_management canister)

```bash
# Make script executable
chmod +x scripts/deploy-mainnet.sh

# Run deployment
./scripts/deploy-mainnet.sh
```

**What this script does:**
1. ✅ Checks your identity and balances
2. ✅ Deploys user_management with 800B cycles
3. ✅ Verifies deployment with health check
4. ✅ Generates Candid declarations
5. ✅ Creates `.env.production` with canister IDs
6. ✅ Displays deployment summary

**Expected output:**
```
🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!

Backend Canister: xxxxx-xxxxx-xxxxx-xxxxx-cai
Frontend Canister: yfmxz-kyaaa-aaaaj-a2gqq-cai (existing)

Candid Interface:
https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=xxxxx-xxxxx-xxxxx-xxxxx-cai
```

**Save your canister IDs immediately!**

---

### Step 2: Build Frontend

```bash
# Install dependencies (if not done)
npm install

# Build for production
npm run build
```

**What happens:**
- Vite builds optimized production bundle
- Uses `.env.production` for environment variables
- Creates `dist/` folder with static assets
- Assets are ready for IC deployment

---

### Step 3: Deploy Frontend

```bash
# Make script executable
chmod +x scripts/deploy-frontend-mainnet.sh

# Deploy to your existing canister
./scripts/deploy-frontend-mainnet.sh
```

**What this script does:**
1. ✅ Checks `.env.production` exists
2. ✅ Verifies `dist/` folder from build
3. ✅ Deploys to existing canister: `yfmxz-kyaaa-aaaaj-a2gqq-cai`
4. ✅ Verifies deployment status

**Expected output:**
```
🎉 FRONTEND DEPLOYED!

Your Momentum app is live at:
https://yfmxz-kyaaa-aaaaj-a2gqq-cai.icp0.io
```

---

## 🔧 Manual Deployment (Alternative)

If you prefer manual deployment or scripts fail:

### Deploy Backend Manually

```bash
# Deploy with --no-wallet (recommended from TradeChain success)
dfx deploy user_management --network ic --no-wallet --with-cycles 800000000000

# Get canister ID
dfx canister id user_management --network ic

# Test health check
dfx canister call user_management healthCheck --network ic

# Generate declarations
dfx generate user_management --network ic

# Copy declarations to frontend
mkdir -p src/declarations/user_management
cp .dfx/ic/canisters/user_management/*.{js,did,d.ts} src/declarations/user_management/
```

### Update Environment Variables Manually

Create `.env.production`:

```env
VITE_DFX_NETWORK=ic
VITE_IC_HOST=https://icp-api.io
VITE_USER_MANAGEMENT_CANISTER_ID=your-actual-canister-id-here
VITE_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app
VITE_NFID_URL=https://nfid.one/authenticate
NODE_ENV=production
```

### Deploy Frontend Manually

```bash
# Build
npm run build

# Deploy
dfx deploy frontend --network ic

# Check status
dfx canister status frontend --network ic
```

---

## 🔍 Verification & Testing

### Test Backend Canister

```bash
# Health check
dfx canister call user_management healthCheck --network ic

# Check canister status
dfx canister status user_management --network ic

# View Candid interface
# https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=YOUR_CANISTER_ID
```

### Test Frontend

1. **Open your app**: `https://yfmxz-kyaaa-aaaaj-a2gqq-cai.icp0.io`
2. **Check landing page** loads correctly
3. **Click "Get Started"** → redirects to `/connect`
4. **Test Internet Identity** authentication
5. **Test NFID** authentication
6. **Register new user** → should redirect to dashboard
7. **Test logout** functionality

### Test Full Flow

```
Landing Page (/)
  ↓
Connect Page (/connect)
  ↓
Internet Identity Authentication
  ↓
Register Page (/register) [new users]
  ↓
Dashboard (/dashboard)
  ↓
Test Logout
  ↓
Back to Landing Page
```

---

## 💰 Cycles Management

### Monitor Cycles Usage

```bash
# Check canister cycles
dfx canister status user_management --network ic
dfx canister status frontend --network ic

# Check your cycles balance
dfx cycles balance --network ic
```

### Top Up Canisters

```bash
# Top up user_management (if needed)
dfx cycles top-up 100000000000 <user-management-canister-id> --network ic

# Top up frontend (if needed)
dfx cycles top-up 100000000000 yfmxz-kyaaa-aaaaj-a2gqq-cai --network ic
```

### Cycles Cost Estimates

Based on TradeChain deployment:

- **Initial deployment**: ~800B cycles
- **Frontend deployment**: ~50M cycles
- **Monthly operation**: ~10-50B cycles (depends on usage)
- **Code updates**: ~50M cycles per update

**Recommendation**: Keep 200-300B cycles reserve for operations

---

## 🔄 Updating Deployed Canisters

### Update Backend Code

```bash
# 1. Test changes locally
dfx start --background
dfx deploy user_management
dfx stop

# 2. Deploy update to mainnet (cheap - ~50M cycles)
dfx deploy user_management --network ic --no-wallet

# 3. Verify update
dfx canister call user_management healthCheck --network ic
```

### Update Frontend

```bash
# 1. Build new version
npm run build

# 2. Deploy to IC
dfx deploy frontend --network ic

# 3. Clear browser cache and test
```

**Important**: Updates are **80x cheaper** than new canisters!
- New canister: ~800B cycles
- Update: ~50M cycles

---

## 🚨 Troubleshooting

### Issue: "Insufficient cycles"

```bash
# Check balances
dfx cycles balance --network ic
dfx wallet balance --network ic

# Convert more ICP
dfx cycles convert --amount 0.2 --network ic

# Or top up from wallet
dfx wallet send <canister-id> 100000000000 --network ic
```

### Issue: "Canister not found"

```bash
# Verify canister exists
dfx canister status user_management --network ic

# Check dfx.json configuration
cat dfx.json

# Verify canister_ids.json
cat canister_ids.json
```

### Issue: "Authentication failed"

```bash
# Check identity
dfx identity whoami

# Re-authenticate
dfx identity use <your-identity>
```

### Issue: "Frontend not loading"

```bash
# Check canister status
dfx canister status frontend --network ic

# Top up cycles if low
dfx cycles top-up 100000000000 yfmxz-kyaaa-aaaaj-a2gqq-cai --network ic

# Redeploy
npm run build
dfx deploy frontend --network ic
```

### Issue: "global is not defined" error

This is already fixed in `vite.config.ts` with the `global: 'globalThis'` polyfill.

---

## 📝 Post-Deployment Checklist

- [ ] Backend canister deployed successfully
- [ ] Backend health check passing
- [ ] `.env.production` created with correct IDs
- [ ] Frontend built successfully (`dist/` exists)
- [ ] Frontend deployed to existing canister
- [ ] Landing page loads at `https://yfmxz-kyaaa-aaaaj-a2gqq-cai.icp0.io`
- [ ] Connect page accessible
- [ ] Internet Identity authentication works
- [ ] NFID authentication works
- [ ] User registration works
- [ ] Dashboard loads after auth
- [ ] Logout works correctly
- [ ] Canister IDs saved securely
- [ ] Cycles monitoring set up

---

## 🎉 Success URLs

After successful deployment:

**Your Momentum App:**
- https://yfmxz-kyaaa-aaaaj-a2gqq-cai.icp0.io
- https://yfmxz-kyaaa-aaaaj-a2gqq-cai.ic0.app
- https://yfmxz-kyaaa-aaaaj-a2gqq-cai.raw.icp0.io

**Backend Candid Interface:**
- https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=YOUR_BACKEND_CANISTER_ID

---

## 💡 Best Practices (from TradeChain Success)

1. **Always use `--no-wallet`** for deployments (more reliable)
2. **Allocate 800B+ cycles** for new canisters
3. **Test locally first** before mainnet deployment
4. **Update existing canisters** instead of creating new ones
5. **Keep cycles reserve** of 200-300B for operations
6. **Monitor canister status** regularly
7. **Save canister IDs** immediately after deployment
8. **Test full authentication flow** before going live

---

## 📞 Emergency Commands

If something goes wrong:

```bash
# Check all resources
dfx ledger balance --network ic
dfx cycles balance --network ic
dfx wallet balance --network ic

# Emergency cycle top-up
dfx cycles convert --amount 0.1 --network ic
dfx cycles top-up 200000000000 <canister-id> --network ic

# Canister status
dfx canister status user_management --network ic
dfx canister status frontend --network ic

# Re-authenticate
dfx identity use <your-identity>
```

---

## 🎯 Next Steps After Deployment

1. **Test thoroughly** - Go through full user flow
2. **Monitor cycles** - Set up alerts if cycles drop below 100B
3. **Share your app** - Test with real users
4. **Collect feedback** - Iterate and improve
5. **Plan updates** - Prepare for adding new features

---

**Ready to deploy?** Start with:

```bash
./scripts/deploy-mainnet.sh
```

Good luck! 🚀
