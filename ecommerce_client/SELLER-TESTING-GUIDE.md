# Seller Pages Testing Guide

## Quick Start Testing

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. Frontend server running on `http://localhost:5173`
3. Database connected and seeded with test data

---

## Test Scenarios

### Scenario 1: Seller Registration ✅ READY TO TEST

**Steps:**
1. Navigate to `http://localhost:5173/seller-register`
2. Fill out the registration form:
   - Email: `testseller@example.com`
   - Password: `Test123!`
   - Business Name: `Test Store`
   - Business Type: `Individual`
   - Complete all required fields
3. Submit the form
4. Verify success message
5. Check database for new seller record

**Expected Backend Call:**
```
POST /api/auth/register/seller
Body: { email, password, businessName, businessType, ... }
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Seller registered successfully",
  "data": { "userId": "...", "sellerId": "..." }
}
```

---

### Scenario 2: Seller Login & Dashboard ✅ READY TO TEST

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Login with seller credentials
3. Verify redirect to `/seller` (dashboard)
4. Check dashboard displays:
   - Total Revenue stat
   - Total Orders stat
   - Active Products stat
   - Average Rating stat
   - Recent Orders table
   - Product Status table

**Expected Backend Calls:**
```
GET /api/seller/dashboard
GET /api/seller/sub-orders?limit=5
GET /api/seller/products?limit=5
```

**Expected Response Structure:**
```json
// Dashboard stats
{
  "revenue": 15000,
  "orders": 45,
  "products": 12,
  "rating": 4.5,
  "totalReviews": 23,
  "pendingProducts": 2
}

// Sub-orders
{
  "data": {
    "subOrders": [
      {
        "id": "...",
        "orderNumber": "ORD-001",
        "customerName": "John Doe",
        "total": 99.99,
        "fulfillmentStatus": "pending",
        "createdAt": "2026-02-09T..."
      }
    ]
  }
}

// Products
{
  "data": {
    "products": [
      {
        "id": "...",
        "name": "Product Name",
        "sku": "SKU-001",
        "price": 29.99,
        "stock": 100,
        "status": "active"
      }
    ]
  }
}
```

---

### Scenario 3: Product Management ✅ READY TO TEST

#### 3A: View Products
**Steps:**
1. Navigate to `/seller/products`
2. Verify product list displays
3. Test search functionality
4. Test status filter

**Expected Backend Call:**
```
GET /api/seller/products
```

#### 3B: Add Product
**Steps:**
1. Navigate to `/seller/products/add`
2. Fill out product form:
   - Name: `Test Product`
   - Description: `Test description`
   - Price: `29.99`
   - Stock: `100`
   - Category: Select from dropdown
3. Submit form
4. Verify success message
5. Verify redirect to products list

**Expected Backend Call:**
```
POST /api/seller/products
Body: { name, description, price, stock, category, ... }
```

#### 3C: Edit Product
**Steps:**
1. Navigate to `/seller/products`
2. Click "Edit" on a product
3. Modify product details
4. Submit form
5. Verify success message

**Expected Backend Calls:**
```
GET /api/products/:id
PUT /api/seller/products/:id
Body: { name, description, price, stock, ... }
```

#### 3D: Delete Product
**Steps:**
1. Navigate to `/seller/products`
2. Click "Delete" on a product
3. Confirm deletion
4. Verify product removed from list

**Expected Backend Call:**
```
DELETE /api/seller/products/:id
```

---

### Scenario 4: Order Management ✅ READY TO TEST

**Steps:**
1. Navigate to `/seller/orders`
2. Verify orders list displays
3. Check stats cards show correct counts
4. Test status filter
5. Click "View Details" on an order

**Expected Backend Call:**
```
GET /api/seller/sub-orders
```

**Expected Response:**
```json
{
  "data": {
    "subOrders": [
      {
        "id": "...",
        "orderNumber": "ORD-001",
        "customerName": "John Doe",
        "productName": "Product Name",
        "total": 99.99,
        "fulfillmentStatus": "pending",
        "createdAt": "2026-02-09T..."
      }
    ]
  }
}
```

---

### Scenario 5: Performance Metrics ✅ READY TO TEST

**Steps:**
1. Navigate to `/seller/performance`
2. Verify performance metrics display
3. Check KPIs and charts

**Expected Backend Call:**
```
GET /api/seller/performance
```

**Expected Response:**
```json
{
  "data": {
    "salesGrowth": 12.5,
    "orderFulfillmentRate": 98.5,
    "customerSatisfaction": 4.7,
    "returnRate": 2.3,
    "averageOrderValue": 85.50
  }
}
```

---

### Scenario 6: Payouts & Balance ✅ READY TO TEST

**Steps:**
1. Navigate to `/seller/payouts`
2. Verify current balance displays
3. Check payout history table
4. Test "Request Payout" button

**Expected Backend Calls:**
```
GET /api/seller/balance
GET /api/seller/payouts
```

**Expected Response:**
```json
// Balance
{
  "data": {
    "availableBalance": 5000.00,
    "pendingBalance": 1500.00,
    "totalEarnings": 15000.00
  }
}

// Payouts
{
  "data": {
    "payouts": [
      {
        "id": "...",
        "amount": 2000.00,
        "status": "completed",
        "requestedAt": "2026-02-01T...",
        "completedAt": "2026-02-03T..."
      }
    ]
  }
}
```

---

### Scenario 7: Disputes ✅ READY TO TEST

**Steps:**
1. Navigate to `/seller/disputes`
2. Verify disputes list displays
3. Click on a dispute to view details
4. Test adding a comment/response

**Expected Backend Calls:**
```
GET /api/disputes
POST /api/disputes/:disputeId/comment
Body: { comment: "..." }
```

---

## Pages Requiring Backend Development ⚠️

These pages will show errors until backend endpoints are created:

### ❌ Inventory Management
- **URL:** `/seller/inventory`
- **Missing Endpoints:**
  - `GET /api/seller/inventory`
  - `GET /api/seller/inventory/stats`
  - `PUT /api/seller/inventory/:id`

### ❌ Bulk Upload
- **URL:** `/seller/bulk-upload`
- **Missing Endpoints:**
  - `POST /api/seller/bulk-upload`
  - `GET /api/seller/bulk-upload/template`

### ❌ Shipping
- **URL:** `/seller/shipping`
- **Needs:** Frontend update to use `/api/seller/sub-orders/:id/fulfillment`

### ❌ Returns
- **URL:** `/seller/returns`
- **Missing Endpoints:**
  - `GET /api/seller/returns`
  - `GET /api/seller/returns/stats`
  - `POST /api/seller/returns/:id/approve`
  - `POST /api/seller/returns/:id/reject`

### ❌ Analytics
- **URL:** `/seller/analytics`
- **Missing Endpoints:**
  - `GET /api/seller/analytics`
  - `GET /api/seller/analytics/top-products`

### ❌ Reviews
- **URL:** `/seller/reviews`
- **Missing Endpoints:**
  - `GET /api/seller/reviews`
  - `GET /api/seller/reviews/stats`
  - `POST /api/seller/reviews/:id/reply`

### ❌ Commissions
- **URL:** `/seller/commissions`
- **Missing Endpoints:**
  - `GET /api/seller/commissions`

### ❌ Invoices
- **URL:** `/seller/invoices`
- **Missing Endpoints:**
  - `GET /api/seller/invoices`
  - `GET /api/seller/invoices/:id/download`

### ❌ Messages
- **URL:** `/seller/messages`
- **Missing Endpoints:**
  - `GET /api/seller/messages`
  - `GET /api/seller/messages/:id`
  - `POST /api/seller/messages/:id/reply`

### ❌ Settings
- **URL:** `/seller/settings`
- **Missing Endpoints:**
  - `GET /api/seller/settings`
  - `PUT /api/seller/settings`

---

## Common Issues & Solutions

### Issue 1: 401 Unauthorized
**Cause:** Not logged in or token expired
**Solution:** 
1. Login again
2. Check localStorage for token
3. Verify token is being sent in Authorization header

### Issue 2: 403 Forbidden
**Cause:** User doesn't have seller role
**Solution:**
1. Verify user has `role: 'seller'` in database
2. Check seller registration completed successfully

### Issue 3: 404 Not Found
**Cause:** Backend endpoint doesn't exist
**Solution:**
1. Check if endpoint is in the "Missing Endpoints" list above
2. Verify backend server is running
3. Check backend route configuration

### Issue 4: 500 Internal Server Error
**Cause:** Backend error
**Solution:**
1. Check backend console for error logs
2. Verify database connection
3. Check if required data exists (categories, etc.)

### Issue 5: CORS Error
**Cause:** CORS not configured properly
**Solution:**
1. Verify backend CORS middleware allows `http://localhost:5173`
2. Check backend CORS configuration

---

## Testing Checklist

### ✅ Ready to Test (10 pages)
- [ ] Seller Registration
- [ ] Seller Dashboard
- [ ] Products List
- [ ] Add Product
- [ ] Edit Product
- [ ] Orders List
- [ ] Performance Metrics
- [ ] Payouts & Balance
- [ ] Disputes
- [ ] Profile

### ⚠️ Needs Backend (10 pages)
- [ ] Inventory Management
- [ ] Bulk Upload
- [ ] Shipping
- [ ] Returns
- [ ] Analytics
- [ ] Reviews
- [ ] Commissions
- [ ] Invoices
- [ ] Messages
- [ ] Settings

---

## Test Data Requirements

### Database Setup
1. **Categories:** At least 5 product categories
2. **Test Seller:** One seller account for testing
3. **Test Products:** 5-10 products owned by test seller
4. **Test Orders:** 5-10 orders with sub-orders for test seller
5. **Test Reviews:** 3-5 reviews on seller's products
6. **Test Disputes:** 1-2 disputes for testing

### Sample Test Data SQL
```sql
-- Create test seller
INSERT INTO users (email, password, role) VALUES ('testseller@example.com', 'hashed_password', 'seller');

-- Create seller profile
INSERT INTO sellers (userId, businessName, businessType, status) VALUES (1, 'Test Store', 'individual', 'approved');

-- Create test products
INSERT INTO products (sellerId, name, description, price, stock, status) VALUES 
(1, 'Test Product 1', 'Description 1', 29.99, 100, 'active'),
(1, 'Test Product 2', 'Description 2', 49.99, 50, 'active');
```

---

## Performance Testing

### Load Testing
1. Test with 100+ products
2. Test with 1000+ orders
3. Verify pagination works
4. Check loading times

### Stress Testing
1. Rapid page navigation
2. Multiple simultaneous API calls
3. Large file uploads (bulk upload)
4. Concurrent user sessions

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Mobile Responsiveness

Test on:
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1920px width)

---

## Security Testing

- [ ] Verify seller can only access own data
- [ ] Test unauthorized access attempts
- [ ] Verify token expiration handling
- [ ] Test XSS prevention
- [ ] Test SQL injection prevention

---

## Conclusion

**Current Status:**
- 10 pages ready for immediate testing
- 10 pages need backend development
- 3 critical fixes applied

**Next Steps:**
1. Test the 10 working pages
2. Document any bugs found
3. Create backend endpoints for remaining pages
4. Retest after backend completion
