import PropTypes from 'prop-types'
/**
 * OrderStatusBadge Component
 * Displays order status with color-coded badges.
 * Color coding: yellow=pending, blue=confirmed, purple=shipped, green=delivered
 * Requirement: 9.6
 */
const OrderStatusBadge = ({ status, size = 'md' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'Pending',
        icon: '⏳'
      },
      pending_payment: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'Pending Payment',
        icon: '💳'
      },
      paid: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        label: 'Paid',
        icon: '✅'
      },
      confirmed: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        label: 'Confirmed',
        icon: '📋'
      },
      packed: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        label: 'Packed',
        icon: '📦'
      },
      shipped: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        label: 'Shipped',
        icon: '🚚'
      },
      out_for_delivery: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        label: 'Out for Delivery',
        icon: '🚛'
      },
      delivered: {
        color: 'bg-green-100 text-green-800 border-green-300',
        label: 'Delivered',
        icon: '🎉'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-300',
        label: 'Cancelled',
        icon: '❌'
      },
      refunded: {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        label: 'Refunded',
        icon: '💰'
      }
    }

    return configs[status] || {
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      label: status.replace('_', ' ').toUpperCase(),
      icon: '📍'
    }
  }

  const getSizeClasses = (size) => {
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    }
    return sizes[size] || sizes.md
  }

  const config = getStatusConfig(status)
  const sizeClasses = getSizeClasses(size)

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${config.color} ${sizeClasses}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
}

export default OrderStatusBadge
