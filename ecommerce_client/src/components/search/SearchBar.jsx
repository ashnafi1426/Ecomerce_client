/**
 * SearchBar Component
 * Search input with autocomplete suggestions
 */

import React, { useState, useEffect, useRef } from 'react';
import apiService from '../../services/api.service';
import { useDebounce } from '../../hooks/useDebounce';

function SearchBar({ query, onQueryChange, onSearch, placeholder = 'Search products...' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [spellingSuggestion, setSpellingSuggestion] = useState(null);
  const wrapperRef = useRef(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        setSpellingSuggestion(null);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch both suggestions and spell check in parallel
        const [suggestionsRes, spellCheckRes] = await Promise.all([
          apiService.get('/search/suggestions', {
            params: { q: debouncedQuery, limit: 8 }
          }),
          apiService.get('/search/spell-check', {
            params: { q: debouncedQuery }
          })
        ]);

        // Handle flattened response structure (axios interceptor returns data directly)
        if (suggestionsRes.success) {
          setSuggestions(suggestionsRes.suggestions || []);
          setShowSuggestions(true);
        }

        if (spellCheckRes.success && spellCheckRes.hasCorrection) {
          setSpellingSuggestion(spellCheckRes.correctedQuery);
        } else {
          setSpellingSuggestion(null);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
        setSpellingSuggestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    onQueryChange(value);
    setSelectedIndex(-1);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    onQueryChange(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && onSearch) {
        onSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (onSearch) {
          onSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    setShowSuggestions(false);
    if (onSearch) {
      onSearch();
    }
  };

  // Handle clear button
  const handleClear = () => {
    onQueryChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="search-bar-wrapper" style={styles.wrapper}>
      <div className="search-bar-container" style={styles.container}>
        {/* Search Icon */}
        <button
          onClick={handleSearchClick}
          className="search-button"
          style={styles.searchButton}
          aria-label="Search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-input"
          style={styles.input}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="clear-button"
            style={styles.clearButton}
            aria-label="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-indicator" style={styles.loading}>
            <div style={styles.spinner}></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || spellingSuggestion) && (
        <div
          id="search-suggestions"
          className="suggestions-dropdown"
          style={styles.dropdown}
          role="listbox"
        >
          {/* Spelling Suggestion */}
          {spellingSuggestion && (
            <div
              onClick={() => handleSuggestionClick(spellingSuggestion)}
              className="spelling-suggestion"
              style={styles.spellingSuggestion}
            >
              <span style={styles.didYouMean}>Did you mean:</span>
              <span style={styles.correctedQuery}>{spellingSuggestion}</span>
              <span style={styles.arrow}>→</span>
            </div>
          )}

          {/* Regular Suggestions */}
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              style={{
                ...styles.suggestionItem,
                ...(index === selectedIndex ? styles.suggestionItemSelected : {})
              }}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={styles.suggestionIcon}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Inline styles
const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px'
  },
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '8px 12px',
    transition: 'border-color 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  searchButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    transition: 'color 0.2s'
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '8px 12px',
    color: '#333',
    backgroundColor: 'transparent'
  },
  clearButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#999',
    transition: 'color 0.2s'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #FF9900',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #f5f5f5'
  },
  suggestionItemSelected: {
    backgroundColor: '#f5f5f5'
  },
  suggestionIcon: {
    marginRight: '12px',
    color: '#999',
    flexShrink: 0
  },
  spellingSuggestion: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    backgroundColor: '#FFF8E1',
    borderBottom: '2px solid #FFD54F',
    transition: 'background-color 0.2s'
  },
  didYouMean: {
    fontSize: '13px',
    color: '#666',
    marginRight: '8px'
  },
  correctedQuery: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#007185',
    flex: 1
  },
  arrow: {
    fontSize: '16px',
    color: '#FF9900',
    marginLeft: '8px'
  }
};

// Add keyframe animation for spinner
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

export default SearchBar;
