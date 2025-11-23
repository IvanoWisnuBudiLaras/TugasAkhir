# Smoethievibes Backend

Backend API untuk aplikasi Smoethievibes - Smoothie & Juice Shop Management System.

## Fitur Utama

- 🔐 **Authentication & Authorization** - JWT-based authentication dengan role-based access control
- 📊 **User Management** - CRUD operations untuk users dengan berbagai roles (Admin, Customer, Staff, Manager)
- 🥤 **Product Management** - CRUD operations untuk produk dengan kategori dan inventory
- 📦 **Order Management** - Sistem order lengkap dengan status tracking
- 📈 **Analytics** - Dashboard analytics untuk sales dan inventory
- 🎯 **GraphQL & REST API** - Dual API support untuk flexibility
- 📱 **Mobile Ready** - Responsive design untuk mobile apps
- 🔒 **Security** - Rate limiting, CORS, helmet security headers

## Teknologi

- **Framework**: NestJS
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: JWT dengan Passport
- **API**: GraphQL (Apollo) & REST (Swagger)
- **Language**: TypeScript
- **Validation**: Class Validator & Class Transformer

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm atau yarn

## Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd smoethievibes/apps/backend
```

2. Install dependencies
```bash
npm install
```

3. Setup database
```bash
# Copy environment file
cp .env.example .env

# Update DATABASE_URL di .env dengan kredensial PostgreSQL Anda

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

4. Start development server
```bash
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smoethievibes?schema=public"

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development

# Port
PORT=3001
```

## Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build production
npm run start           # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## API Documentation

- **REST API**: http://localhost:3001/api (Swagger)
- **GraphQL Playground**: http://localhost:3001/graphql

## Struktur Folder

```
src/
├── common/           # Shared utilities, decorators, pipes, guards
├── config/          # Configuration files
├── modules/         # Feature modules (auth, user, product, order)
├── shared/          # Base classes untuk services dan controllers
├── middleware/      # Custom middleware
├── prisma/          # Prisma service dan setup
└── main.ts          # Application entry point
```

## Best Practices

- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Validation**: Input validation dengan class-validator
- ✅ **Error Handling**: Consistent error response format
- ✅ **Security**: JWT authentication, rate limiting, CORS
- ✅ **Documentation**: Auto-generated API documentation
- ✅ **Testing**: Unit dan integration tests
- ✅ **Code Quality**: ESLint dan Prettier configuration

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.