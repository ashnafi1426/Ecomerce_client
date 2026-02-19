/**
 * PriceRangeSlider Component
 * Amazon-style price range filter with predefined ranges
 */

import React, { useState } from 'react';

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 to $50', min: 25, max: 50 },
  { label: '$50 to $100', min: 50, max: 100 },
  { label: '$100 to $200', min: 100, max: 200 },
  { label: '$200 & Above', min: 200, max: 999999 }
];

function PriceRangeSlider({ minPrice, maxPrice, onPriceChange }) {
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRangeClick = (min, max) => {
    console.log('💰 Price range clicked:', { min, max }); // Debug log
    onPriceChange(min, max);
  };

  const handleCustomApply = () => {
    const min = customMin ? parseFloat(customMin) : 0;
    const max = customMax ? parseFloat(customMax) : 999999;
    console.log('💰 Custom price range applied:', { min, max }); // Debug log
    if (min <= max) {
      onPriceChange(min, max);
    }
  };

  const isRangeSelected = (min, max) => {
    return minPrice === min && maxPrice === max;
  };

  return (
    <div className="price-range-filter" style={styles.container}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <span style={styles.headerText}>Price</span>
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
          {/* Predefined Ranges */}
          {PRICE_RANGES.map((range, index) => (
            <label key={index} style={styles.rangeOption}>
              <input
                type="radio"
                name="priceRange"
                checked={isRangeSelected(range.min, range.max)}
                onChange={() => handleRangeClick(range.min, range.max)}
                style={styles.radio}
              />
              <span style={styles.rangeLabel}>{range.label}</span>
            </label>
          ))}

          {/* Custom Range */}
          <div style={styles.customRange}>
            <div style={styles.customInputs}>
              <input
                type="number"
                placeholder="Min"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                style={styles.customInput}
              />
              <span style={styles.customSeparator}>to</span>
              <input
                type="number"
                placeholder="Max"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                style={styles.customInput}
              />
            </div>
            <button
              onClick={handleCustomApply}
              style={styles.applyButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e68a00'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FF9900'}
            >
              Go
            </button>
          </div>
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
  rangeOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 0',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#0F1111'
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer',
    accentColor: '#FF9900'
  },
  rangeLabel: {
    cursor: 'pointer'
  },
  customRange: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #e7e7e7'
  },
  customInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  customInput: {
    flex: 1,
    padding: '6px 8px',
    border: '1px solid #888',
    borderRadius: '3px',
    fontSize: '14px',
    outline: 'none'
  },
  customSeparator: {
    fontSize: '14px',
    color: '#565959'
  },
  applyButton: {
    width: '100%',
    padding: '6px 12px',
    backgroundColor: '#FF9900',
    border: '1px solid #FF9900',
    borderRadius: '8px',
    color: '#0F1111',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default PriceRangeSlider;
