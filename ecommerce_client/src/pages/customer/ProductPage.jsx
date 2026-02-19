import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import api from '../../config/api'
import StartChatButton from '../../components/chat/StartChatButton'
import './ProductPage.css'

// Amazon-style PDP Components
import ProductBadges from '../../components/product/ProductBadges'
import ProductFeatures from '../../components/product/ProductFeatures'
import ProductSpecs from '../../components/product/ProductSpecs'
import ReviewSection from '../../components/product/ReviewSection'
import QASection from '../../components/product/QASection'

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [productImages, setProductImages] = useState([])
  const [reviewSummary, setReviewSummary] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [inventoryStatus, setInventoryStatus] = useState(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  
  // Animation states
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [showRatingTooltip, setShowRatingTooltip] = useState(false)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log('Fetching product with ID:', id)
        
        // Fetch product details
        const productData = await api.get(`/products/${id}`)
        console.log('Product data received:', productData)
        setProduct(productData)
        
        // Fetch product images
        try {
          const imagesData = await api.get(`/products/${id}/images`)
          if (imagesData.success && imagesData.data.length > 0) {
            setProductImages(imagesData.data)
          } else {
            // Fallback to product main image
            setProductImages([{
              image_url: productData.image_url || productData.image || 'https://via.placeholder.com/600x600?text=No+Image',
              alt_text: productData.title || productData.name,
              is_primary: true
            }])
          }
        } catch (imgErr) {
          console.log('No additional images found, using main image')
          setProductImages([{
            image_url: productData.image_url || productData.image || 'https://via.placeholder.com/600x600?text=No+Image',
            alt_text: productData.title || productData.name,
            is_primary: true
          }])
        }

        // Fetch review summary
        try {
          const summaryData = await api.get(`/products/${id}/reviews/summary`)
          if (summaryData.success) {
            setReviewSummary(summaryData.data)
          }
        } catch (summaryErr) {
          console.log('No review summary found')
          setReviewSummary(null)
        }

        // Fetch inventory status using public endpoint
        try {
          const inventoryData = await api.get(`/inventory/check/${id}`)
          if (inventoryData) {
            // Transform the response to match expected format
            setInventoryStatus({
              available_quantity: inventoryData.available_quantity || 0,
              low_stock_threshold: inventoryData.low_stock_threshold || 10
            })
          }
        } catch (invErr) {
          console.log('No inventory data found')
          setInventoryStatus(null)
        }

        // Check if product is in wishlist (only for authenticated users)
        if (isAuthenticated) {
          try {
            const wishlistData = await api.get('/wishlist')
            if (wishlistData.success && wishlistData.wishlist) {
              const inWishlist = wishlistData.wishlist.some(item => item.product_id === id)
              setIsInWishlist(inWishlist)
            }
          } catch (wishErr) {
            // Silently fail - user might not be authenticated or wishlist might not be available
            console.log('Could not check wishlist status:', wishErr.message)
            setIsInWishlist(false)
          }
        }
      } catch (err) {
        console.error('Error fetching product data:', err)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchProductData()
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        duration: 3000,
        style: {
          background: '#DC2626',
          color: '#fff',
        }
      })
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }

    setAddingToCart(true)
    
    try {
      const cartItem = {
        id: product.id,
        name: product.title || product.name,
        price: product.price,
        image: product.image_url || product.image,
        quantity,
        price_at_add: product.price
      }
      
      dispatch(addToCart(cartItem))
      
      toast.success('✓ Added to cart!', {
        duration: 2000,
        style: {
          background: '#067D62',
          color: '#fff',
        }
      })
    } catch (err) {
      console.error('Error adding to cart:', err)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with purchase', {
        duration: 3000,
        style: {
          background: '#DC2626',
          color: '#fff',
        }
      })
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }

    setAddingToCart(true)
    
    try {
      const cartItem = {
        id: product.id,
        name: product.title || product.name,
        price: product.price,
        image: product.image_url || product.image,
        quantity,
        price_at_add: product.price
      }
      
      dispatch(addToCart(cartItem))
      navigate('/checkout')
    } catch (err) {
      console.error('Error:', err)
      toast.error('Failed to proceed to checkout')
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist', {
        duration: 3000,
        style: {
          background: '#DC2626',
          color: '#fff',
        }
      })
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }

    setWishlistLoading(true)
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await api.delete(`/wishlist/${id}`)
        setIsInWishlist(false)
        toast.success('Removed from wishlist', {
          duration: 2000,
          style: {
            background: '#067D62',
            color: '#fff',
          }
        })
      } else {
        // Add to wishlist
        await api.post('/wishlist', { productId: id })
        setIsInWishlist(true)
        toast.success('Added to wishlist ❤️', {
          duration: 2000,
          style: {
            background: '#067D62',
            color: '#fff',
          }
        })
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err)
      toast.error('Failed to update wishlist')
    } finally {
      setWishlistLoading(false)
    }
  }

  // Image zoom handlers
  const handleMouseMove = (e) => {
    if (!isZoomed) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
    setMousePosition({ x: 50, y: 50 })
  }

  // Thumbnail hover to switch image
  const handleThumbnailHover = (index) => {
    setSelectedImage(index)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-2xl text-gray-800 mb-4">Product not found</p>
          <Link to="/" className="text-blue-600 hover:text-orange-600 hover:underline">
            ← Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const originalPrice = product.original_price || product.price * 1.3
  const savings = originalPrice - product.price
  const savingsPercent = Math.round((savings / originalPrice) * 100)

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        {' › '}
        <Link to={`/category/${product.category_slug || 'electronics'}`}>
          {product.category_name || 'Electronics'}
        </Link>
        {' › '}
        <span>{product.title || product.name}</span>
      </div>

      {/* Product Container */}
      <div className="product-container">
        
        {/* IMAGE GALLERY */}
        <div className="image-gallery">
          <div className="thumbnail-list">
            {productImages.map((img, index) => (
              <div 
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
                onMouseEnter={() => handleThumbnailHover(index)}
              >
                {img.image_url ? (
                  <img 
                    src={img.image_url} 
                    alt={img.alt_text || `Product ${index + 1}`}
                  />
                ) : (
                  <span>🖼️</span>
                )}
              </div>
            ))}
          </div>
          <div 
            className={`main-image ${isZoomed ? 'zoomed' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {productImages[selectedImage]?.image_url ? (
              <img 
                src={productImages[selectedImage].image_url} 
                alt={product.title || product.name}
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                }}
              />
            ) : (
              <span>🖼️</span>
            )}
          </div>
        </div>
        
        {/* PRODUCT INFO */}
        <div className="product-info">
          {/* Product Badges */}
          <ProductBadges productId={id} />

          {/* Product Title */}
          <h1 className="product-title">{product.title || product.name}</h1>
          
          {/* Brand Link */}
          {product.brand && (
            <Link to={`/brand/${product.brand}`} className="product-brand">
              Visit the {product.brand} Store
            </Link>
          )}
          
          {/* Rating Section */}
          {reviewSummary && (
            <div className="rating-section">
              <span className="stars">
                {'★'.repeat(Math.floor(reviewSummary.average_rating))}
                {'☆'.repeat(5 - Math.floor(reviewSummary.average_rating))}
              </span>
              <div 
                className="rating-link-wrapper"
                onMouseEnter={() => setShowRatingTooltip(true)}
                onMouseLeave={() => setShowRatingTooltip(false)}
              >
                <a href="#reviews" className="rating-text">
                  {reviewSummary.average_rating.toFixed(1)} out of 5 stars
                </a>
                {showRatingTooltip && (
                  <div className="rating-tooltip">
                    <div className="tooltip-header">Customer Reviews</div>
                    <div className="tooltip-stars">
                      {'★'.repeat(Math.floor(reviewSummary.average_rating))}
                      {'☆'.repeat(5 - Math.floor(reviewSummary.average_rating))}
                      <span className="tooltip-rating">{reviewSummary.average_rating.toFixed(1)}</span>
                    </div>
                    <div className="tooltip-count">{reviewSummary.total_reviews} global ratings</div>
                  </div>
                )}
              </div>
              <span className="rating-text">{reviewSummary.total_reviews} ratings</span>
              {product.total_sales > 0 && (
                <span className="rating-text">| {product.total_sales}+ sold</span>
              )}
              {product.view_count > 0 && (
                <span className="rating-text">| {product.view_count.toLocaleString()} views</span>
              )}
            </div>
          )}
          
          {/* Price Section */}
          <div className="price-section">
            <span className="price-label">Price:</span>
            <div>
              <span className="price">${Number(product.price).toFixed(2)}</span>
              {originalPrice > product.price && (
                <>
                  <span className="original-price">${Number(originalPrice).toFixed(2)}</span>
                  <span className="savings">Save ${savings.toFixed(2)} ({savingsPercent}%)</span>
                </>
              )}
            </div>
            {isAuthenticated && (
              <div className="prime-badge">
                <span>⚡</span>
                <span>Prime FREE Delivery</span>
              </div>
            )}
          </div>
          
          {/* About This Item */}
          <div className="product-details">
            <h3>About this item</h3>
            <ProductFeatures productId={id} />
          </div>
          
          {/* Product Details */}
          <div className="product-details">
            <h3>Product Details</h3>
            {product.brand && (
              <div className="detail-row">
                <div className="detail-label">Brand</div>
                <div className="detail-value">{product.brand}</div>
              </div>
            )}
            {product.category_name && (
              <div className="detail-row">
                <div className="detail-label">Category</div>
                <div className="detail-value">{product.category_name}</div>
              </div>
            )}
            {product.sku && (
              <div className="detail-row">
                <div className="detail-label">SKU</div>
                <div className="detail-value">{product.sku}</div>
              </div>
            )}
            <div className="detail-row">
              <div className="detail-label">Stock Status</div>
              <div className="detail-value stock-status">
                {inventoryStatus ? (
                  <>
                    {inventoryStatus.available_quantity > 0 ? (
                      <>
                        ✓ In Stock
                        {inventoryStatus.available_quantity <= inventoryStatus.low_stock_threshold && (
                          <span style={{ color: '#C7511F', marginLeft: '10px' }}>
                            Only {inventoryStatus.available_quantity} left!
                          </span>
                        )}
                      </>
                    ) : (
                      <span style={{ color: '#C7511F' }}>Out of Stock</span>
                    )}
                  </>
                ) : (
                  '✓ In Stock'
                )}
              </div>
            </div>
            {product.is_returnable && (
              <div className="detail-row">
                <div className="detail-label">Returns</div>
                <div className="detail-value">30-day return policy</div>
              </div>
            )}
            {product.shipping_cost !== undefined && (
              <div className="detail-row">
                <div className="detail-label">Shipping</div>
                <div className="detail-value">
                  {product.shipping_cost === 0 ? 'FREE Shipping' : `$${product.shipping_cost.toFixed(2)}`}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* BUY BOX */}
        <div className="buy-box">
          <div className="buy-box-price">${Number(product.price).toFixed(2)}</div>

          {/* Delivery Info */}
          <div className="delivery-info">
            <p>
              <strong>FREE delivery</strong>{' '}
              <span className="delivery-date">Wednesday, Feb 12</span>
            </p>
            <p>Order within <strong>5 hrs 23 mins</strong></p>
            <p>📍 Deliver to New York 10001</p>
          </div>

          <div className="stock-status">
            {inventoryStatus ? (
              <>
                {inventoryStatus.available_quantity > 0 ? (
                  <>
                    ✓ In Stock
                    {inventoryStatus.available_quantity <= inventoryStatus.low_stock_threshold && (
                      <div style={{ color: '#C7511F', fontSize: '0.9em', marginTop: '5px' }}>
                        Only {inventoryStatus.available_quantity} left - order soon!
                      </div>
                    )}
                  </>
                ) : (
                  <span style={{ color: '#C7511F' }}>❌ Out of Stock</span>
                )}
              </>
            ) : (
              '✓ In Stock'
            )}
          </div>

          {/* Quantity */}
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="btn btn-add-cart"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>

          {/* Buy Now Button */}
          <button 
            onClick={handleBuyNow}
            disabled={addingToCart}
            className="btn btn-buy-now"
          >
            Buy Now
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="btn btn-wishlist"
            style={{
              backgroundColor: isInWishlist ? '#FFE5E5' : '#F7F8F8',
              color: isInWishlist ? '#C7511F' : '#0F1111',
              border: '1px solid #D5D9D9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '1.2em' }}>{isInWishlist ? '❤️' : '🤍'}</span>
            {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Seller Info */}
          <div className="seller-info">
            <p><strong>Ships from:</strong> FastShop</p>
            <p>
              <strong>Sold by:</strong>{' '}
              {product.seller_name ? (
                <Link to={`/seller/${product.seller_id}`} className="seller-link">
                  {product.seller_name}
                </Link>
              ) : (
                <span className="seller-link">FastShop Official</span>
              )}
            </p>
            <p>⭐ 98% positive ratings</p>
            <p>🔒 Secure transaction</p>
            <p>🔄 30-day return policy</p>
          </div>
          
          {/* Ask Seller Button */}
          {product.seller_id && (
            <div className="ask-seller-btn">
              <StartChatButton
                recipientId={product.seller_id}
                recipientName={product.seller_name || 'Seller'}
                recipientRole="seller"
                metadata={{
                  type: 'product_inquiry',
                  productId: product.id,
                  productName: product.title || product.name
                }}
                className="btn btn-ask-seller"
              >
                💬 Ask Seller
              </StartChatButton>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT DESCRIPTION */}
      {product.description && (
        <div className="reviews-section">
          <h2 className="section-title">Product Description</h2>
          <div className="description-content">
            {product.description}
          </div>
        </div>
      )}

      {/* TECHNICAL SPECIFICATIONS */}
      <div className="reviews-section">
        <ProductSpecs productId={id} />
      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-section" id="reviews">
        <ReviewSection productId={id} />
      </div>

      {/* QUESTIONS & ANSWERS SECTION */}
      <div className="reviews-section">
        <QASection productId={id} />
      </div>
    </div>
  )
}

export default ProductPage
