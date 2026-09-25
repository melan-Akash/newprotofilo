// Helper functions for Admin Authentication tokens and headers

export const getAdminToken = () => {
    try {
        const authData = localStorage.getItem('melan_admin_auth');
        if (!authData) return null;
        const parsed = JSON.parse(authData);
        return parsed?.token || null;
    } catch {
        return null;
    }
};

export const getAuthHeaders = (additionalHeaders = {}) => {
    const token = getAdminToken();
    const headers = { ...additionalHeaders };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};
