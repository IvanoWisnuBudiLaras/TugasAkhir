# Production Deployment Guide

## Prerequisites

- Server dengan Docker dan Docker Compose terinstall
- Domain name yang sudah di-point ke server
- Port 80 dan 443 terbuka di firewall
- Minimum 2GB RAM, 2 CPU cores
- 20GB disk space

## Quick Deployment

### 1. Setup Server

```powershell
# Install Docker (Windows Server)
# Download dan install Docker Desktop atau Docker Engine

# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install docker-compose-plugin
```

### 2. Clone Repository

```bash
git clone https://github.com/yourusername/SmoethieVibes.git
cd SmoethieVibes
```

### 3. Configure Environment

```powershell
# Copy production environment template
copy .env.production .env

# Edit .env dengan nilai production
notepad .env
```

**WAJIB DIISI:**
- `POSTGRES_USER` & `POSTGRES_PASSWORD`: Database credentials
- `JWT_SECRET`: Minimal 32 karakter random
- `NEXT_PUBLIC_API_URL`: URL domain Anda (https://yourdomain.com)

### 4. Deploy Application

```powershell
# Deploy dengan script
.\docker-setup.ps1 -Environment production -Deploy

# Atau manual step-by-step
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Domain & SSL Configuration

### 1. Domain Setup

Point domain ke IP server:
```
A record: yourdomain.com → YOUR_SERVER_IP
A record: www.yourdomain.com → YOUR_SERVER_IP
```

### 2. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
docker run -it --rm --name certbot \
  -p 80:80 -p 443:443 \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  certbot/certbot certonly --standalone \
  -d yourdomain.com -d www.yourdomain.com
```

### 3. Update Nginx Configuration

Edit `nginx.conf` untuk uncomment SSL section dan update paths:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. Mount SSL Certificates

Update `docker-compose.prod.yml` untuk mount SSL:

```yaml
nginx:
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/nginx/ssl:ro
```

## Monitoring & Maintenance

### Health Check

```powershell
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health endpoint
curl http://localhost/health
```

### Backup Database

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup_$DATE.sql
```

### Update Application

```powershell
# Pull latest code
git pull origin main

# Rebuild dan restart
.\docker-setup.ps1 -Environment production -Deploy
```

### Scale Application

Untuk high traffic, gunakan docker-compose override:

```yaml
# docker-compose.scale.yml
version: "3.9"
services:
  backend:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Security Checklist

- [ ] Ganti semua default passwords
- [ ] Gunakan JWT_SECRET yang kuat (32+ karakter)
- [ ] Enable firewall (ufw/iptables)
- [ ] Setup SSL certificate
- [ ] Disable root login (SSH)
- [ ] Update nginx security headers
- [ ] Regular security updates
- [ ] Database backup schedule
- [ ] Log monitoring
- [ ] Rate limiting enabled

## Troubleshooting

### Container tidak bisa start
```powershell
docker-compose -f docker-compose.prod.yml logs [service_name]
```

### Database connection failed
```powershell
# Cek database health
docker-compose -f docker-compose.prod.yml exec db pg_isready -U ${POSTGRES_USER}

# Cek network connectivity
docker network ls
docker network inspect smoethievibes_smoethievibes-network
```

### Port sudah digunakan
```powershell
# Cek port usage
netstat -ano | findstr :80
netstat -ano | findstr :443
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### Memory/CPU tinggi
```powershell
# Monitor resource usage
docker stats
```

## Performance Optimization

1. **Database**: Tambahkan indexes, optimize queries
2. **Redis**: Gunakan untuk caching frequent queries
3. **Nginx**: Enable gzip compression, browser caching
4. **Images**: Compress dan optimize semua images
5. **CDN**: Gunakan CDN untuk static assets

## Support

Untuk issues deployment, buat issue di repository atau hubungi support@smoethievibes.com