# ⚡ Render Deployment - Quick Reference Card

## 🎯 Copy & Paste Configuration for Render

### Step 1: Push Code to GitHub
```bash
cd /home/chei/client-projects/Hisi-Studio
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

### Step 2: Render Dashboard Settings

**Service Type:** Static Site

**Repository:** Connect your GitHub repo (Hisi-Studio)

**Build Settings:**
```
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

---

### Step 3: Environment Variables

Click "Advanced" → "Add Environment Variable"

**Required:**
```
VITE_API_URL=https://your-backend-url.com/api/v1
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-key-here
NODE_VERSION=20
```

**Optional:**
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

### Step 4: Deploy

Click **"Create Static Site"**

Wait 3-5 minutes for build to complete.

---

## ✅ Quick Verification

After deployment:
1. Visit your Render URL
2. Open browser console (F12)
3. Check for errors
4. Test navigation
5. Try adding product to cart
6. Test payment flow

---

## 🐛 If Build Fails

**Check these settings:**
- ✅ Root Directory = `client`
- ✅ Build Command = `npm install && npm run build`
- ✅ Publish Directory = `dist`
- ✅ NODE_VERSION = `20` in environment variables

**Common fixes:**
1. Clear build cache (Settings → Clear cache)
2. Trigger manual deploy
3. Check logs for specific error

---

## 📱 Backend CORS Update

After deploying frontend, update backend CORS:

```python
# server/app/__init__.py
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://your-frontend.onrender.com"  # Add this
        ]
    }
})
```

Push backend changes and redeploy backend.

---

## 🎯 That's It!

Your site will be live at: `https://[your-service-name].onrender.com`

For detailed troubleshooting, see: [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)
