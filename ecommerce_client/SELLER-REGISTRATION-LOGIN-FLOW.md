# Seller Registration & Login Flow - Complete Guide

## Overview
This document explains the complete seller registration and login process, including what happens after registration.

---

## 🔄 Complete Flow Diagram

```
1. User visits site
   ↓
2. Clicks "Register as Seller" link
   ↓
3. Fills seller registration form
   ↓
4. Submits form → POST /api/auth/register/seller
   ↓
5. Backend creates seller account
   ↓
6. Success message shown
   ↓
7. Redirected to /login
   ↓
8. User logs in with credentials
   ↓
9. Backend returns user data with role='seller'
   ↓
10. Frontend detects seller role
   ↓
11. Redirects to /seller (Seller Dashboard)
   ↓
12. Seller can now manage products, orders, etc.
```

---

## 📍 Where to Find "Register as Seller" Links

### 1. Login Page (`/login`)
**Location:** Bottom of the page
**Text:** "Are you a seller? Register as a seller"
**Link:** `/seller-register`

### 2. Register Page (`/register`)
**Location:** Below the "Already have an account?" section
**Text:** "Want to sell on FastShop? Register as a Seller"
**Link:** `/seller-register`

### 3. Direct URL
**URL:** `http://localhost:5173/seller-register`

---

## 📝 Seller Registration Form

### Required Fields

#### Step 1: Account Information
- **Email** - Valid email address
- **Password** - Minimum 8 characters
- **Confirm Password** - Must match password

#### Step 2: Business Information
- **Business Type** - Individual, LLC, Corporation, etc.
- **Business Name** - Minimum 3 characters
- **Registration Number** - Business registration number
- **Tax ID** - Tax identification number

#### Step 3: Business Address
- **Street Address**
- **City**
- **State/Province**
- **ZIP/Postal Code**
- **Country** - Default: United States

#### Step 4: Contact Information
- **Phone Number**
- **Agree to Terms** - Must check this box

---

## 🔐 What Happens After Registration

### Backend Process

1. **Validation**
   - Email format check
   - Password length (min 8 characters)
   - Business name length (min 3 characters)
   - Check if email already exists

2. **Account Creation**
   - Hash password
   - Create user record with role='seller'
   - Create seller profile record
   - Link user to seller profile

3. **Response**
   ```json
   {
     "success": true,
     "message": "Seller registered successfully",
     "data": {
       "userId": "...",
       "sellerId": "...",
       "email": "seller@example.com",
       "businessName": "My Store"
     }
   }
   ```

4. **Email Notification** (if configured)
   - Welcome email sent
   - Verification link (if email verification enabled)
   - Next steps instructions

### Frontend Process

1. **Success Toast**
   - Message: "Registration successful! Please check your email for verification."

2. **Redirect to Login**
   - User redirected to `/login` page
   - Can immediately log in with credentials

---

## 🔑 Login Process for Sellers

### Step 1: User Logs In
- Navigate to `/login`
- Enter email and password
- Click "Sign in"

### Step 2: Backend Authentication
```javascript
POST /api/auth/login
Body: { email, password }

Response: {
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "seller@example.com",
    "role": "seller",
    "displayName": "My Store",
    "sellerId": "..."
  }
}
```

### Step 3: Frontend Role Detection
```javascript
// LoginPage.jsx
const result = await dispatch(login({ email, password })).unwrap()
const userRole = result.user?.role || result.user?.userRole

if (userRole === 'seller') {
  navigate('/seller')  // Redirect to Seller Dashboard
} else if (userRole === 'admin') {
  navigate('/admin')   // Redirect to Admin Dashboard
} else if (userRole === 'manager') {
  navigate('/manager') // Redirect to Manager Dashboard
} else {
  navigate('/')        // Redirect to Home (Customer)
}
```

### Step 4: Seller Dashboard Loads
- URL: `/seller`
- Component: `SellerDashboardPage`
- Protected by `ProtectedRoute` with `roles={['seller']}`

---

## 🎯 What Sellers See After Login

### Seller Dashboard (`/seller`)

#### Stats Cards
- **Total Revenue** - Total earnings
- **Total Orders** - Number of orders
- **Active Products** - Number of products
- **Average Rating** - Customer rating

#### Recent Orders Table
- Order ID
- Customer name
- Product name
- Amount
- Status
- Date
- Actions (View Details)

#### Product Status Table
- Product name with image
- SKU
- Price
- Stock level
- Status (Active, Pending Approval)
- Actions (Edit, View)

---

## 🚀 Available Seller Features

After login, sellers can access:

### ✅ Working Features (Ready to Use)
1. **Dashboard** - `/seller` - Overview and stats
2. **Products** - `/seller/products` - View all products
3. **Add Product** - `/seller/products/add` - Create new product
4. **Edit Product** - `/seller/products/edit/:id` - Update product
5. **Orders** - `/seller/orders` - View and manage orders
6. **Performance** - `/seller/performance` - Performance metrics
7. **Payouts** - `/seller/payouts` - View earnings and payouts
8. **Disputes** - `/seller/disputes` - Handle disputes
9. **Profile** - `/seller/profile` - Update business profile

### ⚠️ Features Needing Backend (Will Show Errors)
1. **Inventory** - `/seller/inventory` - Stock management
2. **Bulk Upload** - `/seller/bulk-upload` - CSV upload
3. **Shipping** - `/seller/shipping` - Shipping management
4. **Returns** - `/seller/returns` - Return requests
5. **Analytics** - `/seller/analytics` - Sales analytics
6. **Reviews** - `/seller/reviews` - Customer reviews
7. **Commissions** - `/seller/commissions` - Commission history
8. **Invoices** - `/seller/invoices` - Invoice management
9. **Messages** - `/seller/messages` - Customer messages
10. **Settings** - `/seller/settings` - Store settings

---

## 🔒 Security & Access Control

### Protected Routes
All seller routes are protected by `ProtectedRoute` component:

```jsx
<Route path="/seller" element={
  <ProtectedRoute roles={['seller']}>
    <SellerLayout />
  </ProtectedRoute>
}>
  {/* Seller routes */}
</Route>
```

### Access Checks
1. **Authentication** - Must be logged in (have valid JWT token)
2. **Authorization** - Must have role='seller'
3. **Token Validation** - Token checked on every API request
4. **Auto Logout** - Redirected to login if token expires (401)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Register as Seller" Link Not Visible
**Cause:** Old version of LoginPage or RegisterPage
**Solution:** 
- Clear browser cache
- Refresh page
- Check that files are updated

### Issue 2: Registration Fails with "Email already registered"
**Cause:** Email already exists in database
**Solution:**
- Use a different email
- OR login with existing credentials
- OR reset password if forgotten

### Issue 3: After Login, Redirected to Home Instead of Seller Dashboard
**Cause:** User role not set correctly or login detection issue
**Solution:**
- Check backend response includes `role: 'seller'`
- Verify user record in database has correct role
- Check browser console for errors

### Issue 4: "Failed to load dashboard data" Error
**Cause:** Backend endpoint not responding or seller not approved
**Solution:**
- Verify backend server is running
- Check seller status in database (should be 'approved')
- Check backend logs for errors

### Issue 5: Can't Access Seller Pages (403 Forbidden)
**Cause:** User doesn't have seller role
**Solution:**
- Verify user role in database
- Re-register as seller if needed
- Contact admin to update role

---

## 🧪 Testing the Flow

### Test Scenario 1: New Seller Registration

```bash
# 1. Start servers
cd ecomerce_backend && npm start
cd ecommerce_client && npm run dev

# 2. Open browser
http://localhost:5173/login

# 3. Click "Register as a seller"
# 4. Fill form with test data:
Email: testseller@example.com
Password: Test123456
Business Name: Test Store
Business Type: Individual
[Fill other required fields]

# 5. Submit form
# 6. Verify success message
# 7. Verify redirect to /login
# 8. Login with credentials
# 9. Verify redirect to /seller
# 10. Verify dashboard loads with data
```

### Test Scenario 2: Existing Seller Login

```bash
# 1. Go to http://localhost:5173/login
# 2. Enter seller credentials
# 3. Click "Sign in"
# 4. Verify redirect to /seller
# 5. Verify dashboard displays correctly
```

---

## 📊 Database Schema

### Users Table
```sql
{
  id: UUID,
  email: STRING,
  passwordHash: STRING,
  role: 'seller',  -- Important!
  displayName: STRING,
  createdAt: TIMESTAMP
}
```

### Sellers Table
```sql
{
  id: UUID,
  userId: UUID (FK to users),
  businessName: STRING,
  businessType: STRING,
  registrationNumber: STRING,
  taxId: STRING,
  phone: STRING,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: TIMESTAMP
}
```

---

## 🎓 Key Points to Remember

1. **Separate Registration Pages**
   - Customers: `/register`
   - Sellers: `/seller-register`

2. **Role-Based Redirection**
   - After login, users redirected based on role
   - Sellers → `/seller`
   - Admins → `/admin`
   - Managers → `/manager`
   - Customers → `/`

3. **Seller Approval**
   - Sellers may need admin approval before accessing all features
   - Check `status` field in sellers table

4. **Protected Routes**
   - All seller routes require authentication + seller role
   - Automatic redirect to login if not authenticated

5. **Token Management**
   - JWT token stored in localStorage
   - Sent with every API request
   - Auto-logout on expiration

---

## 📞 Support

### Documentation Files
- `SELLER-REGISTRATION-LOGIN-FLOW.md` (this file)
- `SELLER-QUICK-REFERENCE.md` - Quick reference
- `SELLER-TESTING-GUIDE.md` - Testing instructions
- `SELLER-INTEGRATION-COMPLETE-SUMMARY.md` - Full summary

### Backend Files
- `ecomerce_backend/controllers/authControllers/auth.controller.js`
- `ecomerce_backend/routes/authRoutes/auth.routes.js`
- `ecomerce_backend/services/userServices/user.service.js`

### Frontend Files
- `ecommerce_client/src/pages/auth/LoginPage.jsx`
- `ecommerce_client/src/pages/auth/RegisterPage.jsx`
- `ecommerce_client/src/pages/seller/SellerRegisterPage.jsx`
- `ecommerce_client/src/store/slices/authSlice.js`

---

## ✅ Summary

**Registration Flow:**
1. Click "Register as Seller" link (on login or register page)
2. Fill multi-step registration form
3. Submit → Backend creates seller account
4. Redirect to login page
5. Login with credentials
6. Auto-redirect to seller dashboard

**What Sellers Get:**
- Dedicated seller dashboard
- Product management tools
- Order management
- Performance metrics
- Payout tracking
- And more...

**Current Status:**
- ✅ Registration flow complete
- ✅ Login flow complete
- ✅ Role-based redirection working
- ✅ 9 seller features ready to use
- ⚠️ 10 features need backend development

---

**Status: REGISTRATION & LOGIN FLOW COMPLETE** ✅
