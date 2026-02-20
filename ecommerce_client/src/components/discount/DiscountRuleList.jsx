import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * DiscountRuleList Component
 * Displays paginated list of discount rules with edit/delete actions (Admin only)
 */
const DiscountRuleList = ({ onEdit, onRefresh }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadRules();
  }, [statusFilter, pagination.page]);

  useEffect(() => {
    if (onRefresh) {
      loadRules();
    }
  }, [onRefresh]);

  const loadRules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/discounts/rules`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setRules(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Error loading discount rules:', error);
      toast.error('Failed to load discount rules');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this discount rule? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/discounts/rules/${ruleId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Discount rule deleted successfully');
        loadRules();
      }
    } catch (error) {
      console.error('Error deleting discount rule:', error);
      toast.error(error.response?.data?.message || 'Failed to delete discount rule');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800',
      disabled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getDiscountTypeLabel = (type) => {
    const labels = {
      percentage: 'Percentage',
      fixed_amount: 'Fixed Amount',
      buy_x_get_y: 'Buy X Get Y'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && rules.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-[#565959]">Loading discount rules...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header with Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0F1111]">Discount Rules</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-[#0F1111]">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="border border-[#D5D9D9] rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-[#0F1111] mb-2">No discount rules found</h3>
          <p className="text-[#565959]">Create your first discount rule to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="border border-[#D5D9D9] rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#0F1111]">{rule.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(rule.status)}`}>
                      {rule.status.toUpperCase()}
                    </span>
                  </div>

                  {rule.description && (
                    <p className="text-sm text-[#565959] mb-3">{rule.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-[#0F1111]">Type:</span>
                      <p className="text-[#565959]">{getDiscountTypeLabel(rule.discount_type)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F1111]">Value:</span>
                      <p className="text-[#565959]">
                        {rule.discount_type === 'percentage'
                          ? `${rule.percentage_value}%`
                          : rule.discount_type === 'fixed_amount'
                          ? `$${rule.discount_value}`
                          : `Buy ${rule.buy_quantity} Get ${rule.get_quantity}`}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F1111]">Start Date:</span>
                      <p className="text-[#565959]">{formatDate(rule.start_date)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F1111]">End Date:</span>
                      <p className="text-[#565959]">{formatDate(rule.end_date)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {rule.applicable_to === 'all_products' && (
                      <span className="bg-[#F0F8FF] text-[#007185] px-2 py-1 rounded">
                        All Products
                      </span>
                    )}
                    {rule.applicable_to === 'specific_categories' && (
                      <span className="bg-[#F0F8FF] text-[#007185] px-2 py-1 rounded">
                        {rule.category_ids?.length || 0} Categories
                      </span>
                    )}
                    {rule.applicable_to === 'specific_products' && (
                      <span className="bg-[#F0F8FF] text-[#007185] px-2 py-1 rounded">
                        {rule.product_ids?.length || 0} Products
                      </span>
                    )}
                    {rule.allow_stacking && (
                      <span className="bg-[#FFF3CD] text-[#856404] px-2 py-1 rounded">
                        Stackable
                      </span>
                    )}
                    {rule.max_uses_per_customer && (
                      <span className="bg-[#E7F3FF] text-[#004085] px-2 py-1 rounded">
                        Max {rule.max_uses_per_customer} per customer
                      </span>
                    )}
                    {rule.current_total_uses > 0 && (
                      <span className="bg-[#D4EDDA] text-[#155724] px-2 py-1 rounded">
                        Used {rule.current_total_uses} times
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit && onEdit(rule)}
                    className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded font-semibold text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="px-4 py-2 bg-white hover:bg-[#F7F8F8] border border-[#D5D9D9] rounded font-semibold text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#D5D9D9]">
          <div className="text-sm text-[#565959]">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} rules
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-[#D5D9D9] rounded hover:bg-[#F7F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 border border-[#D5D9D9] rounded bg-[#F7F8F8]">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-[#D5D9D9] rounded hover:bg-[#F7F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DiscountRuleList.propTypes = {
  onEdit: PropTypes.func,
  onRefresh: PropTypes.number
};

export default DiscountRuleList;
