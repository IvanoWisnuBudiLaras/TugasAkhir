# SmoethieVibe - Fresh Smoothies & Healthy Food Platform

Aplikasi e-commerce UMKM untuk Cafe SmoethieVibe yang menyediakan smoothies segar, makanan sehat, dan pengalaman kuliner premium di Kudus.

**Status**: Production Ready ✅  
**Stack**: Next.js 15 + NestJS 10 + GraphQL + Prisma + PostgreSQL  
**Package Manager**: pnpm (workspace)

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi & Arsitektur](#-teknologi--arsitektur)
- [Setup & Instalasi](#-setup--instalasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Struktur Project](#-struktur-project)
- [API & GraphQL](#-api--graphql)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)

---

## 🎯 Fitur Utama

### Frontend (Next.js 15)
- ✅ **SSR/SSG** - Server-side rendering untuk SEO optimal
- ✅ **Image Optimization** - next/image dengan remote CDN support
- ✅ **GraphQL Integration** - Apollo Client untuk state management
- ✅ **Responsive Design** - Tailwind CSS + Radix UI components
- ✅ **Cart Management** - Context API untuk shopping cart
- ✅ **Authentication** - JWT + Google OAuth sign-in
- ✅ **Performance** - Code splitting, lazy loading, optimized bundling

### Backend (NestJS + GraphQL)
- ✅ **GraphQL API** - Apollo Server dengan schema auto-generation
- ✅ **REST API** - Express endpoints dengan Swagger documentation
- ✅ **Authentication** - JWT + Passport.js (JWT, Google OAuth)
- ✅ **Database** - Prisma ORM + PostgreSQL
- ✅ **Email Service** - Nodemailer untuk OTP dan notifikasi
- ✅ **File Export** - Excel export untuk data (users, products, orders)
- ✅ **Rate Limiting** - express-rate-limit untuk API protection
- ✅ **Security** - Helmet.js CSP headers, CORS, bcrypt password hashing
- ✅ **Admin Dashboard** - Stats dan analytics endpoints

---

## 🏗️ Teknologi & Arsitektur

### Frontend Stack
```
Next.js 15           - React framework with App Router
React 19 (RC)        - UI library
TypeScript            - Type safety
Tailwind CSS          - Utility-first CSS
Radix UI              - Accessible component primitives
Apollo Client         - GraphQL state management
Framer Motion         - Animations
Lucide React          - Icons
React Hook Form       - Form handling
Zod                   - Schema validation
```

### Backend Stack
```
NestJS 10            - Node.js framework (TypeScript)
GraphQL              - Query language with Apollo Server
Prisma ORM           - Database abstraction
PostgreSQL           - Relational database
Passport.js          - Authentication middleware
JWT                  - Token-based auth
Nodemailer           - Email service
ExcelJS              - Excel file generation
Helmet               - Security headers
```

### Infrastructure
```
pnpm                 - Fast package manager (workspace)
Docker               - Containerization
ESLint + Prettier    - Code quality & formatting
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                     │
│  ├─ Pages: Home, Kategori, Menu, Cart, Auth, Profile       │
│  ├─ Components: Nav, Footer, Product Cards, Forms           │
│  ├─ Context: CartContext, AuthContext (localStorage)        │
│  └─ GraphQL: Apollo Client queries/mutations                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/GraphQL
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (NestJS + GraphQL)                 │
│  ├─ Auth Module: JWT, Google OAuth, OTP verification        │
│  ├─ User Module: Profile, registration, password reset      │
│  ├─ Product Module: Catalog, categories, inventory          │
│  ├─ Order Module: Order creation, status tracking           │
│  ├─ Email Module: OTP, order notifications                  │
│  ├─ Dashboard: Admin stats and analytics                    │
│  ├─ Export: CSV/Excel generation                            │
│  └─ GraphQL Schema: Auto-generated types                    │
└────────────────────────┬────────────────────────────────────┘
                         │ Prisma ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                           │
│  ├─ Users: id, email, name, password, role, createdAt       │
│  ├─ Products: id, name, price, category, stock              │
│  ├─ Orders: id, userId, items, total, status, createdAt     │
│  ├─ OTP: email, code, expiresAt                              │
│  └─ Migrations: Managed by Prisma                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Setup & Instalasi

### Prerequisites
- **Node.js** >= 18.x
- **pnpm** >= 8.0 (install: `npm install -g pnpm`)
- **PostgreSQL** >= 12.x (local atau cloud)
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/IvanoWisnuBudiLaras/TugasAkhir.git
cd TugasAkhir/Smoethievibes
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables

#### Backend (.env di `apps/backend/.env`)
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smoethievibes_db"

# JWT
JWT_SECRET="your_jwt_secret_key_here"
JWT_EXPIRES_IN="7d"

# Google OAuth (optional, for sign-in with Google)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Email Service (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# API
API_URL="http://localhost:3001"
PORT="3001"
NODE_ENV="development"
```

#### Frontend (.env.local di `apps/frontend/.env.local`)
```bash
# GraphQL & API
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:3001/graphql"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Analytics (optional)
NEXT_PUBLIC_GA_ID="UA-XXXXXXXXX-X"
```

### 4. Setup Database
```bash
# Generate Prisma client
pnpm exec prisma generate

# Run migrations
pnpm exec prisma migrate deploy

# (Optional) Seed database with sample data
pnpm exec prisma db seed
```

---

## 🚀 Menjalankan Aplikasi

### Development Mode (Terminal terpisah untuk setiap app)

#### Terminal 1: Backend
```bash
cd apps/backend
pnpm dev
# Server berjalan di http://localhost:3001
# GraphQL Playground: http://localhost:3001/graphql
# REST API Docs: http://localhost:3001/api
```

#### Terminal 2: Frontend
```bash
cd apps/frontend
pnpm dev
# Server berjalan di http://localhost:3000
```

### Production Build

#### Backend
```bash
cd apps/backend
pnpm build
pnpm start
```

#### Frontend
```bash
cd apps/frontend
pnpm build
pnpm start
```

### Docker Compose (Recommended)
```bash
# Production setup
docker-compose -f docker-compose.prod.yml up -d

# Development setup
docker-compose up -d
```

---

## 🔧 Konfigurasi Environment

### Database Connection String Format
```
postgresql://[user][:password]@[hostname][:5432]/[database]
```

**Contoh untuk production:**
```
DATABASE_URL="postgresql://smoethievibes:secure_password@db.example.com:5432/smoethievibes_prod"
```

### Google OAuth Setup
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau gunakan yang existing
3. Enable "Google+ API"
4. Buat OAuth 2.0 credentials (Web application)
5. Set Authorized Redirect URIs:
   - Development: `http://localhost:3001/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`
6. Copy `Client ID` dan `Client Secret` ke `.env`

### Email Service (Gmail)
1. Enable 2-Factor Authentication di Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Gunakan App Password di `.env` untuk `SMTP_PASS`

---

## 📁 Struktur Project

```
Smoethievibes/
├── apps/
│   ├── backend/                    # NestJS + GraphQL API
│   │   ├── src/
│   │   │   ├── app.module.ts       # Root module
│   │   │   ├── main.ts             # Bootstrap
│   │   │   ├── config/             # Environment config
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # Authentication
│   │   │   │   ├── user/           # User management
│   │   │   │   ├── product/        # Product catalog
│   │   │   │   ├── order/          # Order processing
│   │   │   │   ├── email/          # Email service
│   │   │   │   ├── dashboard/      # Admin analytics
│   │   │   │   └── ...
│   │   │   ├── prisma/             # Database module
│   │   │   └── common/             # Shared utilities
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── migrations/         # Migration history
│   │   ├── package.json
│   │   └── ...
│   │
│   └── frontend/                   # Next.js React app
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx       # Root layout (server)
│       │   │   ├── page.tsx         # Home page
│       │   │   ├── Auth/            # Authentication pages
│       │   │   ├── Kategori/        # Product category
│       │   │   ├── Menu/            # Menu listing
│       │   │   ├── Cart/            # Shopping cart
│       │   │   ├── order/           # Order pages
│       │   │   └── ...
│       │   ├── components/
│       │   │   ├── Providers.tsx    # Client providers (Apollo, Cart)
│       │   │   ├── Nav.tsx          # Navigation
│       │   │   ├── footer.tsx       # Footer
│       │   │   └── ...
│       │   ├── lib/
│       │   │   └── apollo-client.ts # GraphQL client config
│       │   ├── styles/
│       │   │   └── globals.css      # Global styles
│       │   └── ...
│       ├── public/
│       │   ├── Landing/             # Images
│       │   └── ...
│       ├── package.json
│       └── ...
│
├── pnpm-workspace.yaml             # Workspace config
├── pnpm-lock.yaml                  # Lock file
├── package.json                    # Root package
├── docker-compose.yml              # Dev environment
├── docker-compose.prod.yml         # Prod environment
└── README.md                        # This file
```

---

## 🔌 API & GraphQL

### REST Endpoints

#### Authentication
```bash
POST /auth/register          # Register new user
POST /auth/login             # Login with email/password
POST /auth/send-otp          # Send OTP via email
POST /auth/verify-otp        # Verify OTP code
POST /auth/login-with-otp    # Login with OTP
POST /auth/logout            # Logout
GET  /auth/google            # Initiate Google OAuth
GET  /auth/google/callback   # Google OAuth callback
GET  /auth/me                # Get current user
PATCH /auth/complete-profile # Complete user profile
PATCH /auth/update-profile   # Update user profile
```

#### Users
```bash
GET  /users                  # List all users (admin)
GET  /users/:id              # Get user by ID
POST /users                  # Create user (admin)
PUT  /users/:id              # Update user (admin)
DELETE /users/:id            # Delete user (admin)
```

#### Products
```bash
GET  /products               # List products (with pagination)
GET  /products/:id           # Get product by ID
GET  /products/category/:categoryId  # Products by category
POST /products               # Create product (admin)
PUT  /products/:id           # Update product (admin)
DELETE /products/:id         # Delete product (admin)
```

#### Orders
```bash
GET  /orders                 # List orders (admin)
GET  /orders/my-orders       # Get current user's orders
POST /orders                 # Create order
GET  /orders/:id             # Get order details
PUT  /orders/:id             # Update order status (admin)
DELETE /orders/:id           # Cancel order
```

#### Data Export
```bash
GET  /export/users           # Export users as Excel
GET  /export/products        # Export products as Excel
GET  /export/orders          # Export orders as Excel
```

#### Dashboard
```bash
GET  /dashboard/stats        # Admin dashboard stats
```

### GraphQL Playground

Akses di: `http://localhost:3001/graphql` (development)

#### Example Queries

```graphql
# Login & Get Token
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      name
    }
  }
}

# Get Products
query GetProducts($skip: Int, $take: Int) {
  products(skip: $skip, take: $take) {
    id
    name
    price
    category
    stock
  }
}

# Create Order
mutation CreateOrder($items: [OrderItemInput!]!, $total: Float!) {
  createOrder(items: $items, total: $total) {
    id
    userId
    items {
      productId
      quantity
      price
    }
    total
    status
    createdAt
  }
}
```

---

## 🚢 Deployment

### Option 1: Vercel (Frontend) + Railway/Fly.io (Backend)

#### Frontend to Vercel
```bash
# Ensure you have Vercel CLI
npm i -g vercel

# Deploy frontend
cd apps/frontend
vercel --prod
```

#### Backend to Railway.app
```bash
# Create Railway project and connect Git
# Set environment variables in Railway dashboard
# Auto-deploy on push to main branch
```

### Option 2: Docker + Nginx (Self-hosted)

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Variables for Production

Backend:
```
NODE_ENV=production
DATABASE_URL=postgresql://...     # Production DB
JWT_SECRET=<use strong random>
GOOGLE_CLIENT_ID=<from console>
GOOGLE_CLIENT_SECRET=<from console>
```

Frontend:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.yourdomain.com/graphql
```

---

## 🐛 Troubleshooting

### GraphQL Playground tidak bisa load (CSP errors di browser)

**Penyebab**: Content Security Policy headers terlalu strict.

**Solusi**: 
- Development: CSP sudah relaxed di `apps/backend/src/main.ts`
- Production: Whitelist specific CDN hosts atau serve Playground locally

```typescript
// Development: CSP allows CDN + inline scripts
scriptSrc: ["'self'", "'unsafe-inline'", 'https:']

// Production: Strict CSP (recommended)
scriptSrc: ["'self'"]
```

### Database Connection Refused

**Penyebab**: PostgreSQL tidak running atau `DATABASE_URL` salah.

**Solusi**:
```bash
# Check PostgreSQL status
psql -U postgres -h localhost

# Verify DATABASE_URL format
# Format: postgresql://user:password@host:5432/database
```

### Google OAuth Callback Loop

**Penyebab**: Redirect URI tidak sesuai di Google Console.

**Solusi**:
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Go to: APIs > Credentials > OAuth 2.0 Client IDs
3. Update "Authorized redirect URIs" to match:
   - Dev: `http://localhost:3001/auth/google/callback`
   - Prod: `https://yourdomain.com/auth/google/callback`

### pnpm install fails

**Solusi**:
```bash
# Clear pnpm cache
pnpm store prune

# Clean install
rm pnpm-lock.yaml
pnpm install
```

### Port 3000 atau 3001 sudah digunakan

**Solusi**:
```bash
# Frontend: ubah port di package.json
"dev": "next dev -p 3002"

# Backend: set di .env
PORT=3002
```

---

## 📊 Performance Tips

### Frontend
- ✅ Use `next/image` untuk semua images
- ✅ Enable Static Generation untuk static pages
- ✅ Implement lazy loading untuk components
- ✅ Monitor bundle size: `npm run build`
- ✅ Use Lighthouse untuk audit

### Backend
- ✅ Add database indexes untuk frequent queries
- ✅ Implement caching (Redis optional)
- ✅ Use connection pooling
- ✅ Monitor GraphQL query complexity
- ✅ Enable gzip compression (Helmet)

---

## 🤝 Kontribusi

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes dengan Indonesian comments (@fitur, @keamanan, @performa)
3. Run tests & linting: `pnpm lint`
4. Commit dengan deskripsi yang jelas
5. Push dan buat Pull Request

### Code Standards
- Use TypeScript untuk type safety
- Follow ESLint & Prettier rules
- Add Indonesian documentation tags:
  - `@fitur` - Feature implementation
  - `@keamanan` - Security-related code
  - `@performa` - Performance optimization
  - `@komponen` - Component documentation
  - `@seo` - SEO-related implementations
  - `@ui` - UI/UX improvements

---

## 📞 Support & Contact

**Project Owner**: Ivano Wisnu Budi Laras  
**Repository**: https://github.com/IvanoWisnuBudiLaras/TugasAkhir

---

## 📄 License

Proprietary - SmoethieVibe UMKM 2025

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Midtrans, Stripe)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] SMS notifications (Twilio)
- [ ] Inventory management system
- [ ] Multi-branch support
- [ ] API rate limiting & monitoring

---

**Last Updated**: December 4, 2025  
**Status**: Production Ready ✅
