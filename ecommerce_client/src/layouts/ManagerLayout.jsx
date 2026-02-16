import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import NotificationCenter from '../components/NotificationCenter'
import ChatWidget from '../components/chat/ChatWidget'

const ManagerLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F8F8]">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#F08804] to-[#FF9900] text-white py-4 px-8 shadow-lg">
        <div className="flex items-center justify-between">
          <Link to="/manager" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            🛒 FastShop Manager
          </Link>
          <div className="flex items-center gap-6">
            <NotificationCenter />
            <div className="w-9 h-9 rounded-full bg-white text-[#FF9900] flex items-center justify-center font-bold">
              👤
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#C7511F] hover:bg-[#b04619] px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#D5D9D9]">
          <nav className="py-6">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/manager"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">📊</span>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/product-approvals"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/product-approvals')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">✅</span>
                  <span>Product Approvals</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/seller-approvals"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/seller-approvals')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">🏪</span>
                  <span>Seller Approvals</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/orders"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/orders')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">🛍️</span>
                  <span>Orders</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/returns"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/returns')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">↩️</span>
                  <span>Returns</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/disputes"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/disputes')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">⚠️</span>
                  <span>Disputes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/refunds"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/refunds')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">💰</span>
                  <span>Refunds</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/support-tickets"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/support-tickets')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">🎫</span>
                  <span>Support</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/escalations"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/escalations')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">🚨</span>
                  <span>Escalations</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/performance"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/performance')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">📈</span>
                  <span>Performance</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/seller-performance"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/seller-performance')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">🏪</span>
                  <span>Seller Performance</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/review-moderation"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/review-moderation')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">⭐</span>
                  <span>Review Moderation</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manager/customer-feedback"
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive('/manager/customer-feedback')
                      ? 'bg-[#FFF4E5] border-l-4 border-[#FF9900] font-semibold text-[#0F1111]'
                      : 'text-[#0F1111] hover:bg-[#F7F8F8]'
                  }`}
                >
                  <span className="text-xl">💬</span>
                  <span>Customer Feedback</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </div>
  )
}

export default ManagerLayout
