# 🔄 HTML to React Conversion Mapping

## Strategy
Convert existing HTML designs from `website/` folder to React pages in `ecommerce_client/src/pages/`

---

## 📋 SELLER PAGES MAPPING

| HTML File | React File | Status |
|-----------|-----------|--------|
| seller-dashboard.html | SellerDashboardPage.jsx | ⏳ |
| seller-analytics.html | SellerAnalyticsPage.jsx | ⏳ |
| seller-performance.html | SellerPerformancePage.jsx | ⏳ |
| seller-products.html | SellerProductsPage.jsx | ⏳ |
| seller-add-product.html | SellerAddProductPage.jsx | ⏳ |
| seller-edit-product.html | SellerEditProductPage.jsx | ⏳ |
| seller-inventory.html | SellerInventoryPage.jsx | ⏳ |
| seller-bulk-upload.html | SellerBulkUploadPage.jsx | ⏳ |
| seller-orders.html | SellerOrdersPage.jsx | ⏳ |
| seller-returns.html | SellerReturnsPage.jsx | ⏳ |
| seller-shipping.html | SellerShippingPage.jsx | ⏳ |
| seller-payouts.html | SellerPayoutsPage.jsx | ⏳ |
| seller-commissions.html | SellerCommissionsPage.jsx | ⏳ |
| seller-invoices.html | SellerInvoicesPage.jsx | ⏳ |
| seller-messages.html | SellerMessagesPage.jsx | ⏳ |
| seller-disputes.html | SellerDisputesPage.jsx | ⏳ |
| seller-reviews.html | SellerReviewsPage.jsx | ⏳ |
| seller-profile.html | SellerProfilePage.jsx | ⏳ |
| seller-settings.html | SellerSettingsPage.jsx | ⏳ |
| seller-register.html | SellerRegisterPage.jsx | ⏳ |

---

## 📋 CUSTOMER PAGES MAPPING

| HTML File | React File | Status |
|-----------|-----------|--------|
| index.html | HomePage.jsx | ⏳ |
| product.html | ProductPage.jsx | ⏳ |
| category.html | CategoryPage.jsx | ⏳ |
| search.html | SearchPage.jsx | ⏳ |
| wishlist.html | WishlistPage.jsx | ⏳ |
| cart.html | CartPage.jsx | ⏳ |
| checkout.html | CheckoutPage.jsx | ⏳ |
| orders.html | OrdersPage.jsx | ⏳ |
| order-detail.html | OrderDetailPage.jsx | ⏳ |
| tracking.html | TrackingPage.jsx | ⏳ |
| account.html | AccountPage.jsx | ⏳ |
| customer-profile.html | CustomerProfilePage.jsx | ⏳ |
| customer-addresses.html | CustomerAddressesPage.jsx | ⏳ |
| customer-payment-methods.html | CustomerPaymentMethodsPage.jsx | ⏳ |
| customer-reviews.html | CustomerReviewsPage.jsx | ⏳ |
| customer-returns.html | CustomerReturnsPage.jsx | ⏳ |

---

## 📋 AUTH PAGES MAPPING

| HTML File | React File | Status |
|-----------|-----------|--------|
| login.html | LoginPage.jsx | ⏳ |
| register.html | RegisterPage.jsx | ⏳ |

---

## 📋 MANAGER PAGES MAPPING

| HTML File | React File | Status |
|-----------|-----------|--------|
| manager-dashboard.html | ManagerDashboardPage.jsx | ⏳ Need to create |
| manager-overview.html | ManagerOverviewPage.jsx | ⏳ Need to create |
| manager-product-approvals.html | ManagerProductApprovalsPage.jsx | ⏳ Need to create |

---

## 🎨 CONVERSION APPROACH

### For Each Page:
1. Read the HTML file from `website/` folder
2. Extract the design structure, layout, and styling
3. Convert HTML/CSS to React with inline styles
4. Add React hooks (useState, useEffect)
5. Add API integration placeholders
6. Add mock data for development
7. Maintain the exact visual design from HTML

### Key Conversions:
- HTML classes → inline styles object
- Static data → useState with mock data
- Forms → controlled components
- Links → React Router Links
- CSS → JavaScript style objects

---

**Total Pages to Convert**: 41 pages
- Seller: 20 pages
- Customer: 16 pages
- Auth: 2 pages
- Manager: 3 pages

**Status**: Ready to start systematic conversion
**Last Updated**: February 10, 2024
