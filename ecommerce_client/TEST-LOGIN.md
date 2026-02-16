# 🧪 Test Login - Step by Step

Based on your console output, I can see:
- ✅ Environment variables are loaded correctly
- ✅ VITE_API_URL = "http://localhost:5000/api"
- ✅ api.service.js is loaded

## Quick Test in Browser Console

Open your browser console (F12) and paste this:

### Test 1: Check if Backend is Reachable
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@test.com', 
    password: 'test123' 
  })
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err))
```

### Expected Results:

**If Backend is Running:**
```
Status: 200 (or 401 if wrong credentials)
Response: { token: "...", user: {...} }
```

**If Backend is NOT Running:**
```
Error: Failed to fetch
or
Error: net::ERR_CONNECTION_REFUSED
```

## Common Issues and Solutions

### Issue 1: Backend Not Running
**Error:** `Failed to fetch` or `ERR_CONNECTION_REFUSED`

**Solution:**
```bash
# Open new terminal
cd ecomerce_backend
npm start

# Should see:
# Server running on port 5000
# MongoDB connected
```

### Issue 2: Wrong Port
**Error:** `Failed to fetch`

**Check backend is on port 5000:**
```bash
# In backend terminal, you should see:
# Server running on port 5000
```

**If it's on different port, update .env:**
```
VITE_API_URL=http://localhost:YOUR_PORT/api
```

### Issue 3: CORS Error
**Error:** `Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:** Add CORS to backend (usually in server.js or app.js):
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue 4: No Test User in Database
**Error:** Status 401 or "Invalid credentials"

**Solution:** Create a test user in your database or use registration first

## Test with Postman/Thunder Client

If browser test doesn't work, try with Postman:

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/login`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "email": "test@test.com",
  "password": "test123"
}
```

## Check Backend Logs

When you try to login, check backend terminal for:
- Request received
- Any errors
- Response sent

## Next Steps

1. **Run the fetch test above** in browser console
2. **Tell me what error you see**
3. I'll help you fix it specifically

The most common issue is simply that the backend is not running!
