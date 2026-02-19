/**
 * ActiveFilters Component
 * Amazon-style active filters display with remove buttons
 */

import React from 'react';

function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
  const activeFilters = [];

  // Category filter
  if (filters.category) {
    activeFilters.push({
      type: 'category',
      label: 'Category',
      value: filters.categoryName || 'Selected',
      onRemove: () => onRemoveFilter('category')
    });
  }

  // Price filter
  if (filters.minPrice || filters.maxPrice) {
    const priceLabel = filters.minPrice && filters.maxPrice
      ? `$${filters.minPrice} - $${filters.maxPrice}`
      : filters.minPrice
      ? `$${filters.minPrice}+`
      : `Up to $${filters.maxPrice}`;
    
    activeFilters.push({
      type: 'price',
      label: 'Price',
      value: priceLabel,
      onRemove: () => {
        onRemoveFilter('minPrice');
        onRemoveFilter('maxPrice');
      }
    });
  }

  // Rating filter
  if (filters.minRating) {
    activeFilters.push({
      type: 'rating',
      label: 'Rating',
      value: `${filters.minRating}+ Stars`,
      onRemove: () => onRemoveFilter('minRating')
    });
  }

  // Brand filters
  if (filters.brands && filters.brands.length > 0) {
    filters.brands.forEach((brandId, index) => {
      activeFilters.push({
        type: 'brand',
        label: 'Brand',
        value: filters.brandNames?.[index] || `Brand ${index + 1}`,
        onRemove: () => onRemoveFilter('brands', brandId)
      });
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="active-filters" style={styles.container}>
      <div style={styles.header}>
        <span style={styles.count}>{activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} applied</span>
        <button
          onClick={onClearAll}
          style={styles.clearAllButton}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          Clear all
        </button>
      </div>

      <div style={styles.filtersList}>
        {activeFilters.map((filter, index) => (
          <div key={`${filter.type}-${index}`} style={styles.filterChip}>
            <span style={styles.filterText}>
              <span style={styles.filterLabel}>{filter.label}:</span> {filter.value}
            </span>
            <button
              onClick={filter.onRemove}
              style={styles.removeButton}
              aria-label={`Remove ${filter.label} filter`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  count: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F1111'
  },
  clearAllButton: {
    background: 'none',
    border: 'none',
    color: '#007185',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px 8px',
    fontWeight: '400'
  },
  filtersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    border: '1px solid #888',
    borderRadius: '16px',
    padding: '6px 12px',
    fontSize: '13px'
  },
  filterText: {
    color: '#0F1111'
  },
  filterLabel: {
    fontWeight: '600'
  },
  removeButton: {
    background: 'none',
    border: 'none',
    padding: '2px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#565959',
    transition: 'color 0.2s'
  }
};

export default ActiveFilters;
