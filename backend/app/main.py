# app/main.py
import os
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS
    CORS(app, origins=[
        "https://68a539c509058f80db1b1759--fitnessclubfront.netlify.app",
        "http://localhost:3000",
        "http://localhost:5173"
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
    
    # Registrar blueprints con manejo de errores
    try:
        print("Intentando importar blueprints...")
        from app.api.v1 import auth, users, classes, instructors, bookings
        print("✅ Blueprints importados exitosamente")
        
        app.register_blueprint(auth.auth_bp)
        app.register_blueprint(users.users_bp)
        app.register_blueprint(classes.classes_bp)
        app.register_blueprint(instructors.instructors_bp)
        app.register_blueprint(bookings.bookings_bp)
        print("✅ Blueprints registrados exitosamente")
        
    except ImportError as e:
        print(f"❌ Error importando blueprints: {e}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"❌ Error registrando blueprints: {e}")
        import traceback
        traceback.print_exc()
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
