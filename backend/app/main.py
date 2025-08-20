# app/main.py
import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.api.v1 import auth, users, classes, instructors, bookings

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS - Permite solicitudes desde tu frontend Netlify
    CORS(app, origins=[
        "https://tu-frontend-netlify-url.netlify.app",  # Reemplaza con tu URL real
        "http://localhost:3000",  # Para desarrollo local
        "http://localhost:5173"   # Para Vite dev server
    ])

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
    
    # Registrar blueprints
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(users.users_bp)
    app.register_blueprint(classes.classes_bp)
    app.register_blueprint(instructors.instructors_bp)
    app.register_blueprint(bookings.bookings_bp)
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
