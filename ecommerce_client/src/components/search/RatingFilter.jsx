/**
 * RatingFilter Component
 * Amazon-style star rating filter
 */

import React, { useState } from 'react';

const RATING_OPTIONS = [
  { stars: 4, label: '4 Stars & Up' },
  { stars: 3, label: '3 Stars & Up' },
  { stars: 2, label: '2 Stars & Up' },
  { stars: 1, label: '1 Star & Up' }
];

function RatingFilter({ selectedRating, onRatingChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderStars = (rating) => {
    return (
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={star <= rating ? '#FF9900' : '#ddd'}
            stroke={star <= rating ? '#FF9900' : '#ddd'}
            strokeWidth="1"
            style={styles.star}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="rating-filter" style={styles.container}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <span style={styles.headerText}>Customer Review</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div style={styles.content}>
          {RATING_OPTIONS.map((option) => (
            <label
              key={option.stars}
              style={{
                ...styles.ratingOption,
                ...(selectedRating === option.stars ? styles.ratingOptionSelected : {})
              }}
              onMouseEnter={(e) => {
                if (selectedRating !== option.stars) {
                  e.currentTarget.style.backgroundColor = '#f7f7f7';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRating !== option.stars) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <input
                type="radio"
                name="rating"
                checked={selectedRating === option.stars}
                onChange={() => onRatingChange(option.stars)}
                style={styles.radio}
              />
              <div style={styles.ratingContent}>
                {renderStars(option.stars)}
                <span style={styles.ratingLabel}>& Up</span>
              </div>
            </label>
          ))}

          {/* Clear Rating */}
          {selectedRating && (
            <button
              onClick={() => onRatingChange(null)}
              style={styles.clearButton}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Clear rating filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%'
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: '8px 0',
    cursor: 'pointer',
    color: '#0F1111'
  },
  headerText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F1111'
  },
  content: {
    marginTop: '12px'
  },
  ratingOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 4px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    marginBottom: '4px'
  },
  ratingOptionSelected: {
    backgroundColor: '#e7f6f8'
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer',
    accentColor: '#FF9900'
  },
  ratingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  starsContainer: {
    display: 'flex',
    gap: '2px'
  },
  star: {
    flexShrink: 0
  },
  ratingLabel: {
    fontSize: '14px',
    color: '#0F1111',
    fontWeight: '400'
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#007185',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '8px 4px',
    marginTop: '8px',
    textAlign: 'left'
  }
};

export default RatingFilter;
