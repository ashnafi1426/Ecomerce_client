import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import api from '../../services/api.service';
import RatingSummary from './RatingSummary';
import './ReviewSection.css';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchReviewSummary();
    fetchReviews();
    if (isAuthenticated) {
      checkReviewEligibility();
    }
  }, [productId, isAuthenticated]);

  const fetchReviewSummary = async () => {
    try {
      const response = await api.get(`/products/${productId}/reviews/summary`);
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Error fetching review summary:', error);
      setSummary(null);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}/reviews`);
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const response = await api.get(`/products/${productId}/reviews/can-review`);
      if (response.success) {
        setCanReview(response.canReview);
        setHasReviewed(response.hasReviewed);
        setHasPurchased(response.hasPurchased);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a review title');
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating,
        title: title.trim(),
        review_text: reviewText.trim()
      });

      if (response.success) {
        toast.success('Review submitted successfully!', {
          duration: 3000,
          style: {
            background: '#067D62',
            color: '#fff',
          }
        });
        
        // Reset form
        setRating(0);
        setTitle('');
        setReviewText('');
        setShowReviewForm(false);
        
        // Refresh reviews and eligibility
        fetchReviews();
        fetchReviewSummary();
        checkReviewEligibility();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setReviewText('');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? '★' : '☆');
    }
    return stars.join('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!summary) {
    return null;
  }

  return (
    <div className="reviews-section" id="reviews">
      <h2 className="section-title">Customer Reviews</h2>
      
      {/* Rating Summary */}
      <RatingSummary summary={summary} />

      {/* Write Review Button */}
      {isAuthenticated && canReview && !showReviewForm && (
        <div className="write-review-section">
          <button 
            className="write-review-button"
            onClick={() => setShowReviewForm(true)}
          >
            ✍️ Write a Review
          </button>
          {hasPurchased && (
            <span className="verified-purchase-badge">✓ Verified Purchase</span>
          )}
        </div>
      )}

      {/* Already Reviewed Message */}
      {isAuthenticated && hasReviewed && (
        <div className="already-reviewed-message">
          <p>✓ You have already reviewed this product</p>
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="login-prompt">
          <p>Please <a href="/login">login</a> to write a review</p>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <h3>Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="review-form">
            {/* Star Rating */}
            <div className="form-group">
              <label>Rating *</label>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ cursor: 'pointer', fontSize: '2em' }}
                  >
                    {star <= (hoverRating || rating) ? '★' : '☆'}
                  </span>
                ))}
                <span className="rating-text">
                  {rating > 0 && (
                    rating === 1 ? 'Poor' :
                    rating === 2 ? 'Fair' :
                    rating === 3 ? 'Good' :
                    rating === 4 ? 'Very Good' :
                    'Excellent'
                  )}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div className="form-group">
              <label htmlFor="review-title">Review Title *</label>
              <input
                type="text"
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={100}
                required
              />
            </div>

            {/* Review Text */}
            <div className="form-group">
              <label htmlFor="review-text">Your Review *</label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product (minimum 10 characters)"
                rows={6}
                minLength={10}
                required
              />
              <small>{reviewText.length} characters</small>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-review-button"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button 
                type="button" 
                className="cancel-review-button"
                onClick={handleCancelReview}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="loading-spinner">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">👤</div>
              <div>
                <div className="reviewer-name">
                  {review.users?.first_name || 'Anonymous'} {review.users?.last_name || ''}
                </div>
                <div className="stars">{renderStars(review.rating)}</div>
              </div>
            </div>
            <div className="review-date">
              Reviewed in the United States on {formatDate(review.created_at)}
            </div>
            <div className="review-text">
              {review.title && <strong>{review.title}</strong>}
              {review.title && <br />}
              {review.review_text}
            </div>
            
            {/* Review Images */}
            {review.review_images && review.review_images.length > 0 && (
              <div className="review-images">
                {review.review_images.map((img, index) => (
                  <img 
                    key={index}
                    src={img.image_url} 
                    alt={`Review image ${index + 1}`}
                    className="review-image"
                  />
                ))}
              </div>
            )}
            
            {review.verified_purchase && (
              <div className="verified-purchase">
                ✓ Verified Purchase
              </div>
            )}
            <div className="review-helpful">
              <button className="helpful-button">👍 Helpful</button>
              <span>{review.helpful_count || 0} people found this helpful</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewSection;
