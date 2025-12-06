# 🚀 Automated Deployment Setup (One-Time)

**Goal:** Push to GitHub → Automatic deployment to Netlify!

---

## ✅ What You'll Get

After this one-time setup:
- ✅ Push code to GitHub
- ✅ GitHub Actions automatically builds
- ✅ Automatically deploys to Netlify
- ✅ **No manual steps!**

---

## 🔧 One-Time Setup (15 minutes)

### **Step 1: Get Netlify Auth Token**

1. **Login to Netlify:**
   - Go to: https://app.netlify.com/login
   - Sign in with GitHub

2. **Create Access Token:**
   - Go to: https://app.netlify.com/user/applications#personal-access-tokens
   - Click **"New access token"**
   - Description: `GitHub Actions Deployment`
   - Click **"Generate token"**
   - **COPY THE TOKEN** (you'll need it in Step 3)
   - ⚠️ Save it somewhere safe - you can't see it again!

---

### **Step 2: Create Netlify Site (First Deployment)**

**Option A: Using Netlify CLI (Recommended)**

Run these commands:

```bash
# Login to Netlify (opens browser once)
netlify login

# Initialize site
cd fitlog-shell
netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: Your team
# - Site name: fitlog-app (or whatever you want)
# - Build command: npm run build
# - Publish directory: dist/fitlog-shell/browser

# This creates a .netlify folder with site ID
```

After this, check `.netlify/state.json` - you'll see your `siteId`.

**Option B: Using Netlify Website**

1. Go to: https://app.netlify.com/start
2. Click **"Import an existing project"**
3. Choose **GitHub** → Select `fitlog-shell`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/fitlog-shell/browser`
5. Click **"Deploy site"**
6. After deployment, go to **Site settings** → Copy the **Site ID**

---

### **Step 3: Add Secrets to GitHub**

1. **Go to GitHub Secrets:**
   - https://github.com/Sandeshth148/fitlog-shell/settings/secrets/actions

2. **Add NETLIFY_AUTH_TOKEN:**
   - Click **"New repository secret"**
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: Paste the token from Step 1
   - Click **"Add secret"**

3. **Add NETLIFY_SITE_ID:**
   - Click **"New repository secret"**
   - Name: `NETLIFY_SITE_ID`
   - Value: Paste the Site ID from Step 2
   - Click **"Add secret"**

---

### **Step 4: Push GitHub Actions Workflow**

The workflow file is already created at `.github/workflows/deploy.yml`

Just commit and push:

```bash
git add .
git commit -m "feat: Add automated deployment with GitHub Actions"
git push
```

---

## 🎉 Done! Now It's Automated!

### **How to Deploy (After Setup):**

```bash
# Make changes to your code
# ...

# Commit and push
git add .
git commit -m "Your changes"
git push

# That's it! GitHub Actions will:
# 1. Build your app
# 2. Deploy to Netlify
# 3. Give you the URL
```

---

## 📊 Monitor Deployments

### **GitHub Actions:**
- https://github.com/Sandeshth148/fitlog-shell/actions
- See build logs
- Check deployment status

### **Netlify Dashboard:**
- https://app.netlify.com/sites/YOUR-SITE-NAME/deploys
- See deployment history
- View live site

---

## 🔄 How It Works

```
You push code
    ↓
GitHub detects push
    ↓
GitHub Actions runs
    ↓
Installs dependencies
    ↓
Builds Angular app
    ↓
Deploys to Netlify
    ↓
Live URL updated!
```

**Time:** ~3-5 minutes per deployment

---

## 🆓 Cost

- GitHub Actions: **FREE** (2000 minutes/month)
- Netlify: **FREE** (100GB bandwidth/month)
- **Total: ₹0/month** ✅

---

## 🐛 Troubleshooting

### **Build Fails:**
1. Check GitHub Actions logs
2. Verify secrets are set correctly
3. Test build locally: `npm run build`

### **Deployment Fails:**
1. Verify `NETLIFY_AUTH_TOKEN` is correct
2. Verify `NETLIFY_SITE_ID` is correct
3. Check Netlify dashboard for errors

### **Site Not Updating:**
1. Check GitHub Actions - did it run?
2. Check Netlify deploys - did it deploy?
3. Clear browser cache

---

## 📝 Quick Reference

### **Your URLs:**
- GitHub Repo: https://github.com/Sandeshth148/fitlog-shell
- GitHub Actions: https://github.com/Sandeshth148/fitlog-shell/actions
- Netlify Site: https://app.netlify.com/sites/YOUR-SITE-NAME
- Live App: https://YOUR-SITE-NAME.netlify.app

### **Secrets Needed:**
- `NETLIFY_AUTH_TOKEN` - From Netlify user settings
- `NETLIFY_SITE_ID` - From Netlify site settings

---

## 🎯 Next Steps

After setup:
1. Make code changes
2. Commit and push
3. Watch GitHub Actions deploy automatically!
4. Share your live URL! 🎉

---

**Questions?** Just ask! This is a one-time setup, then it's fully automated! 🚀
