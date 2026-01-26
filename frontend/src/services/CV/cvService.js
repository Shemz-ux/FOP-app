import { apiPost, apiGet, apiDelete, API_BASE_URL } from '../api';

const CV_API_BASE = '/cv';

/**
 * Upload a CV file to R2 storage
 * @param {File} file - The CV file to upload
 * @param {string} replaceStorageKey - Optional storage key of existing CV to replace
 * @returns {Promise<Object>} Upload result with CV metadata
 */
export const uploadCV = async (file, replaceStorageKey = null) => {
    try {
        const formData = new FormData();
        formData.append('cv', file);
        
        if (replaceStorageKey) {
            formData.append('replace_storage_key', replaceStorageKey);
        }

        const response = await fetch(`${API_BASE_URL}${CV_API_BASE}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Failed to upload CV');
        }

        return await response.json();
    } catch (error) {
        console.error('CV upload error:', error);
        throw error;
    }
};

/**
 * Delete a CV from R2 storage
 * @param {string} storageKey - The storage key of the CV to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteCV = async (storageKey) => {
    try {
        return await apiDelete(`${CV_API_BASE}/delete`, { storage_key: storageKey });
    } catch (error) {
        console.error('CV deletion error:', error);
        throw error;
    }
};

/**
 * Get a presigned download URL for a CV
 * @param {string} storageKey - The storage key of the CV
 * @param {string} fileName - Optional original file name for download
 * @param {string} disposition - 'inline' for viewing, 'attachment' for downloading
 * @returns {Promise<string>} Presigned download URL
 */
export const getCVDownloadUrl = async (storageKey, fileName = null, disposition = 'attachment') => {
    try {
        const params = new URLSearchParams({ storage_key: storageKey });
        if (fileName) {
            params.append('file_name', fileName);
        }
        if (disposition) {
            params.append('disposition', disposition);
        }

        const response = await apiGet(`${CV_API_BASE}/download-url?${params.toString()}`);
        return response.download_url;
    } catch (error) {
        console.error('CV download URL error:', error);
        throw error;
    }
};

/**
 * Download a CV file
 * @param {string} storageKey - The storage key of the CV
 * @param {string} fileName - The file name to use for download
 */
export const downloadCV = async (storageKey, fileName) => {
    try {
        const downloadUrl = await getCVDownloadUrl(storageKey, fileName);
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName || 'CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('CV download error:', error);
        throw error;
    }
};
