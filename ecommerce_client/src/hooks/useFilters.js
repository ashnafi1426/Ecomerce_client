/**
 * useFilters Hook
 * Manages filter state for search (price, rating, category, brands)
 */

import { useState, useCallback } from 'react';

/**
 * @returns {Object} Filter state and methods
 */
export function useFilters() {
  const [filters, setFilters] = useState({
    category: null,
    minPrice: null,
    maxPrice: null,
    minRating: null,
    brands: []
  });

  /**
   * Update a single filter
   * @param {string} filterName - Name of the filter
   * @param {any} value - New value
   */
  const updateFilter = useCallback((filterName, value) => {
    console.log('🎯 useFilters: Updating filter:', filterName, '=', value); // Debug log
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterName]: value
      };
      console.log('🎯 useFilters: New filters state:', newFilters); // Debug log
      return newFilters;
    });
  }, []);

  /**
   * Update multiple filters at once
   * @param {Object} newFilters - Object with filter updates
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      category: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      brands: []
    });
  }, []);

  /**
   * Clear a specific filter
   * @param {string} filterName - Name of the filter to clear
   */
  const clearFilter = useCallback((filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: filterName === 'brands' ? [] : null
    }));
  }, []);

  /**
   * Toggle a brand in the brands array
   * @param {string} brandId - Brand UUID to toggle
   */
  const toggleBrand = useCallback((brandId) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId]
    }));
  }, []);

  /**
   * Check if any filters are active
   * @returns {boolean}
   */
  const hasActiveFilters = useCallback(() => {
    return (
      filters.category !== null ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.minRating !== null ||
      filters.brands.length > 0
    );
  }, [filters]);

  /**
   * Get count of active filters
   * @returns {number}
   */
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.brands.length > 0) count++;
    return count;
  }, [filters]);

  /**
   * Build query parameters object for API
   * @returns {Object}
   * 
   * CRITICAL: This function depends on individual filter properties, not the filters object
   * This ensures it recreates whenever ANY filter property changes
   */
  const getQueryParams = useCallback(() => {
    const params = {};
    
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.brands.length > 0) params.brands = filters.brands.join(',');
    
    console.log('📄 useFilters: getQueryParams called, returning:', params); // Debug log
    
    return params;
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.brands]);

  /**
   * Set filters from URL query parameters
   * @param {URLSearchParams} searchParams - URL search parameters
   */
  const setFiltersFromURL = useCallback((searchParams) => {
    const newFilters = {
      category: searchParams.get('category') || null,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : null,
      brands: searchParams.get('brands') ? searchParams.get('brands').split(',') : []
    };
    setFilters(newFilters);
  }, []);

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    toggleBrand,
    hasActiveFilters: hasActiveFilters(),
    activeFilterCount: getActiveFilterCount(),
    getQueryParams,
    setFiltersFromURL
  };
}

export default useFilters;
