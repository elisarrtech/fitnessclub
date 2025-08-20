// En Dashboard.jsx, cambia la verificación de acceso:
if (!user || user.role !== 'ADMIN') {
  // Para pruebas, permitir acceso temporal
  const isDevMode = true; // Cambiar a false en producción
  if (!isDevMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Acceso denegado. Solo administradores pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }
  // En modo desarrollo, continuar con usuario de prueba
}
