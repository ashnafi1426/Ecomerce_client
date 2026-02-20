import PropTypes from 'prop-types'

/**
 * OrderTimeline Component
 * 
 * Visual progress indicator showing the order journey with timestamps.
 * Highlights completed steps and current status.
 * 
 * Requirement: 10.1
 */
const OrderTimeline = ({ timeline = [], currentStatus }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      pending_payment: '💳',
      paid: '✅',
      confirmed: '📋',
      packed: '📦',
      shipped: '🚚',
      out_for_delivery: '🚛',
      delivered: '🎉',
      cancelled: '❌',
      refunded: '💰'
    }
    return icons[status] || '📍'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Order Pending',
      pending_payment: 'Awaiting Payment',
      paid: 'Payment Confirmed',
      confirmed: 'Order Confirmed',
      packed: 'Order Packed',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    }
    return labels[status] || status.replace('_', ' ').toUpperCase()
  }

  // Define standard order flow
  const standardFlow = [
    'pending',
    'pending_payment',
    'paid',
    'confirmed',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered'
  ]

  // Build timeline events from history or create from current status
  const timelineEvents = timeline.length > 0 
    ? timeline 
    : [{ status: currentStatus, timestamp: new Date().toISOString() }]

  // Get the index of current status in standard flow
  const currentIndex = standardFlow.indexOf(currentStatus)

  return (
    <div className="relative">
      {/* Timeline Container */}
      <div className="space-y-6">
        {timelineEvents.map((event, index) => {
          const isCompleted = true // All events in timeline are completed
          const isCurrent = event.status === currentStatus
          const isLast = index === timelineEvents.length - 1

          return (
            <div key={index} className="relative flex items-start">
              {/* Timeline Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-300" />
              )}

              {/* Status Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                isCompleted 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-gray-100 border-gray-300'
              }`}>
                <span className="text-2xl">{getStatusIcon(event.status)}</span>
              </div>

              {/* Status Details */}
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-lg ${
                    isCurrent ? 'text-[#FF9900]' : 'text-gray-900'
                  }`}>
                    {getStatusLabel(event.status)}
                    {isCurrent && (
                      <span className="ml-2 text-sm bg-[#FF9900] text-white px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(event.timestamp || event.created_at || event.createdAt)}
                  </span>
                </div>
                
                {event.notes && (
                  <p className="text-sm text-gray-600 mt-1">{event.notes}</p>
                )}
                
                {event.tracking_number && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tracking: <span className="font-mono font-semibold">{event.tracking_number}</span>
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Order Progress</span>
          <span className="text-sm font-semibold text-gray-700">
            {currentIndex >= 0 ? Math.round((currentIndex / (standardFlow.length - 1)) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#FF9900] h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${currentIndex >= 0 ? (currentIndex / (standardFlow.length - 1)) * 100 : 0}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}

OrderTimeline.propTypes = {
  timeline: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    created_at: PropTypes.string,
    createdAt: PropTypes.string,
    notes: PropTypes.string,
    tracking_number: PropTypes.string
  })),
  currentStatus: PropTypes.string.isRequired
}

export default OrderTimeline
