import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

/**
 * RefundRequestList Component
 * 
 * Displays paginated list of customer's refund requests with status filtering.
 * Shows request status, product details, refund amount, and submission date.
 * 
 * Requirement: 3.1
 * Task: 41.1
 */
const RefundRequestList = ({ 
  requests = [], 
  loading = false,
  onLoadMore,
  hasMore = false
}) => {
  const [filter, setFilter] = useState('all')

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '🔄',
      completed: '✅',
      rejected: '❌',
      cancelled: '🚫'
    }
    return icons[status] || '📋'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatReason = (reason) => {
    const reasons = {
      defective: 'Defective Product',
      not_as_described: 'Not As Described',
      wrong_item: 'Wrong Item Received',
      damaged: 'Damaged During Shipping',
      changed_mind: 'Changed Mind',
      better_price: 'Found Better Price',
      quality_issues: 'Quality Issues',
      other: 'Other'
    }
    return reasons[reason] || reason
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Filter requests by status
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter)

  // Count requests by status
  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    processing: requests.filter(r => r.status === 'processing').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900]"></div>
        <p className="ml-4 text-gray-600">Loading refund requests...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
            { value: 'rejected', label: 'Rejected' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === value
                  ? 'bg-[#FF9900] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({statusCounts[value] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-2xl font-bold mb-2">
            {filter === 'all' 
              ? 'No refund requests found' 
              : `No ${filter} refund requests`
            }
          </h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? "You haven't submitted any refund requests yet"
              : `You don't have any ${filter} refund requests`
            }
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold"
            >
              View All Requests
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {request.product?.image_url ? (
                    <img
                      src={request.product.image_url}
                      alt={request.product.title || request.product.name}
                      className="w-32 h-32 object-cover rounded border"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23f3f4f6" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48"%3E💰%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl rounded border">
                      💰
                    </div>
                  )}
                </div>

                {/* Request Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${request.product_id}`}
                        className="font-semibold text-lg hover:text-[#FF9900] line-clamp-2"
                      >
                        {request.product?.title || request.product?.name || 'Product'}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        Request ID: {request.id.substring(0, 8)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)} {request.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Refund Amount - Prominently Displayed */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Refund Amount</p>
                    <p className="text-3xl font-bold text-green-700">
                      {formatCurrency(request.refund_amount || 0)}
                    </p>
                    {request.refund_breakdown && (
                      <div className="mt-2 text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Product Price:</span>
                          <span className="font-semibold">{formatCurrency(request.refund_breakdown.product_price || 0)}</span>
                        </div>
                        {request.refund_breakdown.shipping_cost > 0 && (
                          <div className="flex justify-between">
                            <span>Shipping (proportional):</span>
                            <span className="font-semibold">{formatCurrency(request.refund_breakdown.shipping_cost || 0)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Reason</p>
                      <p className="font-semibold">{formatReason(request.reason)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-semibold">{formatDate(request.created_at)}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{request.description}</p>
                  </div>

                  {/* Photos (Optional) */}
                  {request.photo_urls && request.photo_urls.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Photos ({request.photo_urls.length})</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {request.photo_urls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Photo ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-75"
                            onClick={() => window.open(url, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status-specific Information */}
                  {request.status === 'completed' && request.refund_transaction_id && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm text-green-800 font-semibold mb-1">
                        ✅ Refund Completed
                      </p>
                      <p className="text-sm text-green-700">
                        Your refund of {formatCurrency(request.refund_amount)} has been processed and will appear in your account within 5-10 business days.
                      </p>
                      {request.refund_transaction_id && (
                        <p className="text-xs text-gray-600 mt-2">
                          Transaction ID: {request.refund_transaction_id}
                        </p>
                      )}
                    </div>
                  )}

                  {request.status === 'rejected' && request.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm text-red-800 font-semibold mb-1">
                        ❌ Request Rejected
                      </p>
                      <p className="text-sm text-red-700">
                        Reason: {request.rejection_reason}
                      </p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-yellow-800">
                        ⏳ Your refund request is being reviewed by our team. You'll be notified once a decision is made.
                      </p>
                    </div>
                  )}

                  {request.status === 'processing' && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800">
                        🔄 Your refund has been approved and is being processed. The refund will be issued to your original payment method shortly.
                      </p>
                    </div>
                  )}

                  {/* Order Link */}
                  <div className="mt-3 pt-3 border-t">
                    <Link
                      to={`/orders/${request.order_id}`}
                      className="text-sm text-[#FF9900] hover:underline font-semibold"
                    >
                      View Original Order →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-[#FF9900] hover:bg-[#F08804] text-white rounded-lg font-semibold"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && requests.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9900]"></div>
          <p className="mt-2 text-gray-600">Loading more requests...</p>
        </div>
      )}
    </div>
  )
}

RefundRequestList.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      order_id: PropTypes.string.isRequired,
      product_id: PropTypes.string.isRequired,
      product: PropTypes.object,
      reason: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      photo_urls: PropTypes.array,
      refund_amount: PropTypes.number.isRequired,
      refund_breakdown: PropTypes.shape({
        product_price: PropTypes.number,
        shipping_cost: PropTypes.number
      }),
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      refund_transaction_id: PropTypes.string,
      rejection_reason: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool
}

export default RefundRequestList
