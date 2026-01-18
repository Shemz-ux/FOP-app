import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from '../api';
import { addResourceMetadata, addResourceMetadataToList } from '../../utils/resourceTagGenerator';

// Get all resources with filters
export const getResources = async (filters = {}) => {
  const queryString = buildQueryString(filters);
  const data = await apiGet(`/resources${queryString}`);
  return {
    resources: addResourceMetadataToList(data.resources || []),
    total: data.total || 0
  };
};

// Get single resource by ID
export const getResourceById = async (resourceId) => {
  const data = await apiGet(`/resources/${resourceId}`);
  return addResourceMetadata(data.resource);
};

// Create new resource with file upload (admin only)
export const createResource = async (formData, adminToken) => {
  const data = await apiPost('/resources', formData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return addResourceMetadata(data.resource);
};

// Update resource metadata (admin only)
export const updateResource = async (resourceId, resourceData, adminToken) => {
  const data = await apiPatch(`/resources/${resourceId}`, resourceData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return addResourceMetadata(data.resource);
};

// Delete resource (admin only)
export const deleteResource = async (resourceId, adminToken) => {
  const data = await apiDelete(`/resources/${resourceId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.msg;
};

// Download resource file
export const downloadResource = async (resourceId) => {
  const data = await apiGet(`/resources/${resourceId}/download`);
  return data.download_url;
};

// Get resource categories
export const getResourceCategories = async () => {
  const data = await apiGet('/resources/categories');
  return data.categories;
};

// Get resource statistics
export const getResourceStats = async () => {
  const data = await apiGet('/resources/stats');
  return data.stats;
};
