/**
 * Press API Service
 * Handles all press-related API calls for the Press page
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get all press page content (hero, media coverage, exhibitions, etc.)
 */
export const getPressPageContent = async () => {
    const response = await fetch(`${API_URL}/api/v1/press`);

    if (!response.ok) {
        throw new Error('Failed to fetch press content');
    }

    const data = await response.json();
    return data.data || data;
};

/**
 * Get media coverage items only
 */
export const getMediaCoverage = async () => {
    const response = await fetch(`${API_URL}/api/v1/press/media-coverage`);

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data.data || [];
};

/**
 * Get exhibitions only
 */
export const getExhibitions = async () => {
    const response = await fetch(`${API_URL}/api/v1/press/exhibitions`);

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data.data || [];
};

/**
 * Get press releases only
 */
export const getPressReleases = async () => {
    const response = await fetch(`${API_URL}/api/v1/press/releases`);

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data.data || [];
};

// ========== ADMIN API FUNCTIONS ==========

/**
 * Get auth headers for admin requests
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// ----- Media Coverage Admin -----

export const adminGetMediaCoverage = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-coverage`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch media coverage');
    const data = await response.json();
    return data.data || [];
};

export const adminCreateMediaCoverage = async (item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-coverage`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create media coverage');
    }
    return (await response.json()).data;
};

export const adminUpdateMediaCoverage = async (id, item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-coverage/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to update media coverage');
    return (await response.json()).data;
};

export const adminDeleteMediaCoverage = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-coverage/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete media coverage');
    return true;
};

// ----- Press Releases Admin -----

export const adminGetPressReleases = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/releases`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch press releases');
    const data = await response.json();
    return data.data || [];
};

export const adminCreatePressRelease = async (item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/releases`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to create press release');
    return (await response.json()).data;
};

export const adminUpdatePressRelease = async (id, item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/releases/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to update press release');
    return (await response.json()).data;
};

export const adminDeletePressRelease = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/releases/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete press release');
    return true;
};

// ----- Exhibitions Admin -----

export const adminGetExhibitions = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/exhibitions`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch exhibitions');
    const data = await response.json();
    return data.data || [];
};

export const adminCreateExhibition = async (item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/exhibitions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to create exhibition');
    return (await response.json()).data;
};

export const adminUpdateExhibition = async (id, item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/exhibitions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to update exhibition');
    return (await response.json()).data;
};

export const adminDeleteExhibition = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/exhibitions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete exhibition');
    return true;
};

// ----- Speaking Engagements Admin -----

export const adminGetSpeakingEngagements = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/speaking-engagements`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch speaking engagements');
    const data = await response.json();
    return data.data || [];
};

export const adminCreateSpeakingEngagement = async (item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/speaking-engagements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to create speaking engagement');
    return (await response.json()).data;
};

export const adminUpdateSpeakingEngagement = async (id, item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/speaking-engagements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to update speaking engagement');
    return (await response.json()).data;
};

export const adminDeleteSpeakingEngagement = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/speaking-engagements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete speaking engagement');
    return true;
};

// ----- Collaborations Admin -----

export const adminGetCollaborations = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/collaborations`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch collaborations');
    const data = await response.json();
    return data.data || [];
};

export const adminCreateCollaboration = async (item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/collaborations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to create collaboration');
    return (await response.json()).data;
};

export const adminUpdateCollaboration = async (id, item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/collaborations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to update collaboration');
    return (await response.json()).data;
};

export const adminDeleteCollaboration = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/collaborations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete collaboration');
    return true;
};

// ----- Press Hero Admin -----

export const adminGetPressHero = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/hero`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch press hero');
    const data = await response.json();
    return data.data;
};

export const adminUpdatePressHero = async (data) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/hero`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to update press hero');
    return (await response.json()).data;
};

// ----- Press Contact Admin -----

export const adminGetPressContact = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/contact`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch press contact');
    const data = await response.json();
    return data.data;
};

export const adminUpdatePressContact = async (data) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/contact`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to update press contact');
    return (await response.json()).data;
};

// ----- Media Kit Admin -----

export const adminGetMediaKit = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-kit`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch media kit');
    const data = await response.json();
    return data.data;
};

export const adminUpdateMediaKitConfig = async (data) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-kit/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to update media kit config');
    return (await response.json()).data;
};

export const adminCreateMediaKitItem = async (item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-kit/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to create media kit item');
    return (await response.json()).data;
};

export const adminUpdateMediaKitItem = async (id, item) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-kit/items/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });

    if (!response.ok) throw new Error('Failed to update media kit item');
    return (await response.json()).data;
};

export const adminDeleteMediaKitItem = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/admin/press/media-kit/items/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete media kit item');
    return true;
};

export default {
    getPressPageContent,
    getMediaCoverage,
    getExhibitions,
    getPressReleases,
    // Admin functions
    adminGetMediaCoverage,
    adminCreateMediaCoverage,
    adminUpdateMediaCoverage,
    adminDeleteMediaCoverage,
    adminGetPressReleases,
    adminCreatePressRelease,
    adminUpdatePressRelease,
    adminDeletePressRelease,
    adminGetExhibitions,
    adminCreateExhibition,
    adminUpdateExhibition,
    adminDeleteExhibition,
    adminGetSpeakingEngagements,
    adminCreateSpeakingEngagement,
    adminUpdateSpeakingEngagement,
    adminDeleteSpeakingEngagement,
    adminGetCollaborations,
    adminCreateCollaboration,
    adminUpdateCollaboration,
    adminDeleteCollaboration,
    adminGetPressHero,
    adminUpdatePressHero,
    adminGetPressContact,
    adminUpdatePressContact,
    adminGetMediaKit,
    adminUpdateMediaKitConfig,
    adminCreateMediaKitItem,
    adminUpdateMediaKitItem,
    adminDeleteMediaKitItem
};
