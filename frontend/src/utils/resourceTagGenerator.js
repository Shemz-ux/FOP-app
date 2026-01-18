// Utility functions to generate tags, icons, and variants for resources

// ==================== ICON TYPE MAPPING ====================

// Map file types/extensions to icon types
const fileTypeToIcon = {
  // Documents
  'pdf': 'FileText',
  'doc': 'FileText',
  'docx': 'FileText',
  'txt': 'FileText',
  
  // Spreadsheets
  'xls': 'Sheet',
  'xlsx': 'Sheet',
  'csv': 'Sheet',
  
  // Presentations
  'ppt': 'Presentation',
  'pptx': 'Presentation',
  
  // Images
  'jpg': 'Image',
  'jpeg': 'Image',
  'png': 'Image',
  'gif': 'Image',
  'svg': 'Image',
  
  // Videos
  'mp4': 'Video',
  'mov': 'Video',
  'avi': 'Video',
  'webm': 'Video',
  
  // Archives
  'zip': 'Archive',
  'rar': 'Archive',
  '7z': 'Archive',
  'tar': 'Archive',
  
  // Code
  'js': 'Code',
  'jsx': 'Code',
  'ts': 'Code',
  'tsx': 'Code',
  'py': 'Code',
  'java': 'Code',
  
  // Default
  'default': 'File'
};

// Map categories to more specific icons
const categoryToIcon = {
  'CV & Cover Letters': 'FileText',
  'Interview Prep': 'MessageSquare',
  'Career Tips': 'Lightbulb',
  'Networking': 'Users',
  'Skills Development': 'BookOpen',
  'Industry Insights': 'TrendingUp',
  'Application Forms': 'ClipboardList',
  'Templates': 'Layout',
  'Guides': 'BookOpen',
  'Checklists': 'CheckSquare',
  'default': 'File'
};

/**
 * Determine icon type based on file type and category
 * @param {string} fileType - File extension (e.g., 'pdf', 'docx')
 * @param {string} category - Resource category
 * @returns {string} Icon type name
 */
export const getIconType = (fileType, category) => {
  // First try to match by file type
  if (fileType) {
    const extension = fileType.toLowerCase().replace('.', '');
    if (fileTypeToIcon[extension]) {
      return fileTypeToIcon[extension];
    }
  }
  
  // Fall back to category-based icon
  if (category && categoryToIcon[category]) {
    return categoryToIcon[category];
  }
  
  // Default icon
  return 'File';
};

// ==================== CATEGORY VARIANT MAPPING ====================

// Map categories to color variants
const categoryVariants = {
  'CV & Cover Letters': 'blue',
  'Interview Prep': 'green',
  'Career Tips': 'purple',
  'Networking': 'pink',
  'Skills Development': 'orange',
  'Industry Insights': 'cyan',
  'Application Forms': 'teal',
  'Templates': 'indigo',
  'Guides': 'violet',
  'Checklists': 'emerald',
  'Salary & Benefits': 'amber',
  'Job Search': 'rose',
  'Personal Branding': 'fuchsia',
  'Work-Life Balance': 'lime',
  'default': 'gray'
};

/**
 * Get color variant for a category
 * @param {string} category - Resource category
 * @returns {string} Color variant name
 */
export const getCategoryVariant = (category) => {
  return categoryVariants[category] || categoryVariants['default'];
};

// ==================== TAG GENERATION ====================

/**
 * Generate tags for a resource based on its properties
 * @param {Object} resource - Resource object
 * @returns {Array} Array of tag objects with label and variant
 */
export const generateResourceTags = (resource) => {
  const tags = [];

  // Add category tag
  if (resource.category) {
    tags.push({
      label: resource.category,
      variant: getCategoryVariant(resource.category)
    });
  }

  // Add file type tag
  if (resource.file_type) {
    const fileType = resource.file_type.toUpperCase().replace('.', '');
    tags.push({
      label: fileType,
      variant: 'slate'
    });
  }

  // Add file size tag if available
  if (resource.file_size) {
    tags.push({
      label: resource.file_size,
      variant: 'gray'
    });
  }

  return tags;
};

/**
 * Add enhanced metadata to a single resource
 * Adds: tags, icon_type, category_variant
 * @param {Object} resource - Resource object
 * @returns {Object} Enhanced resource object
 */
export const addResourceMetadata = (resource) => {
  if (!resource) return resource;
  
  return {
    ...resource,
    icon_type: getIconType(resource.file_type, resource.category),
    category_variant: getCategoryVariant(resource.category),
    tags: generateResourceTags(resource)
  };
};

/**
 * Add enhanced metadata to an array of resources
 * @param {Array} resources - Array of resource objects
 * @returns {Array} Array of enhanced resource objects
 */
export const addResourceMetadataToList = (resources) => {
  if (!Array.isArray(resources)) return resources;
  return resources.map(resource => addResourceMetadata(resource));
};

// ==================== FILE SIZE FORMATTING ====================

/**
 * Format bytes to human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Add formatted file size to resource if it has raw bytes
 * @param {Object} resource - Resource object
 * @returns {Object} Resource with formatted file_size
 */
export const addFormattedFileSize = (resource) => {
  if (!resource) return resource;
  
  // If file_size is a number (bytes), format it
  if (typeof resource.file_size === 'number') {
    return {
      ...resource,
      file_size: formatFileSize(resource.file_size),
      file_size_bytes: resource.file_size
    };
  }
  
  return resource;
};

// ==================== EXPORTS ====================

export default {
  getIconType,
  getCategoryVariant,
  generateResourceTags,
  addResourceMetadata,
  addResourceMetadataToList,
  formatFileSize,
  addFormattedFileSize
};
