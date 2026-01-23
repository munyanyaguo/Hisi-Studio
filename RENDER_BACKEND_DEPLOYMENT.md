# 🚀 Render Backend Deployment Guide - Hisi Studio

## Complete Step-by-Step Guide for Deploying Flask Backend to Render

---

## 📋 Prerequisites

✅ GitHub repository with your code pushed
✅ Render account (free tier works): https://render.com
✅ Frontend deployed at: https://hisi-studio.onrender.com

---

## 🔧 Step 1: Create PostgreSQL Database on Render

### 1.1 Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"PostgreSQL"**

### 1.2 Configure Database
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `hisi-studio-db` |
| **Database** | `hisi_studio_prod` |
| **User** | `hisi_admin` |
| **Region** | Choose closest to you (e.g., Frankfurt, Oregon) |
| **PostgreSQL Version** | 16 (latest) |
| **Plan** | Free |

### 1.3 Create Database
1. Click **"Create Database"**
2. Wait 2-3 minutes for provisioning
3. Once ready, click on your database
4. Find **"Internal Database URL"** - it will look like:
   ```
   postgresql://hisi_admin:xxxxxxxxxxxx@dpg-xxxxx-a/hisi_studio_prod
   ```
5. **COPY THIS URL** - you'll need it in Step 3

---

## 🔴 Step 2: Create Redis Instance on Render

### 2.1 Create Redis
1. Click **"New +"** button again
2. Select **"Redis"**

### 2.2 Configure Redis
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `hisi-studio-redis` |
| **Region** | Same as your database (e.g., Frankfurt) |
| **Plan** | Free |
| **Maxmemory Policy** | `allkeys-lru` (default) |

### 2.3 Get Redis URL
1. Click **"Create Redis"**
2. Wait 1-2 minutes for provisioning
3. Once ready, click on your Redis instance
4. Find **"Internal Redis URL"** - it will look like:
   ```
   redis://red-xxxxx:6379
   ```
5. **COPY THIS URL** - you'll need it in Step 3

---

## 🌐 Step 3: Create Web Service (Backend API)

### 3.1 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"**
3. Select your **Hisi-Studio** repository
4. Click **"Connect"**

### 3.2 Basic Configuration

| Field | Value |
|-------|-------|
| **Name** | `hisi-studio-backend` |
| **Region** | Same as database and Redis |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Python 3` |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn --bind 0.0.0.0:$PORT run:app` |

⚠️ **CRITICAL**:
- Set **Root Directory** to `server`
- Build command is `./build.sh` (your existing build script)
- Start command uses `gunicorn` for production

---

## 🔐 Step 4: Configure Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add ALL of these variables (copy from the table below):

### Core Configuration

| Key | Value | Notes |
|-----|-------|-------|
| `FLASK_APP` | `run.py` | Entry point |
| `FLASK_ENV` | `production` | Production mode |
| `DEBUG` | `False` | Disable debug mode |
| `TESTING` | `False` | Not in test mode |

### Security Keys (ALREADY GENERATED FOR YOU)

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `i6k4w6IHQnE0KRH6EAAwgbbX0eBce8fP1TaXJUWNvLLQ62in52-9BcUGZROkT-P7vZuegE7PAPL7VLU8E0GgSQ` |
| `JWT_SECRET_KEY` | `RXt0xA6oDJnPI5cYgqCs3q5U-u2CrIl4FuBcc5B8eh03IkHvCOBqX4JzGJiiD1uzMLaJs4FNuuE-ruPfU5gx2Q` |

### JWT Configuration

| Key | Value |
|-----|-------|
| `JWT_ACCESS_TOKEN_EXPIRES` | `900` |
| `JWT_REFRESH_TOKEN_EXPIRES` | `604800` |

### Database & Redis (Use the URLs you copied in Steps 1 & 2)

| Key | Value | Example |
|-----|-------|---------|
| `DATABASE_URL` | Your PostgreSQL Internal URL | `postgresql://hisi_admin:xxx@dpg-xxx/hisi_studio_prod` |
| `REDIS_URL` | Your Redis Internal URL | `redis://red-xxx:6379` |

### CORS & Frontend

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://hisi-studio.onrender.com` |

### Email Configuration (Already set up)

| Key | Value |
|-----|-------|
| `MAIL_SERVER` | `smtp.gmail.com` |
| `MAIL_PORT` | `587` |
| `MAIL_USE_TLS` | `True` |
| `MAIL_USERNAME` | `cochewaki@gmail.com` |
| `MAIL_PASSWORD` | `dagmpiskdyztiipg` |
| `MAIL_DEFAULT_SENDER` | `noreply@hisistudio.com` |
| `ADMIN_EMAIL` | `ccwakiama@gmail.com` |

### Payment Gateway (Placeholders for now)

| Key | Value | Notes |
|-----|-------|-------|
| `FLUTTERWAVE_PUBLIC_KEY` | `FLWPUBK_TEST-PLACEHOLDER` | Replace when ready |
| `FLUTTERWAVE_SECRET_KEY` | `FLWSECK_TEST-PLACEHOLDER` | Replace when ready |
| `FLUTTERWAVE_ENCRYPTION_KEY` | `FLWSECK_TEST-PLACEHOLDER` | Replace when ready |
| `FLUTTERWAVE_SECRET_HASH` | `PLACEHOLDER` | Replace when ready |

### Python Configuration

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.12.0` |

---

## 🚀 Step 5: Deploy!

1. Double-check all environment variables are set
2. Click **"Create Web Service"** at the bottom
3. Render will:
   - Clone your repository
   - Navigate to `server` directory
   - Run `./build.sh` (installs dependencies, runs migrations)
   - Start with `gunicorn`
4. Wait 5-10 minutes for first deployment

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Build Logs
1. Click on your web service
2. Go to **"Logs"** tab
3. Look for:
   ```
   Running migrations
   Operations to perform:
     Apply all migrations: ...
   Running migrations: OK
   Starting gunicorn...
   Listening at: http://0.0.0.0:10000
   ```

### 6.2 Test API Endpoints
Once deployed, your backend URL will be:
```
https://hisi-studio-backend.onrender.com
```

Test these endpoints in your browser or Postman:

1. **Health Check:**
   ```
   GET https://hisi-studio-backend.onrender.com/api/v1/health
   ```
   Should return: `{"status": "healthy"}`

2. **Get Products:**
   ```
   GET https://hisi-studio-backend.onrender.com/api/v1/products
   ```
   Should return product list

3. **Get Categories:**
   ```
   GET https://hisi-studio-backend.onrender.com/api/v1/categories
   ```
   Should return category list

---

## 🔄 Step 7: Update Frontend to Use New Backend

### 7.1 Update Frontend Environment Variable
1. Go to your **frontend service** on Render
2. Go to **Environment** tab
3. Find or add `VITE_API_URL`
4. Update to: `https://hisi-studio-backend.onrender.com/api/v1`
5. Click **"Save Changes"**
6. Render will automatically redeploy frontend

### 7.2 Verify Integration
1. Visit: https://hisi-studio.onrender.com
2. Open browser console (F12)
3. Navigate to products page
4. Check Network tab - API calls should go to your new backend
5. Verify products load correctly

---

## 🐛 Troubleshooting

### Issue 1: Build Failed - "Permission denied: ./build.sh"

**Error:**
```
/bin/sh: ./build.sh: Permission denied
```

**Solution:**
Run locally to make build.sh executable:
```bash
cd /home/chei/client-projects/Hisi-Studio/server
chmod +x build.sh
git add build.sh
git commit -m "Make build.sh executable"
git push
```

Then trigger manual deploy on Render.

---

### Issue 2: Database Migration Failed

**Error:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**
1. Verify `DATABASE_URL` is correct (copied from Render PostgreSQL)
2. Make sure you used the **Internal Database URL**, not External
3. Check that database and web service are in the same region
4. Redeploy after fixing

---

### Issue 3: Redis Connection Failed

**Error:**
```
redis.exceptions.ConnectionError: Error connecting to Redis
```

**Solution:**
1. Verify `REDIS_URL` is correct
2. Use **Internal Redis URL**, not External
3. Ensure Redis instance is running (check Render dashboard)
4. Same region for Redis and web service

---

### Issue 4: CORS Errors from Frontend

**Error in browser console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify `FRONTEND_URL` is set to `https://hisi-studio.onrender.com`
2. Check backend CORS configuration in `server/app/__init__.py`
3. Make sure frontend is using correct backend URL

---

### Issue 5: Gunicorn Not Found

**Error:**
```
bash: gunicorn: command not found
```

**Solution:**
Add gunicorn to requirements.txt:
```bash
cd /home/chei/client-projects/Hisi-Studio/server
echo "gunicorn==21.2.0" >> requirements.txt
git add requirements.txt
git commit -m "Add gunicorn to requirements"
git push
```

---

## 📊 Step 8: Create Admin User

After successful deployment, create your admin user:

### 8.1 Use Render Shell
1. Go to your web service on Render
2. Click **"Shell"** tab (top right)
3. Wait for shell to connect
4. Run:
   ```bash
   python create_admin.py
   ```
5. Follow prompts to create admin account

### 8.2 Test Admin Login
1. Go to: https://hisi-studio.onrender.com/admin
2. Login with admin credentials
3. Verify you can access admin dashboard

---

## 🎯 Complete Environment Variables Summary

Here's a quick copy-paste reference of ALL variables needed:

```bash
# Core
FLASK_APP=run.py
FLASK_ENV=production
DEBUG=False
TESTING=False

# Security
SECRET_KEY=i6k4w6IHQnE0KRH6EAAwgbbX0eBce8fP1TaXJUWNvLLQ62in52-9BcUGZROkT-P7vZuegE7PAPL7VLU8E0GgSQ
JWT_SECRET_KEY=RXt0xA6oDJnPI5cYgqCs3q5U-u2CrIl4FuBcc5B8eh03IkHvCOBqX4JzGJiiD1uzMLaJs4FNuuE-ruPfU5gx2Q
JWT_ACCESS_TOKEN_EXPIRES=900
JWT_REFRESH_TOKEN_EXPIRES=604800

# Database & Redis (REPLACE WITH YOUR URLS)
DATABASE_URL=postgresql://hisi_admin:xxx@dpg-xxx/hisi_studio_prod
REDIS_URL=redis://red-xxx:6379

# Frontend
FRONTEND_URL=https://hisi-studio.onrender.com

# Email
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=cochewaki@gmail.com
MAIL_PASSWORD=dagmpiskdyztiipg
MAIL_DEFAULT_SENDER=noreply@hisistudio.com
ADMIN_EMAIL=ccwakiama@gmail.com

# Payment (Placeholders)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-PLACEHOLDER
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-PLACEHOLDER
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-PLACEHOLDER
FLUTTERWAVE_SECRET_HASH=PLACEHOLDER

# Python
PYTHON_VERSION=3.12.0
```

---

## 📝 Pre-Deployment Checklist

Before clicking "Create Web Service":

- [ ] PostgreSQL database created and running
- [ ] Redis instance created and running
- [ ] Root Directory set to `server`
- [ ] Build command is `./build.sh`
- [ ] Start command is `gunicorn --bind 0.0.0.0:$PORT run:app`
- [ ] All environment variables added (especially DATABASE_URL and REDIS_URL)
- [ ] `build.sh` is executable (`chmod +x`)
- [ ] Latest code pushed to GitHub
- [ ] gunicorn in requirements.txt

---

## 🚀 Post-Deployment Steps

1. **Create Admin User** (see Step 8)
2. **Test All API Endpoints**
3. **Update Frontend Environment Variables**
4. **Test Full User Flow** (browse products, add to cart, etc.)
5. **Set Up Monitoring** (Render provides basic metrics)
6. **Add Payment Gateway** (when ready - Paystack, Pesapal, or M-Pesa)

---

## 💡 Pro Tips

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- Database has 90-day retention for free tier
- Consider paid plan ($7/mo) for production to avoid cold starts

### Keep Services in Same Region
- PostgreSQL, Redis, and Web Service should all be in the same region
- This reduces latency and avoids cross-region data transfer fees

### Monitor Logs
- Set up log alerts in Render
- Check logs regularly for errors
- Monitor database connections

### Database Backups
- Render free tier doesn't include automatic backups
- Paid plan includes daily backups
- Consider manual backups for critical data

---

## 📞 Next Steps

### When You're Ready to Add Payments

**Option 1: Paystack (Recommended for Kenya)**
1. Sign up: https://paystack.com
2. Get API keys
3. Update environment variables
4. Update backend payment integration

**Option 2: Pesapal (East Africa)**
1. Sign up: https://www.pesapal.com
2. Get credentials
3. Integrate Pesapal SDK

**Option 3: M-Pesa (Kenya)**
1. Apply for Safaricom M-Pesa API
2. Get credentials (Consumer Key, Consumer Secret)
3. Implement STK Push integration

---

## ✅ Success Criteria

Your backend deployment is successful when:

- ✅ Build completes without errors
- ✅ Migrations run successfully
- ✅ Gunicorn starts and listens on port
- ✅ Health check endpoint responds
- ✅ API endpoints return data
- ✅ Frontend connects to backend successfully
- ✅ No errors in logs
- ✅ Admin user created and can login
- ✅ Database queries work
- ✅ Redis caching works

---

## 🎉 You're Done!

Your Hisi Studio backend is now live on Render!

**Backend URL:** `https://hisi-studio-backend.onrender.com`
**Frontend URL:** `https://hisi-studio.onrender.com`

---

**Last Updated:** January 23, 2026
**Version:** 1.0.0
**Status:** Production Ready (Payments Pending)
