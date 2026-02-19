import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PopularSearches = ({ limit = 10, days = 30 }) => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularSearches();
  }, [limit, days]);

  const fetchPopularSearches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/search/popular-terms`,
        { params: { limit, days } }
      );

      if (response.data.success) {
        setSearches(response.data.data.popularSearches || []);
      }
    } catch (err) {
      console.error('Error fetching popular searches:', err);
      setError('Failed to load popular searches');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>🔥 Popular Searches</h3>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return null; // Hide on error
  }

  if (searches.length === 0) {
    return null; // Hide if no popular searches
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🔥 Popular Searches</h3>
      <div style={styles.list}>
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => handleSearchClick(search.query)}
            style={styles.searchItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#FF9900';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '#ddd';
            }}
          >
            <div style={styles.searchContent}>
              <span style={styles.rank}>{index + 1}</span>
              <span style={styles.query}>{search.query}</span>
            </div>
            <div style={styles.stats}>
              <span style={styles.count}>
                {search.searchCount} {search.searchCount === 1 ? 'search' : 'searches'}
              </span>
              {search.avgResults > 0 && (
                <span style={styles.results}>
                  ~{search.avgResults} results
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#565959',
    fontSize: '14px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  searchItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
  },
  searchContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rank: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: '#FF9900',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },
  query: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#0F1111',
    flex: 1,
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '32px',
    fontSize: '12px',
    color: '#565959',
  },
  count: {
    fontWeight: '500',
    color: '#007185',
  },
  results: {
    color: '#565959',
  },
};

export default PopularSearches;    
