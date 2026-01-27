/**
 * Payment API Service
 * Handles all payment-related API calls with Flutterwave
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
 * Initialize payment for an order
 * @param {string} orderId - Order ID
 * @param {string} redirectUrl - URL to redirect after payment
 */
export const initializePayment = async (orderId, redirectUrl, token) => {
    const response = await fetch(`${API_URL}/api/v1/payments/initialize`, {
        method: 'POST',
        headers: getHeaders(token),
        credentials: 'include',
        body: JSON.stringify({
            order_id: orderId,
            redirect_url: redirectUrl,
        }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment');
    }
    return data;
};

/**
 * Verify payment status
 * @param {string} transactionId - Transaction reference ID
 */
export const verifyPayment = async (transactionId, token) => {
    const response = await fetch(`${API_URL}/api/v1/payments/verify/${transactionId}`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to verify payment');
    }
    return data;
};

/**
 * Get payment details by ID
 * @param {string} paymentId - Payment ID
 */
export const getPaymentById = async (paymentId, token) => {
    const response = await fetch(`${API_URL}/api/v1/payments/${paymentId}`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Payment not found');
    }
    return data;
};

/**
 * Get payment by order ID
 * @param {string} orderId - Order ID
 */
export const getPaymentByOrderId = async (orderId, token) => {
    const response = await fetch(`${API_URL}/api/v1/payments/order/${orderId}`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Payment not found');
    }
    return data;
};

/**
 * Cancel a pending payment
 * @param {string} paymentId - Payment ID
 * @param {string} reason - Cancellation reason
 */
export const cancelPayment = async (paymentId, reason = null, token) => {
    const response = await fetch(`${API_URL}/api/v1/payments/${paymentId}/cancel`, {
        method: 'PUT',
        headers: getHeaders(token),
        credentials: 'include',
        body: JSON.stringify({ reason }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel payment');
    }
    return data;
};

export default {
    initializePayment,
    verifyPayment,
    getPaymentById,
    getPaymentByOrderId,
    cancelPayment,
};
