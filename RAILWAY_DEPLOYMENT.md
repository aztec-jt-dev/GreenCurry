# Railway.app Deployment Guide for Green Curry Hostel

## ✅ Railway CLI Installed

Railway CLI version **4.23.2** is now installed and ready to use.

---

## 🚀 Complete Deployment Steps

### Step 1: Login to Railway (Interactive)

Railway login requires browser authentication. Run this command in your terminal:

```bash
railway login
```

This will:
1. Open your browser
2. Ask you to sign in with GitHub (or create a Railway account)
3. Authorize the CLI
4. Return to terminal when complete

---

### Step 2: Initialize Railway Project

Once logged in, initialize your project:

```bash
cd /home/aztec/Documents/Apps/Greenycurryhostel
railway init
```

You'll be prompted to:
- Create a new project or link to existing
- Choose a project name (suggest: `greencurryhostel`)

---

### Step 3: Add PostgreSQL Database

Railway can provision a PostgreSQL database for you:

```bash
railway add
```

Select **PostgreSQL** from the list. Railway will:
- Create a PostgreSQL instance
- Auto-generate `DATABASE_URL` environment variable
- Link it to your project

---

### Step 4: Set Environment Variables

Set your Gemini API key:

```bash
railway variables set GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

The `DATABASE_URL` is automatically set by Railway when you added PostgreSQL.

To verify all environment variables:

```bash
railway variables
```

---

### Step 5: Deploy Your Application

Deploy using the Dockerfile:

```bash
railway up
```

Railway will:
- Detect your Dockerfile
- Build the Docker image
- Deploy to Railway infrastructure
- Provide a deployment URL

**Build time**: ~2-3 minutes

---

### Step 6: Get Your Deployment URL

After deployment completes:

```bash
railway open
```

This opens your deployed application in the browser.

To see the URL in terminal:

```bash
railway status
```

---

### Step 7: Configure Custom Domain

To use `greencurryhostel.click`:

**Option A - Via CLI**:
```bash
railway domain
```

**Option B - Via Dashboard**:
1. Go to https://railway.app/dashboard
2. Select your project
3. Click "Settings" → "Domains"
4. Add custom domain: `greencurryhostel.click`
5. Update your DNS records as instructed

**DNS Configuration**:
You'll need to add a CNAME record:
```
Type: CNAME
Name: @ (or www)
Value: <your-railway-domain>.railway.app
```

---

## 📊 Monitoring & Management

### View Logs
```bash
railway logs
```

### View Deployment Status
```bash
railway status
```

### Open Railway Dashboard
```bash
railway open
```

### Redeploy
```bash
railway up --detach
```

---

## 🔧 Troubleshooting

### If Build Fails

Check logs:
```bash
railway logs --build
```

Common issues:
- Missing environment variables
- Dockerfile errors
- Port configuration (ensure using `PORT` env var)

### If App Won't Start

1. Check runtime logs:
   ```bash
   railway logs
   ```

2. Verify environment variables:
   ```bash
   railway variables
   ```

3. Test health endpoint:
   ```bash
   curl https://your-app.railway.app/health
   ```

### Database Connection Issues

Verify DATABASE_URL is set:
```bash
railway variables | grep DATABASE_URL
```

---

## 🎯 Quick Command Reference

| Command | Description |
|---------|-------------|
| `railway login` | Authenticate with Railway |
| `railway init` | Initialize project |
| `railway add` | Add service (PostgreSQL, Redis, etc.) |
| `railway up` | Deploy application |
| `railway logs` | View application logs |
| `railway status` | Check deployment status |
| `railway variables` | List environment variables |
| `railway variables set KEY=value` | Set environment variable |
| `railway domain` | Manage custom domains |
| `railway open` | Open app in browser |
| `railway link` | Link to existing project |

---

## 💰 Pricing

Railway offers:
- **$5 free credits per month** (no credit card required)
- **Pay-as-you-go** after free credits
- Typical costs for this app: ~$5-10/month

---

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

1. Go to Railway dashboard
2. Select your project
3. Click "Settings" → "Service"
4. Connect to GitHub repository: `aztec-jt-dev/GreenCurry`
5. Select branch: `main`
6. Enable "Auto Deploy"

Now every `git push` will trigger a deployment!

---

## ✅ Next Steps

1. **Run `railway login`** in your terminal
2. **Follow the browser authentication**
3. **Run `railway init`** to create your project
4. **Run `railway add`** to add PostgreSQL
5. **Set GEMINI_API_KEY** with `railway variables set`
6. **Deploy** with `railway up`
7. **Configure domain** `greencurryhostel.click`

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app/

---

## Summary

Your application is **ready to deploy** to Railway. The Dockerfile and all configurations are in place. Simply follow the steps above to complete the deployment.

**Estimated time to deploy**: 10-15 minutes
