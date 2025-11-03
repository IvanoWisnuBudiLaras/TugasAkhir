# Deployment Guide - Railway

## Langkah-langkah Deployment ke Railway

### 1. Setup Railway Account
- Daftar di https://railway.app
- Connect ke GitHub repository

### 2. Environment Variables
Copy `.env.example` ke `.env` dan isi:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
PORT=3000
NODE_ENV=production
```

### 3. Deploy Frontend Only
Karena ini adalah frontend Next.js, deploy dari folder `frontend`:

1. Di Railway dashboard, pilih "New Project"
2. Pilih "Deploy from GitHub repo"
3. Pilih repository `TugasAkhir`
4. Configure build settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run railway:build`
   - **Start Command**: `npm run start`
   - **Install Command**: `npm install --omit=optional`

### 4. Alternatif Deployment dengan Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login ke Railway
railway login

# Navigate ke folder frontend
cd frontend

# Init project
railway init

# Deploy
railway up

# Set environment variables
railway variables set NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
railway variables set NODE_ENV=production
```

### 5. Troubleshooting

#### Error LightningCSS
Jika masih error lightningcss, gunakan:
```bash
npm install --omit=optional
```

#### Build Failed
- Pastikan semua dependencies terinstall
- Gunakan Node.js version 18 atau 20
- Cek environment variables sudah benar

### 6. Post-Deployment
- Frontend akan berjalan di URL: `https://your-app.railway.app`
- Pastikan backend API juga sudah deploy dan accessible
- Update `NEXT_PUBLIC_API_URL` dengan URL backend

## File Konfigurasi
- `railway.json` - Konfigurasi build Railway
- `Procfile` - Command untuk menjalankan app
- `next.config.js` - Konfigurasi Next.js untuk Railway
- `.env.example` - Template environment variables

## Notes
- Railway menyediakan free tier dengan 500 jam/month
- Pastikan backend API sudah deploy dan CORS di-configure dengan benar
- Gunakan Railway database untuk production jika perlu