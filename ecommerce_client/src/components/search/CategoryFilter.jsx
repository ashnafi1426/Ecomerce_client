/**
 * CategoryFilter Component
 * Amazon-style category filter with expandable list
 */

import React, { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-filter" style={styles.container}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <span style={styles.headerText}>Department</span>
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
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <>
              {/* All Categories Option */}
              <label
                style={{
                  ...styles.categoryOption,
                  ...(selectedCategory === null ? styles.categoryOptionSelected : {})
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== null) {
                    e.currentTarget.style.backgroundColor = '#f7f7f7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== null) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === null}
                  onChange={() => onCategoryChange(null)}
                  style={styles.radio}
                />
                <span style={styles.categoryLabel}>All Departments</span>
              </label>

              {/* Category List */}
              {categories.map((category) => (
                <label
                  key={category.id}
                  style={{
                    ...styles.categoryOption,
                    ...(selectedCategory === category.id ? styles.categoryOptionSelected : {})
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = '#f7f7f7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category.id}
                    onChange={() => onCategoryChange(category.id)}
                    style={styles.radio}
                  />
                  <span style={styles.categoryLabel}>{category.name}</span>
                </label>
              ))}
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
  loading: {
    padding: '12px 0',
    fontSize: '14px',
    color: '#565959'
  },
  categoryOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 4px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    marginBottom: '4px'
  },
  categoryOptionSelected: {
    backgroundColor: '#e7f6f8'
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer',
    accentColor: '#FF9900'
  },
  categoryLabel: {
    fontSize: '14px',
    color: '#0F1111',
    cursor: 'pointer'
  }
};

export default CategoryFilter;
