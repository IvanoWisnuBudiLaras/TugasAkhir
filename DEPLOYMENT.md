# Deployment Guide - EcoQuiz Application

## Overview
This guide covers deploying the EcoQuiz application to Render (backend) and Vercel (frontend).

## Backend Deployment (Render)

### Prerequisites
- Render account (https://render.com)
- GitHub repository with your backend code

### Setup Steps

1. **Connect GitHub Repository**
   - Login to Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your backend folder (`backend`)

2. **Configure Service**
   - **Name**: ecoquiz-backend (or your preferred name)
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   - Go to "Environment" tab
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Format: `postgresql://username:password@host:port/database`
   - Add `PYTHON_VERSION` = `3.11.0`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Deploys on every push to main branch

5. **Verify Deployment**
   - Check logs in Render dashboard
   - Test API endpoints using provided Render URL
   - Example: `https://your-app.onrender.com/quiz/questions/comprehensive`

### Render Configuration Files
- `requirements.txt` - Python dependencies
- `render.yaml` - Render service configuration

## Frontend - Vercel

### Langkah-langkah Deployment:

1. **Setup Vercel Account**
   - Daftar di [vercel.com](https://vercel.com)
   - Connect dengan GitHub account

2. **Deploy Frontend**
   - Klik "New Project"
   - Pilih repository frontend Anda
   - Vercel akan otomatis mendeteksi `next.config.mjs` dan `package.json`
   - Build Command: `npm run build`
   - Klik "Deploy"

3. **Environment Variables (Optional)**
   - Setelah deploy, masuk ke project dashboard
   - Klik "Settings" > "Environment Variables"
   - Tambahkan jika diperlukan

4. **Update API URL di Admin Panel**
   - Buka frontend yang sudah di-deploy
   - Masuk ke halaman admin (misal: `https://your-frontend.vercel.app/admin`)
   - Update API URL dengan URL backend dari Render (misal: `https://ecoquiz-backend.onrender.com`)
   - Klik "Simpan"

## File Konfigurasi yang dibuat:

### Backend
- `render.yaml` - Render service configuration
- `requirements.txt` - Dependencies Python

### Frontend  
- `vercel.json` - Konfigurasi build dan deployment Vercel
- `next.config.mjs` - Konfigurasi Next.js
- `package.json` - Dependencies dan scripts

## Troubleshooting

### Backend Issues (Render)
1. **Build Failed**: Cek `requirements.txt` dan pastikan semua dependencies benar
2. **Database Connection**: Pastikan `DATABASE_URL` environment variable benar
3. **Port Issues**: Render otomatis assign port via `$PORT` environment variable
4. **Logs**: Cek Render dashboard → Logs tab
5. **Python Version**: Pastikan `PYTHON_VERSION` di-set ke 3.11.0 di environment variables
6. **Health Check**: Render akan melakukan health check otomatis - pastikan aplikasi bisa start

### Frontend Issues (Vercel)
1. **Build Failed**: Cek `package.json` dependencies
2. **API Connection**: Pastikan API URL di admin sudah di-update dengan URL Render
3. **Environment Variables**: Cek `vercel.json` configuration
4. **Dependencies**: Pastikan semua dependencies ter-install dengan `npm install`

## Cost Estimation

### Render (Backend + Database)
- Starter plan: $0-7/month (tergantung usage)
- PostgreSQL database included

### Vercel (Frontend)
- Hobby plan: FREE untuk personal use
- Pro plan: $20/month (opsional)

Total estimasi: **$0-7/month** untuk starter setup