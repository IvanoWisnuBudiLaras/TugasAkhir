# Backend Architecture - Smoethievibes API

## Overview
Backend Smoethievibes dibangun menggunakan NestJS framework dengan TypeScript, menyediakan REST API dan GraphQL endpoint untuk mendukung operasi frontend.

## Technology Stack
- **Framework**: NestJS (Node.js framework dengan arsitektur modular)
- **Language**: TypeScript
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API**: REST dan GraphQL (Apollo Server)
- **Testing**: Jest dengan Supertest
- **Validation**: class-validator dan class-transformer

## Folder Structure & Kegunaan

### /src/main.ts
**Kegunaan**: Entry point aplikasi backend
- Menginisialisasi NestJS application
- Setup middleware global
- Konfigurasi CORS
- Menjalankan server pada port yang ditentukan

### /src/app.module.ts
**Kegunaan**: Root module aplikasi
- Mengimport dan mengkonfigurasi module-module utama
- Setup global pipes untuk validation
- Konfigurasi database connection
- Setup GraphQL dan Apollo Server

### /src/modules/
**Kegunaan**: Business logic module yang terorganisir per fitur

#### Auth Module (/src/modules/auth/)
- **auth.controller.ts**: REST endpoint untuk login, register, logout
- **auth.service.ts**: Business logic autentikasi user
- **auth.module.ts**: Dependency injection dan provider setup
- **dto/**: Data Transfer Objects untuk request validation
- **entities/**: TypeORM entities untuk auth
- **strategies/**: JWT dan Passport strategies

#### User Module (/src/modules/users/)
- **users.controller.ts**: REST endpoint untuk user management
- **users.service.ts**: Business logic user operations
- **users.module.ts**: Module configuration
- **dto/**: User data validation schemas
- **entities/**: User database schema

#### Product Module (/src/modules/products/)
- **products.controller.ts**: REST endpoint untuk product CRUD
- **products.service.ts**: Business logic product management
- **products.module.ts**: Module configuration
- **dto/**: Product data validation
- **entities/**: Product database schema

#### Order Module (/src/modules/orders/)
- **orders.controller.ts**: REST endpoint untuk order management
- **orders.service.ts**: Business logic order processing
- **orders.module.ts**: Module configuration
- **dto/**: Order data validation
- **entities/**: Order database schema

### /src/common/
**Kegunaan**: Shared utilities dan decorators yang reusable

#### /src/common/decorators/
- **roles.decorator.ts**: Custom decorator untuk role-based authorization
- **current-user.decorator.ts**: Extract current user dari request
- **api-response.decorator.ts**: Standard API response formatting

#### /src/common/guards/
- **jwt-auth.guard.ts**: JWT authentication guard
- **roles.guard.ts**: Role-based authorization guard
- **throttle.guard.ts**: Rate limiting protection

#### /src/common/interceptors/
- **logging.interceptor.ts**: Request/response logging
- **transform.interceptor.ts**: Response data transformation
- **error.interceptor.ts**: Global error handling

#### /src/common/filters/
- **http-exception.filter.ts**: Global HTTP exception handling
- **prisma-exception.filter.ts**: Database error handling

### /src/config/
**Kegunaan**: Configuration management
- **app.config.ts**: Application configuration
- **database.config.ts**: Database connection settings
- **jwt.config.ts**: JWT secret dan expiration settings
- **swagger.config.ts**: API documentation configuration

### /src/prisma/
**Kegunaan**: Database schema dan migration management
- **schema.prisma**: Database schema definition
- **migrations/**: Database migration files
- **seed.ts**: Database seeding untuk development

### /test/
**Kegunaan**: Testing utilities dan test suites
- **auth.e2e-spec.ts**: End-to-end test untuk auth flow
- **users.e2e-spec.ts**: User management testing
- **jest-e2e.json**: Jest configuration untuk e2e testing

## API Documentation
- **Swagger**: Tersedia di `/api/docs` untuk REST API documentation
- **GraphQL Playground**: Tersedia di `/graphql` untuk GraphQL exploration

## Environment Variables yang Dibutuhkan
```
DATABASE_URL=postgresql://user:password@localhost:5432/smoethievibes
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=development
```

## Development Commands
```bash
# Install dependencies
npm install

# Run database migration
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Run development server
npm run start:dev

# Run tests
npm run test
npm run test:e2e

# Build for production
npm run build
```

## Best Practices
1. Gunakan DTO untuk semua request validation
2. Implement proper error handling dengan custom exceptions
3. Gunakan dependency injection untuk testability
4. Tulis unit test untuk setiap service
5. Gunakan interceptors untuk cross-cutting concerns
6. Implement proper logging untuk debugging
7. Gunakan database transaction untuk operasi kompleks
8. Implement rate limiting untuk API protection