import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useInfiniteScroll Hook
 * 
 * Implements infinite scroll pagination for loading data in chunks.
 * Loads 20 items at a time as specified in Requirement 9.7.
 * 
 * @param {Array} allItems - Complete array of items to paginate
 * @param {number} itemsPerPage - Number of items to load per page (default: 20)
 * @returns {Object} - { displayedItems, hasMore, loadMore, reset }
 */
const useInfiniteScroll = (allItems = [], itemsPerPage = 20) => {
  const [displayedItems, setDisplayedItems] = useState([])
  const [page, setPage] = useState(1)
  const observerTarget = useRef(null)
  
  // Use refs to store latest values without causing re-renders
  const allItemsRef = useRef(allItems)
  const itemsPerPageRef = useRef(itemsPerPage)
  
  // Update refs when props change
  useEffect(() => {
    allItemsRef.current = allItems
    itemsPerPageRef.current = itemsPerPage
  }, [allItems, itemsPerPage])

  // Calculate hasMore based on current state
  const hasMore = displayedItems.length < allItems.length

  // Reset when allItems changes (new data loaded)
  useEffect(() => {
    const initialItems = allItems.slice(0, itemsPerPage)
    setDisplayedItems(initialItems)
    setPage(1)
  }, [allItems, itemsPerPage])

  // Load more items - stable function that doesn't depend on allItems
  const loadMore = useCallback(() => {
    setPage(currentPage => {
      const startIndex = currentPage * itemsPerPageRef.current
      const endIndex = startIndex + itemsPerPageRef.current
      const newItems = allItemsRef.current.slice(startIndex, endIndex)

      if (newItems.length > 0) {
        setDisplayedItems(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(item => item.id))
          const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id))
          return [...prev, ...uniqueNewItems]
        })
        return currentPage + 1
      }
      return currentPage
    })
  }, []) // No dependencies - uses refs instead

  // Intersection Observer for automatic loading
  useEffect(() => {
    if (!hasMore) return // Don't observe if no more items

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loadMore]) // Only re-run when hasMore changes

  // Reset function
  const reset = useCallback(() => {
    const initialItems = allItemsRef.current.slice(0, itemsPerPageRef.current)
    setDisplayedItems(initialItems)
    setPage(1)
  }, [])

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset,
    observerTarget
  }
}

export default useInfiniteScroll
