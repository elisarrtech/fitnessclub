# app/main.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from app.services import user_service, class_service, instructor_service
from app.models.user import UserCreate
from app.models.class import ClassCreate
from app.models.instructor import InstructorCreate

def create_app():
    app = Flask(__name__)
    CORS(app)
    
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
    
    # === ENDPOINTS DE USUARIOS ===
    @app.route("/api/v1/users", methods=["POST"])
    async def create_user():
        try:
            user_data = UserCreate(**request.get_json())
            user = await user_service.create_user(user_data)
            return jsonify(user), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Error creando usuario"}), 500
    
    @app.route("/api/v1/users", methods=["GET"])
    async def get_users():
        try:
            users = await user_service.get_all_users()
            return jsonify(users)
        except Exception as e:
            return jsonify({"error": "Error obteniendo usuarios"}), 500
    
    @app.route("/api/v1/users/<user_id>", methods=["GET"])
    async def get_user(user_id):
        try:
            user = await user_service.get_user_by_id(user_id)
            if user:
                return jsonify(user)
            return jsonify({"error": "Usuario no encontrado"}), 404
        except Exception as e:
            return jsonify({"error": "Error obteniendo usuario"}), 500
    
    # === ENDPOINTS DE CLASES ===
    @app.route("/api/v1/classes", methods=["POST"])
    async def create_class():
        try:
            class_data = ClassCreate(**request.get_json())
            class_obj = await class_service.create_class(class_data)
            return jsonify(class_obj), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Error creando clase"}), 500
    
    @app.route("/api/v1/classes", methods=["GET"])
    async def get_classes():
        try:
            classes = await class_service.get_all_classes()
            return jsonify(classes)
        except Exception as e:
            return jsonify({"error": "Error obteniendo clases"}), 500
    
    @app.route("/api/v1/classes/with-instructors", methods=["GET"])
    async def get_classes_with_instructors():
        try:
            classes = await class_service.get_classes_with_instructor()
            return jsonify(classes)
        except Exception as e:
            return jsonify({"error": "Error obteniendo clases con instructores"}), 500
    
    # === ENDPOINTS DE INSTRUCTORES ===
    @app.route("/api/v1/instructors", methods=["POST"])
    async def create_instructor():
        try:
            instructor_data = InstructorCreate(**request.get_json())
            instructor = await instructor_service.create_instructor(instructor_data)
            return jsonify(instructor), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Error creando instructor"}), 500
    
    @app.route("/api/v1/instructors", methods=["GET"])
    async def get_instructors():
        try:
            instructors = await instructor_service.get_all_instructors()
            return jsonify(instructors)
        except Exception as e:
            return jsonify({"error": "Error obteniendo instructores"}), 500
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
