import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * DiscountAnalytics Component
 * Displays discount usage analytics and revenue impact (Admin only)
 */
const DiscountAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/discounts/analytics`,
        {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load discount analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/discounts/analytics/export`,
        {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          },
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `discount-analytics-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Analytics exported successfully');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Failed to export analytics');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-[#565959]">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-[#565959]">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Filter */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0F1111]">Discount Analytics</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-[#0F1111]">From:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="border border-[#D5D9D9] rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-[#0F1111]">To:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="border border-[#D5D9D9] rounded px-3 py-2"
              />
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : '📥 Export CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border-l-4 border-[#007185]">
          <div className="text-sm font-semibold text-[#565959] mb-1">Total Discount Amount</div>
          <div className="text-3xl font-bold text-[#0F1111]">
            ${analytics.total_discount_amount?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border-l-4 border-[#007600]">
          <div className="text-sm font-semibold text-[#565959] mb-1">Orders With Discounts</div>
          <div className="text-3xl font-bold text-[#0F1111]">
            {analytics.orders_with_discounts || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border-l-4 border-[#FF9900]">
          <div className="text-sm font-semibold text-[#565959] mb-1">Avg Order Value (With Discounts)</div>
          <div className="text-3xl font-bold text-[#0F1111]">
            ${analytics.avg_order_value_with_discounts?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border-l-4 border-[#B12704]">
          <div className="text-sm font-semibold text-[#565959] mb-1">Revenue Impact</div>
          <div className="text-3xl font-bold text-[#0F1111]">
            ${analytics.revenue_impact?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      {/* Revenue Comparison */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#0F1111] mb-4">Revenue Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-semibold text-[#565959] mb-2">Total Revenue</div>
            <div className="text-2xl font-bold text-[#007600]">
              ${analytics.total_revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-[#565959] mt-1">Actual revenue with discounts</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#565959] mb-2">Projected Revenue (No Discounts)</div>
            <div className="text-2xl font-bold text-[#565959]">
              ${analytics.projected_revenue_without_discounts?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-[#565959] mt-1">Estimated without discounts</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#565959] mb-2">Discount Impact</div>
            <div className="text-2xl font-bold text-[#B12704]">
              -${analytics.revenue_impact?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-[#565959] mt-1">Total discount given</div>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#0F1111] mb-4">Order Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#565959]">Orders With Discounts</span>
              <span className="text-lg font-bold text-[#007600]">{analytics.orders_with_discounts || 0}</span>
            </div>
            <div className="w-full bg-[#E7F3FF] rounded-full h-3">
              <div
                className="bg-[#007600] h-3 rounded-full"
                style={{
                  width: `${
                    ((analytics.orders_with_discounts || 0) /
                      ((analytics.orders_with_discounts || 0) + (analytics.orders_without_discounts || 0))) *
                    100
                  }%`
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#565959]">Orders Without Discounts</span>
              <span className="text-lg font-bold text-[#565959]">{analytics.orders_without_discounts || 0}</span>
            </div>
            <div className="w-full bg-[#E7F3FF] rounded-full h-3">
              <div
                className="bg-[#565959] h-3 rounded-full"
                style={{
                  width: `${
                    ((analytics.orders_without_discounts || 0) /
                      ((analytics.orders_with_discounts || 0) + (analytics.orders_without_discounts || 0))) *
                    100
                  }%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F0F8FF] rounded p-4">
            <div className="text-sm font-semibold text-[#565959] mb-1">Avg Order Value (With Discounts)</div>
            <div className="text-2xl font-bold text-[#007185]">
              ${analytics.avg_order_value_with_discounts?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-[#F7F8F8] rounded p-4">
            <div className="text-sm font-semibold text-[#565959] mb-1">Avg Order Value (Without Discounts)</div>
            <div className="text-2xl font-bold text-[#565959]">
              ${analytics.avg_order_value_without_discounts?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      </div>

      {/* Per-Rule Analytics */}
      {analytics.rule_analytics && analytics.rule_analytics.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#0F1111] mb-4">Performance by Discount Rule</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#D5D9D9]">
                  <th className="text-left py-3 px-4 font-semibold text-[#0F1111]">Rule Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#0F1111]">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#0F1111]">Total Discount</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#0F1111]">Order Count</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#0F1111]">Avg Discount</th>
                </tr>
              </thead>
              <tbody>
                {analytics.rule_analytics.map((rule, index) => (
                  <tr key={index} className="border-b border-[#D5D9D9] hover:bg-[#F7F8F8]">
                    <td className="py-3 px-4 font-semibold text-[#0F1111]">{rule.rule_name}</td>
                    <td className="py-3 px-4 text-[#565959]">
                      {rule.discount_type === 'percentage' ? 'Percentage' :
                       rule.discount_type === 'fixed_amount' ? 'Fixed Amount' : 'Buy X Get Y'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[#B12704]">
                      ${rule.total_discount_amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-right text-[#565959]">
                      {rule.order_count || 0}
                    </td>
                    <td className="py-3 px-4 text-right text-[#565959]">
                      ${((rule.total_discount_amount || 0) / (rule.order_count || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {(!analytics.rule_analytics || analytics.rule_analytics.length === 0) && (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-[#0F1111] mb-2">No discount data available</h3>
          <p className="text-[#565959]">
            No discounts were applied during the selected date range
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscountAnalytics;
