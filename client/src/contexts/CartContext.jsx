import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, isAuthenticated } = useAuth();

    // Get session ID for guest users
    const getSessionId = () => {
        let sessionId = localStorage.getItem('cart_session_id');
        if (!sessionId) {
            sessionId = 'guest_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('cart_session_id', sessionId);
        }
        return sessionId;
    };

    // Build headers for API requests
    const getHeaders = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        // Include session ID for guest users
        const sessionId = getSessionId();
        headers['X-Session-ID'] = sessionId;
        return headers;
    }, [token]);

    // Fetch cart from API
    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/v1/cart`, {
                headers: getHeaders(),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setCart(data.data || { items: [], total: 0 });
            } else {
                setError(data.message || 'Failed to fetch cart');
                setCart({ items: [], total: 0 });
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to load cart');
            setCart({ items: [], total: 0 });
        } finally {
            setLoading(false);
        }
    }, [getHeaders]);

    // Fetch cart on mount and when auth changes
    useEffect(() => {
        fetchCart();
    }, [fetchCart, isAuthenticated]);

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        try {
            setError(null);

            const response = await fetch(`${API_URL}/api/v1/cart/items`, {
                method: 'POST',
                headers: getHeaders(),
                credentials: 'include',
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setCart(data.data || data);
                return { success: true, data: data.data };
            } else {
                setError(data.message || 'Failed to add item to cart');
                return { success: false, error: data.message };
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            const errorMsg = 'Failed to add item to cart';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Update cart item quantity
    const updateCartItem = async (itemId, quantity) => {
        try {
            setError(null);

            const response = await fetch(`${API_URL}/api/v1/cart/items/${itemId}`, {
                method: 'PUT',
                headers: getHeaders(),
                credentials: 'include',
                body: JSON.stringify({ quantity }),
            });

            const data = await response.json();

            if (response.ok) {
                setCart(data.data || data);
                return { success: true, data: data.data };
            } else {
                setError(data.message || 'Failed to update cart');
                return { success: false, error: data.message };
            }
        } catch (err) {
            console.error('Error updating cart:', err);
            const errorMsg = 'Failed to update cart';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            setError(null);

            const response = await fetch(`${API_URL}/api/v1/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: getHeaders(),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setCart(data.data || { items: [], total: 0 });
                return { success: true };
            } else {
                setError(data.message || 'Failed to remove item');
                return { success: false, error: data.message };
            }
        } catch (err) {
            console.error('Error removing from cart:', err);
            const errorMsg = 'Failed to remove item';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        try {
            setError(null);

            const response = await fetch(`${API_URL}/api/v1/cart`, {
                method: 'DELETE',
                headers: getHeaders(),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setCart({ items: [], total: 0 });
                return { success: true };
            } else {
                setError(data.message || 'Failed to clear cart');
                return { success: false, error: data.message };
            }
        } catch (err) {
            console.error('Error clearing cart:', err);
            const errorMsg = 'Failed to clear cart';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Validate cart before checkout
    const validateCart = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/cart/validate`, {
                method: 'POST',
                headers: getHeaders(),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                return { valid: true, data: data.data };
            } else {
                return { valid: false, errors: data.errors || [data.message] };
            }
        } catch (err) {
            console.error('Error validating cart:', err);
            return { valid: false, errors: ['Failed to validate cart'] };
        }
    };

    // Merge guest cart after login
    const mergeGuestCart = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/v1/cart/merge`, {
                method: 'POST',
                headers: getHeaders(),
                credentials: 'include',
            });

            if (response.ok) {
                // Clear guest session ID
                localStorage.removeItem('cart_session_id');
                // Refresh cart
                await fetchCart();
            }
        } catch (err) {
            console.error('Error merging carts:', err);
        }
    };

    // Calculate cart totals
    const cartItemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    const cartSubtotal = cart?.items?.reduce((sum, item) => {
        const price = item.price_at_addition || item.product?.price || 0;
        return sum + (price * (item.quantity || 0));
    }, 0) || 0;

    const value = {
        cart,
        loading,
        error,
        cartItemCount,
        cartSubtotal,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        validateCart,
        mergeGuestCart,
        refreshCart: fetchCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
