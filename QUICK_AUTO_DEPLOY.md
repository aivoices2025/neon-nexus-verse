# ⚡ QUICK AUTO-DEPLOY SETUP (2 minutes)

## 🎯 **Stop Dragging Files - Automate Now!**

Follow these exact steps to never drag & drop again:

### **Step 1: Get GitHub Token (30 seconds)**
1. **Click**: https://github.com/settings/tokens
2. **Click**: "Generate new token (classic)"
3. **Name**: `Auto Deploy`
4. **Check**: `repo` box only
5. **Click**: "Generate token"
6. **Copy the token** (starts with `ghp_`)

### **Step 2: Set Up Git (30 seconds)**
```bash
# Replace YOUR_TOKEN with the actual token you copied
git remote set-url origin https://aivoices2025:YOUR_TOKEN@github.com/aivoices2025/neon-nexus-verse.git
```

### **Step 3: Push to GitHub (30 seconds)**
```bash
git add .
git commit -m "🚀 Auto-deploy setup"
git push origin main
```

### **Step 4: Connect Netlify (1 minute)**
1. **Go to**: https://app.netlify.com/
2. **Find**: "lucky-kulfi-29fb30" site
3. **Click**: Site settings → Build & deploy
4. **Click**: "Link site to Git"
5. **Choose**: GitHub → `aivoices2025/neon-nexus-verse`
6. **Set**:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. **Click**: "Deploy site"

## 🎉 **DONE! Automation Active**

### **✅ Test It:**
```bash
# Make any small change
echo "Auto-deploy test" >> README.md
git add .
git commit -m "Test auto deploy"
git push origin main

# Watch Netlify deploy automatically!
# Your site updates in 2-3 minutes
```

### **🔄 From Now On:**
- **Edit code** → **git push** → **Automatic deployment!**
- **No more drag & drop**
- **No more manual uploads**

## 🚨 **If Something Goes Wrong:**

### **Token Issues:**
```bash
# Check current remote
git remote -v

# Fix remote URL
git remote set-url origin https://aivoices2025:YOUR_TOKEN@github.com/aivoices2025/neon-nexus-verse.git
```

### **Build Failures:**
- Check Netlify build logs
- Ensure Node.js 18.18.0 is set
- Clear cache and retry

## 🎯 **Success Indicators:**

✅ **Git push works** without asking for password  
✅ **Netlify shows "Building"** after push  
✅ **Site updates** automatically in 2-3 minutes  
✅ **No more manual file uploads** needed  

**Your VR platform now deploys automatically!** 🚀🥽✨

---

**Next update? Just `git push` and it's live!** ⚡