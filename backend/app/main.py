# app/main.py
import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.api.v1 import auth, users, classes, instructors, bookings

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS
    CORS(app, origins=[
        "https://fitnessclubfront.netlify.app/",
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
    
    # Endpoint de prueba para verificar que las rutas básicas funcionan
    @app.route("/api/v1/test")
    def test_route():
        return jsonify({"message": "Test route working"})
    
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
        
        # Registrar rutas de fallback para diagnóstico
        @app.route("/api/v1/classes")
        def classes_fallback():
            return jsonify({
                "error": "Classes blueprint not registered", 
                "details": str(e),  # Usar 'e' directamente
                "type": "ImportError"
            }), 500
            
        @app.route("/api/v1/classes/with-schedules")
        def classes_with_schedules_fallback():
            return jsonify({
                "error": "Classes with schedules endpoint not available", 
                "details": str(e),  # Usar 'e' directamente
                "type": "ImportError"
            }), 500
    
    except Exception as e:
        print(f"❌ Error registrando blueprints: {e}")
        import traceback
        traceback.print_exc()
        
        # Registrar rutas de fallback para errores generales
        @app.route("/api/v1/classes")
        def classes_fallback():
            return jsonify({
                "error": "Classes blueprint registration failed", 
                "details": str(e),  # Usar 'e' directamente
                "type": "GeneralError"
            }), 500
            
        @app.route("/api/v1/classes/with-schedules")
        def classes_with_schedules_fallback():
            return jsonify({
                "error": "Classes with schedules endpoint registration failed", 
                "details": str(e),  # Usar 'e' directamente
                "type": "GeneralError"
            }), 500
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
