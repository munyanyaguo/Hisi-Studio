import { useState, useCallback, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook for API mutations (create, update, delete operations).
 * Provides loading state, error handling, and success callbacks.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.method - HTTP method (default: 'POST')
 * @param {boolean} options.requiresAuth - Whether to include auth token (default: true)
 * @param {Function} options.onSuccess - Callback on successful mutation
 * @param {Function} options.onError - Callback on error
 *
 * @returns {Object} { mutate, loading, error, reset }
 */
export function useApiMutation(options = {}) {
    const {
        method = 'POST',
        requiresAuth = true,
        onSuccess = null,
        onError = null,
    } = options;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const mutate = useCallback(async (endpoint, data = null) => {
        try {
            setLoading(true);
            setError(null);

            const headers = {
                'Content-Type': 'application/json',
            };

            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const config = {
                method,
                headers,
            };

            if (data && method !== 'GET' && method !== 'DELETE') {
                config.body = JSON.stringify(data);
            }

            const response = await fetch(`${API_URL}${endpoint}`, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json().catch(() => ({}));

            if (isMounted.current) {
                setLoading(false);
                if (onSuccess) {
                    onSuccess(responseData);
                }
            }

            return { success: true, data: responseData };

        } catch (err) {
            if (isMounted.current) {
                setLoading(false);
                setError(err.message);
                if (onError) {
                    onError(err);
                }
            }
            return { success: false, error: err.message };
        }
    }, [method, requiresAuth, onSuccess, onError]);

    const reset = useCallback(() => {
        setError(null);
        setLoading(false);
    }, []);

    return {
        mutate,
        loading,
        error,
        reset,
    };
}

/**
 * Convenience hook for DELETE operations
 */
export function useDelete(options = {}) {
    return useApiMutation({ ...options, method: 'DELETE' });
}

/**
 * Convenience hook for PUT/PATCH operations
 */
export function useUpdate(options = {}) {
    return useApiMutation({ ...options, method: 'PUT' });
}

export default useApiMutation;
