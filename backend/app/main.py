# app/main.py
import os
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    @app.route("/")
    def root():
        return {"message": "Fitness Club API - Python Flask"}
    
    @app.route("/api/v1/health")
    def health_check():
        return {
            "status": "healthy",
            "service": "fitness-api-python"
        }
    
    return app

# Crear la app
app = create_app()

# Ejecutar solo si se llama directamente
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
