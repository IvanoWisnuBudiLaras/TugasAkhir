# Backend Structure - Smoethievibes

## 📁 Folder Structure

```
src/
├── 📁 auth/                    # Authentication module
│   ├── jwt.strategy.ts        # JWT authentication strategy
│   └── auth.module.ts         # Auth module configuration
├── 📁 common/                 # Shared utilities and common code
│   ├── 📁 decorators/         # Custom decorators
│   │   ├── current-user.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── api-response.decorator.ts
│   ├── 📁 dto/               # Common DTOs
│   │   ├── api-response.dto.ts
│   │   └── pagination.dto.ts
│   ├── 📁 enums/              # Shared enums
│   │   ├── user-role.enum.ts
│   │   ├── order-status.enum.ts
│   │   └── product-category.enum.ts
│   ├── 📁 exceptions/         # Custom exceptions
│   │   ├── custom.exception.ts
│   │   └── validation.exception.ts
│   ├── 📁 guards/             # Auth guards
│   │   ├── jwt-auth.guard.ts
│   │   ├── gql-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── 📁 interceptors/       # Request/response interceptors
│   │   ├── logging.interceptor.ts
│   │   ├── transform.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── 📁 pipes/              # Validation pipes
│   │   ├── validation.pipe.ts
│   │   └── parse-uuid.pipe.ts
│   └── 📁 utils/              # Utility functions
│       ├── hash.util.ts
│       ├── validation.util.ts
│       ├── date.util.ts
│       └── string.util.ts
├── 📁 config/                 # Configuration files
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── swagger.config.ts
│   └── graphql.config.ts
├── 📁 middleware/             # Custom middleware
│   ├── logger.middleware.ts
│   └── rate-limiter.middleware.ts
├── 📁 modules/                # Feature modules
│   ├── 📁 auth/              # Authentication
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.resolver.ts
│   │   └── auth.module.ts
│   ├── 📁 user/               # User management
│   │   ├── dto/
│   │   ├── user.model.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.resolver.ts
│   │   └── user.module.ts
│   ├── 📁 product/            # Product management
│   │   ├── dto/
│   │   ├── product.model.ts
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.resolver.ts
│   │   └── product.module.ts
│   └── 📁 order/              # Order management
│       ├── dto/
│       ├── order.model.ts
│       ├── order-item.model.ts
│       ├── order.controller.ts
│       ├── order.service.ts
│       ├── order.resolver.ts
│       ├── order-subscription.service.ts
│       └── order.module.ts
├── 📁 prisma/                   # Prisma configuration
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── 📁 shared/                   # Shared base classes
│   ├── base.service.ts
│   ├── base.controller.ts
│   └── base.resolver.ts
├── app.module.ts                # Root module
├── app.controller.ts            # Root controller
└── main.ts                      # Application entry point
```

## 🏗️ Architecture Overview

### 1. **Modular Architecture**
- Setiap fitur dipisahkan dalam module yang independen
- Memudahkan maintenance dan scaling
- Mendukung separation of concerns

### 2. **GraphQL + REST Hybrid**
- GraphQL untuk frontend flexibility
- REST API untuk integrasi external services
- Dual interface support

### 3. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (RBAC)
- Guards untuk route protection

### 4. **Data Layer**
- Prisma ORM untuk type-safe database operations
- Repository pattern implementation
- Transaction support

### 5. **Common Utilities**
- Reusable decorators, pipes, guards
- Standardized API responses
- Error handling framework

## 🔧 Key Features

### ✅ GraphQL Implementation
- Auto-generated schema
- Subscription support untuk real-time updates
- Input validation dengan class-validator
- Error handling dengan GraphQL errors

### ✅ REST API
- Standard HTTP methods
- Pagination support
- Response transformation
- Rate limiting

### ✅ Security
- JWT authentication
- Role-based permissions
- Input sanitization
- Rate limiting
- CORS configuration

### ✅ Developer Experience
- TypeScript support
- Auto-generated documentation (Swagger)
- Environment-based configuration
- Logging dan monitoring

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma generate

# Run development server
npm run start:dev
```

## 📚 Best Practices Implemented

1. **SOLID Principles**: Single responsibility untuk setiap class
2. **DRY**: Reusable components di common folder
3. **KISS**: Simple dan readable code structure
4. **Separation of Concerns**: Clear separation antara logic layers
5. **Error Handling**: Centralized error handling dengan custom exceptions
6. **Validation**: Input validation di multiple layers
7. **Type Safety**: Full TypeScript implementation dengan Prisma

## 🔗 Integration Points

- **Frontend**: GraphQL queries/mutations/subscriptions
- **External APIs**: REST endpoints dengan proper authentication
- **Database**: Prisma ORM dengan PostgreSQL
- **File Upload**: Support untuk image uploads
- **Real-time**: GraphQL subscriptions untuk live updates