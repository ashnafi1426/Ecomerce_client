# 🔄 Mock Data Removal - Complete Plan

## ✅ Completed Setup

1. **API Service Created** (`src/services/api.service.js`)
   - Axios instance with interceptors
   - Global error handling
   - Auth token management
   - Admin API methods
   - Seller API methods
   - Upload/Download support

---

## 📋 Pages Requiring Updates: 43 Total

### Admin Pages (23)

#### 1. AdminDashboardPage.jsx
**Changes:**
- Remove: `mockStats`, `mockRecentOrders`, `mockRecentUsers`
- Add: `adminAPI.getDashboardStats()`
- Add: Error state and retry button

#### 2. AdminRevenuePage.jsx
**Changes:**
- Remove: `mockRevenueData`, `mockTopCategories`
- Add: `adminAPI.getRevenueAnalytics()`
- Add: Date range filter API calls

#### 3. AdminAnalyticsPage.jsx
**Changes:**
- Remove: All mock chart data
- Add: `adminAPI.getOrderAnalytics()`
- Add: Real-time data refresh

#### 4. AdminProductsPage.jsx
**Changes:**
- Remove: `mockProducts`
- Add: `adminAPI.getProducts({ page, limit, search, filter })`
- Add: `adminAPI.deleteProduct(id)`
- Add: Pagination support

#### 5. AdminCategoriesPage.jsx
**Changes:**
- Remove: `mockCategories`
- Add: `adminAPI.getCategories()`
- Add: `adminAPI.createCategory(data)`
- Add: `adminAPI.updateCategory(id, data)`
- Add: `adminAPI.deleteCategory(id)`

#### 6. AdminBrandsPage.jsx
**Changes:**
- Remove: `mockBrands`
- Add: `adminAPI.getBrands()`
- Add: `adminAPI.createBrand(data)`

#### 7. AdminAttributesPage.jsx
**Changes:**
- Remove: `mockAttributes`
- Add: `adminAPI.getAttributes()`
- Add: CRUD operations

#### 8. AdminProductApprovalsPage.jsx
**Changes:**
- Remove: `mockPendingProducts`
- Add: `adminAPI.getPendingApprovals()`
- Add: `adminAPI.approveProduct(id)`
- Add: `adminAPI.rejectProduct(id, reason)`

#### 9. AdminOrdersPage.jsx
**Changes:**
- Remove: `mockOrders`
- Add: `adminAPI.getOrders({ status, search, dateRange })`
- Add: Real-time order updates

#### 10. AdminOrderDetailPage.jsx
**Changes:**
- Remove: `mockOrderDetail`
- Add: `adminAPI.getOrder(id)`
- Add: `adminAPI.updateOrderStatus(id, status)`

#### 11. AdminUsersPage.jsx
**Changes:**
- Remove: `mockUsers`
- Add: `adminAPI.getUsers({ role, status, search })`
- Add: User management actions

#### 12. AdminSellersPage.jsx
**Changes:**
- Remove: `mockSellers`
- Add: `adminAPI.getSellers({ status, search })`

#### 13. AdminManagersPage.jsx
**Changes:**
- Remove: `mockManagers`
- Add: `adminAPI.getManagers()`

#### 14. AdminCustomersPage.jsx
**Changes:**
- Remove: `mockCustomers`
- Add: `adminAPI.getCustomers({ search, status })`

#### 15. AdminPaymentsPage.jsx
**Changes:**
- Remove: `mockPayments`
- Add: `adminAPI.getPayments({ dateRange, status })`

#### 16. AdminPayoutsPage.jsx
**Changes:**
- Remove: `mockPayouts`
- Add: `adminAPI.getPayouts()`
- Add: `adminAPI.processPayout(data)`

#### 17. AdminRefundsPage.jsx
**Changes:**
- Remove: `mockRefunds`
- Add: `adminAPI.getRefunds({ status })`
- Add: `adminAPI.approveRefund(id)`

#### 18. AdminRolesPage.jsx
**Changes:**
- Remove: `mockRoles`
- Add: `adminAPI.getRoles()`
- Add: `adminAPI.createRole(data)`

#### 19. AdminCommissionsPage.jsx
**Changes:**
- Remove: `mockCommissions`
- Add: `adminAPI.getCommissions()`
- Add: `adminAPI.updateCommissions(data)`

#### 20. AdminTaxesPage.jsx
**Changes:**
- Remove: `mockTaxes`
- Add: `adminAPI.getTaxes()`

#### 21. AdminSettingsPage.jsx
**Changes:**
- Remove: `mockSettings`
- Add: `adminAPI.getSettings()`
- Add: `adminAPI.updateSettings(data)`

#### 22. AdminLogsPage.jsx
**Changes:**
- Remove: `mockLogs`
- Add: `adminAPI.getLogs({ page, limit, type })`

#### 23. AdminReportsPage.jsx
**Changes:**
- Remove: `mockReports`
- Add: `adminAPI.generateReport(type, params)`

---

### Seller Pages (20)

#### 1. SellerDashboardPage.jsx
**Changes:**
- Remove: `mockStats`, `mockRecentOrders`, `mockProducts`
- Add: `sellerAPI.getDashboardStats()`
- Add: Error handling and retry

#### 2. SellerAnalyticsPage.jsx
**Changes:**
- Remove: `mockRevenueData`, `mockSalesData`
- Add: `sellerAPI.getRevenueAnalytics()`
- Add: `sellerAPI.getSalesAnalytics()`

#### 3. SellerProductsPage.jsx
**Changes:**
- Remove: `mockProducts`
- Add: `sellerAPI.getProducts({ page, search, status })`
- Add: `sellerAPI.deleteProduct(id)`

#### 4. SellerAddProductPage.jsx
**Changes:**
- Remove: Mock form submission
- Add: `sellerAPI.createProduct(formData)`
- Add: Image upload with `sellerAPI.upload()`

#### 5. SellerEditProductPage.jsx
**Changes:**
- Remove: `mockProduct`
- Add: `sellerAPI.getProduct(id)`
- Add: `sellerAPI.updateProduct(id, data)`

#### 6. SellerInventoryPage.jsx
**Changes:**
- Remove: `mockInventory`
- Add: `sellerAPI.getInventory()`
- Add: `sellerAPI.updateStock(id, quantity)`

#### 7. SellerOrdersPage.jsx
**Changes:**
- Remove: `mockOrders`
- Add: `sellerAPI.getOrders({ status, search })`

#### 8. SellerShippingPage.jsx
**Changes:**
- Remove: `mockShipments`
- Add: `sellerAPI.getShippingQueue()`
- Add: `sellerAPI.generateLabel(orderId)`
- Add: `sellerAPI.markAsShipped(id, data)`

#### 9. SellerReturnsPage.jsx
**Changes:**
- Remove: `mockReturns`
- Add: `sellerAPI.getReturns({ status })`
- Add: `sellerAPI.approveReturn(id)`
- Add: `sellerAPI.rejectReturn(id, reason)`

#### 10. SellerBulkUploadPage.jsx
**Changes:**
- Remove: `mockUploadHistory`
- Add: `sellerAPI.bulkUpload(formData, onProgress)`
- Add: Upload progress tracking

#### 11. SellerPerformancePage.jsx
**Changes:**
- Remove: `mockMetrics`, `mockHistory`
- Add: `sellerAPI.getPerformanceMetrics()`

#### 12. SellerPayoutsPage.jsx
**Changes:**
- Remove: `mockPayouts`, `mockBalance`
- Add: `sellerAPI.getBalance()`
- Add: `sellerAPI.getPayouts()`
- Add: `sellerAPI.requestWithdrawal(amount)`

#### 13. SellerCommissionsPage.jsx
**Changes:**
- Remove: `mockTiers`, `mockHistory`
- Add: `sellerAPI.getCommissions()`

#### 14. SellerInvoicesPage.jsx
**Changes:**
- Remove: `mockInvoices`
- Add: `sellerAPI.getInvoices()`
- Add: `sellerAPI.downloadInvoice(id)`

#### 15. SellerMessagesPage.jsx
**Changes:**
- Remove: `mockMessages`
- Add: `sellerAPI.getMessages()`
- Add: `sellerAPI.replyToMessage(id, message)`

#### 16. SellerReviewsPage.jsx
**Changes:**
- Remove: `mockReviews`, `mockStats`
- Add: `sellerAPI.getReviews()`
- Add: `sellerAPI.replyToReview(id, reply)`

#### 17. SellerDisputesPage.jsx
**Changes:**
- Remove: `mockActiveDisputes`, `mockResolvedDisputes`
- Add: `sellerAPI.getDisputes({ status })`
- Add: `sellerAPI.respondToDispute(id, response)`

#### 18. SellerProfilePage.jsx
**Changes:**
- Remove: Hardcoded profile data
- Add: `sellerAPI.getProfile()`
- Add: `sellerAPI.updateProfile(data)`

#### 19. SellerSettingsPage.jsx
**Changes:**
- Remove: Hardcoded settings
- Add: `sellerAPI.getSettings()`
- Add: `sellerAPI.updateSettings(data)`

#### 20. SellerRegisterPage.jsx
**Changes:**
- Remove: Mock registration
- Add: Real registration API call
- Add: Document upload support

---

## 🔧 Standard Update Pattern

### For Every Page:

```javascript
// 1. Import API service
import { adminAPI } from '../../services/api.service'; // or sellerAPI

// 2. Update state initialization
const [data, setData] = useState([]); // Empty array, not mock data
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// 3. Create fetch function
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await adminAPI.getData(); // Use appropriate API method
    setData(response.data || response);
  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// 4. Add error UI
if (error) {
  return (
    <div style={styles.errorContainer}>
      <span style={{ fontSize: '3em' }}>⚠️</span>
      <h2>Failed to load data</h2>
      <p>{error}</p>
      <button onClick={fetchData} style={styles.retryButton}>
        Retry
      </button>
    </div>
  );
}

// 5. Update action handlers
const handleCreate = async (data) => {
  try {
    await adminAPI.createItem(data);
    toast.success('Created successfully');
    fetchData(); // Refresh list
  } catch (err) {
    // Error already handled by interceptor
  }
};

const handleUpdate = async (id, data) => {
  try {
    await adminAPI.updateItem(id, data);
    toast.success('Updated successfully');
    fetchData();
  } catch (err) {
    // Error already handled
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure?')) return;
  try {
    await adminAPI.deleteItem(id);
    toast.success('Deleted successfully');
    fetchData();
  } catch (err) {
    // Error already handled
  }
};
```

---

## 📊 Progress Tracking

### Admin Pages: 0/23 Updated
- [ ] AdminDashboardPage.jsx
- [ ] AdminRevenuePage.jsx
- [ ] AdminAnalyticsPage.jsx
- [ ] AdminProductsPage.jsx
- [ ] AdminCategoriesPage.jsx
- [ ] AdminBrandsPage.jsx
- [ ] AdminAttributesPage.jsx
- [ ] AdminProductApprovalsPage.jsx
- [ ] AdminOrdersPage.jsx
- [ ] AdminOrderDetailPage.jsx
- [ ] AdminUsersPage.jsx
- [ ] AdminSellersPage.jsx
- [ ] AdminManagersPage.jsx
- [ ] AdminCustomersPage.jsx
- [ ] AdminPaymentsPage.jsx
- [ ] AdminPayoutsPage.jsx
- [ ] AdminRefundsPage.jsx
- [ ] AdminRolesPage.jsx
- [ ] AdminCommissionsPage.jsx
- [ ] AdminTaxesPage.jsx
- [ ] AdminSettingsPage.jsx
- [ ] AdminLogsPage.jsx
- [ ] AdminReportsPage.jsx

### Seller Pages: 0/20 Updated
- [ ] SellerDashboardPage.jsx
- [ ] SellerAnalyticsPage.jsx
- [ ] SellerProductsPage.jsx
- [ ] SellerAddProductPage.jsx
- [ ] SellerEditProductPage.jsx
- [ ] SellerInventoryPage.jsx
- [ ] SellerOrdersPage.jsx
- [ ] SellerShippingPage.jsx
- [ ] SellerReturnsPage.jsx
- [ ] SellerBulkUploadPage.jsx
- [ ] SellerPerformancePage.jsx
- [ ] SellerPayoutsPage.jsx
- [ ] SellerCommissionsPage.jsx
- [ ] SellerInvoicesPage.jsx
- [ ] SellerMessagesPage.jsx
- [ ] SellerReviewsPage.jsx
- [ ] SellerDisputesPage.jsx
- [ ] SellerProfilePage.jsx
- [ ] SellerSettingsPage.jsx
- [ ] SellerRegisterPage.jsx

---

## 🎯 Next Steps

### Option A: Batch Update (Recommended)
Update pages in batches of 5-10 at a time to manage the workload.

### Option B: Priority Update
Update most critical pages first:
1. Dashboard pages (Admin + Seller)
2. Product pages
3. Order pages
4. Financial pages
5. Settings pages

### Option C: Full Automation
Create a script to automatically update all pages with the standard pattern.

---

## ✅ Benefits After Completion

1. **Production Ready:** All pages connect to real backend
2. **No Mock Data:** Clean, professional code
3. **Error Handling:** Proper error states and retry logic
4. **Loading States:** Real loading indicators
5. **API Consistency:** Centralized API management
6. **Easy Maintenance:** Single source of truth for API calls
7. **Type Safety:** Can add TypeScript later
8. **Testing Ready:** Can mock API service for tests

---

## 🚀 Ready to Proceed?

**The API service is ready. All 43 pages are documented and ready for update.**

Would you like me to:
1. Start updating pages in batches?
2. Update specific high-priority pages first?
3. Create an automated migration script?

Just let me know and I'll proceed! 🎯
