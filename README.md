# CareerPath - Aplikasi Kuis Penjurusan Karir

Aplikasi berbasis web untuk membantu pengguna menemukan jalur karir yang sesuai berdasarkan kuis penjurusan.

## 🚀 Fitur Utama

- **Kuis Penjurusan**: Sistem kuis interaktif untuk menentukan minat dan bakat
- **Rekomendasi Karir**: Hasil analisis berdasarkan jawaban kuis
- **Admin Dashboard**: Manajemen pengguna dan hasil kuis
- **Export Excel**: Export data hasil kuis ke format Excel
- **Responsive Design**: Tampilan yang optimal di semua perangkat

## 🏗️ Arsitektur

### Backend (Railway)
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Deployment**: Railway.app

### Frontend (Vercel)
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📋 Prasyarat

- Node.js 18+ untuk frontend
- Python 3.11+ untuk backend
- PostgreSQL untuk database

## 🛠️ Instalasi Lokal

### 1. Clone Repository
```bash
git clone [repository-url]
cd TugasAkhir
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables
Copy `.env.example` ke `.env` dan sesuaikan nilainya.

## 🚀 Deployment

Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk panduan deployment lengkap.

### Ringkasan Deployment
- **Backend**: Deploy ke Railway dengan PostgreSQL
- **Frontend**: Deploy ke Vercel
- **Database**: Railway PostgreSQL

## 📁 Struktur Proyek

```
TugasAkhir/
├── backend/          # FastAPI backend
│   ├── app/         # Application logic
│   ├── data/        # Quiz data JSON
│   └── requirements.txt
├── frontend/        # Next.js frontend
│   ├── src/        # Source code
│   └── public/     # Static assets
└── DEPLOYMENT_GUIDE.md
```

## 🔧 Konfigurasi

### Backend Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGINS`: Allowed CORS origins
- `PORT`: Server port (default: 8000)

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🐛 Troubleshooting

### Masalah Umum
1. **CORS Error**: Pastikan `CORS_ORIGINS` di backend sudah benar
2. **Build Error**: Cek environment variables di deployment platform
3. **Database Error**: Verifikasi connection string PostgreSQL

Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk troubleshooting lengkap.

## 📞 Support

Untuk issue dan pertanyaan:
- Check deployment logs di Railway dan Vercel
- Verifikasi environment variables
- Pastikan semua service berjalan dengan benar

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik.