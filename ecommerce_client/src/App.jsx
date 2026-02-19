import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Contexts
import { SocketProvider } from './contexts/SocketContext'
import { ChatProvider } from './contexts/ChatContext'

// Layouts
import CustomerLayout from './layouts/CustomerLayout'
import AuthLayout from './layouts/AuthLayout'
import SellerLayout from './layouts/SellerLayout'
import AdminLayout from './layouts/AdminLayout'
import ManagerLayout from './layouts/ManagerLayout'

// Auth Pages
import LoginPageMinimal from './pages/auth/LoginPageMinimal'
import RegisterPage from './pages/auth/RegisterPage'

// Customer Pages
import HomePage from './pages/customer/HomePage'
import AccountPage from './pages/customer/AccountPage'
import ProductPage from './pages/customer/ProductPage'
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrdersPage from './pages/customer/OrdersPage'
import OrderDetailPage from './pages/customer/OrderDetailPage'
import WishlistPage from './pages/customer/WishlistPage'
import TrackingPage from './pages/customer/TrackingPage'
import CustomerProfilePage from './pages/customer/CustomerProfilePage'
import CustomerAddressesPage from './pages/customer/CustomerAddressesPage'
import CustomerPaymentMethodsPage from './pages/customer/CustomerPaymentMethodsPage'
import CustomerReviewsPage from './pages/customer/CustomerReviewsPage'
import CustomerReturnsPage from './pages/customer/CustomerReturnsPage'
import CategoryPage from './pages/customer/CategoryPage'
import SearchPage from './pages/customer/SearchPage'
import GuestCheckoutPage from './pages/customer/GuestCheckoutPage'
import OrderTrackingPage from './pages/customer/OrderTrackingPage'
import SellersListPage from './pages/customer/SellersListPage'
import CustomerViewSellerProfilePage from './pages/customer/SellerProfilePage'
import CategoriesPage from './pages/customer/CategoriesPage'
import DealsPage from './pages/customer/DealsPage'
import CustomerServicePage from './pages/customer/CustomerServicePage'
import RecommendationsPage from './pages/customer/RecommendationsPage'
import BrowsingHistoryPage from './pages/customer/BrowsingHistoryPage'
import RegistryPage from './pages/customer/RegistryPage'
import GiftCardsPage from './pages/customer/GiftCardsPage'
import PrimePage from './pages/customer/PrimePage'

// Seller Pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage'
import SellerProductsPage from './pages/seller/SellerProductsPage'
import SellerAddProductPage from './pages/seller/SellerAddProductPage'
import SellerEditProductPage from './pages/seller/SellerEditProductPage'
import SellerInventoryPage from './pages/seller/SellerInventoryPage'
import SellerBulkUploadPage from './pages/seller/SellerBulkUploadPage'
import SellerOrdersPageEnhanced from './pages/seller/SellerOrdersPageEnhanced'
import SellerShippingPage from './pages/seller/SellerShippingPage'
import SellerReturnsPage from './pages/seller/SellerReturnsPage'
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage'
import SellerPerformancePage from './pages/seller/SellerPerformancePage'
import SellerReviewsPage from './pages/seller/SellerReviewsPage'
import SellerPayoutsPage from './pages/seller/SellerPayoutsPage'
import SellerPaymentsPage from './pages/seller/SellerPaymentsPage'
import SellerCommissionsPage from './pages/seller/SellerCommissionsPage'
import SellerInvoicesPage from './pages/seller/SellerInvoicesPage'
import SellerDisputesPage from './pages/seller/SellerDisputesPage'
import SellerMessagesPage from './pages/seller/SellerMessagesPage'
import SellerProfilePage from './pages/seller/SellerProfilePage'
import SellerSettingsPage from './pages/seller/SellerSettingsPage'
import SellerRegisterPage from './pages/seller/SellerRegisterPage'

// Admin Pages - Lazy loaded to prevent unauthorized API calls
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminSellersPage = lazy(() => import('./pages/admin/AdminSellersPage'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'))
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'))
const AdminCommissionSettingsPage = lazy(() => import('./pages/admin/AdminCommissionSettingsPage'))
const AdminPayoutsPage = lazy(() => import('./pages/admin/AdminPayoutsPage'))
const AdminLogsPage = lazy(() => import('./pages/admin/AdminLogsPage'))
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))
const AdminManagersPage = lazy(() => import('./pages/admin/AdminManagersPage'))
const AdminRolesPageProfessional = lazy(() => import('./pages/admin/AdminRolesPageProfessional'))
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'))
const AdminBrandsPage = lazy(() => import('./pages/admin/AdminBrandsPage'))
const AdminProductApprovalsPage = lazy(() => import('./pages/admin/AdminProductApprovalsPage'))
const AdminRefundsPage = lazy(() => import('./pages/admin/AdminRefundsPage'))
const AdminSellerEarningsPage = lazy(() => import('./pages/admin/AdminSellerEarningsPage'))
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'))

// Manager Pages - Lazy loaded to prevent unauthorized API calls
const ManagerDashboardPage = lazy(() => import('./pages/manager/ManagerDashboardPage'))
const ManagerProductApprovalsPage = lazy(() => import('./pages/manager/ManagerProductApprovalsPage'))
const ManagerSellerApprovalsPage = lazy(() => import('./pages/manager/ManagerSellerApprovalsPage'))
const ManagerOrdersPage = lazy(() => import('./pages/manager/ManagerOrdersPage'))
const ManagerReturnsPage = lazy(() => import('./pages/manager/ManagerReturnsPage'))
const ManagerDisputesPage = lazy(() => import('./pages/manager/ManagerDisputesPage'))
const ManagerRefundsPage = lazy(() => import('./pages/manager/ManagerRefundsPage'))
const ManagerSupportTicketsPage = lazy(() => import('./pages/manager/ManagerSupportTicketsPage'))
const ManagerEscalationsPage = lazy(() => import('./pages/manager/ManagerEscalationsPage'))
const ManagerPerformancePage = lazy(() => import('./pages/manager/ManagerPerformancePage'))
const ManagerSellerPerformancePage = lazy(() => import('./pages/manager/ManagerSellerPerformancePage'))
const ManagerReviewModerationPage = lazy(() => import('./pages/manager/ManagerReviewModerationPage'))
const ManagerCustomerFeedbackPage = lazy(() => import('./pages/manager/ManagerCustomerFeedbackPage'))

// Protected Route
import ProtectedRoute from './components/ProtectedRoute'

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SocketProvider>
        <ChatProvider>
          <Toaster position="top-right" />
          <Routes>
        {/* Auth Routes - Standalone */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPageMinimal />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/seller-register" element={<SellerRegisterPage />} />
        <Route path="/seller/register" element={<SellerRegisterPage />} />

        {/* Customer Routes - All use CustomerLayout */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="customer-service" element={<CustomerServicePage />} />
          <Route path="registry" element={<RegistryPage />} />
          <Route path="gift-cards" element={<GiftCardsPage />} />
          <Route path="prime" element={<PrimePage />} />
          <Route path="sellers" element={<SellersListPage />} />
          <Route path="seller/:sellerId/profile" element={<CustomerViewSellerProfilePage />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          
          {/* Guest Routes */}
          <Route path="guest-checkout" element={<GuestCheckoutPage />} />
          <Route path="track-order" element={<OrderTrackingPage />} />
          
          {/* Protected Customer Routes */}
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="orders/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="tracking/:orderId" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />
          <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
          <Route path="browsing-history" element={<ProtectedRoute><BrowsingHistoryPage /></ProtectedRoute>} />
          <Route path="returns" element={<ProtectedRoute><CustomerReturnsPage /></ProtectedRoute>} />
          <Route path="customer/returns" element={<ProtectedRoute><CustomerReturnsPage /></ProtectedRoute>} />
          <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="account/profile" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
          <Route path="account/addresses" element={<ProtectedRoute><CustomerAddressesPage /></ProtectedRoute>} />
          <Route path="account/payment-methods" element={<ProtectedRoute><CustomerPaymentMethodsPage /></ProtectedRoute>} />
          <Route path="account/reviews" element={<ProtectedRoute><CustomerReviewsPage /></ProtectedRoute>} />
          <Route path="account/returns" element={<ProtectedRoute><CustomerReturnsPage /></ProtectedRoute>} />
        </Route>

        {/* Seller Routes */}
        <Route path="/seller" element={<ProtectedRoute roles={['seller']}><SellerLayout /></ProtectedRoute>}>
          <Route index element={<SellerDashboardPage />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="products/add" element={<SellerAddProductPage />} />
          <Route path="products/edit/:id" element={<SellerEditProductPage />} />
          <Route path="inventory" element={<SellerInventoryPage />} />
          <Route path="bulk-upload" element={<SellerBulkUploadPage />} />
          <Route path="orders" element={<SellerOrdersPageEnhanced />} />
          <Route path="shipping" element={<SellerShippingPage />} />
          <Route path="returns" element={<SellerReturnsPage />} />
          <Route path="analytics" element={<SellerAnalyticsPage />} />
          <Route path="performance" element={<SellerPerformancePage />} />
          <Route path="reviews" element={<SellerReviewsPage />} />
          <Route path="payments" element={<SellerPaymentsPage />} />
          <Route path="payouts" element={<SellerPayoutsPage />} />
          <Route path="commissions" element={<SellerCommissionsPage />} />
          <Route path="invoices" element={<SellerInvoicesPage />} />
          <Route path="disputes" element={<SellerDisputesPage />} />
          <Route path="messages" element={<SellerMessagesPage />} />
          <Route path="profile" element={<SellerProfilePage />} />
          <Route path="settings" element={<SellerSettingsPage />} />
        </Route>

        {/* Admin Routes - Wrapped in Suspense for lazy loading */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AdminAnalyticsPage /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<PageLoader />}><AdminCustomersPage /></Suspense>} />
          <Route path="sellers" element={<Suspense fallback={<PageLoader />}><AdminSellersPage /></Suspense>} />
          <Route path="managers" element={<Suspense fallback={<PageLoader />}><AdminManagersPage /></Suspense>} />
          <Route path="roles" element={<Suspense fallback={<PageLoader />}><AdminRolesPageProfessional /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProductsPage /></Suspense>} />
          <Route path="product-approvals" element={<Suspense fallback={<PageLoader />}><AdminProductApprovalsPage /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrdersPage /></Suspense>} />
          <Route path="refunds" element={<Suspense fallback={<PageLoader />}><AdminRefundsPage /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<PageLoader />}><AdminCategoriesPage /></Suspense>} />
          <Route path="brands" element={<Suspense fallback={<PageLoader />}><AdminBrandsPage /></Suspense>} />
          <Route path="payments" element={<Suspense fallback={<PageLoader />}><AdminPaymentsPage /></Suspense>} />
          <Route path="seller-earnings" element={<Suspense fallback={<PageLoader />}><AdminSellerEarningsPage /></Suspense>} />
          <Route path="commission-settings" element={<Suspense fallback={<PageLoader />}><AdminCommissionSettingsPage /></Suspense>} />
          <Route path="payouts" element={<Suspense fallback={<PageLoader />}><AdminPayoutsPage /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={<PageLoader />}><AdminProfilePage /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettingsPage /></Suspense>} />
          <Route path="logs" element={<Suspense fallback={<PageLoader />}><AdminLogsPage /></Suspense>} />
          <Route path="reports" element={<Suspense fallback={<PageLoader />}><AdminReportsPage /></Suspense>} />
        </Route>

        {/* Manager Routes - Wrapped in Suspense for lazy loading */}
        <Route path="/manager" element={<ProtectedRoute roles={['manager']}><ManagerLayout /></ProtectedRoute>}>
          <Route index element={<Suspense fallback={<PageLoader />}><ManagerDashboardPage /></Suspense>} />
          <Route path="product-approvals" element={<Suspense fallback={<PageLoader />}><ManagerProductApprovalsPage /></Suspense>} />
          <Route path="seller-approvals" element={<Suspense fallback={<PageLoader />}><ManagerSellerApprovalsPage /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><ManagerOrdersPage /></Suspense>} />
          <Route path="returns" element={<Suspense fallback={<PageLoader />}><ManagerReturnsPage /></Suspense>} />
          <Route path="disputes" element={<Suspense fallback={<PageLoader />}><ManagerDisputesPage /></Suspense>} />
          <Route path="refunds" element={<Suspense fallback={<PageLoader />}><ManagerRefundsPage /></Suspense>} />
          <Route path="support-tickets" element={<Suspense fallback={<PageLoader />}><ManagerSupportTicketsPage /></Suspense>} />
          <Route path="escalations" element={<Suspense fallback={<PageLoader />}><ManagerEscalationsPage /></Suspense>} />
          <Route path="performance" element={<Suspense fallback={<PageLoader />}><ManagerPerformancePage /></Suspense>} />
          <Route path="seller-performance" element={<Suspense fallback={<PageLoader />}><ManagerSellerPerformancePage /></Suspense>} />
          <Route path="review-moderation" element={<Suspense fallback={<PageLoader />}><ManagerReviewModerationPage /></Suspense>} />
          <Route path="customer-feedback" element={<Suspense fallback={<PageLoader />}><ManagerCustomerFeedbackPage /></Suspense>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
        </ChatProvider>
      </SocketProvider>
    </Router>
  )
}

export default App
