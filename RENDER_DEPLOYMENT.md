# Render.com Deployment Guide - Green Curry Hostel

## 🎯 Why Render.com?

- ✅ **Free Tier Available** (no credit card required for trial)
- ✅ **Free PostgreSQL** (90 days free, then $7/month)
- ✅ **Auto-deploy from GitHub**
- ✅ **Docker support**
- ✅ **Custom domains**
- ✅ **Zero-downtime deploys**

---

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Sign Up for Render

1. Go to: https://render.com/
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

---

### Step 2: Deploy Using Blueprint (Easiest Method)

We've created a `render.yaml` file that automates everything!

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → **"Blueprint"**
3. **Connect Repository**: `aztec-jt-dev/GreenCurry`
4. **Branch**: `main`
5. **Click "Apply"**

Render will automatically:
- ✅ Create PostgreSQL database
- ✅ Create web service
- ✅ Build Docker image
- ✅ Link database to app
- ✅ Deploy everything

---

### Step 3: Set Environment Variables

After blueprint deployment:

1. Go to your **Web Service** (greencurryhostel)
2. Click **"Environment"** tab
3. Add variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
4. Click **"Save Changes"**

The app will automatically redeploy.

---

### Step 4: Initialize Database Tables

Get your database connection string:

1. Go to **Dashboard** → **greencurryhostel-db** (PostgreSQL)
2. Copy the **"External Database URL"**
3. Run the setup script locally:

```bash
DATABASE_URL="your_database_url_here" node scripts/setup-db-render.js
```

This creates:
- ✅ Users table (with admin user)
- ✅ Rooms table (9 rooms)
- ✅ Bookings table

**Admin Credentials**:
- Username: `admin`
- Password: `curry123#`

---

### Step 5: Configure Custom Domain

1. Go to your **Web Service** → **"Settings"**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `greencurryhostel.click`
5. Follow DNS configuration instructions

**DNS Setup** (at your domain registrar):
```
Type: CNAME
Name: @
Value: greencurryhostel.onrender.com
```

---

## 🔄 Alternative: Manual Deployment

If you prefer not to use the blueprint:

### Option A: Deploy Web Service

1. **Dashboard** → **"New +"** → **"Web Service"**
2. **Connect Repository**: `aztec-jt-dev/GreenCurry`
3. **Settings**:
   - Name: `greencurryhostel`
   - Runtime: `Docker`
   - Branch: `main`
   - Dockerfile Path: `./Dockerfile`
4. **Environment Variables**:
   - Add `GEMINI_API_KEY`
   - Add `DATABASE_URL` (from database)
5. **Click "Create Web Service"**

### Option B: Create PostgreSQL Database

1. **Dashboard** → **"New +"** → **"PostgreSQL"**
2. **Settings**:
   - Name: `greencurryhostel-db`
   - Database: `greencurry`
   - User: `greencurry_user`
   - Plan: **Free**
3. **Click "Create Database"**
4. Copy the **"External Database URL"**
5. Add it to your web service as `DATABASE_URL`

---

## 📊 Monitoring & Management

### View Logs
1. Go to your web service
2. Click **"Logs"** tab
3. Real-time logs appear here

### Check Deployment Status
- Dashboard shows deployment status
- Green = deployed successfully
- Yellow = deploying
- Red = failed

### Restart Service
1. Go to web service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔧 Troubleshooting

### Build Fails
- Check **Logs** tab for errors
- Verify Dockerfile is correct
- Ensure all dependencies in package.json

### App Won't Start
- Check **Logs** for runtime errors
- Verify `DATABASE_URL` is set
- Verify `GEMINI_API_KEY` is set
- Check health endpoint: `https://your-app.onrender.com/health`

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is running (should show "Available")
- Ensure SSL is enabled in connection

### Free Tier Limitations
- Apps spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid plan ($7/month) for always-on

---

## 💰 Pricing

### Free Tier
- **Web Service**: Free (with spin-down)
- **PostgreSQL**: 90 days free, then $7/month
- **Bandwidth**: 100GB/month
- **Build Minutes**: 500 minutes/month

### Paid Plans
- **Starter**: $7/month (always-on, no spin-down)
- **Standard**: $25/month (more resources)
- **Pro**: $85/month (dedicated resources)

---

## 🎯 Post-Deployment Checklist

- [ ] Web service deployed successfully
- [ ] PostgreSQL database created
- [ ] Database tables initialized
- [ ] Environment variables set (GEMINI_API_KEY, DATABASE_URL)
- [ ] Health check passing: `/health`
- [ ] Homepage loads correctly
- [ ] Admin login works (admin / curry123#)
- [ ] Custom domain configured (greencurryhostel.click)
- [ ] Test booking flow
- [ ] Test AI concierge

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com/
- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com/
- **Support**: https://render.com/support

---

## 📝 Quick Commands Reference

### Database Setup
```bash
# Initialize database tables
DATABASE_URL="your_url" node scripts/setup-db-render.js
```

### Local Testing
```bash
# Build Docker image
docker build -t greencurryhostel .

# Run locally
docker run -p 3000:3000 \
  -e DATABASE_URL="your_url" \
  -e GEMINI_API_KEY="your_key" \
  greencurryhostel
```

### Check Health
```bash
# Test health endpoint
curl https://your-app.onrender.com/health
```

---

## ✅ Success!

Once deployed, your app will be available at:
- **Render URL**: `https://greencurryhostel.onrender.com`
- **Custom Domain**: `https://greencurryhostel.click` (after DNS setup)

**Deployment time**: ~5-10 minutes

🎉 **Your Green Curry Hostel is now live on Render!**
