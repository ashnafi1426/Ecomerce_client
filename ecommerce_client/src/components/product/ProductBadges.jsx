import React, { useEffect, useState } from 'react';
import api from '../../services/api.service';
import './ProductBadges.css';

const ProductBadges = ({ productId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [productId]);

  const fetchBadges = async () => {
    try {
      const response = await api.get(`/products/${productId}/badges`);
      if (response.success && Array.isArray(response.data)) {
        setBadges(response.data);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
      setBadges([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badgeType) => {
    const icons = {
      best_seller: '🏆',
      amazons_choice: '✓',
      deal_of_day: '⚡',
      lightning_deal: '⚡',
      new_arrival: '🆕',
      limited_time: '⏰'
    };
    return icons[badgeType] || '⭐';
  };

  const getBadgeClass = (badgeType) => {
    return `badge badge-${badgeType.replace('_', '-')}`;
  };

  if (loading || badges.length === 0) {
    return null;
  }

  return (
    <div className="product-badges">
      {badges.map((badge) => (
        <div key={badge.id} className={getBadgeClass(badge.badge_type)}>
          <span className="badge-icon">{getBadgeIcon(badge.badge_type)}</span>
          <span className="badge-text">{badge.badge_text}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductBadges;
