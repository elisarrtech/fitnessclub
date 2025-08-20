# Fitness Club - Sistema de Gestión de Centro Deportivo

Sistema completo para la gestión de un centro fitness con funcionalidades de registro de clases, horarios, reservas, instructores y usuarios.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Despliegue](#despliegue)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)
- [Frontend](#frontend)
- [Notificaciones y Comunicación](#notificaciones-y-comunicación)
- [Sistema de Reservas](#sistema-de-reservas)
- [Calificaciones y Reseñas](#calificaciones-y-reseñas)
- [Lista de Espera](#lista-de-espera)
- [Recordatorios Automáticos](#recordatorios-automáticos)
- [Seguridad](#seguridad)
- [Variables de Entorno](#variables-de-entorno)
- [Desarrollo](#desarrollo)
- [Contribución](#contribución)
- [Licencia](#licencia)

## 📝 Descripción General

El sistema Fitness Club es una plataforma integral para centros deportivos que permite:

- Gestión de clases y horarios
- Reservas en línea de usuarios
- Administración de instructores
- Sistema de pagos
- Notificaciones por email/SMS
- Calificaciones y reseñas
- Lista de espera para clases llenas
- Recordatorios automáticos
- Panel administrativo

## ⚙️ Tecnologías Utilizadas

### Backend
- **Python 3.11**
- **Flask** - Framework web
- **MongoDB** - Base de datos NoSQL
- **PyMongo** - Driver para MongoDB
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash de contraseñas
- **Flask-CORS** - Manejo de CORS

### Frontend
- **React 18** - Librería de interfaces
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Infraestructura
- **Railway** - Despliegue del backend
- **Netlify** - Despliegue del frontend
- **MongoDB Atlas** - Base de datos en la nube

## 🏗️ Arquitectura del Sistema
┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Frontend │ │ Backend │ │ Base de Datos │
│ (React) │◄──►│ (Flask API) │◄──►│ (MongoDB) │
│ Netlify │ │ Railway │ │ Atlas │
└─────────────────┘ └──────────────────┘ └──────────────────┘
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Notificaciones │ │ Autenticación │ │ Colecciones │
│ (Email/SMS) │ │ (JWT) │ │ - users │
└─────────────────┘ └──────────────────┘ │ - classes │
│ - instructors │
│ - schedules │
│ - bookings │
└──────────────────┘



1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40

## 🚀 Funcionalidades Principales

### Usuarios
- Registro e inicio de sesión
- Perfiles personalizados por rol
- Gestión de reservas
- Historial de clases

### Clases
- Catálogo de clases disponibles
- Horarios y disponibilidad
- Detalles de cada clase
- Precios y capacidades

### Instructores
- Perfiles con biografías
- Calificaciones y reseñas
- Clases asignadas
- Disponibilidad

### Reservas
- Sistema de reservas en línea
- Confirmación automática
- Cancelación de reservas
- Lista de espera para clases llenas

### Notificaciones
- Email y SMS para confirmaciones
- Recordatorios automáticos
- Notificaciones de cambios

### Administración
- Panel de control
- Gestión de usuarios
- Gestión de clases e instructores
- Reportes y estadísticas

## 📁 Estructura del Proyecto

fitnessclub/
├── backend/ # API en Python/Flask
│ ├── app/
│ │ ├── init.py
│ │ ├── main.py # Punto de entrada de la aplicación
│ │ ├── core/ # Configuración y seguridad
│ │ │ ├── init.py
│ │ │ ├── config.py
│ │ │ ├── database.py
│ │ │ ├── security.py
│ │ │ └── auth_middleware.py
│ │ ├── models/ # Modelos de datos
│ │ │ ├── init.py
│ │ │ ├── user.py
│ │ │ ├── class.py
│ │ │ ├── instructor.py
│ │ │ ├── schedule.py
│ │ │ └── booking.py
│ │ ├── schemas/ # Validación de datos
│ │ │ ├── init.py
│ │ │ └── auth.py
│ │ ├── services/ # Lógica de negocio
│ │ │ ├── init.py
│ │ │ ├── user_service.py
│ │ │ ├── class_service.py
│ │ │ ├── instructor_service.py
│ │ │ ├── schedule_service.py
│ │ │ └── booking_service.py
│ │ └── api/ # Endpoints REST
│ │ └── v1/
│ │ ├── init.py
│ │ ├── auth.py
│ │ ├── users.py
│ │ ├── classes.py
│ │ ├── instructors.py
│ │ └── bookings.py
│ ├── requirements.txt # Dependencias de Python
│ ├── Dockerfile # Configuración de Docker
│ └── .env.example # Variables de entorno de ejemplo
├── frontend/ # Aplicación React
│ ├── public/
│ ├── src/
│ │ ├── components/ # Componentes reutilizables
│ │ │ ├── common/ # Componentes comunes
│ │ │ ├── auth/ # Componentes de autenticación
│ │ │ ├── classes/ # Componentes de clases
│ │ │ ├── instructors/ # Componentes de instructores
│ │ │ ├── bookings/ # Componentes de reservas
│ │ │ └── reviews/ # Componentes de reseñas
│ │ ├── pages/ # Páginas de la aplicación
│ │ ├── services/ # Servicios API
│ │ ├── contexts/ # Contextos de React
│ │ ├── hooks/ # Hooks personalizados
│ │ └── utils/ # Utilidades
│ ├── package.json
│ └── .env.example
└── README.md


## 🛠️ Instalación y Configuración

### Backend (Python/Flask)

1. **Navegar al directorio del backend:**
   ```bash
   cd backend
2. Crear un entorno virtual
3. python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows


Instalar dependencias:
