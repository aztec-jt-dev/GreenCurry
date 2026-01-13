# Green Curry Hostel - Deployment Guide

## Spaceship Hyperlift Deployment

This application is configured for deployment on **Spaceship Hyperlift** platform.

### Prerequisites

1. **Spaceship Hyperlift Account**: Sign up at [Spaceship Hyperlift](https://spaceship.run/)
2. **Spaceship CLI**: Install the CLI tool
   ```bash
   npm install -g @spaceship/cli
   # or
   curl -fsSL https://spaceship.run/install.sh | sh
   ```
3. **GitHub Repository**: Code must be pushed to GitHub (already configured at `aztec-jt-dev/GreenCurry`)

### Environment Variables

The following environment variables must be configured in Spaceship Hyperlift:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | ✅ Yes |
| `PORT` | Server port (default: 3000) | ⚠️ Auto-set by Spaceship |
| `NODE_ENV` | Environment mode (production) | ⚠️ Auto-set by Spaceship |

### Deployment Steps

#### Option 1: Deploy via Spaceship Dashboard

1. **Login to Spaceship Hyperlift Dashboard**
   - Navigate to https://spaceship.run/dashboard

2. **Create New App**
   - Click "New App"
   - Connect your GitHub repository: `aztec-jt-dev/GreenCurry`
   - Select branch: `main`

3. **Configure Build Settings**
   - Dockerfile: `Dockerfile` (auto-detected)
   - Build context: `.` (root directory)

4. **Set Environment Variables**
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Add `GEMINI_API_KEY` with your Gemini API key

5. **Configure Domain**
   - Custom domain: `greencurryhostel.click`
   - Follow DNS configuration instructions

6. **Deploy**
   - Click "Deploy" button
   - Monitor build logs
   - Wait for deployment to complete

#### Option 2: Deploy via Spaceship CLI

```bash
# Login to Spaceship
spaceship login

# Initialize app (first time only)
spaceship init

# Set environment variables
spaceship env:set DATABASE_URL="postgresql://user:pass@host:port/db?ssl=true"
spaceship env:set GEMINI_API_KEY="your_api_key_here"

# Deploy
spaceship deploy

# Configure custom domain
spaceship domains:add greencurryhostel.click
```

### Continuous Deployment

To enable automatic deployments on every push to `main`:

1. **Via Dashboard**: Enable "Auto Deploy" in app settings
2. **Via CLI**: 
   ```bash
   spaceship auto-deploy:enable
   ```

### Monitoring & Logs

```bash
# View application logs
spaceship logs --tail

# Check deployment status
spaceship status

# View app info
spaceship info
```

### Health Check

The application includes a health check endpoint at `/health` that:
- Verifies server is running
- Tests database connectivity
- Returns JSON status

Access it at: `https://greencurryhostel.click/health`

### Troubleshooting

#### Build Fails
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Review build logs: `spaceship logs --build`

#### App Won't Start
- Verify environment variables are set correctly
- Check database connection string
- Review runtime logs: `spaceship logs --tail`

#### Database Connection Issues
- Ensure DATABASE_URL is correct
- Verify database allows connections from Spaceship IPs
- Check SSL settings in connection string

### Rollback

If deployment fails or has issues:

```bash
# List deployments
spaceship deployments

# Rollback to previous version
spaceship rollback <deployment-id>
```

### Local Testing with Docker

Before deploying, test the Docker build locally:

```bash
# Build the image
docker build -t greencurryhostel .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e GEMINI_API_KEY="your_api_key" \
  greencurryhostel

# Test the application
curl http://localhost:3000/health
```

### Production URL

Once deployed, your application will be available at:
- **Primary**: https://greencurryhostel.click/
- **Spaceship URL**: https://greencurryhostel.spaceship.run/ (auto-generated)

### Support

- **Spaceship Documentation**: https://docs.spaceship.run/
- **GitHub Issues**: https://github.com/aztec-jt-dev/GreenCurry/issues
