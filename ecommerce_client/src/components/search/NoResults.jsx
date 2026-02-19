import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';

/**
 * NoResults Component
 * Displays helpful message and suggestions when search returns no results
 * Amazon-style design with spell correction and alternatives
 */
const NoResults = ({ query, onRetry }) => {
  const navigate = useNavigate();
  const [spellingSuggestion, setSpellingSuggestion] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [relatedSearches, setRelatedSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, [query]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      // Fetch all suggestions in parallel
      const [spellRes, altRes, relatedRes] = await Promise.all([
        apiService.get('/search/spell-check', { params: { q: query } }),
        apiService.get('/search/alternatives', { params: { q: query } }),
        apiService.get('/search/related', { params: { q: query, limit: 5 } })
      ]);

      if (spellRes.data.success && spellRes.data.data.hasCorrection) {
        setSpellingSuggestion(spellRes.data.data.correctedQuery);
      }

      if (altRes.data.success) {
        setAlternatives(altRes.data.data.suggestions || []);
      }

      if (relatedRes.data.success) {
        setRelatedSearches(relatedRes.data.data.relatedSearches || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    if (onRetry) onRetry(suggestion);
  };

  return (
    <div style={styles.container}>
      {/* Main Message */}
      <div style={styles.mainMessage}>
        <div style={styles.icon}>🔍</div>
        <h2 style={styles.title}>No results for "{query}"</h2>
        <p style={styles.subtitle}>
          We couldn't find any products matching your search.
        </p>
      </div>

      {/* Spelling Suggestion */}
      {!loading && spellingSuggestion && (
        <div style={styles.suggestionBox}>
          <div style={styles.suggestionHeader}>
            <span style={styles.suggestionIcon}>💡</span>
            <span style={styles.suggestionLabel}>Did you mean:</span>
          </div>
          <button
            style={styles.suggestionButton}
            onClick={() => handleSuggestionClick(spellingSuggestion)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            <span style={styles.suggestionText}>{spellingSuggestion}</span>
            <span style={styles.arrow}>→</span>
          </button>
        </div>
      )}

      {/* Alternative Suggestions */}
      {!loading && alternatives.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Try these searches instead:</h3>
          <div style={styles.suggestionsList}>
            {alternatives.map((alt, index) => (
              <button
                key={index}
                style={styles.altButton}
                onClick={() => handleSuggestionClick(alt)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                  e.target.style.borderColor = '#FF9900';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#ddd';
                }}
              >
                {alt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Related Searches */}
      {!loading && relatedSearches.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Related searches:</h3>
          <div style={styles.relatedList}>
            {relatedSearches.map((related, index) => (
              <button
                key={index}
                style={styles.relatedButton}
                onClick={() => handleSuggestionClick(related.query)}
                onMouseEnter={(e) => e.target.style.color = '#FF9900'}
                onMouseLeave={(e) => e.target.style.color = '#007185'}
              >
                • {related.query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips */}
      <div style={styles.tipsSection}>
        <h3 style={styles.tipsTitle}>Search tips:</h3>
        <ul style={styles.tipsList}>
          <li style={styles.tipItem}>Check your spelling</li>
          <li style={styles.tipItem}>Try more general keywords</li>
          <li style={styles.tipItem}>Try different keywords</li>
          <li style={styles.tipItem}>Remove filters to see more results</li>
        </ul>
      </div>

      {/* Browse Categories */}
      <div style={styles.browseSection}>
        <p style={styles.browseText}>Or browse our categories:</p>
        <div style={styles.categoryButtons}>
          <button
            style={styles.categoryButton}
            onClick={() => navigate('/search?category=Electronics')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            Electronics
          </button>
          <button
            style={styles.categoryButton}
            onClick={() => navigate('/search?category=Fashion')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            Fashion
          </button>
          <button
            style={styles.categoryButton}
            onClick={() => navigate('/search?category=Home')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            Home & Kitchen
          </button>
          <button
            style={styles.categoryButton}
            onClick={() => navigate('/search')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            All Products
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Finding suggestions...</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  mainMessage: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '40px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#565959',
    margin: 0
  },
  suggestionBox: {
    backgroundColor: '#FFF8E1',
    border: '1px solid #FFD54F',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px'
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  suggestionIcon: {
    fontSize: '20px'
  },
  suggestionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F1111'
  },
  suggestionButton: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease'
  },
  suggestionText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#007185'
  },
  arrow: {
    fontSize: '18px',
    color: '#FF9900'
  },
  section: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '15px'
  },
  suggestionsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  altButton: {
    padding: '10px 16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#0F1111',
    transition: 'all 0.2s ease'
  },
  relatedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  relatedButton: {
    padding: '8px 0',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#007185',
    textAlign: 'left',
    transition: 'color 0.2s ease'
  },
  tipsSection: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  tipsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '12px'
  },
  tipsList: {
    margin: 0,
    paddingLeft: '20px'
  },
  tipItem: {
    fontSize: '14px',
    color: '#565959',
    marginBottom: '8px'
  },
  browseSection: {
    textAlign: 'center',
    marginTop: '40px'
  },
  browseText: {
    fontSize: '16px',
    color: '#0F1111',
    marginBottom: '15px'
  },
  categoryButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center'
  },
  categoryButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#0F1111',
    transition: 'all 0.2s ease'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #FF9900',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 15px'
  },
  loadingText: {
    fontSize: '14px',
    color: '#565959'
  }
};

// Add keyframe animation for spinner
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default NoResults;
