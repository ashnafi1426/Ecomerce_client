import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TrendingProducts = ({ limit = 6, days = 7 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingProducts();
  }, [limit, days]);

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/search/trending`,
        { params: { limit, days } }
      );

      if (response.data.success) {
        setProducts(response.data.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching trending products:', err);
      setError('Failed to load trending products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🔥 Trending Products</h2>
        <div style={styles.loading}>Loading trending products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🔥 Trending Products</h2>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no trending products
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔥 Trending Products</h2>
      <div style={styles.grid}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={styles.imageContainer}>
              <img
                src={product.image_url || '/placeholder-product.png'}
                alt={product.title}
                style={styles.image}
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
              <div style={styles.trendingBadge}>🔥 Trending</div>
            </div>
            <div style={styles.content}>
              <h3 style={styles.productTitle}>{product.title}</h3>
              {product.brand && (
                <p style={styles.brand}>{product.brand}</p>
              )}
              <div style={styles.footer}>
                <span style={styles.price}>
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {product.average_rating > 0 && (
                  <div style={styles.rating}>
                    <span style={styles.stars}>
                      {'★'.repeat(Math.round(product.average_rating))}
                      {'☆'.repeat(5 - Math.round(product.average_rating))}
                    </span>
                    <span style={styles.ratingText}>
                      ({product.total_reviews || 0})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F1111',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#565959',
    fontSize: '16px',
  },
  error: {
    padding: '20px',
    backgroundColor: '#FEF2F2',
    color: '#B12704',
    borderRadius: '4px',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
  },
  card: {
    display: 'block',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  trendingBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: '#FF9900',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  content: {
    padding: '12px',
  },
  productTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#0F1111',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
  },
  brand: {
    fontSize: '12px',
    color: '#565959',
    marginBottom: '8px',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#B12704',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  stars: {
    color: '#FF9900',
    fontSize: '14px',
  },
  ratingText: {
    fontSize: '12px',
    color: '#007185',
  },
};

export default TrendingProducts;
