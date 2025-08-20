# app/main.py
import os
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS
    CORS(app, origins=[
        "https://68a53b5ad44d4ea56a6cb0c3--fitnessclubfront.netlify.app/",
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
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
