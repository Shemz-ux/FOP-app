/**
 * Event Description Parser
 * Converts between structured description sections and plain text
 */

/**
 * Parse plain text description into structured sections
 * @param {string} description - Plain text description
 * @returns {Array} Array of section objects with header and content
 */
export const parseDescriptionToSections = (description) => {
  if (!description) {
    return [
      { header: 'About the Event', content: [''] },
      { header: 'What to Expect', content: [''] },
      { header: 'Who Should Attend', content: [''] },
    ];
  }

  // Try to parse structured format
  const sections = [];
  const lines = description.split('\n').filter(line => line.trim());
  
  let currentSection = null;
  
  // Map of known headers to normalized format
  const HEADING_MAP = {
    'about the event': 'About the Event',
    'what to expect': 'What to Expect',
    'who should attend': 'Who Should Attend',
    'topics covered': 'Topics Covered',
    'requirements': 'Requirements',
    'format': 'Format'
  };
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    const lowerLine = trimmedLine.toLowerCase();
    
    // Check if line matches a known header (case-insensitive)
    let normalizedHeader = null;
    for (const [key, value] of Object.entries(HEADING_MAP)) {
      if (lowerLine.startsWith(key)) {
        normalizedHeader = value;
        break;
      }
    }
    
    if (normalizedHeader || trimmedLine.endsWith(':') || (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        header: normalizedHeader || trimmedLine.replace(':', ''),
        content: []
      };
    } else if (currentSection) {
      // Add content to current section
      const cleanLine = trimmedLine.replace(/^[-•*]\s*/, '');
      if (cleanLine) {
        currentSection.content.push(cleanLine);
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  // If no sections were parsed, create default structure
  if (sections.length === 0) {
    return [
      { header: 'About the Event', content: [description] },
      { header: 'What to Expect', content: [''] },
      { header: 'Who Should Attend', content: [''] },
    ];
  }
  
  return sections;
};

/**
 * Convert structured sections back to plain text
 * @param {Array} sections - Array of section objects
 * @returns {string} Plain text description
 */
export const sectionsToDescription = (sections) => {
  if (!sections || sections.length === 0) {
    return '';
  }
  
  return sections
    .map(section => {
      const header = section.header;
      const isAboutSection = header === 'About the Event';
      
      // For "About the Event", use plain text without bullet points
      const content = section.content
        .filter(item => item.trim())
        .map(item => isAboutSection ? item : `• ${item}`)
        .join(isAboutSection ? '\n' : '\n');
      
      return `${header}:\n${content}`;
    })
    .join('\n\n');
};

/**
 * Validate that all sections have required content
 * @param {Array} sections - Array of section objects
 * @returns {boolean} True if valid
 */
export const validateSections = (sections) => {
  if (!sections || sections.length === 0) {
    return false;
  }
  
  return sections.every(section => {
    return section.header.trim() && 
           section.content.some(item => item.trim());
  });
};
