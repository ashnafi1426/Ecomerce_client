import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * DiscountRuleForm Component
 * Form for creating and editing discount rules (Admin only)
 */
const DiscountRuleForm = ({ rule, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    percentage_value: '',
    buy_quantity: '',
    get_quantity: '',
    applicable_to: 'all_products',
    category_ids: [],
    product_ids: [],
    start_date: '',
    end_date: '',
    allow_stacking: false,
    priority: 0,
    max_uses_per_customer: '',
    max_total_uses: '',
    min_purchase_amount: ''
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load existing rule data if editing
  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || '',
        description: rule.description || '',
        discount_type: rule.discount_type || 'percentage',
        discount_value: rule.discount_value || '',
        percentage_value: rule.percentage_value || '',
        buy_quantity: rule.buy_quantity || '',
        get_quantity: rule.get_quantity || '',
        applicable_to: rule.applicable_to || 'all_products',
        category_ids: rule.category_ids || [],
        product_ids: rule.product_ids || [],
        start_date: rule.start_date ? new Date(rule.start_date).toISOString().slice(0, 16) : '',
        end_date: rule.end_date ? new Date(rule.end_date).toISOString().slice(0, 16) : '',
        allow_stacking: rule.allow_stacking || false,
        priority: rule.priority || 0,
        max_uses_per_customer: rule.max_uses_per_customer || '',
        max_total_uses: rule.max_total_uses || '',
        min_purchase_amount: rule.min_purchase_amount || ''
      });
    }
  }, [rule]);

  // Load categories and products for selection
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/categories`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/products?limit=100`)
        ]);

        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data || []);
        }
        if (productsRes.data.success) {
          setProducts(productsRes.data.data || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      [field]: options
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.discount_value || formData.discount_value <= 0) {
      newErrors.discount_value = 'Discount value must be greater than 0';
    }

    if (formData.discount_type === 'percentage') {
      const percentage = parseFloat(formData.percentage_value);
      if (!percentage || percentage < 5 || percentage > 90) {
        newErrors.percentage_value = 'Percentage must be between 5% and 90%';
      }
    }

    if (formData.discount_type === 'buy_x_get_y') {
      if (!formData.buy_quantity || formData.buy_quantity <= 0) {
        newErrors.buy_quantity = 'Buy quantity must be greater than 0';
      }
      if (!formData.get_quantity || formData.get_quantity <= 0) {
        newErrors.get_quantity = 'Get quantity must be greater than 0';
      }
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (formData.applicable_to === 'specific_categories' && formData.category_ids.length === 0) {
      newErrors.category_ids = 'Please select at least one category';
    }

    if (formData.applicable_to === 'specific_products' && formData.product_ids.length === 0) {
      newErrors.product_ids = 'Please select at least one product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        percentage_value: formData.discount_type === 'percentage' ? parseFloat(formData.percentage_value) : null,
        buy_quantity: formData.discount_type === 'buy_x_get_y' ? parseInt(formData.buy_quantity) : null,
        get_quantity: formData.discount_type === 'buy_x_get_y' ? parseInt(formData.get_quantity) : null,
        priority: parseInt(formData.priority) || 0,
        max_uses_per_customer: formData.max_uses_per_customer ? parseInt(formData.max_uses_per_customer) : null,
        max_total_uses: formData.max_total_uses ? parseInt(formData.max_total_uses) : null,
        min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : null
      };

      const url = rule
        ? `${import.meta.env.VITE_API_URL}/api/discounts/rules/${rule.id}`
        : `${import.meta.env.VITE_API_URL}/api/discounts/rules`;

      const method = rule ? 'put' : 'post';

      const response = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(rule ? 'Discount rule updated successfully' : 'Discount rule created successfully');
        if (onSuccess) onSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Error saving discount rule:', error);
      toast.error(error.response?.data?.message || 'Failed to save discount rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#0F1111]">
        {rule ? 'Edit Discount Rule' : 'Create Discount Rule'}
      </h2>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#0F1111] mb-1">
            Rule Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
            placeholder="e.g., Summer Sale 2024"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F1111] mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-[#D5D9D9] rounded px-3 py-2"
            placeholder="Optional description of this discount rule"
          />
        </div>
      </div>

      {/* Discount Type and Value */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#0F1111] mb-1">
            Discount Type *
          </label>
          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            className="w-full border border-[#D5D9D9] rounded px-3 py-2"
          >
            <option value="percentage">Percentage Discount</option>
            <option value="fixed_amount">Fixed Amount Discount</option>
            <option value="buy_x_get_y">Buy X Get Y</option>
          </select>
        </div>

        {formData.discount_type === 'percentage' && (
          <div>
            <label className="block text-sm font-semibold text-[#0F1111] mb-1">
              Percentage (5-90%) *
            </label>
            <input
              type="number"
              name="percentage_value"
              value={formData.percentage_value}
              onChange={handleChange}
              min="5"
              max="90"
              step="1"
              className={`w-full border ${errors.percentage_value ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
              placeholder="e.g., 20"
            />
            {errors.percentage_value && <p className="text-red-500 text-sm mt-1">{errors.percentage_value}</p>}
          </div>
        )}

        {formData.discount_type === 'fixed_amount' && (
          <div>
            <label className="block text-sm font-semibold text-[#0F1111] mb-1">
              Discount Amount ($) *
            </label>
            <input
              type="number"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full border ${errors.discount_value ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
              placeholder="e.g., 10.00"
            />
            {errors.discount_value && <p className="text-red-500 text-sm mt-1">{errors.discount_value}</p>}
          </div>
        )}

        {formData.discount_type === 'buy_x_get_y' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0F1111] mb-1">
                Buy Quantity *
              </label>
              <input
                type="number"
                name="buy_quantity"
                value={formData.buy_quantity}
                onChange={handleChange}
                min="1"
                className={`w-full border ${errors.buy_quantity ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
                placeholder="e.g., 2"
              />
              {errors.buy_quantity && <p className="text-red-500 text-sm mt-1">{errors.buy_quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F1111] mb-1">
                Get Quantity *
              </label>
              <input
                type="number"
                name="get_quantity"
                value={formData.get_quantity}
                onChange={handleChange}
                min="1"
                className={`w-full border ${errors.get_quantity ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
                placeholder="e.g., 1"
              />
              {errors.get_quantity && <p className="text-red-500 text-sm mt-1">{errors.get_quantity}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Applicability */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#0F1111] mb-1">
            Apply To *
          </label>
          <select
            name="applicable_to"
            value={formData.applicable_to}
            onChange={handleChange}
            className="w-full border border-[#D5D9D9] rounded px-3 py-2"
          >
            <option value="all_products">All Products</option>
            <option value="specific_categories">Specific Categories</option>
            <option value="specific_products">Specific Products</option>
          </select>
        </div>

        {formData.applicable_to === 'specific_categories' && (
          <div>
            <label className="block text-sm font-semibold text-[#0F1111] mb-1">
              Select Categories * (Hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              size="5"
              value={formData.category_ids}
              onChange={(e) => handleMultiSelect(e, 'category_ids')}
              className={`w-full border ${errors.category_ids ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_ids && <p className="text-red-500 text-sm mt-1">{errors.category_ids}</p>}
          </div>
        )}

        {formData.applicable_to === 'specific_products' && (
          <div>
            <label className="block text-sm font-semibold text-[#0F1111] mb-1">
              Select Products * (Hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              size="5"
              value={formData.product_ids}
              onChange={(e) => handleMultiSelect(e, 'product_ids')}
              className={`w-full border ${errors.product_ids ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
            >
              {products.map(prod => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
            {errors.product_ids && <p className="text-red-500 text-sm mt-1">{errors.product_ids}</p>}
          </div>
        )}
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0F1111] mb-1">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className={`w-full border ${errors.start_date ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
          />
          {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0F1111] mb-1">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className={`w-full border ${errors.end_date ? 'border-red-500' : 'border-[#D5D9D9]'} rounded px-3 py-2`}
          />
          {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allow_stacking"
            checked={formData.allow_stacking}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-sm font-semibold text-[#0F1111]">
            Allow stacking with other discounts
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0F1111] mb-1">
              Priority
            </label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min="0"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F1111] mb-1">
              Max Uses Per Customer
            </label>
            <input
              type="number"
              name="max_uses_per_customer"
              value={formData.max_uses_per_customer}
              onChange={handleChange}
              min="1"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2"
              placeholder="Unlimited"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F1111] mb-1">
              Max Total Uses
            </label>
            <input
              type="number"
              name="max_total_uses"
              value={formData.max_total_uses}
              onChange={handleChange}
              min="1"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2"
              placeholder="Unlimited"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F1111] mb-1">
            Minimum Purchase Amount ($)
          </label>
          <input
            type="number"
            name="min_purchase_amount"
            value={formData.min_purchase_amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-[#D5D9D9] rounded px-3 py-2"
            placeholder="No minimum"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (rule ? 'Update Rule' : 'Create Rule')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white hover:bg-[#F7F8F8] border border-[#D5D9D9] rounded-lg py-3 font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

DiscountRuleForm.propTypes = {
  rule: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func
};

export default DiscountRuleForm;
