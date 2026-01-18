import { API_BASE_URL, handleResponse, handleError, buildQueryString } from '../api';
import { addResourceMetadata, addResourceMetadataToList } from '../../utils/resourceTagGenerator';

// Get all resources with filters
export const getResources = async (filters = {}) => {
  try {
    const queryString = buildQueryString(filters);
    const response = await fetch(`${API_BASE_URL}/resources${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await handleResponse(response);
    return addResourceMetadataToList(data.resources);
  } catch (error) {
    return handleError(error);
  }
};

// Get single resource by ID
export const getResourceById = async (resourceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await handleResponse(response);
    return addResourceMetadata(data.resource);
  } catch (error) {
    return handleError(error);
  }
};

// Create new resource with file upload (admin only)
export const createResource = async (formData, adminToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData, // FormData object with file
    });
    const data = await handleResponse(response);
    return addResourceMetadata(data.resource);
  } catch (error) {
    return handleError(error);
  }
};

// Update resource metadata (admin only)
export const updateResource = async (resourceId, resourceData, adminToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(resourceData),
    });
    const data = await handleResponse(response);
    return addResourceMetadata(data.resource);
  } catch (error) {
    return handleError(error);
  }
};

// Delete resource (admin only)
export const deleteResource = async (resourceId, adminToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
    });
    const data = await handleResponse(response);
    return data.msg;
  } catch (error) {
    return handleError(error);
  }
};

// Download resource file
export const downloadResource = async (resourceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/download`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'download';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    const blob = await response.blob();
    return { blob, filename };
  } catch (error) {
    return handleError(error);
  }
};

// Get resource categories
export const getResourceCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await handleResponse(response);
    return data.categories;
  } catch (error) {
    return handleError(error);
  }
};

// Get resource statistics (admin only)
export const getResourceStats = async (adminToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
    });
    const data = await handleResponse(response);
    return data.stats;
  } catch (error) {
    return handleError(error);
  }
};
