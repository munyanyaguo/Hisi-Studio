/**
 * Contact API Service
 * Handles all contact-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Helper function for API requests
 */
const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
    }

    return response.json();
};

/**
 * Submit contact form
 */
export const submitContactForm = async (formData) => {
    return apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
    });
};

/**
 * Get contact page statistics
 */
export const getContactStats = async () => {
    return apiRequest('/contact/stats');
};

/**
 * Book a consultation
 */
export const bookConsultation = async (bookingData) => {
    return apiRequest('/consultations', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    });
};

/**
 * Get FAQs
 * @param {string} category - Optional category filter
 */
export const getFAQs = async (category = null) => {
    const url = category ? `/faqs?category=${category}` : '/faqs';
    return apiRequest(url);
};

/**
 * Get testimonials
 * @param {boolean} featuredOnly - Get only featured testimonials
 */
export const getTestimonials = async (featuredOnly = false) => {
    const url = featuredOnly ? '/testimonials?featured=true' : '/testimonials';
    return apiRequest(url);
};

/**
 * Get site settings
 */
export const getSiteSettings = async () => {
    return apiRequest('/settings');
};

/**
 * Get contact information (phone, WhatsApp, email, Instagram)
 */
export const getContactInfo = async () => {
    try {
        return await apiRequest('/contact/info');
    } catch (error) {
        console.error('Failed to fetch contact info:', error);
        // Return defaults if fetch fails
        return {
            data: {
                phone: { value: '+254 700 123 456', action: 'tel:+254700123456', availability: 'Mon-Fri, 9AM-6PM EAT' },
                whatsapp: { value: '+254 700 123 456', action: 'https://wa.me/254700123456', availability: 'Usually responds in minutes' },
                email: { value: 'hello@hisistudio.com', action: 'mailto:hello@hisistudio.com', availability: 'Response within 24 hours' },
                instagram: { value: '@hisi_studio', action: 'https://www.instagram.com/hisi_studio/', availability: 'Active daily' }
            }
        };
    }
};

/**
 * Get contact settings (phone, email, WhatsApp, Instagram, location)
 */
export const getContactSettings = async () => {
    try {
        const response = await apiRequest('/settings');
        const settings = response.data || response;

        // Extract contact-related settings
        return {
            phone: settings.contact_phone || '+254 700 123 456',
            email: settings.contact_email || 'hello@hisistudio.com',
            whatsapp: settings.contact_whatsapp || '+254700123456',
            instagram: settings.contact_instagram || '@hisi_studio',
            instagramUrl: settings.contact_instagram_url || 'https://www.instagram.com/hisi_studio/',
            showroomAddress: settings.showroom_address || {
                line1: 'Hisi Studio Showroom',
                line2: 'Westlands, Ring Road Parklands',
                city: 'Nairobi',
                country: 'Kenya'
            },
            showroomHours: settings.showroom_hours || {
                monday_friday: '9:00 AM - 6:00 PM',
                saturday: '10:00 AM - 4:00 PM',
                sunday: 'Closed'
            },
            showroomAccessibility: settings.showroom_accessibility || [
                'Wheelchair accessible entrance',
                'Accessible parking available',
                'Spacious fitting rooms',
                'Assistance available upon request'
            ],
            showroomMapUrl: settings.showroom_map_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819799384!2d36.80611731475394!3d-1.2833879359915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6d3b3b3b3%3A0x1234567890abcdef!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890123!5m2!1sen!2ske',
            showroomDirectionsUrl: settings.showroom_directions_url || 'https://www.google.com/maps/dir//Westlands,+Nairobi'
        };
    } catch (error) {
        console.error('Failed to fetch contact settings:', error);
        // Return defaults if fetch fails
        return {
            phone: '+254 700 123 456',
            email: 'hello@hisistudio.com',
            whatsapp: '+254700123456',
            instagram: '@hisi_studio',
            instagramUrl: 'https://www.instagram.com/hisi_studio/',
            showroomAddress: {
                line1: 'Hisi Studio Showroom',
                line2: 'Westlands, Ring Road Parklands',
                city: 'Nairobi',
                country: 'Kenya'
            },
            showroomHours: {
                monday_friday: '9:00 AM - 6:00 PM',
                saturday: '10:00 AM - 4:00 PM',
                sunday: 'Closed'
            },
            showroomAccessibility: [
                'Wheelchair accessible entrance',
                'Accessible parking available',
                'Spacious fitting rooms',
                'Assistance available upon request'
            ],
            showroomMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819799384!2d36.80611731475394!3d-1.2833879359915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6d3b3b3b3%3A0x1234567890abcdef!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890123!5m2!1sen!2ske',
            showroomDirectionsUrl: 'https://www.google.com/maps/dir//Westlands,+Nairobi'
        };
    }
};
