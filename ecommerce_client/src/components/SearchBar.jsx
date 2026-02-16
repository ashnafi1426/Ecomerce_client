import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, placeholder = "Search FastShop..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🔍' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'home', name: 'Home & Kitchen', icon: '🏠' },
    { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'toys', name: 'Toys & Games', icon: '🧸' },
    { id: 'beauty', name: 'Beauty & Health', icon: '💄' }
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchParams = {
        query: searchQuery.trim(),
        category: selectedCategory.id !== 'all' ? selectedCategory.id : undefined
      };
      
      if (onSearch) {
        onSearch(searchParams);
      } else {
        // Navigate to search results page
        const params = new URLSearchParams();
        params.set('q', searchParams.query);
        if (searchParams.category) {
          params.set('category', searchParams.category);
        }
        navigate(`/search?${params.toString()}`);
      }
    }
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    const searchParams = { query, category: undefined };
    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const popularSearches = [
    'iPhone', 'Laptop', 'Headphones', 'Nike Shoes', 'Samsung TV',
    'Coffee Maker', 'Bluetooth Speaker', 'Gaming Chair'
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex bg-white rounded-lg shadow-lg border-2 border-gray-200 focus-within:border-orange-400 transition-colors">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-l-lg border-r border-gray-200 transition-colors min-w-[140px]"
            >
              <span className="text-lg">{selectedCategory.icon}</span>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {selectedCategory.name.split(' ')[0]}
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Category Dropdown Menu */}
            {isExpanded && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsExpanded(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                        selectedCategory.id === category.id ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 text-gray-700 bg-transparent focus:outline-none"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-r-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:block font-medium">Search</span>
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 font-medium">Popular:</span>
        {popularSearches.slice(0, 6).map((search, index) => (
          <button
            key={index}
            onClick={() => handleQuickSearch(search)}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {search}
          </button>
        ))}
      </div>

      {/* Click outside to close dropdown */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;