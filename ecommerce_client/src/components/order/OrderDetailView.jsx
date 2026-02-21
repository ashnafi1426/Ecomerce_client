import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import OrderTimeline from './OrderTimeline'
import OrderStatusBadge from './OrderStatusBadge'

/**
 * OrderDetailView Component
 * 
 * Displays complete order details including timeline, tracking information,
 * items with discounts, and replacement/refund request status.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7
 */
const OrderDetailView = ({ 
  order, 
  onRequestReplacement, 
  onRequestRefund,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900]"></div>
        <p className="ml-4 text-gray-600">Loading order details...</p>
      </div>
    )
  }

  // Enhanced validation - check for critical order properties
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <p className="text-gray-600 mb-4">The order you're looking for doesn't exist</p>
        <Link
          to="/orders"
          className="inline-block px-6 py-2 bg-[#FF9900] hover:bg-[#F08804] text-white rounded font-semibold"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  // Validate critical properties exist
  if (!order.status || !order.created_at && !order.createdAt) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Incomplete Order Data</h2>
        <p className="text-gray-600 mb-4">This order is missing critical information</p>
        <Link
          to="/orders"
          className="inline-block px-6 py-2 bg-[#FF9900] hover:bg-[#F08804] text-white rounded font-semibold"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`
  }


  // Helper function to extract product image with comprehensive null checks
  const getProductImage = (item) => {
    if (!item) return null
    
    // Check all possible image property variations
    const imageUrl = item.product?.image_url || 
                     item.product?.image || 
                     item.product?.imageUrl ||
                     item.image_url || 
                     item.image ||
                     item.imageUrl
    
    // Return null if no valid image URL found (triggers placeholder rendering)
    return imageUrl || null
  }

  // Helper function to extract product title with fallback logic
  const getProductTitle = (item) => {
    if (!item) return 'Product'
    
    // Check all possible title/name property variations
    return item.product?.title || 
           item.product?.name || 
           item.title || 
           item.name || 
           'Product'
  }

  // Helper function to extract product price with null checks
  const getProductPrice = (item) => {
    if (!item) return 0
    
    // Check all possible price property variations
    return item.price || 
           item.product?.price || 
           item.product_price || 
           0
  }

  // Check if order is eligible for replacement/refund - Requirement 10.7
  const isEligibleForReplacementRefund = () => {
    if (!order || order.status !== 'delivered') return false
    
    // Check for delivered_at or deliveredAt with null checks
    const deliveredAtDate = order.delivered_at || order.deliveredAt
    if (!deliveredAtDate) return false
    
    const deliveryDate = new Date(deliveredAtDate)
    if (isNaN(deliveryDate.getTime())) return false
    
    const daysSinceDelivery = (new Date() - deliveryDate) / (1000 * 60 * 60 * 24)
    
    return daysSinceDelivery <= 30
  }

  const eligible = isEligibleForReplacementRefund()

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/orders"
          className="text-[#FF9900] hover:underline mb-2 inline-block"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-gray-600">Order #{order.order_number || (order.id ? order.id.substring(0, 8) : 'N/A')}</p>
      </div>

      {/* Replacement/Refund Eligibility Banner - Enhanced Visibility */}
      {eligible && (order.delivered_at || order.deliveredAt) && (
        <div className="bg-gradient-to-r from-[#FF9900] to-[#F08804] text-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🔄</div>
              <div>
                <h3 className="font-bold text-xl mb-1">Need a Replacement or Refund?</h3>
                <p className="text-sm opacity-90">
                  Your order is eligible for replacement or refund until {
                    new Date(
                      new Date(order.delivered_at || order.deliveredAt).getTime() + 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">30 Days</div>
              <div className="text-sm opacity-90">Return Window</div>
            </div>
          </div>
        </div>
      )}

      {/* Estimated Delivery - Requirement 10.2 */}
      {(order.estimated_delivery || order.estimatedDelivery) && 
       order.status !== 'delivered' && 
       order.status !== 'cancelled' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🚚</div>
            <div>
              <h3 className="font-bold text-lg">Estimated Delivery</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatDate(order.estimated_delivery || order.estimatedDelivery)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Timeline - Requirement 10.1 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
        <OrderTimeline 
          timeline={order.timeline || []}
          currentStatus={order.status}
        />
      </div>

      {/* Tracking Information - Requirement 10.3 */}
      {(order.tracking_number || order.trackingNumber) && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Tracking Information</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="text-lg font-mono font-semibold">{order.tracking_number || order.trackingNumber}</p>
              {order.carrier && (
                <p className="text-sm text-gray-600 mt-1">Carrier: {order.carrier}</p>
              )}
            </div>
            {(order.tracking_url || order.trackingUrl) && (
              <a
                href={order.tracking_url || order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#FF9900] hover:bg-[#F08804] text-white rounded font-semibold"
              >
                Track Package
              </a>
            )}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Order Date</div>
            <div className="font-semibold">{formatDate(order.created_at || order.createdAt)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="font-semibold text-2xl">{formatCurrency(order.total)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className="flex items-center">
              <OrderStatusBadge status={order.status} size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Items - Requirement 10.4, 10.5 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {/* Defensive rendering with null checks */}
          {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
            order.items.map((item, index) => {
              const imageUrl = getProductImage(item)
              const productTitle = getProductTitle(item)
              const productPrice = getProductPrice(item)
              const hasDiscount = item.original_price && item.original_price > productPrice

              return (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  {/* Product Image */}
                  {imageUrl && imageUrl.startsWith('http') ? (
                    <img
                      src={imageUrl}
                      alt={productTitle}
                      className="w-24 h-24 object-cover rounded border"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23f3f4f6" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="32"%3E📦%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl rounded border">
                      📦
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product_id || item.productId}`}
                      className="font-semibold text-lg hover:text-[#FF9900] line-clamp-2"
                    >
                      {productTitle}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity || 1}</p>
                    
                    {/* Price with Discount - Requirement 10.5 */}
                    <div className="mt-2">
                      {hasDiscount ? (
                        <div>
                          <span className="text-sm text-gray-500 line-through mr-2">
                            {formatCurrency(item.original_price)}
                          </span>
                          <span className="text-lg font-bold text-[#FF9900]">
                            {formatCurrency(productPrice)}
                          </span>
                          <span className="ml-2 text-sm text-green-600 font-semibold">
                            Save {formatCurrency(item.original_price - productPrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">
                          {formatCurrency(productPrice)}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Subtotal: {formatCurrency(productPrice * (item.quantity || 1))}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - Requirement 10.7 - Enhanced Visibility */}
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    {eligible && (order.delivered_at || order.deliveredAt) ? (
                      <>
                        <button
                          onClick={() => onRequestReplacement && onRequestReplacement(item)}
                          className="px-4 py-3 bg-[#FF9900] hover:bg-[#F08804] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <span>🔄</span>
                          <span>Request Replacement</span>
                        </button>
                        <button
                          onClick={() => onRequestRefund && onRequestRefund(item)}
                          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <span>💰</span>
                          <span>Request Refund</span>
                        </button>
                        <div className="text-xs text-center text-gray-500 mt-1">
                          ✓ Eligible until {
                            new Date(
                              new Date(order.delivered_at || order.deliveredAt).getTime() + 30 * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()
                          }
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-center text-gray-400 p-2 bg-gray-50 rounded border border-gray-200">
                        {order.status === 'delivered' ? (
                          '30-day return window expired'
                        ) : (
                          'Available after delivery'
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p>No items found in this order</p>
            </div>
          )}
        </div>

        {/* Order Total Breakdown */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(order.subtotal || order.total || 0)}</span>
              </div>
              {order.discount_amount && order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              {order.shipping_cost && order.shipping_cost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">{formatCurrency(order.shipping_cost)}</span>
                </div>
              )}
              {order.tax && order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">{formatCurrency(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(order.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replacement/Refund Requests - Requirement 10.6 */}
      {((order.replacement_requests && order.replacement_requests.length > 0) || 
        (order.refund_requests && order.refund_requests.length > 0)) && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Replacement & Refund Requests</h2>
          
          {order.replacement_requests && order.replacement_requests.length > 0 && 
            order.replacement_requests.map((request, index) => (
              <div key={`replacement-${index}`} className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Replacement Request</h3>
                    <p className="text-sm text-gray-600">Reason: {request.reason || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Status: <span className="font-semibold">{request.status || 'pending'}</span></p>
                    {request.created_at && (
                      <p className="text-sm text-gray-600">Requested: {formatDate(request.created_at)}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(request.status || 'pending').toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          }

          {order.refund_requests && order.refund_requests.length > 0 && 
            order.refund_requests.map((request, index) => (
              <div key={`refund-${index}`} className="mb-4 p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Refund Request</h3>
                    <p className="text-sm text-gray-600">Reason: {request.reason || 'Not specified'}</p>
                    {request.refund_amount && (
                      <p className="text-sm text-gray-600">Amount: {formatCurrency(request.refund_amount)}</p>
                    )}
                    <p className="text-sm text-gray-600">Status: <span className="font-semibold">{request.status || 'pending'}</span></p>
                    {request.created_at && (
                      <p className="text-sm text-gray-600">Requested: {formatDate(request.created_at)}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(request.status || 'pending').toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        {order.shipping_address || order.shippingAddress ? (
          <div className="text-gray-700">
            {(order.shipping_address?.fullName || order.shippingAddress?.fullName) && (
              <>{order.shipping_address?.fullName || order.shippingAddress?.fullName}<br /></>
            )}
            {(order.shipping_address?.addressLine1 || order.shippingAddress?.addressLine1) && (
              <>{order.shipping_address?.addressLine1 || order.shippingAddress?.addressLine1}<br /></>
            )}
            {(order.shipping_address?.addressLine2 || order.shippingAddress?.addressLine2) && (
              <>{order.shipping_address?.addressLine2 || order.shippingAddress?.addressLine2}<br /></>
            )}
            {(order.shipping_address?.city || order.shippingAddress?.city) && (
              <>
                {order.shipping_address?.city || order.shippingAddress?.city}
                {(order.shipping_address?.state || order.shippingAddress?.state) && 
                  `, ${order.shipping_address?.state || order.shippingAddress?.state}`}
                {(order.shipping_address?.postalCode || order.shippingAddress?.postalCode) && 
                  ` ${order.shipping_address?.postalCode || order.shippingAddress?.postalCode}`}
                <br />
              </>
            )}
            {(order.shipping_address?.country || order.shippingAddress?.country) && (
              <>{order.shipping_address?.country || order.shippingAddress?.country}</>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic">
            Shipping address not available
          </div>
        )}
      </div>
    </div>
  )
}

OrderDetailView.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string,
    order_number: PropTypes.string,
    created_at: PropTypes.string,
    createdAt: PropTypes.string,
    total: PropTypes.number,
    status: PropTypes.string,
    estimated_delivery: PropTypes.string,
    estimatedDelivery: PropTypes.string,
    tracking_number: PropTypes.string,
    trackingNumber: PropTypes.string,
    carrier: PropTypes.string,
    tracking_url: PropTypes.string,
    trackingUrl: PropTypes.string,
    timeline: PropTypes.array,
    items: PropTypes.array,
    shipping_address: PropTypes.object,
    shippingAddress: PropTypes.object,
    replacement_requests: PropTypes.array,
    refund_requests: PropTypes.array,
    subtotal: PropTypes.number,
    discount_amount: PropTypes.number,
    shipping_cost: PropTypes.number,
    tax: PropTypes.number
  }),
  onRequestReplacement: PropTypes.func,
  onRequestRefund: PropTypes.func,
  loading: PropTypes.bool
}

export default OrderDetailView
