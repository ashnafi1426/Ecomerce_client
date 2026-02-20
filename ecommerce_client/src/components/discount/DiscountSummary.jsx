import React from 'react';
import PropTypes from 'prop-types';

/**
 * DiscountSummary Component
 * Displays discount information for cart items
 * Shows original price, discount amount, and final price
 */
const DiscountSummary = ({ items, totalSavings }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const hasDiscounts = items.some(item => item.appliedDiscounts && item.appliedDiscounts.length > 0);

  if (!hasDiscounts) {
    return null;
  }

  return (
    <div className="bg-[#F0F8FF] border border-[#007185] rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🎉</span>
        <h3 className="text-lg font-bold text-[#007185]">Discounts Applied!</h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          if (!item.appliedDiscounts || item.appliedDiscounts.length === 0) {
            return null;
          }

          return (
            <div key={item.productId} className="bg-white rounded p-3 border border-[#D5D9D9]">
              <div className="font-semibold text-[#0F1111] mb-2 line-clamp-1">
                {item.name || 'Product'}
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-[#565959]">
                  <span>Original Price:</span>
                  <span className="line-through">${item.originalPrice?.toFixed(2)}</span>
                </div>
                
                {item.appliedDiscounts.map((discount, idx) => (
                  <div key={idx} className="flex justify-between text-[#007600]">
                    <span>• {discount.name || 'Discount'}:</span>
                    <span>-${discount.savingsAmount?.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between font-bold text-[#B12704] pt-1 border-t border-[#D5D9D9]">
                  <span>Final Price:</span>
                  <span>${item.discountedPrice?.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-[#007600] font-semibold">
                  <span>You Save:</span>
                  <span>${item.savings?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalSavings > 0 && (
        <div className="mt-4 pt-3 border-t border-[#007185]">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-[#0F1111]">Total Savings:</span>
            <span className="text-2xl font-bold text-[#007600]">
              ${totalSavings.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

DiscountSummary.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.string,
      name: PropTypes.string,
      originalPrice: PropTypes.number,
      discountedPrice: PropTypes.number,
      savings: PropTypes.number,
      appliedDiscounts: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          savingsAmount: PropTypes.number
        })
      )
    })
  ),
  totalSavings: PropTypes.number
};

DiscountSummary.defaultProps = {
  items: [],
  totalSavings: 0
};

export default DiscountSummary;
