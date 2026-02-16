import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { logout } from '../store/slices/authSlice'
import { useState, useRef, useEffect } from 'react'
import NotificationCenter from './NotificationCenter'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { items } = useAppSelector((state) => state.cart)
  const guestCart = useAppSelector((state) => state.guestCart)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const accountMenuRef = useRef(null)
  const languageMenuRef = useRef(null)
  const categoryMenuRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false)
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoryMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setShowAccountMenu(false)
  }

  // Calculate cart count based on total quantity (not just unique items)
  // Use guest cart if not authenticated, otherwise use regular cart
  const cartCount = isAuthenticated 
    ? items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
    : guestCart.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0

  // Categories for dropdown
  const categories = [
    { name: 'Electronics', path: '/category/electronics', icon: '📱' },
    { name: 'Fashion', path: '/category/fashion', icon: '👕' },
    { name: 'Home & Kitchen', path: '/category/home-kitchen', icon: '🏠' },
    { name: 'Books', path: '/category/books', icon: '📚' },
    { name: 'Sports & Outdoors', path: '/category/sports', icon: '⚽' },
    { name: 'Beauty & Personal Care', path: '/category/beauty', icon: '💄' },
    { name: 'Toys & Games', path: '/category/toys', icon: '🎮' },
    { name: 'Automotive', path: '/category/automotive', icon: '🚗' }
  ]

  return (
    <header className="bg-gray-800 text-white">
      {/* Top Header */}
      <div className="flex items-center px-5 py-2.5 gap-5">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-1 hover:text-orange-400 transition">
          🛒 <span>FastShop</span>
        </Link>

        {/* Deliver To */}
        <div className="flex items-center gap-1 px-2.5 py-1 border border-transparent rounded hover:border-white cursor-pointer">
          <span>📍</span>
          <div>
            <div className="text-xs text-gray-300">Deliver to</div>
            <div className="font-bold text-sm">New York 10001</div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex h-10">
          <div className="relative">
            <select 
              className="bg-gray-100 border-none px-2.5 rounded-l text-black text-sm cursor-pointer h-full min-w-[60px]"
              onChange={(e) => {
                if (e.target.value !== 'All') {
                  navigate(`/category/${e.target.value.toLowerCase().replace(/\s+/g, '-')}`)
                }
              }}
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none px-4 text-black outline-none"
            placeholder="Search FastShop"
          />
          <button type="submit" className="bg-orange-400 border-none px-5 rounded-r text-xl hover:bg-orange-500 cursor-pointer transition-colors">
            🔍
          </button>
        </form>

        {/* Language Selector */}
        <div 
          ref={languageMenuRef}
          className="relative flex items-center gap-1 px-2.5 py-1 border border-transparent rounded hover:border-white cursor-pointer"
          onMouseEnter={() => setShowLanguageMenu(true)}
          onMouseLeave={() => setShowLanguageMenu(false)}
        >
          <span className="text-lg">🇺🇸</span>
          <span className="text-sm font-bold">EN</span>
          <span className="text-xs">▼</span>
          
          {/* Language Dropdown */}
          {showLanguageMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white text-black rounded shadow-lg w-48 z-50">
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                  <span>🇺🇸</span>
                  <span className="text-sm">English - EN</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                  <span>🇪🇸</span>
                  <span className="text-sm">Español - ES</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                  <span>🇫🇷</span>
                  <span className="text-sm">Français - FR</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account & Lists */}
        {isAuthenticated ? (
          <div 
            ref={accountMenuRef}
            className="relative flex flex-col px-2.5 py-1 border border-transparent rounded hover:border-white cursor-pointer"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <span className="text-xs">Hello, {user?.display_name || user?.name || user?.email?.split('@')[0] || 'User'}</span>
            <span className="font-bold text-sm flex items-center gap-1">
              Account & Lists <span className="text-xs">▼</span>
            </span>
            
            {/* Account Dropdown */}
            {showAccountMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white text-black rounded shadow-lg w-80 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Your Account Column */}
                    <div>
                      <h3 className="font-bold text-sm mb-3 text-gray-800">Your Account</h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setShowAccountMenu(false)
                            navigate('/account')
                          }}
                          className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                        >
                          Your Account
                        </button>
                        <button
                          onClick={() => {
                            setShowAccountMenu(false)
                            navigate('/orders')
                          }}
                          className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                        >
                          Your Orders
                        </button>
                        <button
                          onClick={() => {
                            setShowAccountMenu(false)
                            navigate('/wishlist')
                          }}
                          className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                        >
                          Your Wish List
                        </button>
                        <button
                          onClick={() => {
                            setShowAccountMenu(false)
                            navigate('/recommendations')
                          }}
                          className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                        >
                          Your Recommendations
                        </button>
                        <button
                          onClick={() => {
                            setShowAccountMenu(false)
                            navigate('/browsing-history')
                          }}
                          className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                        >
                          Browsing History
                        </button>
                      </div>
                    </div>

                    {/* Your Lists Column */}
                    <div>
                      <h3 className="font-bold text-sm mb-3 text-gray-800">Your Lists</h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setShowAccountMenu(false)
                            navigate('/lists/create')
                          }}
                          className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                        >
                          Create a List
                        </button>
                        <button
                          onClick={() => {
                            setShowAccountMenu(false)
                            navigate('/wishlist')
                          }}
                          className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                        >
                          Find a List or Registry
                        </button>
                        {user?.role === 'seller' && (
                          <button
                            onClick={() => {
                              setShowAccountMenu(false)
                              navigate('/seller')
                            }}
                            className="block w-full text-left text-sm text-orange-600 hover:underline font-medium"
                          >
                            🏪 Seller Central
                          </button>
                        )}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => {
                              setShowAccountMenu(false)
                              navigate('/admin')
                            }}
                            className="block w-full text-left text-sm text-red-600 hover:underline font-medium"
                          >
                            ⚙️ Admin Dashboard
                          </button>
                        )}
                        {user?.role === 'manager' && (
                          <button
                            onClick={() => {
                              setShowAccountMenu(false)
                              navigate('/manager')
                            }}
                            className="block w-full text-left text-sm text-blue-600 hover:underline font-medium"
                          >
                            📊 Manager Portal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="flex flex-col px-2.5 py-1 border border-transparent rounded hover:border-white no-underline text-white"
            >
              <span className="text-xs">Hello, sign in</span>
              <span className="font-bold text-sm flex items-center gap-1">
                Account & Lists <span className="text-xs">▼</span>
              </span>
            </Link>
          </div>
        )}

        {/* Returns & Orders */}
        <Link to="/orders" className="flex flex-col px-2.5 py-1 border border-transparent rounded hover:border-white no-underline text-white">
          <span className="text-xs">Returns</span>
          <span className="font-bold text-sm">& Orders</span>
        </Link>

        {/* Notifications - Only show for authenticated users */}
        {isAuthenticated && (
          <div className="flex items-center px-2.5 py-1">
            <NotificationCenter />
          </div>
        )}

        {/* Wishlist - Only show for authenticated users */}
        {isAuthenticated && (
          <Link to="/wishlist" className="flex items-center gap-1 px-2.5 py-1 border border-transparent rounded hover:border-white no-underline text-white">
            <span className="text-2xl">❤️</span>
            <span className="font-bold text-sm">Wishlist</span>
          </Link>
        )}

        {/* Cart */}
        <Link to="/cart" className="flex items-center gap-2 px-2.5 py-1 border border-transparent rounded hover:border-white no-underline text-white">
          <div className="relative text-3xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-400 text-gray-800 rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-bold px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-orange-400 font-bold">{cartCount}</span>
            <span className="font-bold text-sm">Cart</span>
          </div>
        </Link>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-700 px-5 py-2.5 flex items-center gap-5">
        {/* All Categories Dropdown */}
        <div 
          ref={categoryMenuRef}
          className="relative"
          onMouseEnter={() => setShowCategoryMenu(true)}
          onMouseLeave={() => setShowCategoryMenu(false)}
        >
          <button className="text-white px-2.5 py-1 text-sm border border-transparent rounded hover:border-white flex items-center gap-1">
            ☰ All <span className="text-xs">▼</span>
          </button>
          
          {/* Categories Dropdown */}
          {showCategoryMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white text-black rounded shadow-lg w-64 z-50">
              <div className="p-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-800 no-underline"
                    onClick={() => setShowCategoryMenu(false)}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                ))}
                <hr className="my-2" />
                <Link
                  to="/categories"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm text-orange-600 font-medium no-underline"
                  onClick={() => setShowCategoryMenu(false)}
                >
                  <span className="text-lg">📂</span>
                  <span>See All Categories</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link to="/deals" className="text-white no-underline px-2.5 py-1 text-sm border border-transparent rounded hover:border-white">
          Today's Deals
        </Link>
        <Link to="/sellers" className="text-white no-underline px-2.5 py-1 text-sm border border-transparent rounded hover:border-white">
          Browse Sellers
        </Link>
        <Link to="/customer-service" className="text-white no-underline px-2.5 py-1 text-sm border border-transparent rounded hover:border-white">
          Customer Service
        </Link>
        <Link to="/registry" className="text-white no-underline px-2.5 py-1 text-sm border border-transparent rounded hover:border-white">
          Registry
        </Link>
        <Link to="/gift-cards" className="text-white no-underline px-2.5 py-1 text-sm border border-transparent rounded hover:border-white">
          Gift Cards
        </Link>
        <Link to="/seller/register" className="text-white no-underline px-2.5 py-1 text-sm border border-transparent rounded hover:border-white">
          Sell
        </Link>
        
        {/* Right side items */}
        <div className="ml-auto flex items-center gap-3">
          {!isAuthenticated && (
            <Link 
              to="/register" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors no-underline"
            >
              🚀 Sign Up Free
            </Link>
          )}
          
          <Link to="/prime" className="text-white no-underline px-2.5 py-1 text-sm border border-transparent rounded hover:border-white">
            <span className="text-orange-400 font-bold">Prime</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header
