import { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-hot-toast'
import io from 'socket.io-client'

/**
 * RealTimeStatusUpdater Component
 * 
 * Establishes WebSocket connection for real-time order status updates.
 * Handles reconnection with exponential backoff and falls back to polling.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7
 */
const RealTimeStatusUpdater = ({ 
  orderId, 
  onStatusUpdate, 
  onTrackingUpdate,
  pollingInterval = 30000 // 30 seconds
}) => {
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const socketRef = useRef(null)
  const pollingIntervalRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const MAX_RECONNECT_ATTEMPTS = 3
  const RECONNECT_DELAYS = [1000, 2000, 4000] // Exponential backoff: 1s, 2s, 4s

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  // Polling fallback - Requirement 11.7
  const startPolling = useCallback(() => {
    console.log('📊 Starting polling fallback...')
    
    const poll = async () => {
      try {
        const token = getAuthToken()
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (onStatusUpdate) {
            onStatusUpdate({
              status: data.status,
              timestamp: new Date().toISOString()
            })
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }

    // Poll immediately and then at intervals
    poll()
    pollingIntervalRef.current = setInterval(poll, pollingInterval)
  }, [orderId, onStatusUpdate, pollingInterval])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      console.log('📊 Polling stopped')
    }
  }, [])

  // Connect to WebSocket - Requirement 11.1
  const connectWebSocket = useCallback(() => {
    const token = getAuthToken()
    if (!token) {
      console.error('No auth token found')
      setConnectionStatus('error')
      return
    }

    console.log('🔌 Connecting to WebSocket...')
    setConnectionStatus('connecting')

    const socket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`, {
      auth: { token },
      query: { orderId },
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('✅ WebSocket connected')
      setConnectionStatus('connected')
      setReconnectAttempts(0)
      stopPolling() // Stop polling if it was running
      
      // Join order room
      socket.emit('join_order', orderId)
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason)
      setConnectionStatus('disconnected')
      
      // Attempt reconnection if not a manual disconnect
      if (reason !== 'io client disconnect') {
        handleReconnection()
      }
    })

    // Listen for status updates - Requirement 11.2, 11.3
    socket.on('status_update', (update) => {
      console.log('📢 Status update received:', update)
      
      if (onStatusUpdate) {
        onStatusUpdate(update)
      }
      
      // Show toast notification - Requirement 11.3
      toast.success(`Order status updated: ${update.status}`, {
        icon: '📦',
        duration: 4000
      })
    })

    // Listen for tracking updates - Requirement 11.4
    socket.on('tracking_update', (update) => {
      console.log('📍 Tracking update received:', update)
      
      if (onTrackingUpdate) {
        onTrackingUpdate(update)
      }
      
      // Show toast notification - Requirement 11.4
      toast.success(`Tracking number added: ${update.tracking_number}`, {
        icon: '🚚',
        duration: 4000
      })
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      setConnectionStatus('error')
      handleReconnection()
    })

    socketRef.current = socket
  }, [orderId, onStatusUpdate, onTrackingUpdate, stopPolling])

  // Handle reconnection with exponential backoff - Requirement 11.6
  const handleReconnection = useCallback(() => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('❌ Max reconnection attempts reached, falling back to polling')
      setConnectionStatus('polling')
      startPolling()
      return
    }

    const delay = RECONNECT_DELAYS[reconnectAttempts] || 4000
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`)
    setConnectionStatus('reconnecting')

    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1)
      connectWebSocket()
    }, delay)
  }, [reconnectAttempts, connectWebSocket, startPolling])

  // Initialize connection
  useEffect(() => {
    connectWebSocket()

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      stopPolling()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connectWebSocket, stopPolling])

  // Connection Status Indicator - Requirement 11.5
  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: '🟢',
          text: 'Connected',
          color: 'text-green-600'
        }
      case 'connecting':
        return {
          icon: '🟡',
          text: 'Connecting...',
          color: 'text-yellow-600'
        }
      case 'reconnecting':
        return {
          icon: '🟡',
          text: `Reconnecting... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
          color: 'text-yellow-600'
        }
      case 'polling':
        return {
          icon: '🔵',
          text: 'Polling mode',
          color: 'text-blue-600'
        }
      case 'disconnected':
        return {
          icon: '🔴',
          text: 'Disconnected',
          color: 'text-red-600'
        }
      case 'error':
        return {
          icon: '🔴',
          text: 'Connection error',
          color: 'text-red-600'
        }
      default:
        return {
          icon: '⚪',
          text: 'Unknown',
          color: 'text-gray-600'
        }
    }
  }

  const status = getStatusDisplay()

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-lg">{status.icon}</span>
      <span className={`font-medium ${status.color}`}>
        {status.text}
      </span>
      {connectionStatus === 'reconnecting' && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600" />
      )}
    </div>
  )
}

RealTimeStatusUpdater.propTypes = {
  orderId: PropTypes.string.isRequired,
  onStatusUpdate: PropTypes.func,
  onTrackingUpdate: PropTypes.func,
  pollingInterval: PropTypes.number
}

export default RealTimeStatusUpdater
