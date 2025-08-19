from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API para gestión de centro fitness"
)

@app.get("/")
async def root():
    return {"message": "Fitness Club API"}

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "fitness-api",
        "version": settings.VERSION
    }#Punto de entrada
