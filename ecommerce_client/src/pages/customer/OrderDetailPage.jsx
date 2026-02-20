import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../config/api'
import { toast } from 'react-toastify'
import StartChatButton from '../../components/chat/StartChatButton'
import OrderDetailView from '../../components/order/OrderDetailView'
import RealTimeStatusUpdater from '../../components/order/RealTimeStatusUpdater'
import ReplacementRequestForm from '../../components/replacement/ReplacementRequestForm'
import RefundRequestForm from '../../components/refund/RefundRequestForm'
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

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      console.log('Fetching order:', orderId)
      const response = await api.get(`/orders/${orderId}`)
      console.log('Order data received from interceptor:', response)
      
      // The API interceptor already extracts response.data
      // If the API returns { success: true, data: {...} }, we need response.data
      // If the API returns just the order object, we use response directly
      const orderData = response.data || response
      console.log('Extracted order data:', orderData)
      console.log('Setting order to state:', orderData)
      setOrder(orderData)
    } catch (error) {
      console.error('Failed to fetch order:', orderId, error)
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
        <OrderDetailView
          order={order}
          loading={loading}
          onRequestReplacement={handleRequestReplacement}
          onRequestRefund={handleRequestRefund}
        />

        {/* Replacement Request Modal - Task 38 */}
        {showReplacementModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ReplacementRequestForm
                orderId={orderId}
                productId={selectedItem.product_id || selectedItem.productId}
                productName={selectedItem.product?.title || selectedItem.product?.name || selectedItem.title || 'Product'}
                onSubmit={handleReplacementSubmit}
                onCancel={() => {
                  setShowReplacementModal(false)
                  setSelectedItem(null)
                }}
                loading={submittingReplacement}
              />
            </div>
          </div>
        )}

        {/* Refund Request Modal - Task 40.2 */}
        {showRefundModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <RefundRequestForm
                orderId={orderId}
                productId={selectedItem.product_id || selectedItem.productId}
                productName={selectedItem.product?.title || selectedItem.product?.name || selectedItem.title || 'Product'}
                onSubmit={handleRefundSubmit}
                onCancel={() => {
                  setShowRefundModal(false)
                  setSelectedItem(null)
                }}
                loading={submittingRefund}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetailPage
