import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { logout } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import NotificationCenter from '../components/NotificationCenter'
import ChatWidget from '../components/chat/ChatWidget'

const AdminLayout = () => {
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
    <div className="admin-layout-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .admin-layout-container { min-height: 100vh; background: #F7F8F8; }
        
        /* Top Header */
        .top-header { background: linear-gradient(135deg, #131921 0%, #232F3E 100%); color: #FFFFFF; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 1.8em; font-weight: bold; color: #FFFFFF; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo:hover { color: #FF9900; }
        .user-menu { display: flex; align-items: center; gap: 20px; }
        .notification-icon { position: relative; font-size: 1.5em; cursor: pointer; padding: 8px; }
        .notification-badge { position: absolute; top: 0; right: 0; background: #C7511F; color: #FFFFFF; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 0.6em; font-weight: bold; }
        .user-info { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid transparent; border-radius: 4px; }
        .user-info:hover { border-color: #FFFFFF; }
        .user-avatar { width: 35px; height: 35px; border-radius: 50%; background: #FF9900; display: flex; align-items: center; justify-content: center; font-size: 1.2em; }
        .btn-logout { background: #C7511F; color: #FFFFFF; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.9em; transition: background 0.2s; }
        .btn-logout:hover { background: #A33F1A; }
        
        /* Dashboard Layout */
        .dashboard-layout { display: flex; min-height: calc(100vh - 60px); }
        
        /* Sidebar */
        .sidebar { width: 260px; background: #FFFFFF; border-right: 1px solid #D5D9D9; padding: 20px 0; box-shadow: 2px 0 8px rgba(0,0,0,0.05); position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; }
        .sidebar-section { margin-bottom: 25px; }
        .sidebar-section-title { padding: 0 20px; font-size: 0.75em; text-transform: uppercase; color: #565959; font-weight: 700; margin-bottom: 10px; }
        .sidebar-menu { list-style: none; }
        .sidebar-menu li { margin-bottom: 3px; }
        .sidebar-menu a { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #0F1111; text-decoration: none; transition: all 0.2s; }
        .sidebar-menu a:hover { background: #F7F8F8; border-left: 3px solid #FF9900; }
        .sidebar-menu a.active { background: linear-gradient(90deg, #FFF4E5 0%, transparent 100%); border-left: 3px solid #FF9900; font-weight: 600; color: #FF9900; }
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
        <Link to="/" className="logo">🛒 <span>FastShop Admin</span></Link>
        <div className="user-menu">
          <NotificationCenter />
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div>
              <div style={{ fontSize: '0.85em' }}>Administrator</div>
              <div style={{ fontWeight: 'bold' }}>{user?.displayName || user?.email || 'Admin User'}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* DASHBOARD LAYOUT */}
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main</div>
            <ul className="sidebar-menu">
              <li>
                <Link to="/admin" className={isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}>
                  <span className="menu-icon">📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/analytics" className={isActive('/admin/analytics') ? 'active' : ''}>
                  <span className="menu-icon">📈</span> Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-section-title">Management</div>
            <ul className="sidebar-menu">
              <li>
                <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
                  <span className="menu-icon">👥</span> Users
                </Link>
              </li>
              <li>
                <Link to="/admin/customers" className={isActive('/admin/customers') ? 'active' : ''}>
                  <span className="menu-icon">🛍️</span> Customers
                </Link>
              </li>
              <li>
                <Link to="/admin/sellers" className={isActive('/admin/sellers') ? 'active' : ''}>
                  <span className="menu-icon">🏪</span> Sellers
                </Link>
              </li>
              <li>
                <Link to="/admin/managers" className={isActive('/admin/managers') ? 'active' : ''}>
                  <span className="menu-icon">👔</span> Managers
                </Link>
              </li>
              <li>
                <Link to="/admin/roles" className={isActive('/admin/roles') ? 'active' : ''}>
                  <span className="menu-icon">🔐</span> Roles
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className={isActive('/admin/products') ? 'active' : ''}>
                  <span className="menu-icon">📦</span> Products
                </Link>
              </li>
              <li>
                <Link to="/admin/product-approvals" className={isActive('/admin/product-approvals') ? 'active' : ''}>
                  <span className="menu-icon">✅</span> Product Approvals
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>
                  <span className="menu-icon">🛒</span> Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/refunds" className={isActive('/admin/refunds') ? 'active' : ''}>
                  <span className="menu-icon">💸</span> Refunds
                </Link>
              </li>
              <li>
                <Link to="/admin/categories" className={isActive('/admin/categories') ? 'active' : ''}>
                  <span className="menu-icon">📂</span> Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-section-title">Financial</div>
            <ul className="sidebar-menu">
              <li>
                <Link to="/admin/payments" className={isActive('/admin/payments') ? 'active' : ''}>
                  <span className="menu-icon">💰</span> Payments
                </Link>
              </li>
              <li>
                <Link to="/admin/seller-earnings" className={isActive('/admin/seller-earnings') ? 'active' : ''}>
                  <span className="menu-icon">💵</span> Seller Earnings
                </Link>
              </li>
              <li>
                <Link to="/admin/commission-settings" className={isActive('/admin/commission-settings') ? 'active' : ''}>
                  <span className="menu-icon">⚙️</span> Commission Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/payouts" className={isActive('/admin/payouts') ? 'active' : ''}>
                  <span className="menu-icon">💳</span> Payouts
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-section-title">System</div>
            <ul className="sidebar-menu">
              <li>
                <Link to="/admin/settings" className={isActive('/admin/settings') ? 'active' : ''}>
                  <span className="menu-icon">⚙️</span> Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/logs" className={isActive('/admin/logs') ? 'active' : ''}>
                  <span className="menu-icon">📋</span> Audit Logs
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className={isActive('/admin/reports') ? 'active' : ''}>
                  <span className="menu-icon">📄</span> Reports
                </Link>
              </li>
            </ul>
          </div>
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

export default AdminLayout
