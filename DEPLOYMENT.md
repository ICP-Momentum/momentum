# Momentum - Deployment Guide

Complete guide for deploying Momentum to local development and IC Mainnet production.

---

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Production Deployment (IC Mainnet)](#production-deployment-ic-mainnet)
3. [Environment Variables Guide](#environment-variables-guide)
4. [Troubleshooting](#troubleshooting)

---

## 🏠 Local Development Setup

### Prerequisites

- Node.js 18+ installed
- DFX SDK installed (`sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`)
- Git installed

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install
```

### Step 2: Deploy Backend Locally

```bash
# Run the local deployment script
chmod +x scripts/deploy-local-dev.sh
./scripts/deploy-local-dev.sh
```

This script will:
- Start a local DFX replica
- Deploy Internet Identity canister
- Deploy user_management canister
- Generate Candid declarations
- Create environment variables

### Step 3: Configure Environment

After deployment, the script creates a `.env.development` file. Copy the canister IDs to your `.env.local`:

```bash
# Get your canister IDs
dfx canister id user_management
dfx canister id internet_identity

# Update .env.local with these IDs
cp .env.example .env.local
# Edit .env.local and add your canister IDs
```

Your `.env.local` should look like:

```env
VITE_DFX_NETWORK=local
VITE_IC_HOST=http://localhost:4943
VITE_USER_MANAGEMENT_CANISTER_ID=bd3sg-teaaa-aaaaa-qaaba-cai
VITE_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
VITE_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai
VITE_NFID_URL=https://nfid.one/authenticate
NODE_ENV=development
```

### Step 4: Start Frontend

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

---

## 🚀 Production Deployment (IC Mainnet)

### Prerequisites

- DFX identity with cycles (get from NNS or a cycles faucet)
- Domain name (optional but recommended)
- Mainnet-ready environment

### Step 1: Configure DFX for Mainnet

```bash
# Check your identity
dfx identity whoami

# Check your cycles balance
dfx wallet balance --network ic
```

### Step 2: Update dfx.json (if needed)

Ensure your `dfx.json` has mainnet network configuration:

```json
{
  "networks": {
    "ic": {
      "providers": ["https://icp-api.io"],
      "type": "persistent"
    }
  }
}
```

### Step 3: Deploy to Mainnet

```bash
# Deploy user_management canister to mainnet
dfx deploy user_management --network ic

# Note: Internet Identity is already deployed on mainnet
# No need to deploy it yourself
```

### Step 4: Get Production Canister IDs

```bash
# Get your production user_management canister ID
dfx canister id user_management --network ic

# Output example: abc12-def34-ghi56-jkl78-mno90-cai
```

### Step 5: Configure Production Environment

Create `.env.production` with your production canister IDs:

```env
VITE_DFX_NETWORK=ic
VITE_IC_HOST=https://icp-api.io
VITE_USER_MANAGEMENT_CANISTER_ID=your-actual-production-canister-id
VITE_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app
VITE_NFID_URL=https://nfid.one/authenticate
NODE_ENV=production
```

### Step 6: Build Frontend for Production

```bash
# Build with production environment
npm run build

# Preview production build locally (optional)
npm run preview
```

### Step 7: Deploy Frontend

**Option A: Deploy to IC (Frontend Canister)**

```bash
# Deploy frontend canister to IC
dfx deploy frontend --network ic

# Get frontend URL
dfx canister id frontend --network ic
# Access at: https://[canister-id].ic0.app
```

**Option B: Deploy to Vercel/Netlify**

1. **Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

2. **Netlify:**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

**Important:** Set environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

---

## 🔐 Environment Variables Guide

### Required Variables

| Variable | Local Development | Production |
|----------|------------------|------------|
| `VITE_DFX_NETWORK` | `local` | `ic` |
| `VITE_IC_HOST` | `http://localhost:4943` | `https://icp-api.io` |
| `VITE_USER_MANAGEMENT_CANISTER_ID` | Local canister ID | Production canister ID |
| `VITE_INTERNET_IDENTITY_CANISTER_ID` | Local II ID | `rdmx6-jaaaa-aaaaa-aaadq-cai` |
| `VITE_INTERNET_IDENTITY_URL` | `http://localhost:4943/?canisterId=...` | `https://identity.ic0.app` |
| `VITE_NFID_URL` | `https://nfid.one/authenticate` | `https://nfid.one/authenticate` |
| `NODE_ENV` | `development` | `production` |

### How to Get Canister IDs

**Local Development:**
```bash
dfx canister id user_management
dfx canister id internet_identity
```

**Production:**
```bash
dfx canister id user_management --network ic
```

---

## 🔧 Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
1. Verify canister IDs in `.env.local` or `.env.production`
2. Check if backend is running: `dfx canister status user_management`
3. Clear browser cache and restart dev server

### Issue: Internet Identity window doesn't open

**Solution:**
1. Check browser popup blocker settings
2. Verify `VITE_INTERNET_IDENTITY_URL` is correct
3. Try accessing II directly in browser first

### Issue: "Actor not available" error

**Solution:**
1. Ensure backend canister is deployed
2. Regenerate declarations: `dfx generate user_management`
3. Restart frontend dev server

### Issue: CORS errors in production

**Solution:**
1. Make sure `VITE_IC_HOST` uses `https://` in production
2. Verify frontend is accessing correct mainnet API
3. Check browser console for specific CORS error details

### Verify Deployment

**Local:**
```bash
# Test health check
dfx canister call user_management healthCheck

# Check canister status
dfx canister status user_management
```

**Production:**
```bash
# Test health check
dfx canister call user_management healthCheck --network ic

# Check canister status
dfx canister status user_management --network ic
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend canister deployed successfully
- [ ] Environment variables configured correctly
- [ ] Frontend builds without errors
- [ ] Can access landing page
- [ ] Internet Identity authentication works
- [ ] NFID authentication works
- [ ] User registration works
- [ ] Dashboard loads after auth
- [ ] Logout functionality works
- [ ] Habit creation works (test one habit)

---

## 🎉 Success!

Your Momentum app is now live!

**Local:** `http://localhost:5173`
**Production:** `https://[your-canister-id].ic0.app` or your custom domain

For support, check the GitHub issues or documentation.

---

## 📚 Additional Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [DFX CLI Reference](https://internetcomputer.org/docs/current/references/cli-reference/)
- [Internet Identity Integration](https://internetcomputer.org/docs/current/developer-docs/integrations/internet-identity/)
- [NFID Documentation](https://docs.nfid.one/)
