/**
 * API client for backend server communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch wrapper with standard error handling and configuration
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }
    
    // For 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiFetch(endpoint, { ...options, method: 'GET' }) as Promise<T>,
  
  post: <T>(endpoint: string, data: any, options?: RequestInit) =>
    apiFetch(endpoint, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<T>,
  
  put: <T>(endpoint: string, data: any, options?: RequestInit) =>
    apiFetch(endpoint, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data),
    }) as Promise<T>,
  
  patch: <T>(endpoint: string, data: any, options?: RequestInit) =>
    apiFetch(endpoint, { 
      ...options, 
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<T>,
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch(endpoint, { ...options, method: 'DELETE' }) as Promise<T>,
};

export default api; 