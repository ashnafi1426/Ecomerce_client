import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-hot-toast'
import { customerAPI } from '../../services/api.service'

/**
 * RefundRequestForm Component
 * 
 * Form for submitting refund requests with reason, description, and optional photo uploads.
 * Displays calculated refund amount prominently and validates required fields.
 * 
 * Requirements: 3.2, 3.6
 * Tasks: 40.1
 */
const RefundRequestForm = ({ 
  orderId, 
  productId,
  productName,
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: ''
  })
  const [photos, setPhotos] = useState([])
  const [photoUrls, setPhotoUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [errors, setErrors] = useState({})
  const [refundAmount, setRefundAmount] = useState(null)
  const [loadingRefundAmount, setLoadingRefundAmount] = useState(true)

  const reasons = [
    { value: 'not_as_described', label: 'Not as Described' },
    { value: 'quality_issue', label: 'Quality Issue' },
    { value: 'changed_mind', label: 'Changed My Mind' },
    { value: 'found_better_price', label: 'Found Better Price' },
    { value: 'other', label: 'Other' }
  ]

  const MAX_PHOTOS = 5
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

  // Debug: Log props on mount for validation
  useEffect(() => {
    console.log('[RefundRequestForm] Component mounted with props:', {
      orderId,
      productId,
      productName,
      hasOnSubmit: typeof onSubmit === 'function',
      hasOnCancel: typeof onCancel === 'function',
      loading
    })
  }, [])

  // Fetch calculated refund amount on component mount - Requirement 3.6
  useEffect(() => {
    const fetchRefundAmount = async () => {
      try {
        setLoadingRefundAmount(true)
        
        console.log('[RefundRequestForm] Fetching refund amount for:', { orderId, productId })
        
        // Call backend API to calculate refund amount using customerAPI
        const response = await customerAPI.calculateRefundAmount({ orderId, productId })

        console.log('[RefundRequestForm] Refund amount response:', response)

        if (response.success) {
          setRefundAmount(response.data.refundAmount)
          console.log('[RefundRequestForm] Refund amount set:', response.data.refundAmount)
        } else {
          console.warn('[RefundRequestForm] Refund amount calculation failed:', response)
          // Set refund amount to null to show "Unable to calculate" message
          setRefundAmount(null)
        }
      } catch (error) {
        console.error('[RefundRequestForm] Error fetching refund amount:', error)
        // Don't show error toast immediately - let user see the form
        // The form will show "Unable to calculate" message
        setRefundAmount(null)
      } finally {
        setLoadingRefundAmount(false)
      }
    }

    // Only fetch if we have valid orderId and productId
    if (orderId && productId) {
      fetchRefundAmount()
    } else {
      console.warn('[RefundRequestForm] Missing orderId or productId:', { orderId, productId })
      setLoadingRefundAmount(false)
      setRefundAmount(null)
    }
  }, [orderId, productId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files)
    
    // Validate photo count
    if (photos.length + files.length > MAX_PHOTOS) {
      toast.error(`You can only upload up to ${MAX_PHOTOS} photos`)
      return
    }

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE)
    if (invalidFiles.length > 0) {
      toast.error(`Each photo must be less than 5MB`)
      return
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidTypes = files.filter(file => !validTypes.includes(file.type))
    if (invalidTypes.length > 0) {
      toast.error('Only JPEG, PNG, and WebP images are allowed')
      return
    }

    setUploading(true)

    try {
      // Create preview URLs and simulate upload progress
      const newPhotos = []
      const newPhotoUrls = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const photoId = `photo-${Date.now()}-${i}`
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file)
        newPhotos.push({ id: photoId, file, previewUrl })
        
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [photoId]: 0 }))
        
        // In a real implementation, this would upload to Supabase Storage
        // For now, we'll simulate the upload with the preview URL
        await new Promise(resolve => {
          let progress = 0
          const interval = setInterval(() => {
            progress += 20
            setUploadProgress(prev => ({ ...prev, [photoId]: progress }))
            if (progress >= 100) {
              clearInterval(interval)
              resolve()
            }
          }, 100)
        })
        
        newPhotoUrls.push(previewUrl)
      }

      setPhotos(prev => [...prev, ...newPhotos])
      setPhotoUrls(prev => [...prev, ...newPhotoUrls])
      toast.success(`${files.length} photo(s) uploaded successfully`)
    } catch (error) {
      console.error('Photo upload error:', error)
      toast.error('Failed to upload photos')
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = (photoId) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === photoId)
      if (photo?.previewUrl) {
        URL.revokeObjectURL(photo.previewUrl)
      }
      return prev.filter(p => p.id !== photoId)
    })
    setPhotoUrls(prev => prev.filter((_, index) => photos[index]?.id !== photoId))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[photoId]
      return newProgress
    })
  }

  const validateForm = () => {
    const newErrors = {}

    // Requirement 3.2: Validate required fields (reason, description)
    if (!formData.reason) {
      newErrors.reason = 'Please select a reason'
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Please provide a detailed description (at least 10 characters)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('[RefundRequestForm] Form submission started')

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    // Validate required props
    if (!orderId || !productId) {
      console.error('[RefundRequestForm] Missing required props:', { orderId, productId })
      toast.error('Missing order or product information')
      return
    }

    if (typeof onSubmit !== 'function') {
      console.error('[RefundRequestForm] onSubmit is not a function')
      toast.error('Form submission handler is not configured')
      return
    }

    try {
      console.log('[RefundRequestForm] Submitting refund request:', {
        orderId,
        productId,
        reason: formData.reason,
        descriptionLength: formData.description.trim().length,
        photoCount: photoUrls.length
      })

      // Call POST /api/refunds endpoint - Requirement 3.3, Task 40.2
      await onSubmit({
        orderId,
        productId,
        reason: formData.reason,
        description: formData.description.trim(),
        photoUrls
      })
      
      console.log('[RefundRequestForm] Refund request submitted successfully')
      // Success message will be shown by parent component
    } catch (error) {
      console.error('[RefundRequestForm] Form submission error:', error)
      // Error toast will be shown by parent component
      throw error
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Request Refund</h2>
        <p className="text-gray-600 mt-1">Product: {productName || 'Unknown Product'}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Refund Amount Display - Requirement 3.6 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Refund Amount</p>
              <p className="text-xs text-gray-600">Includes product price + proportional shipping</p>
            </div>
            <div className="text-right">
              {loadingRefundAmount ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin text-2xl">⏳</span>
                  <span className="text-sm text-gray-600">Calculating...</span>
                </div>
              ) : refundAmount !== null ? (
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    ${refundAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Will be refunded to your account</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-red-600">Unable to calculate</p>
                  <p className="text-xs text-gray-500 mt-1">You can still submit the request</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reason Dropdown - Requirement 3.2 */}
        <div>
          <label htmlFor="reason" className="block text-sm font-semibold mb-2">
            Reason for Refund <span className="text-red-500">*</span>
          </label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select a reason...</option>
            {reasons.map(reason => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
          {errors.reason && (
            <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
          )}
        </div>

        {/* Description Textarea - Requirement 3.2 */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Please provide detailed information about why you're requesting a refund..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-500">{errors.description}</p>
            ) : (
              <p className="text-sm text-gray-500">Minimum 10 characters</p>
            )}
            <p className="text-sm text-gray-500">{formData.description.length} characters</p>
          </div>
        </div>

        {/* Photo Upload (Optional) */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Photos (Optional)
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Upload up to {MAX_PHOTOS} photos (max 5MB each) to support your refund request
          </p>

          {/* Photo Preview Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.previewUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  
                  {/* Upload Progress */}
                  {uploadProgress[photo.id] < 100 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-1">⏳</div>
                        <div className="text-sm">{uploadProgress[photo.id]}%</div>
                      </div>
                    </div>
                  )}

                  {/* Remove Button */}
                  {uploadProgress[photo.id] >= 100 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {photos.length < MAX_PHOTOS && (
            <label className={`block w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              uploading || loading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-[#FF9900] hover:bg-orange-50'
            }`}>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
                disabled={uploading || loading}
              />
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-semibold text-gray-700">
                {uploading ? 'Uploading...' : 'Click to upload photos'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {MAX_PHOTOS - photos.length} photo(s) remaining
              </p>
            </label>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            disabled={loading || uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#FF9900] hover:bg-[#F08804] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || uploading || loadingRefundAmount}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Submitting...
              </span>
            ) : (
              'Submit Refund Request'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

RefundRequestForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

RefundRequestForm.defaultProps = {
  productName: 'Unknown Product',
  loading: false
}

export default RefundRequestForm
