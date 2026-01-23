# 🚨 SECURITY NOTICE - Action Required

## Exposed Credentials Detected

The following credentials were accidentally committed to Git and **MUST BE ROTATED IMMEDIATELY**:

### 1. Render PostgreSQL Database Password
- **Status:** EXPOSED in git history
- **Action Required:**
  1. Go to Render Dashboard → Your Database
  2. Delete and recreate the database, OR
  3. Rotate the password (if Render supports it)
  4. Update the new `DATABASE_URL` in Render environment variables

### 2. Upstash Redis Credentials
- **Status:** EXPOSED in git history
- **Action Required:**
  1. Go to Upstash Dashboard: https://console.upstash.com
  2. Delete the current Redis database
  3. Create a new Redis database
  4. Update the new `REDIS_URL` in Render environment variables

### 3. Gmail App Password
- **Status:** EXPOSED in git history
- **Email:** cochewaki@gmail.com
- **Password:** dagmpiskdyztiipg (COMPROMISED)
- **Action Required:**
  1. Go to Google Account: https://myaccount.google.com/apppasswords
  2. Revoke the exposed app password
  3. Generate a new app password
  4. Update `MAIL_PASSWORD` in Render environment variables

### 4. Flask SECRET_KEY & JWT_SECRET_KEY
- **Status:** EXPOSED in git history
- **Action Required:**
  - Already regenerated new secure keys
  - Update in Render environment variables:
    - `SECRET_KEY` = (new key will be provided)
    - `JWT_SECRET_KEY` = (new key will be provided)

---

## ✅ What Has Been Fixed

1. ✅ Removed `.env` files from git tracking
2. ✅ Removed `RENDER_ENV_VARIABLES.md` from git tracking
3. ✅ Updated `.gitignore` to prevent future commits
4. ✅ Will regenerate new secret keys

---

## ⚠️ What You MUST Do NOW

### Step 1: Rotate Compromised Credentials (URGENT)

**Do these immediately:**

1. **Rotate Database Password** (Render PostgreSQL)
2. **Delete & Recreate Redis** (Upstash)
3. **Revoke & Regenerate Gmail App Password**

### Step 2: Update Render Environment Variables

After rotating credentials, update these in Render:
- `DATABASE_URL` (new PostgreSQL URL)
- `REDIS_URL` (new Upstash URL)
- `MAIL_PASSWORD` (new Gmail app password)
- `SECRET_KEY` (new value - will be provided)
- `JWT_SECRET_KEY` (new value - will be provided)

### Step 3: Clean Git History (Optional but Recommended)

The secrets are still in git history. To completely remove them:

**Option A: Use BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG
# For Ubuntu/Debian:
sudo apt-get install bfg

# Clone a fresh copy
git clone --mirror https://github.com/munyanyaguo/Hisi-Studio.git

# Remove .env files from history
bfg --delete-files .env Hisi-Studio.git
bfg --delete-files RENDER_ENV_VARIABLES.md Hisi-Studio.git

# Clean up
cd Hisi-Studio.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This rewrites history)
git push --force
```

**Option B: Start Fresh Repository (Easier)**
1. Create a new private repository on GitHub
2. Clone current repo
3. Remove .git folder
4. Initialize new git repo
5. Push to new repository
6. Update Render to use new repository

---

## 📝 Best Practices Going Forward

1. **Never commit `.env` files**
2. **Use `.env.example` templates** (without real values)
3. **Store secrets in Render Environment Variables** (not in code)
4. **Enable GitHub secret scanning** (Settings → Security)
5. **Use `git-secrets`** tool to prevent accidental commits

---

## 🆘 Need Help?

If you're unsure about any step, **DO NOT PROCEED** with deployment until credentials are rotated.

**Priority Order:**
1. Rotate Gmail app password (highest risk)
2. Delete/recreate Redis database
3. Rotate database password
4. Clean git history

---

**Created:** January 23, 2026
**Status:** URGENT - Action Required
