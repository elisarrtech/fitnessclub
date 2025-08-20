FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de requerimientos e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Asegurar que todos los directorios tengan __init__.py
RUN find . -type d -exec touch {}/__init__.py \;

# Verificar estructura
RUN ls -la app/
RUN ls -la app/api/
RUN ls -la app/api/v1/

# Exponer puerto
EXPOSE 8000

# COMANDO CORRECTO:
CMD ["python", "-m", "app.main"]
