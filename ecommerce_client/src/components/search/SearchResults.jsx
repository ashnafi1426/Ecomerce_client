/**
 * SearchResults Component
 * Amazon-style product results display with grid/list views
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoResults from './NoResults';

function SearchResults({ products, view = 'grid', loading, error, isEmpty, query, onRetry }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d13212" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return <NoResults query={query} onRetry={onRetry} />;
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={star <= Math.floor(rating) ? '#FF9900' : '#ddd'}
            stroke={star <= Math.floor(rating) ? '#FF9900' : '#ddd'}
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
        <span style={styles.ratingText}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (view === 'list') {
    return (
      <div style={styles.listContainer}>
        {products.map((product) => (
          <div
            key={product.id}
            style={styles.listItem}
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.image_url || '/placeholder.png'}
              alt={product.title}
              style={styles.listImage}
            />
            <div style={styles.listContent}>
              <h3 style={styles.listTitle}>{product.title}</h3>
              {product.average_rating > 0 && renderStars(product.average_rating)}
              <p style={styles.listDescription}>
                {product.description?.substring(0, 150)}...
              </p>
              <div style={styles.listFooter}>
                <span style={styles.price}>${product.price}</span>
                {product.brand_name && (
                  <span style={styles.brand}>by {product.brand_name}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.gridContainer}>
      {products.map((product) => (
        <div
          key={product.id}
          style={styles.gridItem}
          onClick={() => handleProductClick(product.id)}
        >
          <div style={styles.imageContainer}>
            <img
              src={product.image_url || '/placeholder.png'}
              alt={product.title}
              style={styles.gridImage}
            />
          </div>
          <div style={styles.gridContent}>
            <h3 style={styles.gridTitle}>{product.title}</h3>
            {product.average_rating > 0 && renderStars(product.average_rating)}
            <div style={styles.priceContainer}>
              <span style={styles.price}>${product.price}</span>
            </div>
            {product.brand_name && (
              <span style={styles.brand}>{product.brand_name}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #FF9900',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#565959'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 20px',
    minHeight: '400px'
  },
  errorText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#d13212',
    textAlign: 'center'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 20px',
    minHeight: '400px'
  },
  emptyTitle: {
    marginTop: '16px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#0F1111'
  },
  emptyText: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#565959',
    textAlign: 'center'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    padding: '16px 0'
  },
  gridItem: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)'
    }
  },
  imageContainer: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative',
    marginBottom: '12px'
  },
  gridImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  gridContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  gridTitle: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#0F1111',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px 0'
  },
  listItem: {
    display: 'flex',
    gap: '16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  listImage: {
    width: '180px',
    height: '180px',
    objectFit: 'contain',
    flexShrink: 0
  },
  listContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  listTitle: {
    fontSize: '18px',
    fontWeight: '400',
    color: '#0F1111',
    margin: 0
  },
  listDescription: {
    fontSize: '14px',
    color: '#565959',
    lineHeight: '1.5'
  },
  listFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: 'auto'
  },
  starsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  ratingText: {
    fontSize: '13px',
    color: '#007185',
    fontWeight: '400'
  },
  priceContainer: {
    marginTop: '4px'
  },
  price: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#B12704'
  },
  brand: {
    fontSize: '13px',
    color: '#565959'
  }
};

// Add keyframe animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    // Animation already exists
  }
}

export default SearchResults;
