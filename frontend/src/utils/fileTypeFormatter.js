/**
 * Format MIME types into user-friendly display names
 * @param {string} mimeType - The MIME type to format
 * @returns {string} - User-friendly file type name
 */
export const formatFileType = (mimeType) => {
  if (!mimeType) return 'Unknown';

  // Map of MIME types to display names
  const mimeTypeMap = {
    // PDF
    'application/pdf': 'PDF',
    
    // Word Documents
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    
    // PowerPoint
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    
    // Excel
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    
    // Text files
    'text/plain': 'TXT',
    'text/rtf': 'RTF',
    'application/rtf': 'RTF',
    
    // Video
    'video/link': 'Video Link',
    'video/mp4': 'MP4 Video',
    'video/webm': 'WebM Video',
    'video/quicktime': 'MOV Video',
    
    // Images
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/svg+xml': 'SVG',
    'image/webp': 'WebP',
  };

  // Return mapped value or extract from MIME type
  if (mimeTypeMap[mimeType]) {
    return mimeTypeMap[mimeType];
  }

  // Fallback: try to extract file extension from MIME type
  // e.g., "application/pdf" -> "PDF"
  const parts = mimeType.split('/');
  if (parts.length === 2) {
    const subtype = parts[1];
    
    // Handle special cases
    if (subtype.includes('wordprocessingml')) return 'DOCX';
    if (subtype.includes('presentationml')) return 'PPTX';
    if (subtype.includes('spreadsheetml')) return 'XLSX';
    
    // Return uppercase subtype
    return subtype.toUpperCase();
  }

  // Last resort: return the original MIME type
  return mimeType;
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - File extension in uppercase
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toUpperCase();
  }
  return '';
};

/**
 * Format file type with fallback to filename extension
 * @param {string} mimeType - The MIME type
 * @param {string} filename - The filename (optional fallback)
 * @returns {string} - User-friendly file type name
 */
export const formatFileTypeWithFallback = (mimeType, filename) => {
  const formattedMimeType = formatFileType(mimeType);
  
  // If we got a clean result from MIME type, use it
  if (formattedMimeType && formattedMimeType !== 'Unknown' && !formattedMimeType.includes('/')) {
    return formattedMimeType;
  }
  
  // Fallback to filename extension
  if (filename) {
    const extension = getFileExtension(filename);
    if (extension) {
      return extension;
    }
  }
  
  return formattedMimeType;
};
