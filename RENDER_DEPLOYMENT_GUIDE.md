# 🚀 Render Deployment Guide - Hisi Studio Frontend

## Complete Step-by-Step Guide for Deploying React Frontend to Render

---

## 📋 Prerequisites

Before deploying to Render, make sure you have:
- ✅ GitHub repository with your code pushed
- ✅ Render account (free tier works): https://render.com
- ✅ Backend API deployed and accessible (if deploying separately)
- ✅ Flutterwave public key ready

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Create `.node-version` file (Optional but Recommended)

Create a file named `.node-version` in your `client` directory:

```bash
cd /home/chei/client-projects/Hisi-Studio/client
echo "20" > .node-version
```

This tells Render to use Node.js version 20.

### 1.2 Verify `package.json` has build script

Your `package.json` should have (already confirmed):
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

✅ **Confirmed**: Your package.json is correctly configured.

### 1.3 Push changes to GitHub

```bash
cd /home/chei/client-projects/Hisi-Studio
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## 🌐 Step 2: Create New Web Service on Render

### 2.1 Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Static Site"**

### 2.2 Connect Repository
1. Click **"Connect GitHub"** (or GitLab/etc.)
2. Select your **Hisi-Studio** repository
3. Click **"Connect"**

---

## ⚙️ Step 3: Configure Build Settings

Fill in the following settings EXACTLY as shown:

### 3.1 Basic Settings

| Field | Value |
|-------|-------|
| **Name** | `hisi-studio-frontend` (or your preferred name) |
| **Region** | Choose closest to your users (e.g., Oregon, Frankfurt) |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `client` |

⚠️ **CRITICAL**: Set **Root Directory** to `client` - this is where your React app lives!

### 3.2 Build Settings

| Field | Value |
|-------|-------|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

**Explanation:**
- `npm install` - Installs all dependencies from package.json
- `npm run build` - Runs Vite build (creates optimized production files)
- `dist` - Vite outputs built files to the `dist` folder

---

## 🔐 Step 4: Configure Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add the following environment variables:

### Required Variables:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | Your backend API URL | `https://hisi-studio-api.onrender.com/api/v1` |
| `VITE_FLUTTERWAVE_PUBLIC_KEY` | Your Flutterwave public key | `FLWPUBK_TEST-xxxxxxxxxxxxx` |

### Optional Variables:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | `G-XXXXXXXXXX` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `NODE_VERSION` | Node.js version | `20` |

⚠️ **IMPORTANT**:
- If deploying backend separately, use the full backend URL for `VITE_API_URL`
- Use production Flutterwave key for production, test key for testing
- All environment variables in Vite MUST start with `VITE_`

### Example Configuration:

```
VITE_API_URL=https://hisi-studio-backend.onrender.com/api/v1
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-a1b2c3d4e5f6g7h8i9j0
NODE_VERSION=20
```

---

## 🚀 Step 5: Deploy!

1. Click **"Create Static Site"** button at the bottom
2. Render will:
   - Clone your repository
   - Navigate to `client` directory
   - Run `npm install`
   - Run `npm run build`
   - Serve files from `dist` directory
3. Wait 3-5 minutes for deployment to complete

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Build Logs
- Click on your service
- Go to **"Logs"** tab
- Look for:
  ```
  ✓ built in 15s
  Build successful
  ```

### 6.2 Test Your Site
1. Click on the URL provided by Render (e.g., `https://hisi-studio-frontend.onrender.com`)
2. Verify:
   - ✅ Site loads correctly
   - ✅ Images and styles load
   - ✅ Navigation works
   - ✅ Can browse products
   - ✅ API calls work (check browser console)

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Build Failed - "command not found: npm"

**Error:**
```
/bin/sh: npm: command not found
```

**Solution:**
1. Add `NODE_VERSION=20` to environment variables
2. Or create `.node-version` file with `20`
3. Trigger manual deploy

---

### Issue 2: Build Failed - "Cannot find module"

**Error:**
```
Error: Cannot find module 'react' or '@vitejs/plugin-react'
```

**Solution:**
- Build command should be: `npm install && npm run build`
- NOT just `npm run build`
- This ensures dependencies are installed first

---

### Issue 3: Blank Page / White Screen

**Symptoms:**
- Site loads but shows blank white page
- No errors in Render logs

**Solution:**
1. Check browser console (F12) for errors
2. Common causes:
   - Wrong `VITE_API_URL` (missing `/api/v1`)
   - CORS issues (backend needs to allow your Render domain)
   - Missing environment variables

**Fix CORS on Backend:**
Add your Render domain to backend CORS configuration:
```python
# server/app/__init__.py
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://hisi-studio-frontend.onrender.com"  # Add your domain
        ]
    }
})
```

---

### Issue 4: 404 on Routes (React Router)

**Symptoms:**
- Homepage loads fine
- Direct navigation to `/products` gives 404
- Refresh on any route gives 404

**Solution:**
Create `client/public/_redirects` file with:
```
/*    /index.html   200
```

This tells Render to serve `index.html` for all routes (React Router handles routing).

**Steps:**
```bash
cd /home/chei/client-projects/Hisi-Studio/client
mkdir -p public
echo "/*    /index.html   200" > public/_redirects
git add public/_redirects
git commit -m "Add redirects for React Router"
git push origin main
```

Render will automatically redeploy.

---

### Issue 5: Environment Variables Not Working

**Symptoms:**
- `import.meta.env.VITE_API_URL` is undefined
- API calls fail

**Solution:**
1. Verify all environment variables start with `VITE_`
2. Re-deploy after adding environment variables:
   - Go to Render dashboard
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Clear browser cache and reload

---

### Issue 6: Build Succeeds but Site Shows Old Content

**Solution:**
1. Clear deploy cache:
   - Dashboard → Settings → "Clear build cache"
   - Manual Deploy
2. Hard refresh browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)

---

## 🔄 Step 7: Auto-Deploy on Push (Optional)

Render automatically deploys on every push to your main branch.

To disable auto-deploy:
1. Go to Settings
2. Toggle **"Auto-Deploy"** to OFF
3. Use **"Manual Deploy"** button instead

---

## 📊 Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain
1. Go to **Settings** → **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `hisistudio.com`)
4. Follow DNS configuration instructions

### 8.2 Update DNS Records
Add these records to your domain registrar:

**For root domain (hisistudio.com):**
```
Type: A
Name: @
Value: [IP provided by Render]
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: [your-site].onrender.com
```

### 8.3 Enable HTTPS
Render automatically provisions SSL certificates for custom domains (free via Let's Encrypt).

---

## 🎯 Complete Configuration Summary

### ✅ What You Need to Enter in Render:

```
Service Type: Static Site
Repository: Your GitHub repo
Branch: main
Root Directory: client

Build Command: npm install && npm run build
Publish Directory: dist

Environment Variables:
  VITE_API_URL=https://your-backend.onrender.com/api/v1
  VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-key
  NODE_VERSION=20
```

---

## 📝 Pre-Deployment Checklist

Before clicking "Deploy", verify:

- [ ] Root Directory is set to `client`
- [ ] Build command is `npm install && npm run build`
- [ ] Publish directory is `dist`
- [ ] `VITE_API_URL` points to your deployed backend
- [ ] `VITE_FLUTTERWAVE_PUBLIC_KEY` is set
- [ ] Backend CORS allows your Render domain
- [ ] `public/_redirects` file exists (for React Router)
- [ ] Latest code is pushed to GitHub

---

## 🚀 Post-Deployment Steps

1. **Test Payment Flow:**
   - Add product to cart
   - Proceed to checkout
   - Initialize payment
   - Verify Flutterwave page loads
   - Complete test payment

2. **Update Backend Environment:**
   ```bash
   # In your backend .env
   FRONTEND_URL=https://hisi-studio-frontend.onrender.com
   ```

3. **Update Flutterwave Dashboard:**
   - Login to https://dashboard.flutterwave.com
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-backend.onrender.com/api/v1/payments/webhook`

4. **Monitor Logs:**
   - Check Render logs for any errors
   - Monitor API calls in browser console
   - Test all critical user flows

---

## 💡 Pro Tips

1. **Free Tier Limitations:**
   - Render free tier spins down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds
   - Consider upgrading to paid plan for production

2. **Speed Up Builds:**
   - Enable build cache in Settings
   - Use `.node-version` file instead of env variable
   - Minimize dependencies

3. **Environment Variables:**
   - Use different API URLs for staging/production
   - Never commit `.env` files to GitHub
   - Use Render's environment variable manager

4. **Monitoring:**
   - Set up Render notifications (Settings → Notifications)
   - Enable deploy notifications on Slack/Discord
   - Use Render's built-in metrics

---

## 📞 Need Help?

### Common Commands for Local Testing:

```bash
# Test build locally before deploying
cd client
npm install
npm run build
npm run preview  # Preview production build

# Check for build errors
npm run build 2>&1 | tee build.log
```

### Render Support:
- Documentation: https://render.com/docs/static-sites
- Community: https://community.render.com
- Support: support@render.com

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Render build completes without errors
- ✅ Site loads at your Render URL
- ✅ All pages navigate correctly
- ✅ API calls work (check Network tab)
- ✅ Payment initialization works
- ✅ No console errors (F12)
- ✅ Mobile responsive (test on phone)

---

## 🎉 You're Done!

Your Hisi Studio frontend is now live on Render!

**Next Steps:**
1. Deploy backend to Render (or your preferred platform)
2. Configure custom domain
3. Set up monitoring/analytics
4. Test thoroughly before going live
5. Update Flutterwave to production keys

**Deployment URL:** `https://[your-service-name].onrender.com`

---

**Last Updated:** December 15, 2024
**Version:** 1.0.0
**Status:** Production Ready
