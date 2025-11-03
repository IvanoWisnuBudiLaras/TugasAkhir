@echo off
echo CareerPath Railway Deployment Script
echo ======================================
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Railway CLI...
    powershell -Command "iwr -useb https://railway.app/install.ps1 | iex"
)

echo.
echo Step 1: Deploy Backend to Railway
echo --------------------------------
cd /d "%~dp0backend"

REM Initialize Railway project if not exists
if not exist "railway.json" (
    echo Initializing Railway backend project...
    railway init --name "careerpath-backend"
)

REM Add PostgreSQL database
echo Adding PostgreSQL database...
railway add --service --database postgres

REM Deploy backend
echo Deploying backend to Railway...
railway up --detach

REM Get backend URL
for /f "tokens=2" %%i in ('railway status ^| findstr "URL:"') do set BACKEND_URL=%%i
echo Backend deployed to: %BACKEND_URL%

echo.
echo Step 2: Update Frontend Configuration
echo ------------------------------------
cd /d "%~dp0frontend"

REM Update frontend environment
echo NEXT_PUBLIC_API_URL=%BACKEND_URL% > .env.production
echo NEXT_PUBLIC_APP_NAME=CareerPath >> .env.production
echo NEXT_PUBLIC_APP_VERSION=1.0.0 >> .env.production

echo.
echo Step 3: Deploy Frontend to Vercel
echo -----------------------------------
echo Please deploy frontend manually to Vercel:
echo 1. Go to https://vercel.com
echo 2. Import your frontend folder
echo 3. Set environment variables in Vercel dashboard
echo 4. Deploy

echo.
echo Deployment Summary:
echo ===================
echo Backend URL: %BACKEND_URL%
echo Frontend: Deploy to Vercel manually
echo.
echo Note: Update the BACKEND_URL in frontend/.env.production after deployment!

pause