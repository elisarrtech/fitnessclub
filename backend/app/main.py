# app/main.py
import os
from fastapi import FastAPI

app = FastAPI(title="Fitness Club API")

@app.get("/")
async def root():
    return {"message": "Fitness Club API"}

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "fitness-api",
        "timestamp": "2025-08-19T17:00:00Z"
    }

if __name__ == "__main__":
    import uvicorn
    # Obtener puerto de variable de entorno o usar 8000 por defecto
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
