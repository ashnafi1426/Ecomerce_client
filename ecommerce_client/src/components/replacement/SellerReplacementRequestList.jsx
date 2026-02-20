import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

/**
 * SellerReplacementRequestList Component
 * 
 * Displays seller's replacement requests with customer details and photos.
 * Provides approve and reject actions with API calls.
 * 
 * Requirements: 2.2, 2.3, 2.4
 * Tasks: 37.1, 37.2
 */
const SellerReplacementRequestList = ({ 
  requests = [], 
  loading = false,
  onApprove,
  onReject,
  onLoadMore,
  hasMore = false
}) => {
  const [filter, setFilter] = useState('pending')
  const [processingId, setProcessingId] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [expandedPhotos, setExpandedPhotos] = useState({})

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      completed: '📦',
      cancelled: '🚫'
    }
    return icons[status] || '📋'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatReason = (reason) => {
    const reasons = {
      defective: 'Defective Product',
      damaged: 'Damaged During Shipping',
      wrong_item: 'Wrong Item Received',
      missing_parts: 'Missing Parts',
      other: 'Other'
    }
    return reasons[reason] || reason
  }

  // Filter requests by status
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter)

  // Count requests by status
  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }

  // Task 37.2: Handle approve action
  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this replacement request? A new order will be created.')) {
      return
    }

    try {
      setProcessingId(requestId)
      await onApprove(requestId)
      toast.success('Replacement request approved successfully')
    } catch (error) {
      console.error('Approve error:', error)
      toast.error(error.message || 'Failed to approve replacement request')
    } finally {
      setProcessingId(null)
    }
  }

  // Task 37.2: Handle reject action
  const handleRejectClick = (requestId) => {
    setRejectingId(requestId)
    setRejectionReason('')
  }

  const handleRejectSubmit = async (requestId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      setProcessingId(requestId)
      await onReject(requestId, rejectionReason.trim())
      toast.success('Replacement request rejected')
      setRejectingId(null)
      setRejectionReason('')
    } catch (error) {
      console.error('Reject error:', error)
      toast.error(error.message || 'Failed to reject replacement request')
    } finally {
      setProcessingId(null)
    }
  }

  const togglePhotoExpand = (requestId) => {
    setExpandedPhotos(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }))
  }

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900]"></div>
        <p className="ml-4 text-gray-600">Loading replacement requests...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'all', label: 'All' }
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
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">
            {filter === 'all' 
              ? 'No replacement requests found' 
              : `No ${filter} replacement requests`
            }
          </h2>
          <p className="text-gray-600 mb-6">
            {filter === 'pending'
              ? "You don't have any pending replacement requests to review"
              : `You don't have any ${filter} replacement requests`
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
              <div className="flex flex-col gap-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      Replacement Request #{request.id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submitted {formatDate(request.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)} {request.status.toUpperCase()}
                  </span>
                </div>

                {/* Customer Information - Requirement 2.2 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-semibold">
                        {request.customer?.full_name || request.customer?.name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-semibold">
                        {request.customer?.email || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Order ID:</span>
                      <Link
                        to={`/seller/orders/${request.order_id}`}
                        className="ml-2 font-semibold text-[#FF9900] hover:underline"
                      >
                        {request.order_id.substring(0, 8)}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product and Request Details */}
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
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23f3f4f6" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48"%3E📦%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl rounded border">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Request Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${request.product_id}`}
                      className="font-semibold text-lg hover:text-[#FF9900] line-clamp-2 block mb-3"
                    >
                      {request.product?.title || request.product?.name || 'Product'}
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-semibold">{formatReason(request.reason)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Product ID</p>
                        <p className="font-mono text-sm">{request.product_id.substring(0, 16)}...</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Customer Description</p>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded border">
                        {request.description}
                      </p>
                    </div>

                    {/* Customer Photos - Requirement 2.2 */}
                    {request.photo_urls && request.photo_urls.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">
                            Customer Photos ({request.photo_urls.length})
                          </p>
                          {request.photo_urls.length > 3 && (
                            <button
                              onClick={() => togglePhotoExpand(request.id)}
                              className="text-sm text-[#FF9900] hover:underline"
                            >
                              {expandedPhotos[request.id] ? 'Show Less' : 'Show All'}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {(expandedPhotos[request.id] ? request.photo_urls : request.photo_urls.slice(0, 3)).map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => window.open(url, '_blank')}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Task 37.2 */}
                {request.status === 'pending' && (
                  <div className="pt-4 border-t">
                    {rejectingId === request.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Rejection Reason <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejecting this request..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setRejectingId(null)
                              setRejectionReason('')
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                            disabled={processingId === request.id}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleRejectSubmit(request.id)}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50"
                            disabled={processingId === request.id || !rejectionReason.trim()}
                          >
                            {processingId === request.id ? 'Rejecting...' : 'Confirm Rejection'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRejectClick(request.id)}
                          className="flex-1 px-6 py-3 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                          disabled={processingId === request.id}
                        >
                          ❌ Reject
                        </button>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="animate-spin">⏳</span>
                              Approving...
                            </span>
                          ) : (
                            '✅ Approve & Create Replacement Order'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Status Information for Processed Requests */}
                {request.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="text-sm text-green-800 font-semibold mb-1">
                      ✅ Request Approved
                    </p>
                    {request.replacement_order_id && (
                      <Link
                        to={`/seller/orders/${request.replacement_order_id}`}
                        className="text-sm text-[#FF9900] hover:underline font-semibold"
                      >
                        View Replacement Order →
                      </Link>
                    )}
                  </div>
                )}

                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-sm text-red-800 font-semibold mb-1">
                      ❌ Request Rejected
                    </p>
                    <p className="text-sm text-red-700">
                      Reason: {request.rejection_reason}
                    </p>
                  </div>
                )}
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

SellerReplacementRequestList.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      order_id: PropTypes.string.isRequired,
      product_id: PropTypes.string.isRequired,
      product: PropTypes.object,
      customer: PropTypes.object,
      reason: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      photo_urls: PropTypes.array,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      replacement_order_id: PropTypes.string,
      rejection_reason: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool
}

export default SellerReplacementRequestList
