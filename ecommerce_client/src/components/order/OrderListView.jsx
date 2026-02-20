import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

/**
 * OrderListView Component
 * 
 * Displays a paginated list of orders with status badges and product thumbnails.
 * Supports filtering by status and searching by order number/product name.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */
const OrderListView = ({ orders, onOrderClick, loading = false }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      pending_payment: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusDisplayName = (status) => {
    const displayNames = {
      pending: 'Pending',
      pending_payment: 'Pending Payment',
      paid: 'Paid',
      confirmed: 'Confirmed',
      packed: 'Packed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    }
    return displayNames[status] || status
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`
  }

  const getProductThumbnail = (item) => {
    // Try different possible image URL fields
    const imageUrl = item.product?.image_url || 
                     item.product?.image || 
                     item.image_url || 
                     item.image

    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl
    }
    return null
  }

  const handleOrderClick = (orderId) => {
    if (onOrderClick) {
      onOrderClick(orderId)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900]"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-2">No orders found</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
        <Link
          to="/"
          className="inline-block bg-[#FF9900] hover:bg-[#F08804] text-white px-8 py-3 rounded font-semibold"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleOrderClick(order.id)}
        >
          {/* Order Header - Requirement 9.2 */}
          <div className="bg-gray-50 px-6 py-4 border-b grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 uppercase">Order Placed</div>
              <div className="font-semibold">{formatDate(order.created_at || order.createdAt)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase">Total</div>
              <div className="font-semibold">{formatCurrency(order.total)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase">Ship To</div>
              <div className="font-semibold truncate">
                {order.shipping_address?.fullName || 
                 order.shippingAddress?.fullName || 
                 'N/A'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600 uppercase mb-1">
                Order # {order.order_number || order.id.substring(0, 8)}
              </div>
              {/* Status Badge - Requirement 9.6 */}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {getStatusDisplayName(order.status)}
              </span>
            </div>
          </div>

          {/* Order Items with Thumbnails - Requirement 9.2 */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Product Thumbnails */}
              <div className="flex -space-x-2">
                {order.items?.slice(0, 3).map((item, index) => {
                  const thumbnailUrl = getProductThumbnail(item)
                  return (
                    <div key={index} className="relative">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={item.product?.title || item.product?.name || item.title || 'Product'}
                          className="w-16 h-16 object-cover rounded border-2 border-white"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f3f4f6" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3E📦%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl rounded border-2 border-white">
                          📦
                        </div>
                      )}
                    </div>
                  )
                })}
                {order.items?.length > 3 && (
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs font-semibold rounded border-2 border-white">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                </h3>
                <p className="text-sm text-gray-600">
                  {order.status === 'delivered' ? 'Delivered' : 
                   order.status === 'shipped' ? 'On the way' :
                   order.status === 'packed' ? 'Packed and ready to ship' :
                   order.status === 'confirmed' ? 'Order confirmed' :
                   order.status === 'paid' ? 'Payment received' :
                   order.status === 'pending_payment' ? 'Awaiting payment' :
                   order.status === 'cancelled' ? 'Cancelled' : 
                   order.status === 'refunded' ? 'Refunded' : 'Processing'}
                </p>
              </div>

              {/* View Details Link - Requirement 9.5 */}
              <Link
                to={`/orders/${order.id}`}
                onClick={(e) => e.stopPropagation()}
                className="px-6 py-2 bg-[#FF9900] hover:bg-[#F08804] text-white rounded font-semibold whitespace-nowrap"
              >
                View Details
              </Link>
            </div>

            {/* First Item Preview */}
            {order.items && order.items.length > 0 && (
              <div className="text-sm text-gray-600 border-t pt-4">
                <span className="font-medium">
                  {order.items[0].product?.title || 
                   order.items[0].product?.name || 
                   order.items[0].title || 
                   'Product'}
                </span>
                {order.items.length > 1 && (
                  <span> and {order.items.length - 1} more {order.items.length === 2 ? 'item' : 'items'}</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

OrderListView.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    order_number: PropTypes.string,
    created_at: PropTypes.string,
    createdAt: PropTypes.string,
    total: PropTypes.number,
    status: PropTypes.string.isRequired,
    shipping_address: PropTypes.object,
    shippingAddress: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.object)
  })).isRequired,
  onOrderClick: PropTypes.func,
  loading: PropTypes.bool
}

export default OrderListView
