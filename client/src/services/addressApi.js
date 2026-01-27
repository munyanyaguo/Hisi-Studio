/**
 * Address API Service
 * Handles all address-related API calls
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
 * Get all user addresses
 */
export const getAddresses = async (token) => {
    const response = await fetch(`${API_URL}/api/v1/addresses`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch addresses');
    }
    return data;
};

/**
 * Get single address by ID
 * @param {string} addressId - Address ID
 */
export const getAddressById = async (addressId, token) => {
    const response = await fetch(`${API_URL}/api/v1/addresses/${addressId}`, {
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Address not found');
    }
    return data;
};

/**
 * Create a new address
 * @param {Object} addressData - Address details
 */
export const createAddress = async (addressData, token) => {
    const response = await fetch(`${API_URL}/api/v1/addresses`, {
        method: 'POST',
        headers: getHeaders(token),
        credentials: 'include',
        body: JSON.stringify(addressData),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create address');
    }
    return data;
};

/**
 * Update an address
 * @param {string} addressId - Address ID
 * @param {Object} addressData - Updated address details
 */
export const updateAddress = async (addressId, addressData, token) => {
    const response = await fetch(`${API_URL}/api/v1/addresses/${addressId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        credentials: 'include',
        body: JSON.stringify(addressData),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update address');
    }
    return data;
};

/**
 * Delete an address
 * @param {string} addressId - Address ID
 */
export const deleteAddress = async (addressId, token) => {
    const response = await fetch(`${API_URL}/api/v1/addresses/${addressId}`, {
        method: 'DELETE',
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete address');
    }
    return data;
};

/**
 * Set address as default
 * @param {string} addressId - Address ID
 */
export const setDefaultAddress = async (addressId, token) => {
    const response = await fetch(`${API_URL}/api/v1/addresses/${addressId}/set-default`, {
        method: 'PUT',
        headers: getHeaders(token),
        credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to set default address');
    }
    return data;
};

export default {
    getAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
};
