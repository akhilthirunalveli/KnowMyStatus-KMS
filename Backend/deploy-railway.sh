#!/bin/bash

# Railway Deployment Script for KnowMyStatus Backend

echo "🚂 Railway Deployment Script for KnowMyStatus Backend"
echo "=================================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Please run the following commands:"
echo ""
echo "1. Login to Railway:"
echo "   railway login"
echo ""
echo "2. Navigate to Backend directory:"
echo "   cd Backend"
echo ""
echo "3. Initialize Railway project:"
echo "   railway init"
echo ""
echo "4. Set environment variables (one by one):"
echo "   railway variables set SUPABASE_URL=https://htrxagrybfupwpefyyhg.supabase.co"
echo "   railway variables set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjgzOTgsImV4cCI6MjA2NjQ0NDM5OH0.Mvcr3hk3wNI6GPgnkAjnnqNtZ4u5q_SaXIA_5yFFIM4"
echo "   railway variables set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cnhhZ3J5YmZ1cHdwZWZ5eWhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2ODM5OCwiZXhwIjoyMDY2NDQ0Mzk4fQ.1_GF0cQp2KRPGCh8D8kXaLViZ2q5iLn0-QaQA-kRWAU"
echo "   railway variables set JWT_SECRET=3LKv3jFK/P0YaIMhgYPEcis7qND8pBYS2D9aYdGfXM8FGNc7NNJLYrTaVCv+V3ry9WCm457SyFNvY/4b8Wq8Kw=="
echo "   railway variables set NODE_ENV=production"
echo "   railway variables set FRONTEND_URL=https://your-vercel-domain.vercel.app"
echo ""
echo "5. Deploy:"
echo "   railway deploy"
echo ""
echo "6. Get your deployment URL:"
echo "   railway status"
echo ""
echo "🎉 Your backend will be available at: https://your-project-name.railway.app"
