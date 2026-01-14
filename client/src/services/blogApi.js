/**
 * Blog API Service
 * Handles all blog-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get blog posts with pagination and optional filters
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.perPage - Items per page (default: 10)
 * @param {string} options.category - Filter by category
 * @param {string} options.search - Search query
 */
export const getBlogPosts = async (options = {}) => {
    const { page = 1, perPage = 10, category, search } = options;

    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });

    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`${API_URL}/api/v1/blog?${params}`);

    if (!response.ok) {
        // Return empty structure on error
        return { data: { posts: [], total: 0, page: 1, per_page: perPage } };
    }

    const data = await response.json();

    // Transform to consistent structure
    return {
        data: {
            posts: data.data || data.items || [],
            total: data.pagination?.total || data.total || 0,
            page: data.pagination?.page || page,
            per_page: data.pagination?.per_page || perPage,
            total_pages: data.pagination?.pages || Math.ceil((data.pagination?.total || 0) / perPage)
        }
    };
};

/**
 * Get a single blog post by slug
 * @param {string} slug - Blog post slug
 */
export const getBlogPostBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/api/v1/blog/${slug}`);

    if (!response.ok) {
        throw new Error('Blog post not found');
    }

    return await response.json();
};

/**
 * Get featured blog posts
 * @param {number} limit - Number of posts to fetch (default: 3)
 */
export const getFeaturedBlogPosts = async (limit = 3) => {
    // Use standard blog endpoint with smaller limit
    const response = await fetch(`${API_URL}/api/v1/blog?per_page=${limit}`);

    if (!response.ok) {
        return { data: { posts: [] } };
    }

    const data = await response.json();

    return {
        data: {
            posts: (data.data || data.items || []).slice(0, limit)
        }
    };
};

/**
 * Get blog categories
 * Returns hardcoded categories as fallback if endpoint unavailable
 */
export const getBlogCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/api/v1/blog/categories`);
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        // Fall through to default
    }

    // Return default categories if endpoint not available
    return {
        data: [
            { id: 1, slug: 'adaptive-fashion', name: 'Adaptive Fashion' },
            { id: 2, slug: 'sustainability', name: 'Sustainability' },
            { id: 3, slug: 'community', name: 'Community' },
            { id: 4, slug: 'behind-the-scenes', name: 'Behind the Scenes' },
        ]
    };
};

/**
 * Search blog posts
 * @param {string} query - Search query
 */
export const searchBlogPosts = async (query) => {
    if (!query || query.trim().length < 2) {
        return { data: { posts: [] } };
    }

    return getBlogPosts({ search: query });
};

export default {
    getBlogPosts,
    getBlogPostBySlug,
    getFeaturedBlogPosts,
    getBlogCategories,
    searchBlogPosts,
};
