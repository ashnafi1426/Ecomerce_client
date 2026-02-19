/**
 * BrandFilter Component
 * Amazon-style brand filter with checkboxes and search
 */

import React, { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function BrandFilter({ selectedBrands = [], onBrandToggle }) {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/brands');
      // Handle flattened response structure (axios interceptor returns data directly)
      if (response.success) {
        setBrands(response.brands || []);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedBrands = showAll ? filteredBrands : filteredBrands.slice(0, 5);

  const isBrandSelected = (brandId) => {
    return selectedBrands.includes(brandId);
  };

  return (
    <div className="brand-filter" style={styles.container}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <span style={styles.headerText}>Brand</span>
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
          {/* Search Box */}
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search brands"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Brand List */}
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <>
              {displayedBrands.map((brand) => (
                <label
                  key={brand.id}
                  style={styles.brandOption}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <input
                    type="checkbox"
                    checked={isBrandSelected(brand.id)}
                    onChange={() => onBrandToggle(brand.id)}
                    style={styles.checkbox}
                  />
                  <span style={styles.brandLabel}>{brand.name}</span>
                </label>
              ))}

              {/* Show More/Less Button */}
              {filteredBrands.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={styles.showMoreButton}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  {showAll ? 'Show less' : `Show ${filteredBrands.length - 5} more`}
                </button>
              )}

              {/* No Results */}
              {filteredBrands.length === 0 && searchTerm && (
                <div style={styles.noResults}>No brands found</div>
              )}
            </>
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
  searchBox: {
    marginBottom: '12px'
  },
  searchInput: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #888',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  loading: {
    padding: '12px 0',
    fontSize: '14px',
    color: '#565959'
  },
  brandOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 4px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    marginBottom: '4px'
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
    accentColor: '#FF9900',
    width: '16px',
    height: '16px'
  },
  brandLabel: {
    fontSize: '14px',
    color: '#0F1111',
    cursor: 'pointer'
  },
  showMoreButton: {
    background: 'none',
    border: 'none',
    color: '#007185',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '8px 4px',
    marginTop: '4px',
    textAlign: 'left'
  },
  noResults: {
    padding: '12px 4px',
    fontSize: '14px',
    color: '#565959'
  }
};

export default BrandFilter;
