import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api.service'
import { toast } from 'react-toastify'

const AdminReplacementsRefundsPage = () => {
  const [activeTab, setActiveTab] = useState('replacements')
  const [replacements, setReplacements] = useState([])
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    seller: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  })
  const [total, setTotal] = useState(0)
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [overrideAction, setOverrideAction] = useState('approve')
  const [overrideReason, setOverrideReason] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab, filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'replacements') {
        const response = await adminAPI.getAllReplacements(filters)
        const data = response.data || response
        setReplacements(data.replacements || data.data || [])
        setTotal(data.total || 0)
      } else {
        const response = await adminAPI.getAllRefunds(filters)
        const data = response.data || response
        setRefunds(data.refunds || data.data || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(`Failed to load ${activeTab}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleOverride = (request) => {
    setSelectedRequest(request)
    setShowOverrideModal(true)
    setOverrideReason('')
  }

  const submitOverride = async () => {
    if (!overrideReason.trim()) {
      toast.error('Please provide a reason for the override')
      return
    }

    try {
      const data = {
        action: overrideAction,
        reason: overrideReason
      }

      if (activeTab === 'replacements') {
        await adminAPI.overrideReplacementDecision(selectedRequest.id, data)
        toast.success(`Replacement request ${overrideAction}d successfully`)
      } else {
        await adminAPI.overrideRefundDecision(selectedRequest.id, data)
        toast.success(`Refund request ${overrideAction}d successfully`)
      }

      setShowOverrideModal(false)
      setSelectedRequest(null)
      fetchData()
    } catch (error) {
      console.error('Error overriding decision:', error)
      toast.error('Failed to override decision')
    }
  }

  const handleExport = async () => {
    try {
      let response
      if (activeTab === 'replacements') {
        response = await adminAPI.exportReplacementsCSV(filters)
      } else {
        response = await adminAPI.exportRefundsCSV(filters)
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Export completed successfully')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: '#FFF4E5', color: '#F08804' },
      approved: { bg: '#E6F4F1', color: '#067D62' },
      rejected: { bg: '#FFE5E5', color: '#C7511F' },
      completed: { bg: '#E6F4F1', color: '#067D62' },
      processing: { bg: '#E7F3FF', color: '#146EB4' }
    }
    const style = statusMap[status?.toLowerCase()] || statusMap.pending
    return (
      <span style={{
        display: 'inline-block',
        padding: '5px 14px',
        borderRadius: '20px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        background: style.bg,
        color: style.color
      }}>
        {status}
      </span>
    )
  }

  const data = activeTab === 'replacements' ? replacements : refunds

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        .tabs { display: flex; gap: 10px; marginBottom: 20px; borderBottom: 2px solid #D5D9D9; }
        .tab { padding: 12px 24px; cursor: pointer; border: none; background: none; fontSize: 1em; fontWeight: 500; color: #565959; transition: all 0.2s; }
        .tab.active { color: #FF9900; borderBottom: 3px solid #FF9900; marginBottom: -2px; }
        .tab:hover { color: #FF9900; }
        
        .filters { display: grid; gridTemplateColumns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; marginBottom: 20px; padding: 20px; background: #FFFFFF; borderRadius: 8px; border: 1px solid #D5D9D9; }
        .filter-group { display: flex; flexDirection: column; gap: 5px; }
        .filter-label { fontSize: 0.9em; fontWeight: 500; color: #565959; }
        .filter-input { padding: 8px 12px; border: 1px solid #D5D9D9; borderRadius: 4px; fontSize: 0.95em; }
        
        .actions { display: flex; justifyContent: space-between; alignItems: center; marginBottom: 20px; }
        .btn { padding: 10px 20px; border: none; borderRadius: 6px; cursor: pointer; fontWeight: bold; transition: all 0.2s; }
        .btn-primary { background: #FF9900; color: #FFFFFF; }
        .btn-primary:hover { background: #F08804; transform: translateY(-2px); }
        .btn-secondary { background: #FFFFFF; color: #0F1111; border: 1px solid #D5D9D9; }
        .btn-secondary:hover { background: #F7F8F8; }
        
        .table-container { background: #FFFFFF; borderRadius: 8px; border: 1px solid #D5D9D9; overflow: hidden; }
        table { width: 100%; borderCollapse: collapse; }
        th { background: #F7F8F8; padding: 14px 12px; textAlign: left; fontWeight: 600; borderBottom: 2px solid #D5D9D9; fontSize: 0.9em; textTransform: uppercase; color: #565959; }
        td { padding: 14px 12px; borderBottom: 1px solid #D5D9D9; }
        tr:hover { background: #F7F8F8; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; alignItems: center; justifyContent: center; zIndex: 1000; }
        .modal { background: #FFFFFF; padding: 30px; borderRadius: 12px; maxWidth: 500px; width: 90%; }
        .modal-title { fontSize: 1.5em; fontWeight: 600; marginBottom: 20px; }
        .modal-actions { display: flex; gap: 10px; marginTop: 20px; justifyContent: flex-end; }
      `}</style>

      <h1 style={{ fontSize: '2.2em', marginBottom: '10px' }}>Replacement & Refund Management</h1>
      <p style={{ color: '#565959', marginBottom: '30px' }}>View and manage all replacement and refund requests</p>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'replacements' ? 'active' : ''}`}
          onClick={() => setActiveTab('replacements')}
        >
          🔄 Replacements
        </button>
        <button 
          className={`tab ${activeTab === 'refunds' ? 'active' : ''}`}
          onClick={() => setActiveTab('refunds')}
        >
          💸 Refunds
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select 
            className="filter-input"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Seller</label>
          <input 
            type="text"
            className="filter-input"
            placeholder="Seller name or ID"
            value={filters.seller}
            onChange={(e) => handleFilterChange('seller', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Start Date</label>
          <input 
            type="date"
            className="filter-input"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">End Date</label>
          <input 
            type="date"
            className="filter-input"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <div style={{ fontSize: '0.95em', color: '#565959' }}>
          Showing {data.length} of {total} {activeTab}
        </div>
        <button className="btn btn-primary" onClick={handleExport}>
          📥 Export to CSV
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>⏳</div>
            <div style={{ fontSize: '1.1em', color: '#565959' }}>Loading {activeTab}...</div>
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>📋</div>
            <div style={{ fontSize: '1.1em', color: '#565959' }}>No {activeTab} found</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Seller</th>
                {activeTab === 'refunds' && <th>Amount</th>}
                <th>Reason</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontSize: '0.85em', fontFamily: 'monospace' }}>
                    {item.id.slice(0, 8)}...
                  </td>
                  <td>{item.customer_name || item.customer?.name || 'Unknown'}</td>
                  <td>{item.product_name || item.product?.name || 'Unknown Product'}</td>
                  <td>{item.seller_name || item.seller?.name || 'Unknown Seller'}</td>
                  {activeTab === 'refunds' && (
                    <td style={{ fontWeight: 'bold' }}>
                      ${parseFloat(item.refund_amount || 0).toFixed(2)}
                    </td>
                  )}
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.reason_description || item.description}
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.85em' }}
                      onClick={() => handleOverride(item)}
                    >
                      Override
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > filters.limit && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button 
            className="btn btn-secondary"
            disabled={filters.page === 1}
            onClick={() => handleFilterChange('page', filters.page - 1)}
          >
            Previous
          </button>
          <span style={{ padding: '10px 20px', color: '#565959' }}>
            Page {filters.page} of {Math.ceil(total / filters.limit)}
          </span>
          <button 
            className="btn btn-secondary"
            disabled={filters.page >= Math.ceil(total / filters.limit)}
            onClick={() => handleFilterChange('page', filters.page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="modal-overlay" onClick={() => setShowOverrideModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Override Decision</h2>
            <p style={{ marginBottom: '20px', color: '#565959' }}>
              Override the decision for this {activeTab.slice(0, -1)} request
            </p>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Action</label>
              <select 
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #D5D9D9', borderRadius: '4px' }}
                value={overrideAction}
                onChange={(e) => setOverrideAction(e.target.value)}
              >
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Reason</label>
              <textarea 
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #D5D9D9', borderRadius: '4px', minHeight: '100px', resize: 'vertical' }}
                placeholder="Provide a reason for this override..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowOverrideModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={submitOverride}
              >
                Submit Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReplacementsRefundsPage
