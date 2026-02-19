/**
 * useSearch Hook - FIXED VERSION
 * Main search hook that integrates debounce, filters, and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { useFilters } from './useFilters';
import apiService from '../services/api.service';

/**
 * @param {Object} options - Configuration options
 * @returns {Object} Search state and methods
 */
export function useSearch(options = {}) {
  const {
    initialQuery = '',
    initialSortBy = 'relevance',
    initialLimit = 20,
    autoSearch = true
  } = options;

  // Search query state
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  // Filters hook
  const filtersHook = useFilters();
  const { filters, getQueryParams } = filtersHook;

  // Sort and pagination state
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  // Results state
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false
  });

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Perform search API call
   * Dependencies: debouncedQuery, getQueryParams, sortBy, page, limit
   * When getQueryParams changes (because filters changed), this recreates
   */
  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const filterParams = getQueryParams();
      const params = {
        q: debouncedQuery,
        ...filterParams,
        sortBy,
        page,
        limit
      };

      console.log('🔍 useSearch: Search params:', params); // Debug log

      // Make API call
      const response = await apiService.get('/search', { params });

      console.log('✅ useSearch: Search response:', response); // Debug log

      // Handle flattened response structure (axios interceptor returns data directly)
      if (response.success) {
        setProducts(response.products || []);
        setPagination(response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasMore: false
        });
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (err) {
      console.error('❌ useSearch: Search error:', err);
      setError(err.message || 'Failed to search products');
      setProducts([]);
      setPagination({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, getQueryParams, sortBy, page, limit]);

  /**
   * Trigger search when performSearch changes
   * performSearch changes when: debouncedQuery, getQueryParams, sortBy, page, or limit changes
   * getQueryParams changes when: filters change
   * So this effectively triggers when any of those change
   */
  useEffect(() => {
    if (autoSearch) {
      console.log('🔄 useSearch: Triggering search due to dependency change');
      performSearch();
    }
  }, [autoSearch, performSearch]);

  /**
   * Update search query
   */
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page on new search
  }, []);

  /**
   * Update sort option
   */
  const updateSort = useCallback((newSort) => {
    setSortBy(newSort);
    setPage(1); // Reset to first page on sort change
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((pageNumber) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (pagination.hasMore) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.hasMore]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  /**
   * Reset search (clear query, filters, reset page)
   */
  const resetSearch = useCallback(() => {
    setQuery('');
    filtersHook.clearFilters();
    setSortBy('relevance');
    setPage(1);
  }, [filtersHook]);

  /**
   * Manually trigger search (for non-auto mode)
   */
  const search = useCallback(() => {
    performSearch();
  }, [performSearch]);

  return {
    // Query state
    query,
    updateQuery,
    debouncedQuery,

    // Filters (from useFilters hook)
    ...filtersHook,

    // Sort state
    sortBy,
    updateSort,

    // Pagination state
    page,
    limit,
    pagination,
    goToPage,
    nextPage,
    previousPage,

    // Results
    products,
    loading,
    error,

    // Actions
    search,
    resetSearch,

    // Computed values
    hasResults: products.length > 0,
    isEmpty: !loading && products.length === 0,
    isSearching: loading
  };
}

export default useSearch;
