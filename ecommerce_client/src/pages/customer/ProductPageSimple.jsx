import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import api from '../../config/api'
import StartChatButton from '../../components/chat/StartChatButton'

const ProductPageSimple = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id)
        // api.get already returns response.data due to interceptor
        const productData = await api.get(`/products/${id}`)
        console.log('Product data received:', productData)
        
        setProduct(productData)
      } catch (err) {
        console.error('Error fetching product:', err)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!product) {
    return <div className="p-8">Product not found</div>
  }

  const handleAddToCart = async () => {
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

  return (
    <div className="p-8 bg-white min-h-screen">
      <Link to="/" className="text-blue-600 mb-4 inline-block">← Back to Home</Link>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.title || product.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img 
              src={product.image_url || product.image || 'https://via.placeholder.com/400'} 
              alt={product.title || product.name}
              className="w-full rounded-lg"
            />
          </div>
          
          <div>
            <p className="text-2xl font-bold text-red-600 mb-4">
              ${Number(product.price).toFixed(2)}
            </p>
            
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
            
            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg mb-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button 
              onClick={handleBuyNow}
              disabled={addingToCart}
              className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold py-3 rounded-lg mb-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            {/* Ask Seller Button */}
            {product.seller_id && (
              <StartChatButton
                recipientId={product.seller_id}
                recipientName={product.seller_name || 'Seller'}
                recipientRole="seller"
                metadata={{
                  type: 'product_inquiry',
                  productId: product.id,
                  productName: product.title || product.name
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Ask Seller
              </StartChatButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPageSimple
