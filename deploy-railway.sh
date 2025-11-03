#!/bin/bash

# Railway Deployment Script for CareerPath Backend
echo "Starting Railway deployment..."

# Install Railway CLI if not already installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    curl -fsSL https://railway.app/install.sh | sh
fi

# Login to Railway
echo "Please login to Railway..."
railway login

# Initialize Railway project if not already done
if [ ! -f "railway.json" ]; then
    echo "Initializing Railway project..."
    railway init --name "careerpath-backend" --template "https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Frailway%2Ftemplates%2Ftree%2Fmain%2Fexamples%2Ffastapi"
fi

# Add PostgreSQL database
echo "Adding PostgreSQL database..."
railway add --service --database postgres

# Deploy the backend
echo "Deploying backend to Railway..."
railway up --detach

# Get the deployment URL
BACKEND_URL=$(railway status | grep "URL:" | awk '{print $2}')
echo "Backend deployed to: $BACKEND_URL"

# Update frontend environment variable
echo "Updating frontend environment variable..."
cd frontend
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.production

# Deploy frontend to Vercel
echo "Deploying frontend to Vercel..."
vercel --prod

echo "Deployment completed!"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: Check Vercel dashboard"