/**
 * CMS API Service
 * Handles all CMS-related API calls for pages, sections, and settings
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get a CMS page by slug
 * @param {string} slug - Page slug (e.g., 'about', 'accessibility')
 */
export const getPageBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/api/v1/pages/${slug}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Page not found');
    }

    return data;
};

/**
 * Get all section content for a page
 * @param {string} pageName - Page name (e.g., 'home', 'about', 'accessibility', 'press')
 */
export const getPageSections = async (pageName) => {
    const response = await fetch(`${API_URL}/api/v1/section-content/${pageName}`);

    if (!response.ok) {
        // Return empty object if endpoint fails - allows fallback
        return { data: {} };
    }

    return await response.json();
};

/**
 * Get section content by page and section name
 * @param {string} pageName - Page name (e.g., 'home')
 * @param {string} sectionName - Section name (e.g., 'hero', 'about')
 */
export const getSectionContent = async (pageName, sectionName) => {
    const response = await fetch(`${API_URL}/api/v1/section-content/${pageName}/${sectionName}`);

    if (!response.ok) {
        return { data: {} };
    }

    return await response.json();
};

/**
 * Get public site settings
 */
export const getSiteSettings = async () => {
    const response = await fetch(`${API_URL}/api/v1/settings`);

    if (!response.ok) {
        return { data: {} };
    }

    return await response.json();
};

/**
 * Get all published pages
 */
export const getPublishedPages = async () => {
    const response = await fetch(`${API_URL}/api/v1/pages`);

    if (!response.ok) {
        return { data: [] };
    }

    return await response.json();
};

/**
 * Get collections/categories for collections page
 */
export const getCollections = async () => {
    // Try dedicated collections endpoint first, fall back to categories
    try {
        const response = await fetch(`${API_URL}/api/v1/collections`);
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        // Fall back to categories
    }

    // Fall back to product categories
    const response = await fetch(`${API_URL}/api/v1/products/categories`);

    if (!response.ok) {
        return { data: [] };
    }

    return await response.json();
};

/**
 * Get about page content from section-content API
 */
export const getAboutContent = async () => {
    return getPageSections('about');
};

/**
 * Get accessibility page content from section-content API
 */
export const getAccessibilityContent = async () => {
    return getPageSections('accessibility');
};

/**
 * Get press page content from section-content API
 */
export const getPressContent = async () => {
    return getPageSections('press');
};

/**
 * Get home page content from section-content API
 */
export const getHomeContent = async () => {
    return getPageSections('home');
};

/**
 * Get contact page content from section-content API
 */
export const getContactContent = async () => {
    return getPageSections('contact');
};

/**
 * Get collections page content from section-content API
 */
export const getCollectionsContent = async () => {
    return getPageSections('collections');
};

export default {
    getPageBySlug,
    getSectionContent,
    getPageSections,
    getSiteSettings,
    getPublishedPages,
    getCollections,
    getAboutContent,
    getAccessibilityContent,
    getPressContent,
    getHomeContent,
    getContactContent,
    getCollectionsContent,
};
