import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../config/api'
import { toast } from 'react-toastify'
import StartChatButton from '../../components/chat/StartChatButton'
import OrderDetailView from '../../components/order/OrderDetailView'
import RealTimeStatusUpdater from '../../components/order/RealTimeStatusUpdater'
import ReplacementRequestForm from '../../components/replacement/ReplacementRequestForm'
import RefundRequestForm from '../../components/refund/RefundRequestForm'
import ErrorBoundary from '../../components/common/ErrorBoundary'
import { customerAPI } from '../../services/api.service'

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReplacementModal, setShowReplacementModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [submittingReplacement, setSubmittingReplacement] = useState(false)
  const [submittingRefund, setSubmittingRefund] = useState(false)

  // Debug: Log modal state changes
  useEffect(() => {
    console.log('Modal state changed:', {
      showReplacementModal,
      showRefundModal,
      hasSelectedItem: !!selectedItem,
      selectedItemProductId: selectedItem?.product_id || selectedItem?.productId
    })
  }, [showReplacementModal, showRefundModal, selectedItem])

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      console.log('Fetching order:', orderId)
      const response = await api.get(`/orders/${orderId}`)
      console.log('Raw API response:', response)
      
      // Extract order data from API response
      // The API may return various structures, so we need to handle them all
      let orderData = response
      
      // Step 1: Extract from response.data if it exists
      if (response && response.data) {
        console.log('Step 1 - Found response.data:', response.data)
        orderData = response.data
      }
      
      // Step 2: If there's a success wrapper, extract the nested data
      if (orderData && orderData.success && orderData.data) {
        console.log('Step 2 - Found success wrapper, extracting nested data')
        orderData = orderData.data
      }
      
      // Step 3: If order data is wrapped in an 'order' property, extract it
      // but preserve top-level enhancement properties
      if (orderData && orderData.order && typeof orderData.order === 'object') {
        console.log('Step 3 - Found nested order structure')
        const nestedOrder = orderData.order
        
        // Merge nested order with top-level enhancement properties
        // Only merge if top-level properties exist and are not empty
        orderData = {
          ...nestedOrder,
          // Preserve enhancement properties from top level if they exist
          timeline: (orderData.timeline && orderData.timeline.length > 0) ? orderData.timeline : (nestedOrder.timeline || []),
          trackingInfo: orderData.trackingInfo || nestedOrder.trackingInfo || null,
          estimatedDelivery: orderData.estimatedDelivery || nestedOrder.estimatedDelivery,
          replacementRequests: (orderData.replacementRequests && orderData.replacementRequests.length > 0) ? orderData.replacementRequests : (nestedOrder.replacementRequests || []),
          refundRequests: (orderData.refundRequests && orderData.refundRequests.length > 0) ? orderData.refundRequests : (nestedOrder.refundRequests || [])
        }
        console.log('Step 3 - Merged order data')
      }
      
      console.log('Extracted order data:', orderData)
      
      // Step 4: Normalize property names (handle both snake_case and camelCase)
      const normalizedOrder = {
        ...orderData,
        // Ensure items is always an array
        items: orderData.items || orderData.order_items || [],
        // Normalize date property
        created_at: orderData.created_at || orderData.createdAt,
        // Normalize shipping address property
        shipping_address: orderData.shipping_address || orderData.shippingAddress,
        // Ensure optional properties have defaults
        timeline: orderData.timeline || [],
        trackingInfo: orderData.trackingInfo || null,
        replacementRequests: orderData.replacementRequests || [],
        refundRequests: orderData.refundRequests || []
      }
      
      console.log('Normalized order data:', normalizedOrder)
      
      // Step 5: Enhanced validation - check all critical properties
      const validationErrors = []
      
      if (!normalizedOrder.status) {
        validationErrors.push('status')
      }
      if (!normalizedOrder.created_at) {
        validationErrors.push('created_at/createdAt')
      }
      if (normalizedOrder.total === undefined || normalizedOrder.total === null) {
        validationErrors.push('total')
      }
      if (!normalizedOrder.shipping_address) {
        validationErrors.push('shipping_address/shippingAddress')
      }
      if (!normalizedOrder.items || normalizedOrder.items.length === 0) {
        console.warn('Order has no items - this may be valid for some order states')
      }
      
      if (validationErrors.length > 0) {
        console.error('Invalid order data - missing required fields:', validationErrors)
        console.error('Order data received:', normalizedOrder)
        toast.error(`Invalid order data: missing ${validationErrors.join(', ')}`)
        return
      }
      
      console.log('Validation passed - setting order to state')
      setOrder(normalizedOrder)
    } catch (error) {
      console.error('Failed to fetch order:', orderId, error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      toast.error(`Failed to load order details (ID: ${orderId})`)
    } finally {
      setLoading(false)
    }
  }

  // Handle real-time status updates
  const handleStatusUpdate = (update) => {
    console.log('📢 Received status update:', update)
    setOrder(prevOrder => ({
      ...prevOrder,
      status: update.status,
      timeline: [
        ...(prevOrder.timeline || []),
        {
          status: update.status,
          timestamp: update.timestamp,
          notes: update.message
        }
      ]
    }))
  }

  // Handle real-time tracking updates
  const handleTrackingUpdate = (update) => {
    console.log('📍 Received tracking update:', update)
    setOrder(prevOrder => ({
      ...prevOrder,
      tracking_number: update.tracking_number,
      carrier: update.carrier,
      tracking_url: update.tracking_url
    }))
  }

  // Handle replacement request - Task 38
  const handleRequestReplacement = (item) => {
    console.log('Request replacement for item:', item)
    
    // Validate item has required data
    if (!item) {
      console.error('Cannot request replacement: item is null or undefined')
      toast.error('Unable to process replacement request - invalid item data')
      return
    }
    
    // Extract product ID with fallback
    const productId = item.product_id || item.productId
    if (!productId) {
      console.error('Cannot request replacement: missing product_id', item)
      toast.error('Unable to process replacement request - missing product ID')
      return
    }
    
    console.log('Opening replacement modal for product:', productId)
    setSelectedItem(item)
    setShowReplacementModal(true)
  }

  // Handle replacement form submission - Task 38
  const handleReplacementSubmit = async (formData) => {
    try {
      setSubmittingReplacement(true)
      
      // Call POST /api/replacements endpoint
      await customerAPI.createReplacementRequest(formData)
      
      toast.success('Replacement request submitted successfully!')
      setShowReplacementModal(false)
      setSelectedItem(null)
      
      // Refresh order to show the new replacement request
      await fetchOrderDetail()
    } catch (error) {
      console.error('Failed to submit replacement request:', error)
      throw error // Let the form component handle the error
    } finally {
      setSubmittingReplacement(false)
    }
  }

  // Handle refund request - Task 40.2
  const handleRequestRefund = (item) => {
    console.log('Request refund for item:', item)
    
    // Validate item has required data
    if (!item) {
      console.error('Cannot request refund: item is null or undefined')
      toast.error('Unable to process refund request - invalid item data')
      return
    }
    
    // Extract product ID with fallback
    const productId = item.product_id || item.productId
    if (!productId) {
      console.error('Cannot request refund: missing product_id', item)
      toast.error('Unable to process refund request - missing product ID')
      return
    }
    
    console.log('Opening refund modal for product:', productId)
    setSelectedItem(item)
    setShowRefundModal(true)
  }

  // Handle refund form submission - Task 40.2
  const handleRefundSubmit = async (formData) => {
    try {
      setSubmittingRefund(true)
      
      // Call POST /api/refunds endpoint - Requirement 3.3
      await customerAPI.createRefundRequest(formData)
      
      toast.success('Refund request submitted successfully!')
      setShowRefundModal(false)
      setSelectedItem(null)
      
      // Refresh order to show the new refund request
      await fetchOrderDetail()
    } catch (error) {
      console.error('Failed to submit refund request:', error)
      throw error // Let the form component handle the error
    } finally {
      setSubmittingRefund(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Debug: Log callback availability */}
        {order && !loading && console.log('OrderDetailPage callbacks:', {
          hasReplacementCallback: !!handleRequestReplacement,
          hasRefundCallback: !!handleRequestRefund,
          orderStatus: order.status,
          orderItems: order.items?.length || 0
        })}

        {/* Real-Time Status Updater */}
        {order && !loading && (
          <div className="mb-4 flex justify-end">
            <RealTimeStatusUpdater
              orderId={orderId}
              onStatusUpdate={handleStatusUpdate}
              onTrackingUpdate={handleTrackingUpdate}
            />
          </div>
        )}

        {/* Contact Support Buttons */}
        {order && !loading && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex gap-3">
              <StartChatButton
                recipientId="support"
                recipientName="Customer Support"
                recipientRole="admin"
                metadata={{
                  type: 'order_support',
                  orderId: order.id,
                  orderStatus: order.status
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                💬 Contact Support
              </StartChatButton>
              
              {order.seller_id && (
                <StartChatButton
                  recipientId={order.seller_id}
                  recipientName={order.seller_name || 'Seller'}
                  recipientRole="seller"
                  metadata={{
                    type: 'order_inquiry',
                    orderId: order.id,
                    orderNumber: order.order_number || order.id,
                    orderStatus: order.status
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors border border-gray-300"
                >
                  💬 Message Seller
                </StartChatButton>
              )}
            </div>
          </div>
        )}

        {/* Order Detail View Component */}
        <ErrorBoundary
          fallbackMessage="Failed to load order details. Please try refreshing the page."
          onReset={() => {
            setLoading(true)
            fetchOrderDetail()
          }}
        >
          <OrderDetailView
            order={order}
            loading={loading}
            onRequestReplacement={handleRequestReplacement}
            onRequestRefund={handleRequestRefund}
          />
        </ErrorBoundary>

        {/* Replacement Request Modal - Task 38 */}
        {showReplacementModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ErrorBoundary
                fallbackMessage="Failed to load replacement request form. Please try again."
                onReset={() => {
                  setShowReplacementModal(false)
                  setSelectedItem(null)
                }}
              >
                <ReplacementRequestForm
                  orderId={orderId}
                  productId={selectedItem.product_id || selectedItem.productId || ''}
                  productName={
                    selectedItem.product?.title || 
                    selectedItem.product?.name || 
                    selectedItem.title || 
                    selectedItem.name ||
                    'Product'
                  }
                  onSubmit={handleReplacementSubmit}
                  onCancel={() => {
                    console.log('Closing replacement modal')
                    setShowReplacementModal(false)
                    setSelectedItem(null)
                  }}
                  loading={submittingReplacement}
                />
              </ErrorBoundary>
            </div>
          </div>
        )}

        {/* Refund Request Modal - Task 40.2 */}
        {showRefundModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ErrorBoundary
                fallbackMessage="Failed to load refund request form. Please try again."
                onReset={() => {
                  setShowRefundModal(false)
                  setSelectedItem(null)
                }}
              >
                <RefundRequestForm
                  orderId={orderId}
                  productId={selectedItem.product_id || selectedItem.productId || ''}
                  productName={
                    selectedItem.product?.title || 
                    selectedItem.product?.name || 
                    selectedItem.title || 
                    selectedItem.name ||
                    'Product'
                  }
                  onSubmit={handleRefundSubmit}
                  onCancel={() => {
                    console.log('Closing refund modal')
                    setShowRefundModal(false)
                    setSelectedItem(null)
                  }}
                  loading={submittingRefund}
                />
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetailPage
