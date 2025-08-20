// frontend/src/components/reviews/ReviewForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ReviewForm = ({ classId, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Debes iniciar sesión para dejar una reseña');
      return;
    }
    
    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // En producción, aquí conectarías con la API para guardar la reseña
      const reviewData = {
        classId,
        userId: user.id,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      };
      
      if (onSubmit) {
        await onSubmit(reviewData);
      }
      
      // Resetear formulario
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Deja tu Reseña</h3>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                {star <= rating ? (
                  <span className="text-yellow-400">★</span>
                ) : (
                  <span className="text-gray-300">☆</span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {rating > 0 ? `${rating} estrella${rating > 1 ? 's' : ''}` : 'Selecciona una calificación'}
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentario
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            placeholder="Comparte tu experiencia con esta clase..."
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Reseña'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
