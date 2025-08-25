#!/bin/bash

# 🚀 VR Platform Deployment Script
# This script helps you deploy your VR fixes automatically

echo "🥽 VR Platform Deployment Assistant"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the neon-nexus-verse directory"
    exit 1
fi

echo "✅ Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🎯 Next Steps:"
    echo ""
    echo "OPTION 1 - Manual Upload (Works Now):"
    echo "1. Go to https://app.netlify.com/"
    echo "2. Drag the 'dist' folder to deploy"
    echo "3. Your VR buttons will work immediately!"
    echo ""
    echo "OPTION 2 - Setup Automatic Deployment:"
    echo "1. Get Personal Access Token:"
    echo "   - Go to https://github.com/settings/tokens"
    echo "   - Generate new token with 'repo' permission"
    echo "   - Copy the token"
    echo ""
    echo "2. Push to GitHub with token:"
    echo "   git remote set-url origin https://aivoices2025:YOUR_TOKEN@github.com/aivoices2025/neon-nexus-verse.git"
    echo "   git push origin main"
    echo ""
    echo "3. Connect GitHub to Netlify:"
    echo "   - https://app.netlify.com/ → Add new site → Import from GitHub"
    echo "   - Select your repo → Build: 'npm run build' → Publish: 'dist'"
    echo ""
    echo "🥽 Your VR button fixes are ready to deploy!"
    echo "   The WorkingVRButton component will make VR work properly!"
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi