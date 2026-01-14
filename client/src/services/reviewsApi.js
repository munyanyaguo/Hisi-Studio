/**
 * Reviews API service
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get approved reviews (public)
 */
export const getReviews = async ({ page = 1, perPage = 10, productId = null, featured = false } = {}) => {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });

    if (productId) params.append('product_id', productId);
    if (featured) params.append('featured', 'true');

    const response = await fetch(`${API_URL}/api/v1/reviews?${params}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
    }

    return data;
};

/**
 * Get review statistics
 */
export const getReviewStats = async (productId = null) => {
    const params = productId ? `?product_id=${productId}` : '';
    const response = await fetch(`${API_URL}/api/v1/reviews/stats${params}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch review stats');
    }

    return data.data;
};

/**
 * Submit a new review (requires authentication)
 */
export const submitReview = async ({ rating, title, content, productId = null }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/v1/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            rating,
            title,
            content,
            product_id: productId,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
    }

    return data;
};

/**
 * Get all reviews for admin
 */
export const adminGetReviews = async ({ page = 1, perPage = 20, status = 'all' } = {}) => {
    const token = localStorage.getItem('token');

    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        status,
    });

    const response = await fetch(`${API_URL}/api/v1/admin/reviews?${params}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
    }

    return data;
};

/**
 * Update/moderate a review (admin)
 */
export const adminUpdateReview = async (reviewId, updates) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/api/v1/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to update review');
    }

    return data;
};

/**
 * Delete a review (admin)
 */
export const adminDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/api/v1/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review');
    }

    return data;
};
