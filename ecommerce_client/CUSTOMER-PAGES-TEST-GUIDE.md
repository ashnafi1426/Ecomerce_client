# Customer Pages Testing Guide

## Overview
This document provides a comprehensive testing checklist for all 16 Customer pages.

## Prerequisites
1. ✅ Backend server running on `http://localhost:5000`
2. ✅ Frontend server running on `http://localhost:3000`
3. ✅ Database connected (Supabase)
4. ✅ Test user account created

## Test Checklist

### 1. HomePage (/) ✅
**URL**: `http://localhost:3000/`

**Tests**:
- [ ] Page loads without errors
- [ ] Hero banner displays correctly
- [ ] Category cards (4) display with emojis
- [ ] "Today's Deals" section shows products
- [ ] "Recommended for You" section shows products
- [ ] Product cards show: image, title, rating, price, discount badge
- [ ] Clicking category card navigates to category page
- [ ] Clicking product card navigates to product detail
- [ ] Footer displays (only ONE footer, not duplicate)
- [ ] Loading state shows while fetching data
- [ ] Fallback categories show if backend returns empty

**API Endpoints Used**:
- `GET /api/categories`
- `GET /api/products?featured=true&limit=8`
- `GET /api/products?limit=4&offset=8`

---

### 2. ProductPage (/product/:id) ✅
**URL**: `http://localhost:3000/product/1`

**Tests**:
- [ ] Page loads with product details
- [ ] Product image/emoji displays
- [ ] Product name, price, rating display
- [ ] "Add to Cart" button works
- [ ] "Buy Now" button works
- [ ] Product description shows
- [ ] Reviews section displays
- [ ] Related products show
- [ ] Quantity selector works
- [ ] Toast notification on add to cart

**API Endpoints Used**:
- `GET /api/products/:id`
- `GET /api/reviews?productId=:id`
- `POST /api/cart/items`

---

### 3. CartPage (/cart) ✅
**URL**: `http://localhost:3000/cart`

**Tests**:
- [ ] Cart items display correctly
- [ ] Quantity can be increased/decreased
- [ ] Remove item button works
- [ ] Subtotal calculates correctly
- [ ] "Proceed to Checkout" button navigates
- [ ] Empty cart message shows when no items
- [ ] Product images/emojis display
- [ ] Price updates on quantity change

**API Endpoints Used**:
- `GET /api/cart`
- `PUT /api/cart/items/:id`
- `DELETE /api/cart/items/:id`

---

### 4. SearchPage (/search?q=) ✅
**URL**: `http://localhost:3000/search?q=headphones`

**Tests**:
- [ ] Search results display
- [ ] Sidebar filters show
- [ ] Sort dropdown works
- [ ] Related searches display
- [ ] Sponsored banner shows
- [ ] Product grid displays results
- [ ] Clicking product navigates correctly
- [ ] "No results" message when empty
- [ ] Filter checkboxes work

**API Endpoints Used**:
- `GET /api/products/search?q=:query&sort=:sortBy`

---

### 5. CategoryPage (/category/:categoryId) ✅
**URL**: `http://localhost:3000/category/1`

**Tests**:
- [ ] Category products display
- [ ] Breadcrumb navigation shows
- [ ] Sidebar filters display
- [ ] Price filter works
- [ ] Rating filter works
- [ ] Sort dropdown works
- [ ] Product grid displays
- [ ] Pagination works (if implemented)
- [ ] Empty state shows if no products

**API Endpoints Used**:
- `GET /api/products?category=:id&sort=:sortBy`

---

### 6. CheckoutPage (/checkout) 🔒
**URL**: `http://localhost:3000/checkout` (Protected)

**Tests**:
- [ ] Redirects to login if not authenticated
- [ ] Step 1: Shipping address form shows
- [ ] Address selection works
- [ ] "Add new address" works
- [ ] Step 2: Payment method shows
- [ ] Payment method selection works
- [ ] Order summary displays correctly
- [ ] "Place Order" button works
- [ ] Success message/redirect after order
- [ ] Form validation works

**API Endpoints Used**:
- `GET /api/addresses`
- `GET /api/payments/methods`
- `POST /api/orders`

---

### 7. OrdersPage (/orders) 🔒
**URL**: `http://localhost:3000/orders` (Protected)

**Tests**:
- [ ] Order list displays
- [ ] Filter tabs work (All, Pending, Processing, Shipped, Delivered, Cancelled)
- [ ] Order cards show: ID, date, status, total
- [ ] Status badges display correctly
- [ ] "View Details" button navigates
- [ ] "Track Order" button navigates
- [ ] Empty state shows if no orders
- [ ] Loading state displays

**API Endpoints Used**:
- `GET /api/orders?status=:status`

---

### 8. OrderDetailPage (/orders/:orderId) 🔒
**URL**: `http://localhost:3000/orders/1` (Protected)

**Tests**:
- [ ] Order details display
- [ ] Order items list shows
- [ ] Shipping address displays
- [ ] Order status shows
- [ ] Total amount displays
- [ ] Order date shows
- [ ] Product images/emojis display
- [ ] "Order not found" message for invalid ID

**API Endpoints Used**:
- `GET /api/orders/:id`

---

### 9. TrackingPage (/tracking/:orderId) 🔒
**URL**: `http://localhost:3000/tracking/1` (Protected)

**Tests**:
- [ ] Tracking timeline displays
- [ ] 5 steps show (Ordered → Processing → Shipped → Out for Delivery → Delivered)
- [ ] Current step highlighted
- [ ] Estimated delivery date shows
- [ ] Tracking number displays
- [ ] Carrier information shows
- [ ] Order details display

**API Endpoints Used**:
- `GET /api/orders/:id/tracking`

---

### 10. WishlistPage (/wishlist) 🔒
**URL**: `http://localhost:3000/wishlist` (Protected)

**Tests**:
- [ ] Wishlist items display
- [ ] Product cards show correctly
- [ ] "Add to Cart" button works
- [ ] "Remove" button works
- [ ] Empty wishlist message shows
- [ ] Product images/emojis display
- [ ] Price and rating display

**API Endpoints Used**:
- `GET /api/wishlist`
- `POST /api/cart/items`
- `DELETE /api/wishlist/:id`

---

### 11. AccountPage (/account) 🔒
**URL**: `http://localhost:3000/account` (Protected)

**Tests**:
- [ ] Account dashboard displays
- [ ] 30+ account cards show
- [ ] 8 sections display correctly
- [ ] Navigation links work
- [ ] User name displays
- [ ] Quick access cards clickable
- [ ] Recommendations section shows

**API Endpoints Used**:
- `GET /api/auth/me`

---

### 12. CustomerProfilePage (/account/profile) 🔒
**URL**: `http://localhost:3000/account/profile` (Protected)

**Tests**:
- [ ] Profile form displays
- [ ] User data pre-filled
- [ ] Avatar displays
- [ ] Form fields editable
- [ ] "Save Changes" button works
- [ ] Success message shows
- [ ] Security settings section displays
- [ ] Password change link works
- [ ] 2FA status shows

**API Endpoints Used**:
- `GET /api/auth/me`
- `PUT /api/auth/profile`

---

### 13. CustomerAddressesPage (/account/addresses) 🔒
**URL**: `http://localhost:3000/account/addresses` (Protected)

**Tests**:
- [ ] Address cards display
- [ ] Default address badge shows
- [ ] "Add New Address" button works
- [ ] "Edit" button works
- [ ] "Remove" button works
- [ ] "Set as Default" button works
- [ ] Confirmation dialog on delete
- [ ] Empty state shows if no addresses

**API Endpoints Used**:
- `GET /api/addresses`
- `POST /api/addresses`
- `PUT /api/addresses/:id`
- `DELETE /api/addresses/:id`
- `PATCH /api/addresses/:id/default`

---

### 14. CustomerPaymentMethodsPage (/account/payment-methods) 🔒
**URL**: `http://localhost:3000/account/payment-methods` (Protected)

**Tests**:
- [ ] Payment method cards display
- [ ] Card numbers masked (•••• 4242)
- [ ] Default badge shows
- [ ] "Add Payment Method" button works
- [ ] "Edit" button works
- [ ] "Remove" button works
- [ ] "Set as Default" button works
- [ ] Security notice displays
- [ ] Empty state shows if no methods

**API Endpoints Used**:
- `GET /api/payments/methods`
- `POST /api/payments/methods`
- `DELETE /api/payments/methods/:id`
- `PATCH /api/payments/methods/:id/default`

---

### 15. CustomerReviewsPage (/account/reviews) 🔒
**URL**: `http://localhost:3000/account/reviews` (Protected)

**Tests**:
- [ ] Review statistics display (total, avg rating, helpful votes)
- [ ] Review cards display
- [ ] Star ratings show
- [ ] Product info displays
- [ ] "Edit" button works
- [ ] "Delete" button works
- [ ] Confirmation dialog on delete
- [ ] Empty state shows if no reviews
- [ ] Helpful votes count displays

**API Endpoints Used**:
- `GET /api/reviews/my-reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

---

### 16. CustomerReturnsPage (/account/returns) 🔒
**URL**: `http://localhost:3000/account/returns` (Protected)

**Tests**:
- [ ] Return request cards display
- [ ] Status badges show (Pending, Approved, Processing, Refunded)
- [ ] Product info displays
- [ ] Return reason shows
- [ ] Refund status displays
- [ ] Refund amount shows
- [ ] "Track Return" button works
- [ ] "View Details" button works
- [ ] Empty state shows if no returns

**API Endpoints Used**:
- `GET /api/returns`
- `GET /api/returns/:id`

---

## Quick Test Commands

### Start Backend
```bash
cd .kiro/specs/fastshop-ecommerce-platform/ecomerce_backend
npm start
```

### Start Frontend
```bash
cd .kiro/specs/fastshop-ecommerce-platform/ecommerce_client
npm run dev
```

### Check Backend Health
```bash
curl http://localhost:5000/api/v1/health
```

## Common Issues & Solutions

### Issue: Duplicate Footer
**Solution**: ✅ FIXED - Removed footer from HomePage.jsx (CustomerLayout provides it)

### Issue: 404 on API calls
**Solution**: Check backend is running and .env has correct API URL

### Issue: Authentication errors
**Solution**: Clear localStorage and login again

### Issue: Products not loading
**Solution**: Check backend has products in database

### Issue: CORS errors
**Solution**: Backend CORS is configured for localhost:3000

## Test Results Template

```
Date: ___________
Tester: ___________

HomePage: ☐ Pass ☐ Fail
ProductPage: ☐ Pass ☐ Fail
CartPage: ☐ Pass ☐ Fail
SearchPage: ☐ Pass ☐ Fail
CategoryPage: ☐ Pass ☐ Fail
CheckoutPage: ☐ Pass ☐ Fail
OrdersPage: ☐ Pass ☐ Fail
OrderDetailPage: ☐ Pass ☐ Fail
TrackingPage: ☐ Pass ☐ Fail
WishlistPage: ☐ Pass ☐ Fail
AccountPage: ☐ Pass ☐ Fail
CustomerProfilePage: ☐ Pass ☐ Fail
CustomerAddressesPage: ☐ Pass ☐ Fail
CustomerPaymentMethodsPage: ☐ Pass ☐ Fail
CustomerReviewsPage: ☐ Pass ☐ Fail
CustomerReturnsPage: ☐ Pass ☐ Fail

Notes:
_________________________________
_________________________________
```

## Summary

✅ **All 16 Customer pages are implemented**
✅ **Duplicate footer issue FIXED**
✅ **All pages have backend integration**
✅ **Loading states and error handling included**
✅ **Protected routes configured**
✅ **Responsive design implemented**

Ready for testing!
