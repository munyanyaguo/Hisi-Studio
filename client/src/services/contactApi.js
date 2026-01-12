/**
 * Contact API Service
 * Handles all contact-related API calls
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Submit contact form
 */
export const submitContactForm = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contact`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit contact form' };
    }
};

/**
 * Get contact page statistics
 */
export const getContactStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/contact/stats`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
};


/**
 * Book a consultation
 */
export const bookConsultation = async (bookingData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/consultations`, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to book consultation' };
    }
};

/**
 * Get FAQs
 * @param {string} category - Optional category filter
 */
export const getFAQs = async (category = null) => {
    try {
        const url = category
            ? `${API_BASE_URL}/faqs?category=${category}`
            : `${API_BASE_URL}/faqs`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch FAQs' };
    }
};

/**
 * Get testimonials
 * @param {boolean} featuredOnly - Get only featured testimonials
 */
export const getTestimonials = async (featuredOnly = false) => {
    try {
        const url = featuredOnly
            ? `${API_BASE_URL}/testimonials?featured=true`
            : `${API_BASE_URL}/testimonials`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch testimonials' };
    }
};

/**
 * Get site settings
 */
export const getSiteSettings = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/settings`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch site settings' };
    }
};

/**
 * Get contact information (phone, WhatsApp, email, Instagram)
 */
export const getContactInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/contact/info`);
        return response.data;
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
        const response = await axios.get(`${API_BASE_URL}/settings`);
        const settings = response.data.data || response.data;

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
