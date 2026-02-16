# Customer Pages Implementation Plan

## Goal
Build all remaining customer pages with real API integration, remove all mock data, and implement Amazon-like architecture where each part works independently.

## Customer Pages Status

### Existing Pages (16 total):
1. ✅ HomePage.jsx
2. ✅ ProductPage.jsx  
3. ✅ CategoryPage.jsx
4. ✅ SearchPage.jsx
5. ✅ CartPage.jsx
6. ✅ CheckoutPage.jsx
7. ✅ OrdersPage.jsx
8. ✅ OrderDetailPage.jsx
9. ✅ TrackingPage.jsx
10. ✅ AccountPage.jsx
11. ✅ CustomerProfilePage.jsx
12. ✅ CustomerAddressesPage.jsx
13. ✅ CustomerPaymentMethodsPage.jsx
14. ✅ CustomerReviewsPage.jsx
15. ✅ CustomerReturnsPage.jsx
16. ✅ WishlistPage.jsx

## Implementation Strategy

### Phase 1: Add Customer API Endpoints to api.service.js
Create comprehensive `customerAPI` object with all endpoints:
- Products (browse, search, filter)
- Cart operations
- Checkout & Orders
- Profile & Account
- Addresses & Payment Methods
- Reviews & Ratings
- Returns & Tracking
- Wishlist

### Phase 2: Update Pages One by One (Amazon Architecture)
Each page will be updated with:
1. **Real API Integration** - Remove all mock data
2. **Loading States** - Skeleton loaders like Amazon
3. **Error Handling** - Retry buttons and error messages
4. **Empty States** - Friendly messages when no data
5. **Optimistic Updates** - Instant UI feedback
6. **Toast Notifications** - Success/error feedback
7. **Responsive Design** - Mobile-first approach

### Phase 3: Test Each Page After Login
Verify:
- Data loads correctly
- Actions work (add to cart, checkout, etc.)
- Error handling works
- Loading states display properly
- Navigation works

## Customer API Endpoints Needed

### Products & Browse
- `GET /products` - List products with filters
- `GET /products/:id` - Get product details
- `GET /products/featured` - Featured products
- `GET /products/recommendations` - Personalized recommendations
- `GET /categories` - List categories
- `GET /categories/:id/products` - Products by category
- `GET /search` - Search products

### Cart
- `GET /cart` - Get cart items
- `POST /cart` - Add item to cart
- `PUT /cart/:id` - Update cart item quantity
- `DELETE /cart/:id` - Remove from cart
- `DELETE /cart` - Clear cart

### Checkout & Orders
- `POST /orders` - Create order
- `GET /orders` - List user orders
- `GET /orders/:id` - Get order details
- `GET /orders/:id/track` - Track order
- `POST /orders/:id/cancel` - Cancel order

### Profile & Account
- `GET /user/profile` - Get profile
- `PUT /user/profile` - Update profile
- `PUT /user/password` - Change password
- `GET /user/notifications` - Get notifications
- `PUT /user/notifications/:id/read` - Mark notification as read

### Addresses
- `GET /addresses` - List addresses
- `POST /addresses` - Add address
- `PUT /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address
- `PUT /addresses/:id/default` - Set default address

### Payment Methods
- `GET /payment-methods` - List payment methods
- `POST /payment-methods` - Add payment method
- `DELETE /payment-methods/:id` - Delete payment method
- `PUT /payment-methods/:id/default` - Set default payment method

### Reviews
- `GET /reviews` - Get user reviews
- `GET /products/:id/reviews` - Get product reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Returns
- `GET /returns` - List returns
- `POST /returns` - Create return request
- `GET /returns/:id` - Get return details

### Wishlist
- `GET /wishlist` - Get wishlist items
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist/:id` - Remove from wishlist

## Page Update Order (Priority)

### High Priority (Core Shopping Flow):
1. HomePage - Browse products
2. ProductPage - View product details
3. CartPage - Manage cart
4. CheckoutPage - Complete purchase
5. OrdersPage - View orders
6. OrderDetailPage - Track order

### Medium Priority (Account Management):
7. AccountPage - Account overview
8. CustomerProfilePage - Edit profile
9. CustomerAddressesPage - Manage addresses
10. CustomerPaymentMethodsPage - Manage payment methods

### Lower Priority (Additional Features):
11. CategoryPage - Browse by category
12. SearchPage - Search products
13. CustomerReviewsPage - Manage reviews
14. CustomerReturnsPage - Manage returns
15. TrackingPage - Track shipment
16. WishlistPage - Manage wishlist

## Amazon-Like Features to Implement

### 1. Product Browsing
- Grid/List view toggle
- Filters (price, rating, brand, etc.)
- Sort options (price, popularity, rating)
- Pagination or infinite scroll
- Quick view modal

### 2. Product Details
- Image gallery with zoom
- Variant selection (size, color)
- Stock availability
- Delivery estimates
- Related products
- Customer reviews section

### 3. Cart
- Mini cart in header
- Cart summary sidebar
- Quantity controls
- Remove items
- Save for later
- Estimated delivery

### 4. Checkout
- Multi-step process
- Address selection/add new
- Payment method selection
- Order summary
- Apply coupon/promo code
- Place order button

### 5. Orders
- Order history list
- Order status badges
- Quick actions (track, return, review)
- Filter by status
- Search orders

### 6. Account
- Dashboard with quick stats
- Recent orders
- Saved addresses
- Payment methods
- Account settings

## Success Criteria

✅ All pages use real API endpoints
✅ No mock data anywhere
✅ All CRUD operations work
✅ Loading states implemented
✅ Error handling with retry
✅ Empty states with helpful messages
✅ Toast notifications for feedback
✅ Responsive on all devices
✅ Amazon-like user experience
✅ Each page works independently

## Next Steps

1. Add customerAPI to api.service.js
2. Update HomePage first (test after login)
3. Update ProductPage (test product details)
4. Update CartPage (test add/remove)
5. Update CheckoutPage (test order creation)
6. Continue with remaining pages
7. Test complete shopping flow
8. Document any backend endpoints that need to be created

