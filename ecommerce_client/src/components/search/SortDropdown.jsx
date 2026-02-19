/**
 * SortDropdown Component
 * Amazon-style sort dropdown
 */

import React from 'react';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' }
];

function SortDropdown({ sortBy, onSortChange }) {
  const currentOption = SORT_OPTIONS.find(opt => opt.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div className="sort-dropdown" style={styles.container}>
      <label htmlFor="sort-select" style={styles.label}>
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        style={styles.select}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    color: '#0F1111',
    fontWeight: '400'
  },
  select: {
    padding: '8px 32px 8px 12px',
    fontSize: '14px',
    color: '#0F1111',
    backgroundColor: '#f0f2f2',
    border: '1px solid #888',
    borderRadius: '8px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23565959' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    minWidth: '200px'
  }
};

export default SortDropdown;
