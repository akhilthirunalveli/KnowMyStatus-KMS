# Railway Deployment Guide for KnowMyStatus Backend

## Prerequisites
1. Railway account (sign up at https://railway.app)
2. GitHub repository with your backend code
3. Environment variables ready

## Step-by-Step Deployment

### 1. **Create New Railway Project**
```bash
# Option A: Using Railway CLI
npm install -g @railway/cli
railway login
cd Backend
railway deploy

# Option B: Using Railway Web Dashboard
# Go to https://railway.app/new
# Connect your GitHub repository
```

### 2. **Environment Variables Setup**
In Railway Dashboard → Your Project → Variables, add:

```env
SUPABASE_URL=https://htrxagrybfupwpefyyhg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjgzOTgsImV4cCI6MjA2NjQ0NDM5OH0.Mvcr3hk3wNI6GPgnkAjnnqNtZ4u5q_SaXIA_5yFFIM4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2ODM5OCwiZXhwIjoyMDY2NDQ0Mzk4fQ.1_GF0cQp2KRPGCh8D8kXaLViZ2q5iLn0-QaQA-kRWAU
JWT_SECRET=3LKv3jFK/P0YaIMhgYPEcis7qND8pBYS2D9aYdGfXM8FGNc7NNJLYrTaVCv+V3ry9WCm457SyFNvY/4b8Wq8Kw==
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 3. **Railway Configuration File**
Railway will auto-detect your Node.js app, but you can customize with `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 4. **Build Configuration**
Railway uses Nixpacks by default. For custom build steps, create `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-9_x"]

[phases.build]
cmds = ["npm ci"]

[start]
cmd = "npm start"
```

## Railway CLI Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from Backend directory
cd Backend
railway deploy

# Link to existing project
railway link [project-id]

# Set environment variables
railway variables set SUPABASE_URL=https://htrxagrybfupwpefyyhg.supabase.co

# View logs
railway logs

# Open project in browser
railway open
```

## Post-Deployment Steps

### 1. **Update Frontend URLs**
Once deployed, update your frontend's API base URL to point to Railway:
```javascript
// In Frontend - update axios baseURL or proxy
const API_BASE_URL = 'https://your-app-name.railway.app';
```

### 2. **Update CORS Settings**
Update `FRONTEND_URL` environment variable in Railway with your Vercel domain:
```env
FRONTEND_URL=https://knowmystatus.vercel.app
```

### 3. **Test Deployment**
```bash
# Health check
curl https://your-app-name.railway.app/api/health

# Test API endpoint
curl https://your-app-name.railway.app/api/teachers
```

## Railway Features & Benefits

✅ **Zero Configuration** - Auto-detects Node.js  
✅ **Git Integration** - Auto-deploy on git push  
✅ **Environment Variables** - Secure config management  
✅ **Custom Domains** - Add your own domain  
✅ **Automatic HTTPS** - SSL certificates included  
✅ **Monitoring** - Built-in logs and metrics  
✅ **Rollbacks** - Easy deployment rollbacks  

## Pricing
- **Hobby Plan**: $5/month - Perfect for your backend
- **Free Trial**: Available for testing

## Troubleshooting

### Build Issues
```bash
# Check build logs in Railway dashboard
# Or via CLI:
railway logs --deployment
```

### Environment Variables
```bash
# List all variables
railway variables

# Check specific variable
railway variables get NODE_ENV
```

### Port Configuration
Railway automatically assigns a port via `$PORT` environment variable. Your server.js already handles this:
```javascript
const PORT = process.env.PORT || 5000;
```

## Expected Railway URL
After deployment: `https://knowmystatus-backend-production.railway.app`
