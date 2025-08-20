# app/main.py
import os
from flask import Flask, jsonify
from flask_cors import CORS

ALLOWED_ORIGINS = [
    "https://fitnessclubfront.netlify.app",  # sin slash final
    "http://localhost:3000",
    "http://localhost:5173",
]

def create_app():
    app = Flask(__name__)

    # CORS: aplica a /api/* y habilita preflight correcto
    CORS(
        app,
        resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
        supports_credentials=True
    )

    @app.get("/")
    def root():
        return jsonify({"message": "Fitness Club API - Python Flask"})

    @app.get("/api/v1/health")
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "fitness-api-python",
            "version": "1.0.0"
        }), 200

    # Importa y registra blueprints (USAR IMPORTS RELATIVOS)
    try:
        # Nota: si tus archivos usan `bp` en lugar de `auth_bp`, importa como alias:
        # from .api.v1.auth import bp as auth_bp
        from .api.v1.auth import auth_bp
        from .api.v1.users import users_bp
        from .api.v1.classes import classes_bp
        from .api.v1.instructors import instructors_bp
        from .api.v1.bookings import bookings_bp

        app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
        app.register_blueprint(users_bp, url_prefix="/api/v1/users")
        app.register_blueprint(classes_bp, url_prefix="/api/v1/classes")
        app.register_blueprint(instructors_bp, url_prefix="/api/v1/instructors")
        app.register_blueprint(bookings_bp, url_prefix="/api/v1/bookings")

        app.logger.info("✅ Blueprints registrados exitosamente")
    except Exception:
        app.logger.exception("❌ Error importando o registrando blueprints")
        # En producción, falla pronto para no servir 404 engañosos:
        # raise

    return app

# Para `python -m app.main` o Gunicorn
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
