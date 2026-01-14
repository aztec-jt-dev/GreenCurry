# Railway Quick Setup Guide - Green Curry Hostel

## ⚠️ Important Issues Discovered

1. **Account Limitation**: Your Railway account is on a limited plan
2. **Service Not Linked**: Need to link to a Railway service
3. **Database Tables**: Need to be created using setup script

---

## 🔧 Fix: Complete Railway Setup

### Step 1: Link to Your PostgreSQL Service

```bash
railway service
```

Select your **Postgres** service from the list.

---

### Step 2: Set Environment Variables (Correct Syntax)

The correct syntax is `--set` (not `set`):

```bash
railway variables --set GEMINI_API_KEY="your_actual_gemini_api_key"
```

> **Note**: Replace `your_actual_gemini_api_key` with your real Gemini API key (not the GitHub token you used before)

---

### Step 3: Create Database Tables

Run the Railway-specific setup script:

```bash
railway run node scripts/setup-db-railway.js
```

This will:
- ✅ Create all database tables (users, rooms, bookings)
- ✅ Seed admin user (username: `admin`, password: `curry123#`)
- ✅ Seed 9 rooms

---

### Step 4: Deploy Your Application

First, you need to create a **new service** for your application (separate from Postgres):

```bash
# Create a new service for the app
railway service create

# Name it something like: greencurryhostel-app
```

Then deploy:

```bash
railway up
```

---

### Step 5: Link Services Together

Your app service needs access to the Postgres DATABASE_URL:

```bash
# Switch to your app service
railway service

# Link the Postgres database
railway link
```

Select your Postgres service to link.

---

## 🏗️ Alternative: Use Railway Dashboard (Easier)

If the CLI is confusing, use the web dashboard:

1. **Go to**: https://railway.app/dashboard
2. **Select Project**: GreenCurryHostel
3. **Create New Service**:
   - Click "+ New"
   - Select "Empty Service"
   - Name: "greencurryhostel-app"
4. **Connect GitHub**:
   - Settings → Connect Repo
   - Select: `aztec-jt-dev/GreenCurry`
   - Branch: `main`
5. **Set Variables**:
   - Go to Variables tab
   - Add: `GEMINI_API_KEY` = your key
   - The `DATABASE_URL` will auto-populate from linked Postgres
6. **Deploy**:
   - Click "Deploy"

---

## 💰 Account Limitation Issue

Railway now requires a paid plan for most features. You have two options:

### Option A: Upgrade Railway Plan
- Go to: https://railway.com/account/plans
- Choose a plan (starts at $5/month)
- Add payment method

### Option B: Use Free Alternative

If you want to stay free, consider **Render.com**:

```bash
# Install Render CLI
npm install -g render

# Login
render login

# Deploy
render deploy
```

Render has a generous free tier with:
- ✅ Free PostgreSQL (90 days, then $7/month)
- ✅ Free web services (with limitations)
- ✅ No credit card required for trial

---

## 📊 Current Railway Status

```bash
# Check your current setup
railway status

# List all services
railway service

# View variables for current service
railway variables

# View logs
railway logs
```

---

## 🎯 Recommended Next Steps

1. **Upgrade Railway** (if you want to use Railway)
   - Visit: https://railway.com/account/plans
   - Add payment method
   
2. **Link to App Service**:
   ```bash
   railway service
   # Select your app service (not Postgres)
   ```

3. **Set Gemini API Key** (with correct syntax):
   ```bash
   railway variables --set GEMINI_API_KEY="your_real_gemini_key"
   ```

4. **Initialize Database**:
   ```bash
   railway run node scripts/setup-db-railway.js
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

---

## ❓ Need Help?

**Check Railway docs**: https://docs.railway.app/
**Railway Discord**: https://discord.gg/railway

Or let me know if you'd like to switch to **Render.com** (free tier) instead!
