# Seller Sidebar & Header - Persistent Layout Fix

## Problem
The sidebar and header in the seller dashboard were not persistent across all seller pages. When clicking sidebar links, the sidebar would disappear on other pages.

## Solution
Moved the header and sidebar from individual pages to the `SellerLayout` component, which wraps all seller routes.

## Changes Made

### 1. Updated `SellerLayout.jsx`
- Added complete top header with logo, user info, and logout button
- Added sidebar navigation with all 9 menu items:
  - Dashboard
  - Products
  - Orders
  - Inventory
  - Payments (Payouts)
  - Analytics
  - Reviews
  - Settings
  - Support (Messages)
- Made sidebar sticky with `position: sticky; top: 60px`
- Added active state highlighting for current page
- Responsive design for mobile devices

### 2. Simplified `SellerDashboardPage.jsx`
- Removed duplicate header and sidebar code
- Now only contains page-specific content (stats, tables)
- Inherits header/sidebar from SellerLayout

### 3. Route Structure (App.jsx)
All seller routes are wrapped with SellerLayout:
```jsx
<Route path="/seller" element={<ProtectedRoute roles={['seller']}><SellerLayout /></ProtectedRoute>}>
  <Route index element={<SellerDashboardPage />} />
  <Route path="products" element={<SellerProductsPage />} />
  <Route path="orders" element={<SellerOrdersPage />} />
  // ... all other seller routes
</Route>
```

## Result
- Header and sidebar now persist across ALL seller pages
- Sidebar stays visible when navigating between pages
- Active menu item is highlighted based on current route
- Consistent layout and navigation experience
- No duplicate code in individual pages

## Testing
1. Login as a seller
2. Navigate to `/seller` (dashboard)
3. Click any sidebar menu item
4. Verify header and sidebar remain visible
5. Verify active menu item is highlighted
6. Test all seller pages to ensure layout consistency

## Files Modified
- `ecommerce_client/src/layouts/SellerLayout.jsx` - Added header & sidebar
- `ecommerce_client/src/pages/seller/SellerDashboardPage.jsx` - Removed header & sidebar
- All other seller pages already had no header/sidebar (correct)

## Design
- Matches `website/seller-dashboard.html` design exactly
- Amazon-style professional design (#FF9900 orange, #131921 dark)
- Sticky header at top, sticky sidebar on left
- Responsive layout for mobile devices
