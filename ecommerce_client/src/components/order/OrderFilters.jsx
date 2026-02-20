import PropTypes from 'prop-types'

/**
 * OrderFilters Component
 * 
 * Provides filtering and search functionality for orders.
 * Supports status filtering and search by order number/product name.
 * 
 * Requirements: 9.3, 9.4
 */
const OrderFilters = ({ 
  currentFilter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange,
  orderCounts = {}
}) => {
  const filterOptions = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'refunded', label: 'Refunded' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* Search Bar - Requirement 9.4 */}
      <div className="p-4 border-b">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by order number or product name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs - Requirement 9.3 */}
      <div className="flex border-b overflow-x-auto">
        {filterOptions.map((option) => {
          const count = orderCounts[option.key] || 0
          const isActive = currentFilter === option.key

          return (
            <button
              key={option.key}
              onClick={() => onFilterChange(option.key)}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? 'border-b-2 border-[#FF9900] text-[#FF9900]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{option.label}</span>
              {count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isActive
                    ? 'bg-[#FF9900] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

OrderFilters.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  orderCounts: PropTypes.object
}

export default OrderFilters
