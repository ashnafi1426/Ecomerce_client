import React from 'react';
import './ProductTitle.css';

const ProductTitle = ({ product, summary }) => {
  if (!product) return null;

  const averageRating = summary?.average_rating || 0;
  const totalReviews = summary?.total_reviews || 0;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="product-title-section">
      <h1 className="product-title">{product.title}</h1>
      
      {product.brand && (
        <a href={`/brand/${product.brand}`} className="product-brand">
          Visit the {product.brand} Store
        </a>
      )}
      
      <div className="rating-section">
        <span className="stars">
          {renderStars(averageRating)}
        </span>
        <a 
          href="#reviews" 
          className="rating-text"
          onClick={(e) => {
            e.preventDefault();
            scrollToReviews();
          }}
        >
          {averageRating.toFixed(1)} out of 5 stars
        </a>
        <span className="rating-count">{totalReviews.toLocaleString()} ratings</span>
      </div>
    </div>
  );
};

export default ProductTitle;
