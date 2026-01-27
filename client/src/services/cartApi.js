/**
 * Cart API Service
 * Handles all cart-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = (token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Get current cart
 */
export const getCart = async (token = null) => {
    const response = await fetch(`${API_URL}/api/v1/cart`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cart');
    }
    return data;
};

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 */
export const addToCart = async (productId, quantity = 1, token = null) => {
    const response = await fetch(`${API_URL}/api/v1/cart/items`, {
        method: 'POST',
        headers: getHeaders(token),
        credentials: 'include',
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity,
        }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
    }
    return data;
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 */
export const updateCartItem = async (itemId, quantity, token = null) => {
    const response = await fetch(`${API_URL}/api/v1/cart/items/${itemId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        credentials: 'include',
        body: JSON.stringify({ quantity }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart item');
    }
    return data;
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 */
export const removeFromCart = async (itemId, token = null) => {
    const response = await fetch(`${API_URL}/api/v1/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item from cart');
    }
    return data;
};

/**
 * Clear entire cart
 */
export const clearCart = async (token = null) => {
    const response = await fetch(`${API_URL}/api/v1/cart`, {
        method: 'DELETE',
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to clear cart');
    }
    return data;
};

/**
 * Validate cart stock before checkout
 */
export const validateCart = async (token = null) => {
    const response = await fetch(`${API_URL}/api/v1/cart/validate`, {
        method: 'POST',
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        return { valid: false, errors: data.errors || [data.message] };
    }
    return { valid: true, data: data.data };
};

/**
 * Merge guest cart to user cart after login
 */
export const mergeGuestCart = async (token) => {
    const response = await fetch(`${API_URL}/api/v1/cart/merge`, {
        method: 'POST',
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to merge carts');
    }
    return data;
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    validateCart,
    mergeGuestCart,
};
