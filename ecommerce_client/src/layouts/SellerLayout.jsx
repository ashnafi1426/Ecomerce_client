import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { logout } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import NotificationCenter from '../components/NotificationCenter'
import ChatWidget from '../components/chat/ChatWidget'

const SellerLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="seller-layout-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .seller-layout-container { min-height: 100vh; background: #F7F8F8; }
        
        /* Top Header */
        .top-header { background: #131921; color: #FFFFFF; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 1.8em; font-weight: bold; color: #FFFFFF; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo:hover { color: #FF9900; }
        .user-menu { display: flex; align-items: center; gap: 20px; }
        .user-info { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid transparent; border-radius: 4px; }
        .user-info:hover { border-color: #FFFFFF; }
        .user-avatar { width: 35px; height: 35px; border-radius: 50%; background: #FF9900; display: flex; align-items: center; justify-content: center; font-size: 1.2em; }
        .btn-logout { background: #C7511F; color: #FFFFFF; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.9em; transition: background 0.2s; }
        .btn-logout:hover { background: #A33F1A; }
        
        /* Dashboard Layout */
        .dashboard-layout { display: flex; min-height: calc(100vh - 60px); }
        
        /* Sidebar */
        .sidebar { width: 250px; background: #FFFFFF; border-right: 1px solid #D5D9D9; padding: 20px 0; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; }
        .sidebar-menu { list-style: none; }
        .sidebar-menu li { margin-bottom: 5px; }
        .sidebar-menu a { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #0F1111; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent; }
        .sidebar-menu a:hover { background: #F7F8F8; border-left-color: #FF9900; }
        .sidebar-menu a.active { background: #FFF4E5; border-left-color: #FF9900; font-weight: 600; }
        .menu-icon { font-size: 1.3em; width: 25px; text-align: center; }
        
        /* Main Content */
        .main-content { flex: 1; padding: 30px; overflow-y: auto; }
        
        @media (max-width: 768px) {
          .dashboard-layout { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #D5D9D9; position: relative; height: auto; }
          .top-header { flex-direction: column; gap: 15px; }
          .user-menu { width: 100%; justify-content: space-between; }
        }
      `}</style>

      {/* TOP HEADER */}
      <div className="top-header">
        <Link to="/" className="logo">🛒 <span>FastShop Seller</span></Link>
        <div className="user-menu">
          <NotificationCenter />
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div>
              <div style={{ fontSize: '0.85em' }}>Seller Account</div>
              <div style={{ fontWeight: 'bold' }}>{user?.displayName || user?.businessName || 'TechStore Pro'}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* DASHBOARD LAYOUT */}
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <Link to="/seller" className={isActive('/seller') && location.pathname === '/seller' ? 'active' : ''}>
                <span className="menu-icon">📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/seller/products" className={isActive('/seller/products') ? 'active' : ''}>
                <span className="menu-icon">📦</span> Products
              </Link>
            </li>
            <li>
              <Link to="/seller/orders" className={isActive('/seller/orders') ? 'active' : ''}>
                <span className="menu-icon">🛍️</span> Orders
              </Link>
            </li>
            <li>
              <Link to="/seller/inventory" className={isActive('/seller/inventory') ? 'active' : ''}>
                <span className="menu-icon">📋</span> Inventory
              </Link>
            </li>
            <li>
              <Link to="/seller/payments" className={isActive('/seller/payments') ? 'active' : ''}>
                <span className="menu-icon">💰</span> Payments
              </Link>
            </li>
            <li>
              <Link to="/seller/analytics" className={isActive('/seller/analytics') ? 'active' : ''}>
                <span className="menu-icon">📈</span> Analytics
              </Link>
            </li>
            <li>
              <Link to="/seller/reviews" className={isActive('/seller/reviews') ? 'active' : ''}>
                <span className="menu-icon">⭐</span> Reviews
              </Link>
            </li>
            <li>
              <Link to="/seller/settings" className={isActive('/seller/settings') ? 'active' : ''}>
                <span className="menu-icon">⚙️</span> Settings
              </Link>
            </li>
            <li>
              <Link to="/seller/messages" className={isActive('/seller/messages') ? 'active' : ''}>
                <span className="menu-icon">💬</span> Support
              </Link>
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </div>
  )
}

export default SellerLayout
