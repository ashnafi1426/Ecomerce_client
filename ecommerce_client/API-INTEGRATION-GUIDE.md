# 🔌 API Integration Guide - Remove Mock Data

## Overview
This guide documents the process of replacing all mock data with real API calls across Admin and Seller pages.

---

## 📋 API Endpoints Reference

### Admin API Endpoints

#### Dashboard & Analytics
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/analytics/revenue` - Revenue analytics
- `GET /api/admin/analytics/orders` - Order analytics
- `GET /api/admin/analytics/products` - Product analytics

#### Products
- `GET /api/admin/products` - All products with pagination
- `GET /api/admin/products/:id` - Single product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/products/approvals` - Pending approvals
- `PUT /api/admin/products/:id/approve` - Approve product
- `PUT /api/admin/products/:id/reject` - Reject product

#### Categories & Brands
- `GET /api/admin/categories` - All categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/brands` - All brands
- `POST /api/admin/brands` - Create brand

#### Orders
- `GET /api/admin/orders` - All orders
- `GET /api/admin/orders/:id` - Order details
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/orders/stats` - Order statistics

#### Users
- `GET /api/admin/users` - All users
- `GET /api/admin/users/:id` - User details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/sellers` - All sellers
- `GET /api/admin/managers` - All managers
- `GET /api/admin/customers` - All customers

#### Financial
- `GET /api/admin/payments` - Payment transactions
- `GET /api/admin/payouts` - Seller payouts
- `POST /api/admin/payouts` - Process payout
- `GET /api/admin/refunds` - Refund requests
- `POST /api/admin/refunds/:id/approve` - Approve refund

#### System
- `GET /api/admin/roles` - All roles
- `POST /api/admin/roles` - Create role
- `GET /api/admin/commissions` - Commission settings
- `PUT /api/admin/commissions` - Update commissions
- `GET /api/admin/taxes` - Tax settings
- `GET /api/admin/settings` - System settings
- `PUT /api/admin/settings` - Update settings
- `GET /api/admin/logs` - Activity logs
- `GET /api/admin/reports` - Generate reports

---

### Seller API Endpoints

#### Dashboard & Analytics
- `GET /api/seller/dashboard/stats` - Dashboard statistics
- `GET /api/seller/analytics/revenue` - Revenue data
- `GET /api/seller/analytics/sales` - Sales data
- `GET /api/seller/performance` - Performance metrics

#### Products
- `GET /api/seller/products` - Seller's products
- `GET /api/seller/products/:id` - Product details
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product
- `POST /api/seller/products/bulk-upload` - CSV upload
- `GET /api/seller/inventory` - Inventory levels
- `PUT /api/seller/inventory/:id` - Update stock

#### Orders
- `GET /api/seller/orders` - Seller's orders
- `GET /api/seller/orders/:id` - Order details
- `PUT /api/seller/orders/:id/ship` - Mark as shipped
- `GET /api/seller/shipping` - Shipping queue
- `POST /api/seller/shipping/label` - Generate label
- `GET /api/seller/returns` - Return requests
- `PUT /api/seller/returns/:id/approve` - Approve return
- `PUT /api/seller/returns/:id/reject` - Reject return

#### Financial
- `GET /api/seller/payouts` - Payout history
- `GET /api/seller/payouts/balance` - Current balance
- `POST /api/seller/payouts/request` - Request withdrawal
- `GET /api/seller/commissions` - Commission details
- `GET /api/seller/invoices` - Invoice list
- `GET /api/seller/invoices/:id/download` - Download PDF

#### Customer Service
- `GET /api/seller/messages` - Customer messages
- `POST /api/seller/messages/:id/reply` - Reply to message
- `GET /api/seller/reviews` - Product reviews
- `POST /api/seller/reviews/:id/reply` - Reply to review
- `GET /api/seller/disputes` - Dispute cases
- `POST /api/seller/disputes/:id/respond` - Respond to dispute

#### Account
- `GET /api/seller/profile` - Business profile
- `PUT /api/seller/profile` - Update profile
- `GET /api/seller/settings` - Store settings
- `PUT /api/seller/settings` - Update settings

---

## 🔧 API Helper Functions

### Create API Service (`src/services/api.service.js`)

```javascript
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // GET request
  get: (url, params = {}) => {
    return apiClient.get(url, { params });
  },
  
  // POST request
  post: (url, data = {}) => {
    return apiClient.post(url, data);
  },
  
  // PUT request
  put: (url, data = {}) => {
    return apiClient.put(url, data);
  },
  
  // DELETE request
  delete: (url) => {
    return apiClient.delete(url);
  },
  
  // Upload file
  upload: (url, formData) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;
```

---

## 📝 Migration Pattern

### Before (With Mock Data):
```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const SellerDashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 24567,
    totalOrders: 342,
    activeProducts: 127,
    avgRating: 4.8
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  // Mock data
  const mockOrders = [
    { id: 1, orderId: '#ORD-12345', customer: 'John Doe', amount: '79.99' }
  ];

  // ... rest of component
};
```

### After (With Real API):
```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api.service';

const SellerDashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    avgRating: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stats
      const statsData = await api.get('/seller/dashboard/stats');
      setStats(statsData);
      
      // Fetch recent orders
      const ordersData = await api.get('/seller/orders', { 
        limit: 10, 
        sort: '-createdAt' 
      });
      setOrders(ordersData.orders || []);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>
          <span style={{ fontSize: '3em' }}>⚠️</span>
          <h2>Failed to load data</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} style={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ... rest of component
};
```

---

## 🎯 Update Checklist

### For Each Page:

1. **Remove Mock Data**
   - ❌ Delete all `mockData` arrays
   - ❌ Remove `setTimeout` simulations
   - ❌ Remove hardcoded values

2. **Add API Service**
   - ✅ Import `api` from service
   - ✅ Create `fetchData` function
   - ✅ Add error state
   - ✅ Add retry functionality

3. **Update State Management**
   - ✅ Initialize with empty/zero values
   - ✅ Add error state
   - ✅ Add loading state
   - ✅ Handle API responses

4. **Add Error Handling**
   - ✅ Try-catch blocks
   - ✅ Error state display
   - ✅ Retry button
   - ✅ Toast notifications

5. **Update Actions**
   - ✅ Create → POST request
   - ✅ Update → PUT request
   - ✅ Delete → DELETE request
   - ✅ Refresh after actions

---

## 📊 Pages to Update

### Admin Pages (23):
1. AdminDashboardPage.jsx
2. AdminRevenuePage.jsx
3. AdminAnalyticsPage.jsx
4. AdminProductsPage.jsx
5. AdminCategoriesPage.jsx
6. AdminBrandsPage.jsx
7. AdminAttributesPage.jsx
8. AdminProductApprovalsPage.jsx
9. AdminOrdersPage.jsx
10. AdminOrderDetailPage.jsx
11. AdminUsersPage.jsx
12. AdminSellersPage.jsx
13. AdminManagersPage.jsx
14. AdminCustomersPage.jsx
15. AdminPaymentsPage.jsx
16. AdminPayoutsPage.jsx
17. AdminRefundsPage.jsx
18. AdminRolesPage.jsx
19. AdminCommissionsPage.jsx
20. AdminTaxesPage.jsx
21. AdminSettingsPage.jsx
22. AdminLogsPage.jsx
23. AdminReportsPage.jsx

### Seller Pages (20):
1. SellerDashboardPage.jsx
2. SellerAnalyticsPage.jsx
3. SellerProductsPage.jsx
4. SellerAddProductPage.jsx
5. SellerEditProductPage.jsx
6. SellerInventoryPage.jsx
7. SellerOrdersPage.jsx
8. SellerShippingPage.jsx
9. SellerReturnsPage.jsx
10. SellerBulkUploadPage.jsx
11. SellerPerformancePage.jsx
12. SellerPayoutsPage.jsx
13. SellerCommissionsPage.jsx
14. SellerInvoicesPage.jsx
15. SellerMessagesPage.jsx
16. SellerReviewsPage.jsx
17. SellerDisputesPage.jsx
18. SellerProfilePage.jsx
19. SellerSettingsPage.jsx
20. SellerRegisterPage.jsx

**Total: 43 pages to update**

---

## 🚀 Implementation Order

### Phase 1: Setup (Priority)
1. Create API service file
2. Update environment variables
3. Test API connectivity

### Phase 2: Admin Pages
1. Dashboard & Analytics (3 pages)
2. Products & Categories (5 pages)
3. Orders (2 pages)
4. Users (4 pages)
5. Financial (3 pages)
6. System (6 pages)

### Phase 3: Seller Pages
1. Dashboard & Analytics (2 pages)
2. Products (6 pages)
3. Orders (3 pages)
4. Financial (3 pages)
5. Customer Service (3 pages)
6. Account (3 pages)

---

## ✅ Testing Checklist

For each updated page:
- [ ] Page loads without errors
- [ ] Loading state displays correctly
- [ ] Data fetches from API
- [ ] Error handling works
- [ ] Retry functionality works
- [ ] Create/Update/Delete actions work
- [ ] Toast notifications appear
- [ ] No console errors
- [ ] Responsive design maintained

---

## 📝 Environment Variables

Add to `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

**Ready to start updating all 43 pages!** 🚀
