import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routes import warga, quiz, report

# Load environment variables
load_dotenv()

# Get environment variables
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")

app = FastAPI(
    title="CareerPath Backend API",
    description="Backend API for CareerPath Quiz Application",
    version="1.0.0",
    docs_url="/docs" if DEBUG else None,
    redoc_url="/redoc" if DEBUG else None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(warga.router)
app.include_router(quiz.router)
app.include_router(report.router)

@app.get("/")
async def root():
    return {
        "message": "CareerPath Backend API",
        "version": "1.0.0",
        "status": "running",
        "port": PORT
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Railway deployment
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=DEBUG
    )