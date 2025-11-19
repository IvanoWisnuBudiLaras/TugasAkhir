# Deployment Guide - Smoethievibes

## Overview
Dokumentasi ini menjelaskan prosedur deployment aplikasi Smoethievibes ke berbagai environment (development, staging, production) menggunakan Docker dan Docker Compose.

## Prerequisites
- Docker dan Docker Compose terinstall di server
- Domain name yang sudah dikonfigurasi (untuk production)
- SSL Certificate (untuk production HTTPS)
- Environment variables yang sudah disiapkan
- Database server yang dapat diakses

## Environment Configuration

### Development Environment
**File**: `docker-compose.yml`
**Kegunaan**: Konfigurasi untuk development dengan hot reload dan debugging

**Services**:
- **backend**: NestJS development server dengan volume mounting
- **frontend**: Next.js development server dengan hot reload
- **postgres**: PostgreSQL database untuk development
- **redis**: Redis cache server (optional)
- **nginx**: Reverse proxy untuk routing

### Production Environment
**File**: `docker-compose.prod.yml`
**Kegunaan**: Konfigurasi untuk production dengan optimized builds

**Services**:
- **backend**: Optimized NestJS production build
- **frontend**: Optimized Next.js production build
- **postgres**: Production PostgreSQL dengan backup
- **redis**: Production Redis dengan persistence
- **nginx**: Production nginx dengan SSL dan security headers

## Deployment Steps

### 1. Development Deployment
```bash
# Clone repository
git clone <repository-url>
cd Smoethievibes

# Copy environment file
cp .env.example .env

# Edit environment variables sesuai kebutuhan
nano .env

# Jalankan development environment
docker-compose up -d

# Cek status container
docker-compose ps

# Lihat logs jika diperlukan
docker-compose logs -f
```

### 2. Production Deployment
```bash
# Clone repository
git clone <repository-url>
cd Smoethievibes

# Copy production environment file
cp .env.production .env

# Edit production environment variables
nano .env

# Build dan jalankan production environment
docker-compose -f docker-compose.prod.yml up -d --build

# Cek status container
docker-compose -f docker-compose.prod.yml ps

# Setup SSL certificate (jika belum ada)
# Gunakan Let's Encrypt atau certificate authority lainnya

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Docker Configuration Details

### Backend Dockerfile
**Kegunaan**: Build image untuk NestJS backend

**Build Process**:
1. Gunakan Node.js Alpine image sebagai base
2. Install dependencies dengan npm ci
3. Copy source code
4. Jalankan TypeScript compilation
5. Jalankan aplikasi dengan node

**Multi-stage build untuk production**:
- Stage 1: Development dependencies dan build
- Stage 2: Production dependencies only
- Stage 3: Final optimized image

### Frontend Dockerfile
**Kegunaan**: Build image untuk Next.js frontend

**Build Process**:
1. Gunakan Node.js Alpine image sebagai base
2. Install dependencies dengan npm ci
3. Jalankan Next.js build
4. Gunakan standalone output untuk optimized server
5. Setup nginx untuk static file serving

## Nginx Configuration

### Development nginx.conf
**Kegunaan**: Reverse proxy untuk development environment

**Features**:
- Proxy ke backend service (port 3000)
- Proxy ke frontend service (port 3001)
- WebSocket support untuk hot reload
- CORS headers untuk development

### Production nginx.conf
**Kegunaan**: Production reverse proxy dengan SSL dan security

**Features**:
- SSL termination dengan certificate management
- HTTP to HTTPS redirect
- Security headers (HSTS, CSP, X-Frame-Options)
- Gzip compression
- Rate limiting untuk DDoS protection
- Static file caching
- Load balancing (jika multiple instances)

## Database Setup

### PostgreSQL Configuration
**Kegunaan**: Database server untuk data persistence

**Setup Steps**:
1. Jalankan PostgreSQL container
2. Create database dan user
3. Jalankan Prisma migrations
4. Setup backup strategy
5. Configure connection pooling

### Database Migration
```bash
# Jalankan migration di container backend
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Seed database (jika diperlukan)
docker-compose exec backend npm run seed
```

## SSL Certificate Setup

### Let's Encrypt dengan Certbot
```bash
# Install Certbot
docker run -it --rm --name certbot \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  certbot/certbot certonly --standalone -d yourdomain.com

# Auto-renewal setup
# Tambahkan cron job untuk renewal otomatis
```

### Manual SSL Certificate
```bash
# Copy certificate files ke server
scp certificate.crt user@server:/path/to/certs/
scp private.key user@server:/path/to/certs/

# Update nginx configuration untuk menggunakan certificate
# Restart nginx container
```

## Monitoring dan Logging

### Container Health Checks
**Kegunaan**: Monitor kesehatan container dan service

**Setup**:
- Health check endpoint di backend
- Docker health check configuration
- Alerting untuk failed health checks

### Log Management
**Kegunaan**: Centralized logging untuk debugging dan monitoring

**Configuration**:
- Docker logging driver configuration
- Log rotation untuk menghemat disk space
- Centralized logging dengan ELK stack (optional)

### Performance Monitoring
**Kegunaan**: Monitor performance dan availability

**Tools**:
- New Relic, DataDog, atau Prometheus + Grafana
- APM (Application Performance Monitoring)
- Real User Monitoring (RUM)

## Security Best Practices

### Container Security
1. Gunakan minimal base images (Alpine Linux)
2. Jangan run container sebagai root user
3. Scan images untuk vulnerabilities
4. Keep images updated
5. Use multi-stage builds untuk mengurangi image size

### Network Security
1. Gunakan internal Docker network untuk service communication
2. Expose hanya port yang dibutuhkan
3. Implement proper firewall rules
4. Gunakan VPN untuk administrative access

### Application Security
1. Implement proper authentication dan authorization
2. Gunakan HTTPS untuk semua communication
3. Sanitize user input untuk prevent injection attacks
4. Implement rate limiting dan DDoS protection
5. Regular security audits dan penetration testing

## Backup dan Disaster Recovery

### Database Backup
```bash
# Automated daily backup dengan cron
docker-compose exec postgres pg_dump -U username dbname > backup.sql

# Backup ke cloud storage (AWS S3, Google Cloud Storage)
# Implement retention policy untuk backup files
```

### Application Backup
1. Backup source code dan configuration files
2. Backup uploaded files dan assets
3. Backup environment variables dan secrets
4. Test restore procedures secara regular

## Troubleshooting

### Common Issues
1. **Container tidak bisa start**: Cek logs dan resource constraints
2. **Database connection failed**: Verify connection strings dan network
3. **SSL certificate errors**: Check certificate validity dan configuration
4. **Performance issues**: Monitor resource usage dan optimize queries

### Debug Commands
```bash
# Cek container logs
docker-compose logs -f [service-name]

# Masuk ke container untuk debugging
docker-compose exec [service-name] /bin/sh

# Cek resource usage
docker stats

# Monitor network
docker network ls
docker network inspect [network-name]
```

## Scaling Considerations

### Horizontal Scaling
1. Gunakan Docker Swarm atau Kubernetes untuk orchestration
2. Implement load balancing untuk multiple instances
3. Gunakan external database dan cache services
4. Setup CDN untuk static assets

### Vertical Scaling
1. Monitor resource usage dan upgrade server resources
2. Optimize application code dan database queries
3. Implement caching strategies
4. Use CDN untuk content delivery