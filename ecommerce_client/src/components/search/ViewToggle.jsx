/**
 * ViewToggle Component
 * Amazon-style grid/list view toggle
 */

import React from 'react';

function ViewToggle({ view, onViewChange }) {
  return (
    <div className="view-toggle" style={styles.container}>
      <button
        onClick={() => onViewChange('grid')}
        style={{
          ...styles.button,
          ...(view === 'grid' ? styles.buttonActive : {})
        }}
        aria-label="Grid view"
        title="Grid view"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>

      <button
        onClick={() => onViewChange('list')}
        style={{
          ...styles.button,
          ...(view === 'list' ? styles.buttonActive : {})
        }}
        aria-label="List view"
        title="List view"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '4px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '2px',
    backgroundColor: '#fff'
  },
  button: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#565959',
    transition: 'all 0.2s'
  },
  buttonActive: {
    backgroundColor: '#f0f2f2',
    color: '#0F1111'
  }
};

export default ViewToggle;
