# Dokumentasi Proyek Smoethievibes

## Deskripsi Proyek
Smoethievibes adalah aplikasi web e-commerce modern yang dibangun dengan arsitektur full-stack menggunakan Next.js untuk frontend dan NestJS untuk backend. Proyek ini menggunakan monorepo structure dengan pnpm workspaces untuk efisiensi dependency management.

## Struktur Dokumentasi

### 1. [Struktur Proyek](01-Struktur-Proyek.md)
**Kegunaan**: Penjelasan lengkap tentang struktur folder dan file dalam proyek, termasuk kegunaan setiap file konfigurasi dan folder utama.

**Isi**:
- Root directory structure
- File konfigurasi utama (package.json, tsconfig, dll)
- Environment files
- Docker dan deployment configuration
- Folder apps/backend dan apps/frontend
- Folder Progress untuk tracking tim

### 2. [Backend Architecture](02-Backend-Architecture.md)
**Kegunaan**: Dokumentasi arsitektur backend yang dibangun dengan NestJS, termasuk struktur module dan best practices.

**Isi**:
- Technology stack dan dependencies
- Struktur folder src/ dengan penjelasan module
- Authentication dan authorization system
- Database design dengan Prisma ORM
- API documentation dengan Swagger dan GraphQL
- Testing strategy dan best practices

### 3. [Frontend Architecture](03-Frontend-Architecture.md)
**Kegunaan**: Dokumentasi arsitektur frontend yang dibangun dengan Next.js 14 dan React 18, termasuk state management dan component structure.

**Isi**:
- Next.js App Router structure
- Component organization dan reusability
- State management dengan Context API
- Data fetching strategies (SWR, Server Components)
- Performance optimization techniques
- SEO dan accessibility best practices

### 4. [Deployment Guide](04-Deployment-Guide.md)
**Kegunaan**: Step-by-step guide untuk deployment aplikasi ke berbagai environment menggunakan Docker dan Docker Compose.

**Isi**:
- Development dan production deployment
- Docker configuration dan best practices
- Nginx reverse proxy setup
- SSL certificate configuration
- Database migration dan seeding
- Monitoring dan logging setup
- Security considerations

### 5. [Development Workflow](05-Development-Workflow.md)
**Kegunaan**: Pedoman kolaborasi tim, Git workflow, code standards, dan best practices untuk development.

**Isi**:
- Git branching strategy (Git Flow)
- Commit message conventions
- Code review process
- Testing strategy (unit, integration, e2e)
- CI/CD pipeline configuration
- Debugging dan performance monitoring
- Team communication guidelines

## Quick Start

### Prerequisites
- Node.js v18+
- pnpm package manager
- Git
- Docker (optional)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd Smoethievibes

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env dengan configuration yang sesuai

# Jalankan development server
pnpm dev
```

### Development Commands
```bash
# Frontend development
pnpm --filter frontend dev

# Backend development
pnpm --filter backend dev

# Jalankan semua services
pnpm dev

# Build untuk production
pnpm build

# Jalankan tests
pnpm test
```

## Team Structure

### Anggota Tim
- **Ayu**: Frontend Developer - Fokus pada UI/UX dan user experience
- **Ivano**: Backend Developer - Fokus pada API development dan database
- **Jumaila**: Full-stack Developer - Fokus pada integration dan deployment
- **Zaki**: QA dan DevOps - Fokus pada testing dan infrastructure

### Progress Tracking
Setiap anggota tim memiliki folder di `/Progress/` untuk mendokumentasikan:
- Daily progress dan accomplishments
- Challenges dan blockers
- Learning dan insights
- Sprint retrospective notes

## Technology Stack

### Frontend
- **Framework**: Next.js 14 dengan React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: SWR dan Server Components
- **Form Handling**: React Hook Form dengan Zod validation

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: JWT dengan Passport
- **API**: REST dan GraphQL (Apollo Server)
- **Testing**: Jest dengan Supertest

### Infrastructure
- **Containerization**: Docker dan Docker Compose
- **Reverse Proxy**: Nginx
- **Package Management**: pnpm workspaces
- **Version Control**: Git dengan GitHub
- **CI/CD**: GitHub Actions

## Best Practices

### Code Quality
- Gunakan TypeScript untuk type safety
- Implement proper error handling
- Tulis unit tests untuk critical logic
- Gunakan meaningful variable dan function names
- Follow SOLID principles untuk clean code

### Performance
- Implement proper caching strategies
- Gunakan code splitting untuk large applications
- Optimize images dan static assets
- Monitor Core Web Vitals
- Implement proper database indexing

### Security
- Validasi semua user input
- Implement proper authentication dan authorization
- Gunakan HTTPS untuk semua communication
- Jangan hardcode sensitive information
- Regular security audits dan dependency updates

## Troubleshooting

### Common Issues
1. **Dependency conflicts**: Gunakan pnpm untuk better dependency resolution
2. **Database connection**: Cek environment variables dan network configuration
3. **Build failures**: Pastikan semua dependencies terinstall dan types correct
4. **Performance issues**: Gunakan proper caching dan optimization techniques

### Getting Help
- Cek dokumentasi yang relevan di folder ini
- Review troubleshooting section di setiap file dokumentasi
- Tanyakan di team communication channels
- Create issue di repository untuk bugs atau feature requests

## Contributing

### Code Contribution
1. Fork repository dan create feature branch
2. Follow Git workflow yang sudah ditentukan
3. Tulis tests untuk code baru
4. Pastikan semua tests pass
5. Submit pull request dengan proper description

### Documentation Contribution
1. Update dokumentasi jika ada perubahan significant
2. Gunakan format markdown yang consistent
3. Tambahkan examples dan code snippets jika relevant
4. Review dan update outdated documentation

## Resources

### Internal Resources
- [Backend API Documentation](apps/backend/docs)
- [Component Library Storybook](apps/frontend/storybook)
- [Database Schema](apps/backend/prisma/schema.prisma)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Catatan**: Dokumentasi ini akan terus diupdate seiring dengan perkembangan proyek. Pastikan untuk selalu merujuk ke versi terbaru dan berkontribusi dalam menjaga dokumentasi tetap up-to-date.