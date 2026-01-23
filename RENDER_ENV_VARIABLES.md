# 🔐 Render Environment Variables - READY TO DEPLOY

## Complete Environment Variables for Render Backend Deployment

Copy and paste these into Render's Environment Variables section when deploying your backend web service.

---

## ✅ All Environment Variables (Copy-Paste Ready)

### Core Flask Configuration
```
FLASK_APP=run.py
FLASK_ENV=production
DEBUG=False
TESTING=False
PYTHON_VERSION=3.12.0
```

### Security Keys (Already Generated)
```
SECRET_KEY=i6k4w6IHQnE0KRH6EAAwgbbX0eBce8fP1TaXJUWNvLLQ62in52-9BcUGZROkT-P7vZuegE7PAPL7VLU8E0GgSQ
JWT_SECRET_KEY=RXt0xA6oDJnPI5cYgqCs3q5U-u2CrIl4FuBcc5B8eh03IkHvCOBqX4JzGJiiD1uzMLaJs4FNuuE-ruPfU5gx2Q
JWT_ACCESS_TOKEN_EXPIRES=900
JWT_REFRESH_TOKEN_EXPIRES=604800
```

### Database (Render PostgreSQL - CONFIGURED)
```
DATABASE_URL=postgresql://hisi_studio_db_user:czOAosXWB5VI0yYrLBZCl8IvAJmlOXMG@dpg-d5pj3vf5r7bs73d2s2a0-a/hisi_studio_db
```

### Redis Cache (Upstash - CONFIGURED)
```
REDIS_URL=rediss://default:ATj3AAIncDI0MGU2NmYwODc1OTE0MmUwYjE5ZWI4MjA5OTEzYmQ4Y3AyMTQ1ODM@divine-dassie-14583.upstash.io:6379
```

### Frontend URL (CONFIGURED)
```
FRONTEND_URL=https://hisi-studio.onrender.com
```

### Email Configuration (Gmail SMTP - CONFIGURED)
```
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=cochewaki@gmail.com
MAIL_PASSWORD=dagmpiskdyztiipg
MAIL_DEFAULT_SENDER=noreply@hisistudio.com
ADMIN_EMAIL=ccwakiama@gmail.com
```

### Payment Gateway (Placeholders - Can be updated later)
```
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-PLACEHOLDER
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-PLACEHOLDER
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-PLACEHOLDER
FLUTTERWAVE_SECRET_HASH=PLACEHOLDER
```

---

## 📋 How to Add These to Render

### Option 1: Add One by One (Recommended for first time)
1. Go to your Render web service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Copy each **Key** and **Value** from above
5. Click **"Save Changes"**

### Option 2: Bulk Add via .env File Upload
1. Render also allows uploading a `.env` file
2. Go to Environment tab
3. Look for "Add from .env" option
4. Upload your `server/.env` file

---

## 🚀 Render Build & Start Commands

When creating your web service on Render, use these settings:

### Build Settings
```
Name: hisi-studio-backend
Region: Frankfurt (or closest to you)
Branch: main
Root Directory: server

Build Command: ./build.sh
Start Command: gunicorn --bind 0.0.0.0:$PORT run:app

Instance Type: Free
```

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [x] PostgreSQL database created on Render
- [x] Database URL added to environment variables
- [x] Upstash Redis account created
- [x] Redis URL added to environment variables
- [x] All secret keys generated and added
- [x] Frontend URL configured
- [x] Email configuration added
- [x] Root Directory set to `server`
- [x] Build command is `./build.sh`
- [x] Start command is `gunicorn --bind 0.0.0.0:$PORT run:app`
- [ ] Latest code pushed to GitHub
- [ ] `build.sh` is executable (should already be)

---

## 🔄 After Deployment

Once your backend is deployed:

### 1. Get Your Backend URL
Your backend will be available at:
```
https://hisi-studio-backend.onrender.com
```
(Replace with your actual service name)

### 2. Update Frontend Environment Variable
Go to your **frontend** service on Render:
1. Environment tab
2. Update `VITE_API_URL` to:
   ```
   https://hisi-studio-backend.onrender.com/api/v1
   ```
3. Save changes (frontend will auto-redeploy)

### 3. Test API Endpoints
Test these URLs in your browser:

**Health Check:**
```
https://hisi-studio-backend.onrender.com/health
```
Should return: `{"status": "healthy", "message": "Hisi Studio API is running"}`

**Get Products:**
```
https://hisi-studio-backend.onrender.com/api/v1/products
```

**Get Categories:**
```
https://hisi-studio-backend.onrender.com/api/v1/products/categories
```

### 4. Create Admin User
Once deployed, use Render's Shell to create admin:
1. Go to your web service
2. Click **"Shell"** tab
3. Run:
   ```bash
   python create_admin.py
   ```
4. Follow prompts to create admin account

### 5. Verify Redis Caching
Check logs to see cache is working:
- Look for "Redis cache connected successfully"
- Watch for "Cache HIT" and "Cache MISS" messages
- If Redis connection fails, app will still work (caching disabled)

---

## 🎯 What's Configured

### ✅ Database & Caching
- **PostgreSQL**: Production database on Render
- **Redis**: Upstash for caching (10,000 requests/day free)
- **Caching**: Products, categories, pages, blog posts

### ✅ Security
- **Production secret keys**: Cryptographically secure
- **JWT authentication**: Access & refresh tokens
- **CORS**: Configured for your frontend domain

### ✅ Email
- **SMTP**: Gmail configured for contact forms
- **Notifications**: Contact form submissions sent to admin

### ✅ Features Ready
- Product catalog with caching
- Blog/CMS with caching
- User authentication
- Admin dashboard
- Contact forms
- Newsletter subscriptions

### ⏳ To Be Added Later
- Payment gateway (Paystack/Pesapal/M-Pesa)
- Image hosting (Cloudinary - optional)
- SendGrid (optional - for better email delivery)

---

## 🐛 Common Issues & Solutions

### Issue: Build fails with "Permission denied: ./build.sh"
**Solution:**
```bash
cd /home/chei/client-projects/Hisi-Studio/server
chmod +x build.sh
git add build.sh
git commit -m "Make build.sh executable"
git push
```

### Issue: Database migration fails
**Solution:**
- Verify DATABASE_URL is correct
- Check Render PostgreSQL is running
- Ensure you used **Internal Database URL**

### Issue: Redis connection error in logs
**Solution:**
- Verify REDIS_URL starts with `rediss://` (double 's' for TLS)
- Check Upstash Redis is active
- App will still work, just without caching

### Issue: CORS errors from frontend
**Solution:**
- Verify FRONTEND_URL is `https://hisi-studio.onrender.com`
- Make sure frontend uses correct backend URL
- Check Render logs for CORS messages

---

## 📊 Monitoring After Deployment

### Check These in Render Dashboard:

1. **Logs Tab**
   - Should see successful migrations
   - "Redis cache connected successfully"
   - "Listening at: http://0.0.0.0:10000"
   - No error messages

2. **Metrics Tab**
   - Response times
   - Memory usage
   - CPU usage

3. **Events Tab**
   - Deployment history
   - Any failures or warnings

---

## 💡 Performance Tips

### Free Tier Considerations
- **Cold starts**: First request after 15 min inactivity takes 30-60 seconds
- **Monthly hours**: 750 hours/month on free tier
- **Database**: 90-day retention

### Speed Optimization
- **Redis caching**: Already implemented - speeds up repeated requests
- **CDN**: Consider Cloudinary for images
- **Upgrade**: Consider paid plan ($7/mo) to eliminate cold starts

---

## 🎉 Ready to Deploy!

Everything is configured and ready. Follow these steps:

1. **Push latest code to GitHub**
   ```bash
   cd /home/chei/client-projects/Hisi-Studio
   git add .
   git commit -m "Add Redis caching and production configuration"
   git push origin main
   ```

2. **Create Web Service on Render**
   - New + → Web Service
   - Connect GitHub repo
   - Use settings from "Render Build & Start Commands" section above
   - Add all environment variables from the top of this document
   - Click "Create Web Service"

3. **Wait for deployment** (5-10 minutes)

4. **Test endpoints** (see "After Deployment" section)

5. **Update frontend** with backend URL

6. **Create admin user** via Shell

7. **You're live!** 🚀

---

**Questions or issues?** Check the logs first, then refer to the troubleshooting section above.

**Last Updated:** January 23, 2026
**Status:** ✅ Ready for Production Deployment
