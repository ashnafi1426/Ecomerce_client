/**
 * SearchPage Component
 * Amazon-style complete search page with filters and results
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import SearchBar from '../../components/search/SearchBar';
import FilterSidebar from '../../components/search/FilterSidebar';
import ActiveFilters from '../../components/search/ActiveFilters';
import SortDropdown from '../../components/search/SortDropdown';
import ViewToggle from '../../components/search/ViewToggle';
import SearchResults from '../../components/search/SearchResults';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('grid');

  // Initialize search with URL params
  const search = useSearch({
    initialQuery: searchParams.get('q') || '',
    initialSortBy: searchParams.get('sort') || 'relevance',
    autoSearch: true
  });

  const {
    query,
    updateQuery,
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    sortBy,
    updateSort,
    products,
    loading,
    error,
    isEmpty,
    pagination,
    nextPage,
    previousPage,
    page
  } = search;

  // Update URL when search changes
  const handleQueryChange = (newQuery) => {
    updateQuery(newQuery);
    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleFilterChange = (filterName, value) => {
    console.log('📄 SearchPage: Filter change:', filterName, value); // Debug log
    console.log('📄 Current filters before update:', filters); // Debug log
    updateFilter(filterName, value);
  };

  const handleRemoveFilter = (filterName, value) => {
    if (filterName === 'brands' && value) {
      // Toggle specific brand
      updateFilter('brands', value);
    } else {
      updateFilter(filterName, null);
    }
  };

  const handleSortChange = (newSort) => {
    updateSort(newSort);
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  return (
    <div style={styles.page}>
      {/* Search Bar */}
      <div style={styles.searchBarContainer}>
        <SearchBar
          query={query}
          onQueryChange={handleQueryChange}
          placeholder="Search products..."
        />
      </div>

      {/* Main Content */}
      <div style={styles.container} className="search-page-container">
        {/* Sidebar */}
        <aside style={styles.sidebar} className="search-page-sidebar">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onFilterChanges={updateFilters}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* Results Section */}
        <main style={styles.main}>
          {/* Results Header */}
          <div style={styles.resultsHeader} className="search-page-results-header">
            <div style={styles.resultsInfo} className="search-page-results-info">
              {!loading && !isEmpty && (
                <span style={styles.resultsCount} className="search-page-results-count">
                  {pagination.total} results
                  {query && <span> for "{query}"</span>}
                </span>
              )}
            </div>

            <div style={styles.resultsControls} className="search-page-results-controls">
              <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={clearFilters}
            />
          )}

          {/* Results */}
          <SearchResults
            products={products}
            view={view}
            loading={loading}
            error={error}
            isEmpty={isEmpty}
          />

          {/* Pagination */}
          {!loading && !isEmpty && pagination.totalPages > 1 && (
            <div style={styles.pagination} className="search-page-pagination">
              <button
                onClick={previousPage}
                disabled={page === 1}
                className="search-page-pagination-button"
                style={{
                  ...styles.paginationButton,
                  ...(page === 1 ? styles.paginationButtonDisabled : {})
                }}
              >
                Previous
              </button>

              <span style={styles.paginationInfo} className="search-page-pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={!pagination.hasMore}
                className="search-page-pagination-button"
                style={{
                  ...styles.paginationButton,
                  ...(!pagination.hasMore ? styles.paginationButtonDisabled : {})
                }}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  searchBarContainer: {
    backgroundColor: '#232F3E',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    gap: '20px'
  },
  sidebar: {
    flexShrink: 0
  },
  main: {
    flex: 1,
    minWidth: 0
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  resultsInfo: {
    flex: 1
  },
  resultsCount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F1111'
  },
  resultsControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px',
    padding: '20px 0'
  },
  paginationButton: {
    padding: '10px 24px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F1111',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  paginationInfo: {
    fontSize: '14px',
    color: '#565959'
  }
};

// Inject responsive CSS styles (React doesn't support @media in inline styles)
if (typeof document !== 'undefined') {
  const styleId = 'search-page-responsive-styles';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = `
      @media (max-width: 768px) {
        .search-page-container {
          padding: 12px !important;
          gap: 12px !important;
          flex-direction: column !important;
        }
        
        .search-page-sidebar {
          width: 100% !important;
        }
        
        .search-page-results-header {
          flex-direction: column !important;
          align-items: stretch !important;
        }
        
        .search-page-results-info {
          text-align: center !important;
        }
        
        .search-page-results-count {
          font-size: 14px !important;
        }
        
        .search-page-results-controls {
          width: 100% !important;
          justify-content: space-between !important;
        }
        
        .search-page-pagination {
          gap: 8px !important;
          margin-top: 20px !important;
          padding: 16px 0 !important;
        }
        
        .search-page-pagination-button {
          padding: 8px 16px !important;
          font-size: 13px !important;
        }
        
        .search-page-pagination-info {
          font-size: 12px !important;
        }
        
        .filter-sidebar {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .search-results-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
          gap: 12px !important;
        }
        
        .product-card {
          padding: 12px !important;
        }
        
        .product-card img {
          height: 150px !important;
        }
      }
      
      @media (max-width: 480px) {
        .search-results-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }
    `;
    document.head.appendChild(styleElement);
  }
}

export default SearchPage;
