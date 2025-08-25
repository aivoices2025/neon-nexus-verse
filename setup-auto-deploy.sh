#!/bin/bash

# 🚀 Netlify Auto-Deploy Setup Script
# This script helps you set up automated deployment

echo "🚀 Netlify Auto-Deploy Setup"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the neon-nexus-verse directory"
    exit 1
fi

echo "✅ Project directory confirmed"
echo ""

# Check Git status
echo "📋 Current Git Status:"
git status --short
echo ""

# Build the project to make sure it works
echo "🔨 Building project to verify everything works..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
else
    echo "❌ Build failed! Fix errors before setting up auto-deploy."
    exit 1
fi

# Show next steps
echo "🎯 AUTOMATED DEPLOYMENT SETUP:"
echo ""
echo "1️⃣ GET GITHUB TOKEN:"
echo "   → Go to: https://github.com/settings/tokens"
echo "   → Generate new token with 'repo' permission"
echo "   → Copy the token"
echo ""
echo "2️⃣ PUSH TO GITHUB:"
echo "   → Run: git remote set-url origin https://aivoices2025:YOUR_TOKEN@github.com/aivoices2025/neon-nexus-verse.git"
echo "   → Run: git add ."
echo "   → Run: git commit -m 'Setup automated deployment'"
echo "   → Run: git push origin main"
echo ""
echo "3️⃣ CONNECT NETLIFY:"
echo "   → Go to: https://app.netlify.com/"
echo "   → Find site: 'lucky-kulfi-29fb30'"
echo "   → Site settings → Build & deploy → Link site to Git"
echo "   → Choose GitHub → Select 'aivoices2025/neon-nexus-verse'"
echo "   → Build command: npm run build"
echo "   → Publish directory: dist"
echo ""
echo "🎉 AFTER SETUP:"
echo "   → git push = automatic deployment!"
echo "   → No more drag & drop!"
echo "   → Your VR site updates automatically!"
echo ""
echo "📖 Full guide: NETLIFY_AUTO_DEPLOY_GUIDE.md"
echo ""
echo "🥽 Your VR platform is ready for automated deployment!"

# Ask if user wants to commit changes
echo ""
read -p "📝 Do you want to commit all current changes? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "🚀 Ready for automated deployment

✅ VR loading dots fixed - full virtual world now renders
✅ Created VRCanvas component with proper WebXR sessions
✅ Added automated deployment setup guides
✅ Build verified and ready for GitHub → Netlify automation

Next: Set up GitHub token and connect to Netlify!"
    
    echo "✅ Changes committed!"
    echo ""
    echo "🔗 Next: Get your GitHub token and push:"
    echo "   git remote set-url origin https://aivoices2025:YOUR_TOKEN@github.com/aivoices2025/neon-nexus-verse.git"
    echo "   git push origin main"
else
    echo "📝 Skipped commit. Run 'git add . && git commit' when ready."
fi

echo ""
echo "🎯 Ready for automated deployment setup!"