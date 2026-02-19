import React, { useEffect, useState } from 'react';
import api from '../../services/api.service';
import './ProductSpecs.css';

const ProductSpecs = ({ productId }) => {
  const [specifications, setSpecifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    fetchSpecifications();
  }, [productId]);

  const fetchSpecifications = async () => {
    try {
      const response = await api.get(`/products/${productId}/specifications`);
      if (response.success && Array.isArray(response.data)) {
        setSpecifications(response.data);
        // Expand first group by default
        if (response.data.length > 0) {
          const firstGroup = response.data[0].spec_group;
          setExpandedGroups({ [firstGroup]: true });
        }
      }
    } catch (error) {
      console.error('Error fetching specifications:', error);
      setSpecifications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Group specifications by spec_group
  const groupedSpecs = Array.isArray(specifications) ? specifications.reduce((acc, spec) => {
    const group = spec.spec_group || 'General';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(spec);
    return acc;
  }, {}) : {};

  if (loading) {
    return (
      <div className="product-specs loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (specifications.length === 0) {
    return null;
  }

  return (
    <div className="product-specs">
      <h2 className="specs-title">Technical Specifications</h2>
      
      {Object.entries(groupedSpecs).map(([group, specs]) => (
        <div key={group} className="spec-group">
          <div 
            className="spec-group-header"
            onClick={() => toggleGroup(group)}
          >
            <h3>{group}</h3>
            <i className={`fas fa-chevron-${expandedGroups[group] ? 'up' : 'down'}`}></i>
          </div>
          
          {expandedGroups[group] && (
            <table className="spec-table">
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.id}>
                    <td className="spec-name">{spec.spec_name}</td>
                    <td className="spec-value">{spec.spec_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductSpecs;
