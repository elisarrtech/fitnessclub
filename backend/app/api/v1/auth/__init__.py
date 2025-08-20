from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

# Importar las rutas después de crear el blueprint
from . import routes
