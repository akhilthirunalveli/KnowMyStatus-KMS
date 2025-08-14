#!/bin/bash

# KnowMyStatus Deployment Verification Script

echo "🔍 KnowMyStatus Deployment Status Check"
echo "======================================"

# Test Backend Health
echo "1. Testing Backend Health..."
BACKEND_RESPONSE=$(curl -s https://knowmystatus-kms-production.up.railway.app/api/health)
if [[ $BACKEND_RESPONSE == *"OK"* ]]; then
    echo "✅ Backend: HEALTHY"
else
    echo "❌ Backend: ISSUES DETECTED"
fi

# Test Frontend Access
echo "2. Testing Frontend Access..."
FRONTEND_RESPONSE=$(curl -s -I https://knowmystatus.vercel.app/ | head -n 1)
if [[ $FRONTEND_RESPONSE == *"200"* ]]; then
    echo "✅ Frontend: ACCESSIBLE"
else
    echo "❌ Frontend: ISSUES DETECTED"
fi

# Test Teachers API
echo "3. Testing Teachers API..."
TEACHERS_RESPONSE=$(curl -s https://knowmystatus-kms-production.up.railway.app/api/teachers)
if [[ $TEACHERS_RESPONSE == *"teachers"* ]]; then
    echo "✅ Teachers API: WORKING"
else
    echo "❌ Teachers API: ISSUES DETECTED"
fi

echo ""
echo "🌐 Live URLs:"
echo "Frontend: https://knowmystatus.vercel.app/"
echo "Backend:  https://knowmystatus-kms-production.up.railway.app"
echo ""
echo "📋 Next Steps:"
echo "1. Update FRONTEND_URL in Railway to: https://knowmystatus.vercel.app"
echo "2. Test login/registration on live site"
echo "3. Test QR code generation and scanning"
echo ""
echo "🎉 Your KnowMyStatus application is LIVE!"
