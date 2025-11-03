# CareerPath - Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account: https://railway.app
- Railway CLI installed
- Git repository initialized

### Backend Deployment (Railway)

1. **Login ke Railway**
   ```bash
   railway login
   ```

2. **Initialize Railway project**
   ```bash
   cd backend
   railway init --name "careerpath-backend"
   ```

3. **Add PostgreSQL database**
   ```bash
   railway add --service --database postgres
   ```

4. **Deploy backend**
   ```bash
   railway up --detach
   ```

5. **Get backend URL**
   ```bash
   railway status
   ```

6. **Update frontend environment**
   Copy the backend URL and update `frontend/.env.production`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

### Environment Variables

#### Backend (Railway)
- `DATABASE_URL`: PostgreSQL connection string (auto-generated)
- `PORT`: Port number (auto-assigned by Railway)
- `NODE_ENV`: Set to "production"

#### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Your Railway backend URL
- `NEXT_PUBLIC_APP_NAME`: CareerPath
- `NEXT_PUBLIC_APP_VERSION`: 1.0.0

### Quick Deployment
Run the deployment script:
```bash
chmod +x deploy-railway.sh
./deploy-railway.sh
```

### Manual Deployment Steps

1. **Backend Setup**
   - Railway automatically detects Python app
   - Uses `requirements.txt` for dependencies
   - Uses `Procfile` for startup command
   - PostgreSQL database auto-provisioned

2. **Frontend Setup**
   - Vercel auto-detects Next.js app
   - Uses `package.json` for build settings
   - Environment variables configured in Vercel dashboard

### Post-Deployment

1. **Test backend health**
   ```bash
   curl https://your-backend-url.up.railway.app/health
   ```

2. **Test API endpoints**
   ```bash
   curl https://your-backend-url.up.railway.app/api/warga
   ```

3. **Access frontend**
   Visit your Vercel deployment URL

### Troubleshooting

- **Database connection**: Check DATABASE_URL in Railway dashboard
- **CORS issues**: Ensure backend allows frontend domain
- **Build failures**: Check build logs in Railway/Vercel dashboard
- **Environment variables**: Verify all required variables are set

### Support
For issues:
- Railway documentation: https://docs.railway.app
- Vercel documentation: https://vercel.com/docs
- Project issues: Create GitHub issue