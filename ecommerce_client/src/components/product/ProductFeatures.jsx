import React, { useEffect, useState } from 'react';
import api from '../../services/api.service';
import './ProductFeatures.css';

const ProductFeatures = ({ productId }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, [productId]);

  const fetchFeatures = async () => {
    try {
      const response = await api.get(`/products/${productId}/features`);
      if (response.success) {
        setFeatures(response.data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-features loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <ul className="features-list">
      {features.map((feature) => (
        <li key={feature.id}>
          {feature.feature_text}
        </li>
      ))}
    </ul>
  );
};

export default ProductFeatures;
