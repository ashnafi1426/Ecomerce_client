# Registration Route Error Fix

## Problem
User reported error: `Route not found: POST /api/v1/auth/registe`

The error showed the endpoint was being called as `/api/v1/auth/register` but the backend routes were configured as `/api/auth/register`.

## Root Cause
**Mismatch between frontend and backend API base paths:**

- **Frontend** (.env): `VITE_API_URL=http://localhost:5000/api/v1`
- **Backend** (routes): All routes start with `/api/` (e.g., `/api/auth/register`)
- **Result**: Frontend was calling `http://localhost:5000/api/v1/auth/register` ❌
- **Expected**: Backend listens on `http://localhost:5000/api/auth/register` ✅

## Solution
Updated frontend configuration to match backend routes:

### Files Changed:
1. **`.env`**
   - Changed: `VITE_API_URL=http://localhost:5000/api/v1`
   - To: `VITE_API_URL=http://localhost:5000/api`

2. **`src/config/api.js`**
   - Changed fallback: `http://localhost:5004/api`
   - To: `http://localhost:5000/api`

## Verification
After this fix, the API calls will work correctly:

- **Login**: `POST http://localhost:5000/api/auth/login` ✅
- **Register**: `POST http://localhost:5000/api/auth/register` ✅
- **Get Profile**: `GET http://localhost:5000/api/auth/me` ✅

## Testing
1. Restart the frontend dev server: `npm run dev`
2. Try registering a new user
3. The registration should now work without the "Route not found" error

## Note
The backend uses `/api/` as the base path for all routes, not `/api/v1/`. The `/api/v1/health` endpoint mentioned in server.js is a special health check endpoint, but the actual API routes use `/api/` prefix.
