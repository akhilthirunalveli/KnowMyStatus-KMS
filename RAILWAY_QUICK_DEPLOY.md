# 🚂 Complete Railway Deployment Guide

## Quick Start (Web Dashboard Method - Easiest)

### 1. **Create Railway Account & Project**
1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `KnowMyStatus-KMS` repository
5. Choose "Backend" folder as root directory

### 2. **Configure Environment Variables**
In Railway Dashboard → Variables tab, add these **exactly**:

```
SUPABASE_URL = https://htrxagrybfupwpefyyhg.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjgzOTgsImV4cCI6MjA2NjQ0NDM5OH0.Mvcr3hk3wNI6GPgnkAjnnqNtZ4u5q_SaXIA_5yFFIM4
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2ODM5OCwiZXhwIjoyMDY2NDQ0Mzk4fQ.1_GF0cQp2KRPGCh8D8kXaLViZ2q5iLn0-QaQA-kRWAU
JWT_SECRET = 3LKv3jFK/P0YaIMhgYPEcis7qND8pBYS2D9aYdGfXM8FGNc7NNJLYrTaVCv+V3ry9WCm457SyFNvY/4b8Wq8Kw==
NODE_ENV = production
FRONTEND_URL = https://your-vercel-app.vercel.app
```

### 3. **Deploy**
- Railway will automatically detect your Node.js app
- Click "Deploy" - it will build and deploy automatically
- Your backend will be available at: `https://your-project.railway.app`

## Alternative: Railway CLI Method

### Install CLI
```bash
npm install -g @railway/cli
```

### Deploy Commands
```bash
# 1. Login
railway login

# 2. Navigate to backend
cd Backend

# 3. Initialize project
railway init

# 4. Set variables (paste each line)
railway variables set SUPABASE_URL=https://htrxagrybfupwpefyyhg.supabase.co
railway variables set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjgzOTgsImV4cCI6MjA2NjQ0NDM5OH0.Mvcr3hk3wNI6GPgnkAjnnqNtZ4u5q_SaXIA_5yFFIM4
railway variables set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2ODM5OCwiZXhwIjoyMDY2NDQ0Mzk4fQ.1_GF0cQp2KRPGCh8D8kXaLViZ2q5iLn0-QaQA-kRWAU
railway variables set JWT_SECRET=3LKv3jFK/P0YaIMhgYPEcis7qND8pBYS2D9aYdGfXM8FGNc7NNJLYrTaVCv+V3ry9WCm457SyFNvY/4b8Wq8Kw==
railway variables set NODE_ENV=production

# 5. Deploy
railway deploy

# 6. Get URL
railway status
```

## Post-Deployment Checklist

### ✅ **Test Your API**
```bash
# Replace with your actual Railway URL
curl https://your-project.railway.app/api/health
```

### ✅ **Update Frontend**
Update your frontend's Vite config or API base URL to point to Railway:

```javascript
// In Frontend/vite.config.mjs
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://your-project.railway.app'  // Your Railway URL
    }
  }
});
```

### ✅ **Update CORS**
Once you deploy frontend to Vercel, update the `FRONTEND_URL` variable in Railway to your Vercel domain.

## Railway Features You Get

🎯 **Automatic Deployments** - Deploys on every git push  
🔒 **Environment Variables** - Secure configuration  
🌐 **Custom Domains** - Add your own domain  
📊 **Monitoring** - Logs and metrics built-in  
🔄 **Zero Downtime** - Rolling deployments  
💰 **Affordable** - $5/month hobby plan  

## Expected Results

After deployment:
- **Backend URL**: `https://knowmystatus-backend.railway.app`
- **API Health**: `https://knowmystatus-backend.railway.app/api/health`
- **Teachers API**: `https://knowmystatus-backend.railway.app/api/teachers`

## Troubleshooting

### Build Fails
- Check Railway logs in dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Environment Variables Missing
```bash
railway variables list  # Check if all variables are set
```

### CORS Issues
- Make sure `FRONTEND_URL` points to your actual frontend domain
- Update after deploying frontend

---

**🎉 Ready to Deploy!** Your backend is fully configured for Railway deployment with Supabase Storage integration.
