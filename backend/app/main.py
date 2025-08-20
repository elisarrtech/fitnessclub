# app/main.py
import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    try:
        # Intentar importación absoluta (para Railway)
        from app.api.v1.auth.routes import auth_bp
        print("Usando importación absoluta")
    except ImportError:
        try:
            # Intentar importación relativa (para desarrollo local)
            from .api.v1.auth.routes import auth_bp
            print("Usando importación relativa")
        except ImportError as e:
            print(f"Error de importación: {e}")
            # Listar contenido del directorio para debugging
            import os
            print("Contenido del directorio actual:", os.listdir('.'))
            if 'app' in os.listdir('.'):
                print("Contenido de app:", os.listdir('app'))
            raise e
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    
    @app.route("/")
    def root():
        return jsonify({"message": "Fitness Club API - Python Flask"})
    
    @app.route("/api/v1/health")
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "fitness-api-python",
            "version": "1.0.0"
        })
    
    return app

# Crear la app
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
