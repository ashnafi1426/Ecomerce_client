import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice'
import { removeGuestCartItem, updateGuestCartItem, clearGuestCart } from '../../store/slices/guestCartSlice'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import axios from 'axios'
import DiscountSummary from '../../components/discount/DiscountSummary'

const CartPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const registeredCart = useAppSelector((state) => state.cart)
  const guestCart = useAppSelector((state) => state.guestCart)
  
  // Use guest cart if not logged in, otherwise use registered cart
  const items = user ? registeredCart.items : guestCart.items
  const isGuest = !user

  // State for discounted cart items
  const [discountedItems, setDiscountedItems] = useState([])
  const [totalSavings, setTotalSavings] = useState(0)
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false)

  // Apply discounts when cart changes
  useEffect(() => {
    const applyDiscounts = async () => {
      if (items.length === 0) {
        setDiscountedItems([])
        setTotalSavings(0)
        return
      }

      setIsLoadingDiscounts(true)
      try {
        const cartItems = items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          categoryId: item.category_id
        }))

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/discounts/apply-to-cart`,
          { cartItems }
        )

        if (response.data.success) {
          setDiscountedItems(response.data.data.items || [])
          setTotalSavings(response.data.data.totalSavings || 0)
          
          // Show notification if discounts were applied
          if (response.data.data.totalSavings > 0) {
            toast.success(`🎉 You're saving $${response.data.data.totalSavings.toFixed(2)}!`, {
              duration: 4000,
              icon: '💰'
            })
          }
        }
      } catch (error) {
        console.error('Error applying discounts:', error)
        // Silently fail - cart still works without discounts
        setDiscountedItems([])
        setTotalSavings(0)
      } finally {
        setIsLoadingDiscounts(false)
      }
    }

    applyDiscounts()
  }, [items])

  const handleRemove = (id) => {
    if (isGuest) {
      dispatch(removeGuestCartItem(id))
    } else {
      dispatch(removeFromCart(id))
    }
    toast.success('Item removed from cart')
  }

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      if (isGuest) {
        dispatch(updateGuestCartItem({ productId: id, quantity }))
      } else {
        dispatch(updateQuantity({ id, quantity }))
      }
    }
  }

  const handleClearCart = () => {
    // Confirm before clearing
    if (window.confirm('Are you sure you want to clear your entire cart? This cannot be undone.')) {
      if (isGuest) {
        dispatch(clearGuestCart())
      } else {
        dispatch(clearCart())
      }
      toast.success('Cart cleared successfully!')
    }
  }
  
  const handleCheckout = () => {
    if (isGuest) {
      navigate('/guest-checkout')
    } else {
      navigate('/checkout')
    }
  }

  // Calculate prices using discounted items if available
  const getItemPrice = (item) => {
    const discountedItem = discountedItems.find(d => d.productId === item.id)
    return discountedItem?.discountedPrice || item.price
  }

  const subtotal = items.reduce((sum, item) => {
    const price = getItemPrice(item)
    return sum + (price * item.quantity)
  }, 0)
  
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const totalAmount = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="bg-[#EAEDED] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-5 py-10">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-[#0F1111] mb-4">Your cart is empty</h2>
            <p className="text-[#565959] mb-6">Add items to get started</p>
            <Link
              to="/"
              className="inline-block bg-[#FF9900] hover:bg-[#F08804] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-5 py-5">
        <h1 className="text-3xl font-normal text-[#0F1111] mb-5">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Discount Summary */}
            {discountedItems.length > 0 && totalSavings > 0 && (
              <DiscountSummary items={discountedItems} totalSavings={totalSavings} />
            )}

            <div className="bg-white rounded-lg p-5">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#D5D9D9]">
                <h2 className="text-xl font-bold text-[#0F1111]">Cart Items ({items.length})</h2>
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 border border-[#D5D9D9] rounded hover:bg-[#F7F8F8] text-[#0F1111] text-sm font-semibold transition-colors"
                >
                  🗑️ Clear Cart
                </button>
              </div>

              {items.map((item) => {
                const discountedItem = discountedItems.find(d => d.productId === item.id)
                const finalPrice = discountedItem?.discountedPrice || item.price
                const hasDiscount = discountedItem && discountedItem.appliedDiscounts?.length > 0

                return (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-[#D5D9D9] last:border-b-0">
                    {item.image && item.image.startsWith('http') ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded border border-[#D5D9D9]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23f3f4f6" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="60"%3E📦%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl rounded border border-[#D5D9D9]">
                        📦
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.id}`}
                        className="text-lg font-semibold text-[#0F1111] hover:text-[#C7511F] line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      
                      {hasDiscount && (
                        <div className="inline-block bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded mt-1">
                          DISCOUNT APPLIED
                        </div>
                      )}
                      
                      <div className="text-[#007600] text-sm my-1 font-semibold">In Stock</div>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-semibold text-[#0F1111]">Qty:</label>
                          <select
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            className="border border-[#D5D9D9] rounded px-2 py-1 bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm"
                        >
                          Delete
                        </button>
                        
                        <button className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm">
                          Save for later
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#B12704]">
                        ${(finalPrice * item.quantity).toFixed(2)}
                      </div>
                      {hasDiscount && (
                        <div className="text-sm text-[#565959] line-through">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      )}
                      <div className="text-sm text-[#565959]">
                        ${finalPrice.toFixed(2)} each
                      </div>
                      {hasDiscount && discountedItem.savings > 0 && (
                        <div className="text-sm text-[#007600] font-semibold mt-1">
                          Save ${discountedItem.savings.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-5 sticky top-5">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items):</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-[#007600]">
                    <span>Discount Savings:</span>
                    <span className="font-semibold">-${totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax:</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-bold mb-4 pb-4 border-b">
                <span>Order Total:</span>
                <span className="text-[#B12704]">${totalAmount.toFixed(2)}</span>
              </div>
              
              {totalSavings > 0 && (
                <div className="bg-[#F0F8FF] border border-[#007185] rounded p-3 mb-4">
                  <div className="flex items-center gap-2 text-[#007600] font-semibold">
                    <span>💰</span>
                    <span>You're saving ${totalSavings.toFixed(2)}!</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleCheckout}
                disabled={isLoadingDiscounts}
                className="block w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-3 font-semibold text-center mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingDiscounts ? 'Calculating discounts...' : (isGuest ? 'Checkout as Guest' : 'Proceed to Checkout')}
              </button>
              
              {isGuest && (
                <div className="text-sm text-center text-[#565959] mt-2 mb-3">
                  <Link to="/login" className="text-[#007185] hover:text-[#C7511F] hover:underline">
                    Sign in
                  </Link>
                  {' '}for faster checkout
                </div>
              )}
              
              {shipping > 0 && (
                <div className="text-sm text-center text-[#565959] mt-3">
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-[#D5D9D9] text-sm text-[#565959]">
                <div className="flex items-start gap-2 mb-2">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>↩️</span>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-5">
          <Link
            to="/"
            className="text-[#007185] hover:text-[#C7511F] hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage
