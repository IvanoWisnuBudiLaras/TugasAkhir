# Gmail Service Account Setup Guide

## Overview
Aplikasi ini mendukung dua metode pengiriman email:
1. **SMTP Gmail** (tradisional) - menggunakan username dan password
2. **Gmail Service Account** (recommended) - menggunakan Google Service Account

## Cara Setup Gmail Service Account

### 1. Buat Google Service Account
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Enable **Gmail API** di menu APIs & Services > Library
4. Pergi ke **APIs & Services > Credentials**
5. Klik **Create Credentials > Service Account**
6. Isi detail service account:
   - Name: `smoethievibes-email`
   - Description: `Service account untuk mengirim OTP email`
7. Download service account key JSON

### 2. Konfigurasi Backend

#### Opsi A: Menggunakan Environment Variable (Recommended)
1. Buka file service account JSON yang sudah di-download
2. Copy seluruh isi file JSON tersebut
3. Paste ke dalam `.env` sebagai satu baris:

```env
GMAIL_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"your-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYourPrivateKey\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project-id.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"}
```

#### Opsi B: Menggunakan File Service Account
1. Copy file service account JSON ke folder backend
2. Rename menjadi `service-account-key.json`
3. Atau set path di `.env`:

```env
GMAIL_KEY_FILE_PATH=path/to/your/service-account-key.json
```

### 3. Konfigurasi Email Sender
Tambahkan di `.env`:

```env
GMAIL_SENDER_EMAIL=your-email@gmail.com
```

### 4. Test Pengiriman Email

#### Test via API
```bash
# Kirim OTP ke email Anda
curl -X POST http://localhost:3001/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com", "action": "LOGIN"}'
```

#### Test via Frontend
1. Buka http://localhost:3000/auth
2. Masukkan email Anda
3. Klik "Send OTP"

### 5. Troubleshooting

#### Email tidak terkirim?
- Cek console backend untuk pesan error
- Pastikan service account JSON valid
- Pastikan Gmail API sudah di-enable
- Cek file `.env` sudah benar formatnya

#### Ingin menggunakan SMTP biasa?
Comment baris-baris Gmail di `.env` dan gunakan:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Keamanan
- Jangan commit file service account ke repository
- Jangan share service account key
- Rotate service account key secara berkala
- Gunakan environment variable untuk production

## Referensi
- [Google Cloud Service Account Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [Gmail API Documentation](https://developers.google.com/gmail/api/guides)