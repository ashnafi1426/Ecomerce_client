# 🔧 Login Debugging Guide - Step by Step

## ✅ Fixes Applied

### Fix #1: Removed Double Unwrapping in authSlice.js
**Problem:** The response was being unwrapped twice - once in the interceptor and once in authSlice
**Solution:** Removed `response.data || response` logic since interceptor already returns `response.data`

```javascript
// ❌ BEFORE (Double unwrapping)
const response = await authAPI.login({ email, password })
const data = response.data || response  // Trying to unwrap again!

// ✅ AFTER (Single unwrapping in interceptor)
const data = await authAPI.login({ email, password })  // Already unwrapped!
```

### Fix #2: Added Console Logging for Debugging
Added console.log statements to track the data flow:
- Login API response
- Token storage
- User storage
- Error details

### Fix #3: Improved Error Handling
- Better error message extraction
- Removed redundant error.response checks (already handled in interceptor)

---

## 🔍 Step-by-Step Debugging Process

### Step 1: Check if Backend is Running
```bash
# In terminal, navigate to backend folder
cd ecomerce_backend
npm start

# You should see:
# Server running on port 5000
# Database connected
```

**Expected:** Backend running on `http://localhost:5000`

### Step 2: Test Backend API Directly
Open browser console and run:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com', 
    password: 'password123' 
  })
})
.then(r => r.json())
.then(data => console.log('Backend Response:', data))
.catch(err => console.error('Backend Error:', err))
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "test@example.com",
    "role": "customer",
    "name": "Test User"
  }
}
```

### Step 3: Check Frontend Environment Variables
```bash
# In ecommerce_client folder, check .env file
cat .env

# Should show:
# VITE_API_URL=http://localhost:5000/api
# VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Step 4: Check Browser Console During Login

When you try to login, you should see these console logs:

```
1. "API Response:" { token: "...", user: {...} }
2. "Login result:" { token: "...", user: {...} }
3. "User object:" { id: "...", email: "...", role: "..." }
4. "User role:" "customer" (or "seller", "admin", "manager")
5. "Detected role:" "customer"
6. "Redirecting to home" (or appropriate dashboard)
```

### Step 5: Check Network Tab

1. Open Browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for request to `/api/auth/login`

**Check Request:**
- URL: `http://localhost:5000/api/auth/login`
- Method: POST
- Headers: `Content-Type: application/json`
- Payload: `{ "email": "...", "password": "..." }`

**Check Response:**
- Status: 200 OK (success) or 401 (wrong credentials)
- Response body should have `token` and `user`

---

## 🐛 Common Errors and Solutions

### Error 1: "Network error. Please check your internet connection."
**Cause:** Backend is not running or wrong URL
**Solution:**
1. Start backend: `cd ecomerce_backend && npm start`
2. Check .env has correct URL: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend: `npm run dev`

### Error 2: "Cannot read property 'token' of undefined"
**Cause:** Backend response format is wrong
**Solution:**
1. Check backend returns: `{ token: "...", user: {...} }`
2. Not: `{ data: { token: "...", user: {...} } }`
3. The interceptor unwraps `response.data` automatically

### Error 3: "Session expired. Please login again."
**Cause:** Getting 401 on login request (shouldn't happen on login)
**Solution:**
1. Check backend auth route doesn't require token for login
2. Login endpoint should be public (no auth middleware)

### Error 4: "Login failed" (generic error)
**Cause:** Error not being caught properly
**Solution:**
1. Check browser console for actual error
2. Check Network tab for response details
3. Look at console.log outputs we added

### Error 5: Toast notifications not showing
**Cause:** Using react-toastify in LoginPage but react-hot-toast in api.service
**Solution:** Both should work, but check:
1. Toaster component is rendered in App.jsx
2. For react-toastify: `<ToastContainer />` in App.jsx
3. For react-hot-toast: `<Toaster />` in App.jsx

---

## 📋 Checklist Before Testing

- [ ] Backend is running on port 5000
- [ ] Database is connected
- [ ] Test user exists in database
- [ ] .env file has correct VITE_API_URL
- [ ] Frontend is running (npm run dev)
- [ ] Browser console is open (F12)
- [ ] Network tab is open
- [ ] No CORS errors in console

---

## 🧪 Test Cases

### Test Case 1: Valid Login
```
Email: test@example.com
Password: password123
Expected: Success, redirect to appropriate dashboard
```

### Test Case 2: Invalid Email
```
Email: wrong@example.com
Password: password123
Expected: Error toast "Invalid credentials" or similar
```

### Test Case 3: Invalid Password
```
Email: test@example.com
Password: wrongpassword
Expected: Error toast "Invalid credentials" or similar
```

### Test Case 4: Empty Fields
```
Email: (empty)
Password: (empty)
Expected: HTML5 validation prevents submission
```

### Test Case 5: Backend Down
```
Stop backend server
Try to login
Expected: Error toast "Network error. Please check your internet connection."
```

---

## 🔧 Quick Fixes

### If login button does nothing:
1. Check browser console for errors
2. Check if form is submitting (Network tab)
3. Check if handleSubmit is being called (add console.log)

### If you get CORS error:
Add to backend (usually in server.js or app.js):
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

### If token is not being saved:
Check localStorage in DevTools:
1. Open DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Check if 'token' and 'user' are there after login

### If redirect doesn't work:
1. Check console logs show correct role
2. Check navigate function is being called
3. Check routes are defined in App.jsx
4. Try manual navigation: `window.location.href = '/seller'`

---

## 📝 What to Check in Console

After attempting login, check console for:

```javascript
// Should see these logs:
"API Response:" { token: "...", user: {...} }  // From authSlice
"Login result:" { token: "...", user: {...} }  // From LoginPage
"User object:" { id: "...", email: "...", role: "..." }  // From LoginPage
"User role:" "customer"  // From LoginPage
"Detected role:" "customer"  // From LoginPage
"Redirecting to home"  // From LoginPage

// Should NOT see:
"Login error:" ...  // Means login failed
"Login error in authSlice:" ...  // Means API call failed
```

---

## 🎯 Expected Data Flow

```
1. User enters email/password
   ↓
2. LoginPage calls dispatch(login({email, password}))
   ↓
3. authSlice calls authAPI.login({email, password})
   ↓
4. api.service.js makes POST to /api/auth/login
   ↓
5. Request interceptor adds headers
   ↓
6. Backend processes login
   ↓
7. Backend returns { token, user }
   ↓
8. Response interceptor unwraps response.data
   ↓
9. authSlice receives { token, user }
   ↓
10. authSlice stores in localStorage
   ↓
11. authSlice returns data to LoginPage
   ↓
12. LoginPage redirects based on role
```

---

## 🚀 Next Steps After Login Works

1. Test all user roles (customer, seller, admin, manager)
2. Test protected routes
3. Test logout functionality
4. Test token expiration
5. Test "keep me signed in" functionality

---

**Status:** ✅ FIXES APPLIED
**Date:** February 10, 2026
**Action:** Try logging in and check console for the logs mentioned above
