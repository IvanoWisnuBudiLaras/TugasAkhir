# Struktur Proyek Smoethievibes

## Deskripsi Umum
File ini berisi penjelasan lengkap tentang struktur folder dan file dalam proyek Smoethievibes, aplikasi web yang dibangun dengan arsitektur full-stack menggunakan Next.js untuk frontend dan NestJS untuk backend.

## Root Directory Structure

### File Konfigurasi Utama
- **package.json**: File manifest proyek yang berisi metadata, dependencies, dan scripts untuk menjalankan aplikasi
- **pnpm-lock.yaml**: File lock dependencies yang menjamin konsistensi versi package antar environment
- **pnpm-workspace.yaml**: Konfigurasi workspace untuk monorepo yang mengelola multiple package
- **tsconfig.base.json**: Konfigurasi TypeScript dasar yang digunakan oleh seluruh proyek
- **.gitignore**: Menentukan file dan folder yang diabaikan oleh Git version control
- **.prettierrc**: Konfigurasi Prettier untuk formatting kode yang konsisten
- **.eslintrc.js**: Konfigurasi ESLint untuk linting dan menjaga kualitas kode

### File Environment
- **.env**: File environment untuk development (tidak di-track oleh Git)
- **.env.example**: Template environment yang menunjukkan variabel yang dibutuhkan
- **.env.production**: Konfigurasi environment untuk production deployment

### File Deployment & Infrastruktur
- **docker-compose.yml**: Konfigurasi Docker untuk development environment
- **docker-compose.prod.yml**: Konfigurasi Docker untuk production environment
- **nginx.conf**: Konfigurasi reverse proxy server untuk routing dan load balancing
- **DEPLOYMENT.md**: Dokumentasi prosedur deployment aplikasi

## Folder Structure

### /apps/backend/
Backend API server yang dibangun dengan NestJS framework.

**Kegunaan**: Menyediakan REST API dan GraphQL endpoint untuk operasi CRUD, autentikasi, dan business logic.

**File Penting**:
- **package.json**: Dependencies dan scripts backend
- **tsconfig.json**: Konfigurasi TypeScript untuk backend
- **jest.config.js**: Konfigurasi testing framework
- **Dockerfile**: Image definition untuk containerisasi backend
- **prisma/**: Database schema dan migration files
- **src/**: Source code aplikasi backend
- **dist/**: Compiled JavaScript output
- **test/**: File-file unit dan integration test

### /apps/frontend/
Frontend web application yang dibangun dengan Next.js dan React.

**Kegunaan**: Menyediakan user interface untuk interaksi dengan aplikasi, rendering halaman web, dan client-side logic.

**File Penting**:
- **package.json**: Dependencies dan scripts frontend
- **next.config.mjs**: Konfigurasi Next.js framework
- **tsconfig.json**: Konfigurasi TypeScript untuk frontend
- **tailwind.config.js**: Konfigurasi Tailwind CSS untuk styling
- **postcss.config.js**: Konfigurasi PostCSS untuk CSS processing
- **Dockerfile**: Image definition untuk containerisasi frontend
- **src/**: Source code aplikasi frontend
- **public/**: Static assets (images, fonts, icons)
- **.next/**: Build output dan cache (auto-generated)

### /node_modules/
Folder yang berisi semua dependencies yang di-install melalui package manager.

**Kegunaan**: Menyimpan library dan package eksternal yang digunakan oleh proyek.

**Catatan**: Folder ini di-generate otomatis dan tidak perlu di-track oleh Git.

### /Progress/
Folder untuk tracking progress development oleh tim.

**Kegunaan**: Dokumentasi perkembangan kerja setiap anggota tim.

**Sub-folder**:
- **Ayu/**: Progress dan catatan kerja anggota tim Ayu
- **Ivano/**: Progress dan catatan kerja anggota tim Ivano
- **Jumaila/**: Progress dan catatan kerja anggota tim Jumaila
- **Zaki/**: Progress dan catatan kerja anggota tim Zaki

## Best Practices
1. Jangan mengubah file di folder node_modules secara manual
2. Gunakan environment variables untuk konfigurasi yang sensitif
3. Pastikan untuk menjalankan migration database sebelum menjalankan aplikasi
4. Gunakan Prettier dan ESLint untuk menjaga konsistensi kode
5. Test kode secara berkala menggunakan Jest
6. Commit perubahan ke Git secara reguler dengan pesan yang deskriptif