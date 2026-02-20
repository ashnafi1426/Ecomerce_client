import React from 'react';
import PropTypes from 'prop-types';

/**
 * DiscountBadge Component
 * Displays a discount badge on product cards
 * Shows discount percentage or amount
 */
const DiscountBadge = ({ discountType, discountValue, percentageValue }) => {
  if (!discountType || !discountValue) {
    return null;
  }

  const getDiscountText = () => {
    switch (discountType) {
      case 'percentage':
        return `${percentageValue || discountValue}% OFF`;
      case 'fixed_amount':
        return `$${discountValue} OFF`;
      case 'buy_x_get_y':
        return 'SPECIAL OFFER';
      default:
        return 'DISCOUNT';
    }
  };

  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="bg-[#CC0C39] text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
        {getDiscountText()}
      </div>
    </div>
  );
};

DiscountBadge.propTypes = {
  discountType: PropTypes.oneOf(['percentage', 'fixed_amount', 'buy_x_get_y']),
  discountValue: PropTypes.number,
  percentageValue: PropTypes.number
};

export default DiscountBadge;
