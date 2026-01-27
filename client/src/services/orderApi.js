/**
 * Order API Service
 * Handles all order-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = (token) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Create a new order from cart
 * @param {Object} orderData - Order details
 * @param {string} orderData.shipping_address_id - Shipping address ID
 * @param {string} orderData.billing_address_id - Billing address ID (optional)
 * @param {string} orderData.notes - Order notes (optional)
 */
export const createOrder = async (orderData, token) => {
    const response = await fetch(`${API_URL}/api/v1/orders`, {
        method: 'POST',
        headers: getHeaders(token),
        credentials: 'include',
        body: JSON.stringify(orderData),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
    }
    return data;
};

/**
 * Get user's orders
 * @param {Object} options - Filter options
 * @param {number} options.page - Page number
 * @param {number} options.perPage - Items per page
 * @param {string} options.status - Filter by status
 */
export const getOrders = async ({ page = 1, perPage = 10, status = null } = {}, token) => {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });

    if (status) params.append('status', status);

    const response = await fetch(`${API_URL}/api/v1/orders?${params}`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
    }
    return data;
};

/**
 * Get single order by ID
 * @param {string} orderId - Order ID
 */
export const getOrderById = async (orderId, token) => {
    const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Order not found');
    }
    return data;
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 */
export const cancelOrder = async (orderId, token) => {
    const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel order');
    }
    return data;
};

export default {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder,
};
