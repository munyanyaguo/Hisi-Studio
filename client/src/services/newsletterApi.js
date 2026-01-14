/**
 * Newsletter API Service
 * Handles newsletter subscription API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Subscribe to newsletter
 * @param {string} email - Email address to subscribe
 */
export const subscribe = async (email) => {
    const response = await fetch(`${API_URL}/api/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
    }

    return data;
};

/**
 * Unsubscribe from newsletter
 * @param {string} email - Email address to unsubscribe
 */
export const unsubscribe = async (email) => {
    const response = await fetch(`${API_URL}/api/v1/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe');
    }

    return data;
};

export default {
    subscribe,
    unsubscribe,
};
