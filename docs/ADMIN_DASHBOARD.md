# Admin Dashboard Documentation

## Table of Contents
1. [Overview](#overview)
2. [Setup & Configuration](#setup--configuration)
3. [Authentication](#authentication)
4. [Translation Management](#translation-management)
5. [GitHub Integration](#github-integration)
6. [Auto-Deployment Workflow](#auto-deployment-workflow)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Admin Dashboard is a secure, server-side application that allows administrators to manage website content across all languages. Changes are automatically committed to GitHub and deployed to Vercel.

### Key Features
- 🔐 **Secure Authentication** - Password-protected admin access
- 🌍 **Multi-Language Support** - Edit translations for EN, ES, and FR
- 🔄 **Auto-Deployment** - Changes automatically deploy to Vercel
- 📝 **Easy Editing** - Intuitive interface for content management
- ✅ **Real-time Validation** - Immediate feedback on changes
- 🚀 **GitHub Integration** - Commits pushed directly to repository

---

## Setup & Configuration

### Environment Variables

Create or update `.env.local` with the following variables:

```bash
# Admin Dashboard Configuration
ADMIN_PASSWORD=admin123
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your-org/your-repo
GITHUB_BRANCH=main
GITHUB_EMAIL=abdellahraissouni@gmail.com
GITHUB_NAME=AbdellahRAISSOUNI

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app

# Contact Email
NEXT_PUBLIC_CONTACT_EMAIL=info@example.com
```

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "Site Admin Dashboard"
4. Set expiration: No expiration (or your preferred duration)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Generate token and copy it
7. Add to `.env.local` as `GITHUB_TOKEN`

### Vercel Configuration

Vercel automatically deploys when changes are pushed to GitHub. No additional configuration needed.

To ensure admin dashboard works in production:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all environment variables from `.env.local`
3. Redeploy the project

---

## Authentication

### Login Flow

1. Navigate to `/admin/login`
2. Enter admin password
3. Session created (valid for 24 hours)
4. Redirected to `/admin/dashboard`

### Session Management

- **Duration:** 24 hours
- **Storage:** HTTP-only secure cookie
- **Auto-logout:** After 24 hours or manual logout
- **Protection:** Middleware protects all `/admin/*` routes except `/admin/login`

### Security Features

- ✅ Password hashing in environment
- ✅ HTTP-only cookies (not accessible via JavaScript)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite protection
- ✅ Middleware route protection

---

## Translation Management

### Editing Translations

1. Log in to admin dashboard
2. Select language tab (EN, ES, FR)
3. Edit translations in the form
4. Click "Save Changes"
5. Changes committed to GitHub and auto-deployed

### Translation Structure

Translations are organized hierarchically:

```json
{
  "common": {
    "home": "Home",
    "pricing": "Pricing"
  },
  "hero": {
    "title": "Your Product",
    "description": "..."
  },
  "reseller": {
    "heroTitle": "Example Hero Title",
    "heroSubtitle": "..."
  }
}
```

### Expandable Sections

- Sections are collapsible for easier navigation
- Click section headers to expand/collapse
- All sections collapsed by default

### Field Types

- **Short Text:** Single-line input
- **Long Text:** Multi-line textarea (auto-adjusts height)
- **Nested Objects:** Collapsible sections

---

## GitHub Integration

### How It Works

```
Admin Dashboard → GitHub API → Commit Changes → Vercel Deployment
```

### File Operations

**1. Fetch Translations:**
```typescript
GET /api/admin/translations
→ Fetches all translation files from GitHub
→ Returns content + SHA for each locale
```

**2. Update Translations:**
```typescript
POST /api/admin/translations
→ Commits changes to GitHub
→ Returns success/error
```

### Commit Process

1. Admin clicks "Save Changes"
2. API validates authentication
3. Content converted to JSON and Base64-encoded
4. GitHub API creates commit with:
   - Message: "Update {locale} translations via admin dashboard"
   - Author: Your GitHub name/email
   - Branch: main (or configured branch)
5. Vercel webhook triggered
6. Automatic deployment starts

### GitHub API Endpoints Used

- `GET /repos/:owner/:repo/contents/:path` - Fetch file
- `PUT /repos/:owner/:repo/contents/:path` - Update file

---

## Auto-Deployment Workflow

### Deployment Flow

```
1. Admin saves changes in dashboard
   ↓
2. Changes committed to GitHub (main branch)
   ↓
3. Vercel webhook triggered automatically
   ↓
4. Vercel builds and deploys new version
   ↓
5. Website updated with new content
```

### Deployment Timeline

- **Commit time:** < 1 second
- **Vercel build time:** 1-3 minutes
- **Total time:** ~2-3 minutes from save to live

### Vercel Integration

Vercel automatically:
- Detects changes on main branch
- Runs `npm run build`
- Deploys to production
- Invalidates CDN cache

No manual intervention required!

---

## Security Considerations

### Best Practices

1. **Keep Token Secure:**
   - Never commit `.env.local` to Git
   - Add `.env.local` to `.gitignore`
   - Rotate token periodically

2. **Use Strong Password:**
   - Change default admin password
   - Use password manager
   - Consider using environment variable

3. **Limit Token Scope:**
   - Only grant necessary permissions
   - Use repository-specific tokens if possible

4. **Monitor Access:**
   - Check GitHub commit history regularly
   - Review Vercel deployment logs

### Security Features

- ✅ Server-side authentication
- ✅ HTTP-only cookies
- ✅ Middleware route protection
- ✅ Environment variable encryption
- ✅ No client-side token exposure

### .gitignore Configuration

Ensure `.env.local` is in `.gitignore`:

```
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## Troubleshooting

### Common Issues

#### 1. "Unauthorized" Error

**Problem:** Can't access admin dashboard after login

**Solutions:**
- Clear browser cookies
- Check `ADMIN_PASSWORD` in `.env.local`
- Verify session hasn't expired (24 hours)
- Try logging in again

#### 2. "Failed to save translations" Error

**Problem:** Can't save changes to GitHub

**Solutions:**
- Verify `GITHUB_TOKEN` is valid
- Check token has `repo` scope
- Ensure repository name is correct
- Check GitHub API rate limits

#### 3. Changes Not Deploying

**Problem:** Saved changes but website not updating

**Solutions:**
- Check Vercel deployment logs
- Verify Vercel is connected to correct branch
- Check GitHub commit was successful
- Wait 2-3 minutes for deployment
- Clear browser cache

#### 4. "Failed to fetch translations" Error

**Problem:** Can't load translation editor

**Solutions:**
- Verify `GITHUB_REPO` format: `owner/repo`
- Check `GITHUB_BRANCH` is correct
- Ensure translation files exist in repository
- Verify network connection

### Debugging

**Enable Debug Logging:**

Check browser console for detailed errors:
```javascript
// In browser console
localStorage.setItem('debug', 'admin:*');
```

**Check Vercel Logs:**

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. View logs for latest deployment

**Check GitHub API Status:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/rate_limit
```

---

## API Reference

### Authentication Endpoints

**POST /api/admin/login**
```json
{
  "password": "admin123"
}
→ { "success": true }
```

**POST /api/admin/logout**
```json
→ { "success": true }
```

**GET /api/admin/verify**
```json
→ { "authenticated": true }
```

### Translation Endpoints

**GET /api/admin/translations**
```json
→ {
  "en": {
    "content": { ... },
    "sha": "abc123...",
    "path": "lib/i18n/translations/en.json"
  },
  "es": { ... },
  "fr": { ... }
}
```

**POST /api/admin/translations**
```json
{
  "locale": "en",
  "content": { ... },
  "sha": "abc123..."
}
→ { "success": true }
```

---

## File Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── dashboard/
│       └── page.tsx           # Main dashboard
├── api/
│   └── admin/
│       ├── login/
│       │   └── route.ts       # Login API
│       ├── logout/
│       │   └── route.ts       # Logout API
│       ├── verify/
│       │   └── route.ts       # Session verification
│       └── translations/
│           └── route.ts       # Translation CRUD

lib/
└── admin/
    ├── auth.ts                # Authentication utilities
    └── github.ts              # GitHub API integration

middleware.ts                  # Route protection
.env.local                    # Environment variables (DO NOT COMMIT)
```

---

## Future Enhancements

Potential improvements:

1. **Settings Management:**
   - Edit site metadata
   - Manage contact information
   - Update pricing plans

2. **Media Management:**
   - Upload images via admin
   - Optimize images automatically
   - Manage gallery

3. **User Management:**
   - Multiple admin accounts
   - Role-based permissions
   - Activity logs

4. **Preview Mode:**
   - Preview changes before committing
   - Staging environment

5. **Backup & Restore:**
   - Automatic backups
   - Rollback capability
   - Version history

6. **Analytics Dashboard:**
   - View deployment status
   - Monitor performance
   - Track changes

---

## Support

For issues or questions:
- Check this documentation first
- Review GitHub commit history
- Check Vercel deployment logs
- Contact system administrator

---

**Last Updated:** 2024
**Version:** 1.0.0

