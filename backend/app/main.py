from flask import Flask
from flask_cors import CORS
from app.core.database import db
import os

def create_app():
    app = Flask(__name__)
    
    # Configuración de CORS
    CORS(app, origins=os.getenv("CORS_ORIGINS", "*").split(","))
    
    # Rutas de salud
    @app.route("/")
    def root():
        return {"message": "Fitness Club API - Python Flask"}
    
    @app.route("/api/v1/health")
    def health_check():
        try:
            # Verificar conexión a MongoDB
            db.command('ping')
            return {
                "status": "healthy",
                "service": "fitness-api-python",
                "database": "connected"
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "fitness-api-python",
                "database": f"error: {str(e)}"
            }, 500
    
    # Registrar blueprints
    from app.api.v1.auth import auth_bp
    from app.api.v1.users import users_bp
    from app.api.v1.classes import classes_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')
    app.register_blueprint(classes_bp, url_prefix='/api/v1/classes')
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
