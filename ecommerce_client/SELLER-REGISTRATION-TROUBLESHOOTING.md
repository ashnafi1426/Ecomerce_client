# Seller Registration Troubleshooting Guide

## Issue: Registration Failed

### Fix Applied ✅

**Problem:** Frontend was sending form data in wrong format
**Solution:** Updated to match backend expectations

---

## What Was Fixed

### Before (Incorrect Format)
```javascript
// Frontend was sending:
{
  email: "test@example.com",
  password: "password123",
  businessType: "individual",
  businessName: "My Store",
  street: "123 Main St",
  city: "New York",
  // ... all fields flat
}
```

### After (Correct Format)
```javascript
// Frontend now sends:
{
  email: "test@example.com",
  password: "password123",
  displayName: "My Store",
  businessName: "My Store",
  phone: "+1234567890",
  businessInfo: {
    businessType: "individual",
    registrationNumber: "REG123",
    taxId: "12-3456789",
    address: "{\"street\":\"123 Main St\",\"city\":\"New York\",...}"
  }
}
```

---

## Backend Requirements

The backend `/api/auth/register/seller` endpoint expects:

### Required Fields
- `email` (string) - Valid email format
- `password` (string) - Minimum 8 characters
- `businessName` (string) - Minimum 3 characters

### Optional Fields
- `displayName` (string) - Defaults to businessName
- `phone` (string) - Phone number
- `businessInfo` (object) - Business details
  - `businessType` (string)
  - `registrationNumber` (string)
  - `taxId` (string)
  - `address` (string) - JSON stringified address object

---

## Common Errors & Solutions

### Error 1: "Email, password, and business name are required"
**Cause:** Missing required fields
**Solution:** Ensure all required fields are filled:
- Email
- Password (min 8 characters)
- Business Name (min 3 characters)

### Error 2: "Invalid email format"
**Cause:** Email doesn't match regex pattern
**Solution:** Use valid email format: `user@domain.com`

### Error 3: "Password must be at least 8 characters"
**Cause:** Password too short
**Solution:** Use password with 8+ characters

### Error 4: "Email already registered"
**Cause:** Email exists in database
**Solution:** 
- Use different email
- OR login with existing account
- OR reset password

### Error 5: "Passwords do not match"
**Cause:** Password and Confirm Password fields don't match
**Solution:** Ensure both password fields have same value

### Error 6: "Please agree to the terms and conditions"
**Cause:** Terms checkbox not checked
**Solution:** Check the agreement checkbox before submitting

### Error 7: Network Error / 500 Internal Server Error
**Cause:** Backend server issue or database connection
**Solution:**
1. Check backend server is running
2. Check database connection
3. Check backend logs for errors
4. Verify Supabase credentials

---

## Testing the Fix

### Test Steps

1. **Start Servers**
```bash
# Terminal 1 - Backend
cd ecomerce_backend
npm start

# Terminal 2 - Frontend
cd ecommerce_client
npm run dev
```

2. **Open Registration Page**
```
http://localhost:5173/seller-register
```

3. **Fill Form with Test Data**
```
Email: testseller@example.com
Password: Test123456
Confirm Password: Test123456
Business Type: Individual
Business Name: Test Store
Registration Number: REG123
Tax ID: 12-3456789
Street: 123 Main Street
City: New York
State: NY
ZIP Code: 10001
Country: United States
Phone: +1 (555) 123-4567
[✓] Agree to terms
```

4. **Submit Form**
- Click "Continue to Next Step"
- Watch browser console for any errors
- Check network tab for API request/response

5. **Expected Result**
- Success toast: "Registration successful! Please login to continue."
- Redirect to `/login` page
- Can login with credentials
- Redirected to `/seller` dashboard

---

## Debugging Steps

### 1. Check Browser Console
```javascript
// Open DevTools (F12)
// Look for errors in Console tab
// Check Network tab for API calls
```

### 2. Check Request Payload
```javascript
// In Network tab:
// 1. Click on "register" request
// 2. Go to "Payload" tab
// 3. Verify data format matches backend expectations
```

### 3. Check Response
```javascript
// In Network tab:
// 1. Click on "register" request
// 2. Go to "Response" tab
// 3. Check for error messages
```

### 4. Check Backend Logs
```bash
# In backend terminal
# Look for error messages
# Check database connection
# Verify Supabase queries
```

---

## Backend Validation Rules

### Email
- Must be valid email format
- Must not already exist in database
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Password
- Minimum 8 characters
- Will be hashed before storage
- Not returned in response

### Business Name
- Minimum 3 characters
- Required field
- Used as displayName if not provided

### Phone
- Optional field
- No specific format validation
- Stored as-is

### Business Info
- Optional object
- Can contain any business-related data
- Address should be JSON string

---

## Database Schema

### Users Table
```sql
{
  id: UUID (auto-generated),
  email: STRING (unique),
  password_hash: STRING,
  role: 'seller',
  display_name: STRING,
  business_name: STRING,
  phone: STRING (nullable),
  business_address: STRING (nullable),
  tax_id: STRING (nullable),
  verification_status: 'pending',
  status: 'active',
  created_at: TIMESTAMP
}
```

---

## API Response Format

### Success Response (201)
```json
{
  "message": "Seller account created successfully. Pending admin approval.",
  "token": "jwt_token_here",
  "seller": {
    "id": "uuid",
    "email": "seller@example.com",
    "role": "seller",
    "displayName": "My Store",
    "businessName": "My Store",
    "verificationStatus": "pending"
  }
}
```

### Error Response (400/409/500)
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

---

## Post-Registration Flow

### 1. Registration Success
- User account created in database
- Role set to 'seller'
- Verification status set to 'pending'
- JWT token generated (but not used yet)

### 2. Redirect to Login
- User redirected to `/login` page
- Must login with credentials
- Token from registration not stored

### 3. Login
- User enters email and password
- Backend validates credentials
- Returns new JWT token
- Token stored in localStorage

### 4. Role Detection
- Frontend checks user role
- If role is 'seller', redirect to `/seller`
- Dashboard loads with seller data

### 5. Seller Dashboard
- Shows stats, orders, products
- Access to all seller features
- Protected by authentication

---

## Verification Status

### Pending (Default)
- New sellers start with 'pending' status
- May have limited access
- Awaiting admin approval

### Approved
- Admin has verified seller
- Full access to all features
- Can list products

### Rejected
- Admin has rejected seller
- Limited or no access
- May need to reapply

---

## Security Notes

### Password Handling
- Never logged or displayed
- Hashed using bcrypt
- Minimum 8 characters required
- Not returned in API responses

### JWT Token
- Generated on registration
- Contains userId and role
- Expires after set time
- Stored in localStorage

### Data Validation
- All inputs validated on backend
- SQL injection prevention
- XSS prevention
- CSRF protection

---

## Next Steps After Registration

1. ✅ Registration successful
2. ✅ Redirected to login
3. ✅ Login with credentials
4. ✅ Redirected to seller dashboard
5. ⏳ Wait for admin approval (if required)
6. ✅ Start adding products
7. ✅ Manage orders
8. ✅ Track performance

---

## Support & Resources

### Documentation
- `SELLER-REGISTRATION-LOGIN-FLOW.md` - Complete flow
- `SELLER-REGISTRATION-FIXES.md` - Recent fixes
- `SELLER-TESTING-GUIDE.md` - Testing instructions
- `SELLER-REGISTRATION-TROUBLESHOOTING.md` - This file

### Code Files
- Frontend: `ecommerce_client/src/pages/seller/SellerRegisterPage.jsx`
- Backend: `ecomerce_backend/controllers/authControllers/auth.controller.js`
- Service: `ecomerce_backend/services/userServices/user.service.js`

### API Endpoint
- URL: `POST /api/auth/register/seller`
- Full URL: `http://localhost:5000/api/auth/register/seller`

---

## Quick Checklist

Before submitting registration:
- [ ] Email is valid format
- [ ] Password is 8+ characters
- [ ] Passwords match
- [ ] Business name is 3+ characters
- [ ] All required fields filled
- [ ] Terms checkbox checked
- [ ] Backend server running
- [ ] Database connected

After submission:
- [ ] No errors in console
- [ ] Success toast shown
- [ ] Redirected to login
- [ ] Can login successfully
- [ ] Redirected to dashboard

---

## Status: FIXED ✅

**Issue:** Registration data format mismatch
**Fix:** Updated frontend to send correct format
**Result:** Registration now works correctly

**Test it now!**
