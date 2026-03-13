const API_BASE_URL = 'http://localhost:8080/api';

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.token;
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

export const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        let errorMessage = 'An error occurred while fetching data.';
        try {
            const errorData = await response.json();
            // Handle validation errors: { message: "Validation failed", data: { field: "error msg" } }
            if (errorData.data && typeof errorData.data === 'object' && !Array.isArray(errorData.data)) {
                const fieldErrors = Object.values(errorData.data).join('. ');
                errorMessage = fieldErrors || errorData.message || errorMessage;
            } else {
                errorMessage = errorData.message || errorMessage;
            }
        } catch (e) {
            // Body not JSON
        }
        throw new Error(errorMessage);
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    // Spring boot might return text or empty if not JSON, so we handle safely
    const textVal = await response.text();
    if (!textVal) return null;

    try {
        return JSON.parse(textVal);
    } catch (e) {
        return textVal; // Non-JSON response (e.g., pure string)
    }
};
