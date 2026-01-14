/**
 * Products API Service
 * Handles all product-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get all products with optional filters
 * @param {Object} options - Filter options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.perPage - Items per page (default: 12)
 * @param {string} options.category - Category slug filter
 * @param {boolean} options.featured - Filter featured products only
 * @param {string} options.search - Search query
 * @param {number} options.minPrice - Minimum price filter
 * @param {number} options.maxPrice - Maximum price filter
 * @param {string} options.sortBy - Sort by field (price, name, created_at)
 * @param {string} options.sortOrder - Sort order (asc, desc)
 */
export const getProducts = async ({
    page = 1,
    perPage = 12,
    category = null,
    featured = false,
    search = null,
    minPrice = null,
    maxPrice = null,
    sortBy = 'created_at',
    sortOrder = 'desc'
} = {}) => {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    if (search) params.append('search', search);
    if (minPrice !== null) params.append('min_price', minPrice.toString());
    if (maxPrice !== null) params.append('max_price', maxPrice.toString());

    const response = await fetch(`${API_URL}/api/v1/products?${params}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
    }

    return data;
};

/**
 * Get featured products
 * @param {number} limit - Number of products to return
 */
export const getFeaturedProducts = async (limit = 8) => {
    return getProducts({ featured: true, perPage: limit });
};

/**
 * Get product by ID
 * @param {string} productId - Product ID
 */
export const getProductById = async (productId) => {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Product not found');
    }

    return data;
};

/**
 * Get product by slug
 * @param {string} slug - Product slug
 */
export const getProductBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/api/v1/products/slug/${slug}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Product not found');
    }

    return data;
};

/**
 * Get all product categories
 */
export const getCategories = async () => {
    const response = await fetch(`${API_URL}/api/v1/products/categories`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
    }

    return data;
};

/**
 * Get products by category
 * @param {string} categorySlug - Category slug
 * @param {Object} options - Additional filter options
 */
export const getProductsByCategory = async (categorySlug, options = {}) => {
    return getProducts({ ...options, category: categorySlug });
};

/**
 * Search products
 * @param {string} query - Search query
 * @param {Object} options - Additional filter options
 */
export const searchProducts = async (query, options = {}) => {
    return getProducts({ ...options, search: query });
};

export default {
    getProducts,
    getFeaturedProducts,
    getProductById,
    getProductBySlug,
    getCategories,
    getProductsByCategory,
    searchProducts,
};
