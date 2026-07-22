# 🎯 Admin Dashboard - Quick Start Guide

## ✅ What's Done

Your website now has an admin dashboard to edit translations and auto-deploy changes.

---

## 🚀 How to Use (3 Steps)

### Step 1: Access Admin Dashboard

**Development:**
```bash
npm run dev
```
Visit: http://localhost:3000/admin/login

**Production:**
Visit: https://your-site.vercel.app/admin/login

### Step 2: Login

- Password: `admin123`

### Step 3: Edit & Save

1. Select language (EN, ES, FR)
2. Edit any translation
3. Click "Save Changes"
4. Wait 2-3 minutes → Changes live on website!

---

## 🌐 Deploy to Vercel (Required for Production)

### Add Environment Variables to Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. **Settings → Environment Variables**
4. Add these 8 variables (copy from `.env.local`):

```
ADMIN_PASSWORD=admin123
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your-org/your-repo
GITHUB_BRANCH=main
GITHUB_EMAIL=abdellahraissouni@gmail.com
GITHUB_NAME=AbdellahRAISSOUNI
NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=info@example.com
```

5. Click "Save" for each
6. Redeploy your project

---

## 🔄 How It Works

```
Edit Translation → Save → GitHub Commit → Vercel Deploy → Live (2-3 min)
```

---

## ⚠️ Important

1. **Change Password:** Edit `ADMIN_PASSWORD` in `.env.local`
2. **Never Commit:** `.env.local` is in `.gitignore` (security)
3. **Test First:** Try editing locally before production

---

## 📚 Full Documentation

Need more details? See: `docs/ADMIN_DASHBOARD.md`

---

That's it! Access `/admin/login` and start editing. 🎉

