import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook for fetching paginated lists with filtering and sorting.
 * Eliminates duplicated fetch logic across admin pages.
 *
 * @param {string} endpoint - API endpoint (e.g., '/api/v1/products')
 * @param {Object} options - Configuration options
 * @param {Object} options.defaultFilters - Initial filter values
 * @param {number} options.defaultLimit - Items per page (default: 10)
 * @param {boolean} options.requiresAuth - Whether to include auth token (default: true)
 * @param {string} options.dataKey - Key to extract items from response (default: 'data')
 * @param {Function} options.transformResponse - Optional function to transform response data
 *
 * @returns {Object} { items, loading, error, pagination, filters, setFilters, refetch, setPage }
 */
export function useFetchList(endpoint, options = {}) {
    const {
        defaultFilters = {},
        defaultLimit = 10,
        requiresAuth = true,
        dataKey = 'data',
        transformResponse = null,
    } = options;

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(defaultFilters);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: defaultLimit,
        total: 0,
        pages: 0,
    });

    // Track if component is mounted to prevent state updates after unmount
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params from filters and pagination
            const params = new URLSearchParams({
                page: pagination.page,
                per_page: pagination.limit,
            });

            // Add non-empty filters to params
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== 'all' && value !== null && value !== undefined) {
                    params.append(key, value);
                }
            });

            const headers = {};
            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`${API_URL}${endpoint}?${params}`, { headers });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (!isMounted.current) return;

            // Extract items from response using dataKey path
            let extractedItems = responseData;
            if (dataKey) {
                const keys = dataKey.split('.');
                for (const key of keys) {
                    extractedItems = extractedItems?.[key];
                }
            }

            // Apply transform if provided
            const finalItems = transformResponse
                ? transformResponse(extractedItems, responseData)
                : extractedItems;

            setItems(Array.isArray(finalItems) ? finalItems : []);

            // Extract pagination info (handle various response formats)
            const paginationData = responseData.pagination || responseData.meta || {};
            setPagination(prev => ({
                ...prev,
                total: paginationData.total_items || paginationData.total || responseData.total || 0,
                pages: paginationData.total_pages || paginationData.pages || Math.ceil((paginationData.total || 0) / prev.limit),
            }));

        } catch (err) {
            if (isMounted.current) {
                setError(err.message);
                console.error(`Error fetching ${endpoint}:`, err);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [endpoint, filters, pagination.page, pagination.limit, requiresAuth, dataKey, transformResponse]);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const setPage = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    const setLimit = useCallback((newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    }, []);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
    }, []);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        items,
        loading,
        error,
        pagination,
        filters,
        setFilters: updateFilters,
        setPage,
        setLimit,
        refetch,
    };
}

export default useFetchList;
