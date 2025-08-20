import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.api.v1.auth.routes import auth_bp
# Importa otros blueprints cuando los tengas

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuración
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    
    # Registrar blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    # app.register_blueprint(dashboard_bp, url_prefix='/api/v1/dashboard')
    
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

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
