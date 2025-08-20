// frontend/src/components/reviews/ReviewList.jsx
import React, { useState } from 'react';
import ReviewForm from './ReviewForm';

const ReviewList = ({ reviews = [], classId, onAddReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Datos de ejemplo - en producción vendrían de la API
  const sampleReviews = [
    {
      id: 1,
      user: { name: 'María González', avatar: null },
      rating: 5,
      comment: 'Excelente clase, el instructor es muy profesional y atento a las necesidades de cada alumno.',
      createdAt: '2025-08-15T10:30:00Z'
    },
    {
      id: 2,
      user: { name: 'Carlos Rodríguez', avatar: null },
      rating: 4,
      comment: 'Muy buena clase, aunque la sala estaba un poco fría. Recomendada para principiantes.',
      createdAt: '2025-08-10T14:15:00Z'
    },
    {
      id: 3,
      user: { name: 'Ana Martínez', avatar: null },
      rating: 5,
      comment: 'Increíble experiencia, aprendí mucho en una sola clase. Definitivamente volveré.',
      createdAt: '2025-08-05T09:45:00Z'
    }
  ];

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddReview = async (reviewData) => {
    // En producción, aquí conectarías con la API
    console.log('Nueva reseña:', reviewData);
    
    // Simular éxito
    alert('¡Gracias por tu reseña!');
    setShowReviewForm(false);
    
    if (onAddReview) {
      onAddReview(reviewData);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Reseñas</h3>
        <button
          onClick={() => setShowReviewForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Dejar Reseña
        </button>
      </div>

      {showReviewForm && (
        <div className="mb-8">
          <ReviewForm
            classId={classId}
            onSubmit={handleAddReview}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
              <div className="ml-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      {star <= Math.round(averageRating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {sampleReviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{review.user.name}</h4>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">
                        {star <= review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDateTime(review.createdAt)}
                </p>
                <div className="mt-3 text-sm text-gray-700">
                  <p>{review.comment}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sampleReviews.length === 0 && !showReviewForm && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reseñas aún</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sé el primero en compartir tu experiencia.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
