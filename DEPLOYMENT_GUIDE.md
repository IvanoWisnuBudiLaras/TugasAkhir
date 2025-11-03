# Deployment Guide - CareerPath Application

## Overview
Panduan ini menjelaskan cara deploy aplikasi CareerPath dengan:
- **Backend**: Railway (FastAPI + PostgreSQL)
- **Frontend**: Vercel (Next.js)

## Prerequisites
- Akun Railway (https://railway.app)
- Akun Vercel (https://vercel.com)
- Git repository (GitHub/GitLab)

---

## Backend Deployment (Railway)

### 1. Setup Railway
1. Login ke Railway dashboard
2. Klik "New Project" → "Deploy from GitHub"
3. Pilih repository backend Anda

### 2. Environment Variables
Tambahkan environment variables di Railway dashboard:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# CORS Configuration
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000

# App Configuration
APP_NAME=CareerPath Backend
APP_VERSION=1.0.0
DEBUG=False

# Railway Environment
PORT=8000
HOST=0.0.0.0
```

### 3. Database Setup
1. Di Railway dashboard, klik "New" → "Database"
2. Pilih "PostgreSQL"
3. Copy connection string ke `DATABASE_URL`

### 4. Deploy Backend
Railway akan otomatis deploy saat push ke main branch.

**URL Backend**: `https://your-project.railway.app`

---

## Frontend Deployment (Vercel)

### 1. Setup Vercel
1. Login ke Vercel dashboard
2. Klik "New Project"
3. Import repository frontend Anda

### 2. Environment Variables
Tambahkan environment variables di Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### 3. Deploy Settings
Pastikan settings berikut:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4. Deploy Frontend
Vercel akan otomatis deploy saat push ke main branch.

**URL Frontend**: `https://your-project.vercel.app`

---

## Post-Deployment Configuration

### 1. Update CORS Backend
Update `CORS_ORIGINS` di Railway dengan URL Vercel Anda:
```
CORS_ORIGINS=https://your-project.vercel.app
```

### 2. Update Frontend API URL
Jika API URL berubah, update di Vercel dashboard.

---

## Testing

### Test Backend
```bash
curl https://your-backend.railway.app/health
```

### Test Frontend
- Buka `https://your-project.vercel.app`
- Test registrasi user baru
- Test quiz submission
- Test admin panel

---

## Troubleshooting

### Backend Issues
1. **Database Connection**: Check `DATABASE_URL`
2. **Port Issues**: Railway otomatis set `PORT`
3. **CORS Errors**: Update `CORS_ORIGINS`

### Frontend Issues
1. **API Connection**: Check `NEXT_PUBLIC_API_URL`
2. **Build Errors**: Check build logs di Vercel
3. **CSS Issues**: Disable LightningCSS di `next.config.js`

---

## Security Checklist
- [ ] Environment variables tidak ter-expose
- [ ] HTTPS enabled (otomatis di Railway/Vercel)
- [ ] CORS properly configured
- [ ] Database credentials secure
- [ ] API endpoints authenticated (jika diperlukan)

---

## Monitoring
- Railway: Built-in monitoring di dashboard
- Vercel: Analytics dan performance monitoring

---

## Support
Untuk issue teknis:
- Railway: Check deployment logs
- Vercel: Check build dan function logs
- Database: Check connection dan query performance