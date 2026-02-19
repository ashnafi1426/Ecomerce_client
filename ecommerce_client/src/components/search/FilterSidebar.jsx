/**
 * FilterSidebar Component
 * Amazon-style filter sidebar with mobile drawer support
 */

import React, { useState, useEffect } from 'react';
import PriceRangeSlider from './PriceRangeSlider';
import RatingFilter from './RatingFilter';
import CategoryFilter from './CategoryFilter';
import BrandFilter from './BrandFilter';

function FilterSidebar({ filters, onFilterChange, onFilterChanges, onClearFilters, hasActiveFilters }) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileDrawerOpen, isMobile]);

  const handleApplyFilters = () => {
    setIsMobileDrawerOpen(false);
  };

  const handleClearFilters = () => {
    onClearFilters();
    if (isMobile) {
      setIsMobileDrawerOpen(false);
    }
  };

  // Mobile: Show filter button
  if (isMobile && !isMobileDrawerOpen) {
    return (
      <>
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          style={styles.mobileFilterButton}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span style={styles.filterBadge}>{Object.values(filters).filter(Boolean).length}</span>
          )}
        </button>
      </>
    );
  }

  // Mobile: Drawer overlay
  const drawerContent = (
    <div className="filter-sidebar" style={isMobile ? styles.mobileDrawer : styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Filters</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              style={styles.clearButton}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Clear all
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              style={styles.closeButton}
              aria-label="Close filters"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider}></div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={filters.category}
        onCategoryChange={(category) => onFilterChange('category', category)}
      />

      <div style={styles.divider}></div>

      {/* Price Range Filter */}
      <PriceRangeSlider
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onPriceChange={(min, max) => {
          console.log('🔧 FilterSidebar: Price change received:', { min, max }); // Debug log
          // Update both minPrice and maxPrice together using onFilterChanges if available
          if (onFilterChanges) {
            onFilterChanges({ minPrice: min, maxPrice: max });
          } else {
            // Fallback to individual updates
            onFilterChange('minPrice', min);
            onFilterChange('maxPrice', max);
          }
        }}
      />

      <div style={styles.divider}></div>

      {/* Rating Filter */}
      <RatingFilter
        selectedRating={filters.minRating}
        onRatingChange={(rating) => onFilterChange('minRating', rating)}
      />

      <div style={styles.divider}></div>

      {/* Brand Filter */}
      <BrandFilter
        selectedBrands={filters.brands}
        onBrandToggle={(brandId) => {
          console.log('🔧 FilterSidebar: Brand toggle:', brandId);
          // Toggle brand in array
          const newBrands = filters.brands.includes(brandId)
            ? filters.brands.filter(id => id !== brandId)
            : [...filters.brands, brandId];
          console.log('🔧 FilterSidebar: New brands array:', newBrands);
          onFilterChange('brands', newBrands);
        }}
      />

      {/* Mobile: Apply Button */}
      {isMobile && (
        <div style={styles.mobileActions}>
          <button onClick={handleApplyFilters} style={styles.applyButton}>
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );

  // Mobile: Return drawer with overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isMobileDrawerOpen && (
          <div
            style={styles.overlay}
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        )}
        {/* Drawer */}
        {drawerContent}
      </>
    );
  }

  // Desktop: Return normal sidebar
  return drawerContent;
}

const styles = {
  sidebar: {
    width: '100%',
    maxWidth: '280px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  },
  mobileFilterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F1111',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '16px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  filterBadge: {
    backgroundColor: '#FF9900',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700'
  },
  mobileDrawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '85%',
    maxWidth: '400px',
    height: '100vh',
    backgroundColor: '#fff',
    zIndex: 1001,
    overflowY: 'auto',
    padding: '20px',
    boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
    animation: 'slideIn 0.3s ease-out'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F1111',
    margin: 0
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#007185',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px 8px',
    fontWeight: '400'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    color: '#666'
  },
  divider: {
    height: '1px',
    backgroundColor: '#e7e7e7',
    margin: '16px 0'
  },
  mobileActions: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e7e7e7'
  },
  applyButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#FF9900',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

// Add keyframe animations
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
    `, styleSheet.cssRules.length);
    
    styleSheet.insertRule(`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    // Animations already exist
  }
}

export default FilterSidebar;
