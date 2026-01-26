import axios from 'axios';
import { API_BASE_URL } from '../api';

/**
 * Upload media file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} purpose - Purpose of upload: 'event_image', 'company_logo', 'organiser_logo', 'other'
 * @param {string} replaceUrl - Optional URL of existing media to replace
 * @returns {Promise<Object>} Upload result with URL and metadata
 */
export const uploadMedia = async (file, purpose, replaceUrl = null) => {
  try {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('purpose', purpose);
    
    if (replaceUrl) {
      formData.append('replace_url', replaceUrl);
    }

    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_BASE_URL}/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Media upload error:', error);
    return {
      success: false,
      error: error.response?.data?.msg || error.message || 'Failed to upload media'
    };
  }
};

/**
 * Delete media from Cloudinary (Admin only)
 * @param {string} publicId - Cloudinary public_id
 * @param {string} url - Alternative: Cloudinary URL
 * @returns {Promise<Object>} Deletion result
 */
export const deleteMedia = async (publicId = null, url = null) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(`${API_BASE_URL}/media/delete`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        public_id: publicId,
        url: url
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Media delete error:', error);
    return {
      success: false,
      error: error.response?.data?.msg || error.message || 'Failed to delete media'
    };
  }
};
