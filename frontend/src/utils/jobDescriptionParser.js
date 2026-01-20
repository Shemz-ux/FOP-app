/**
 * Parses a job description string into structured sections
 * 
 * Expected format:
 * About the Role
 * Paragraph text...
 * 
 * Responsibilities
 * - Bullet point 1
 * - Bullet point 2
 * 
 * @param {string} description - The raw description text from API
 * @returns {Array} Array of section objects with header and content
 */
export function parseDescriptionToSections(description) {
  if (!description) return [
    { header: 'About the Role', content: [''] },
    { header: 'Responsibilities', content: [''] },
    { header: 'Requirements', content: [''] },
    { header: 'Benefits', content: [''] },
  ];
  
  // Exact headings we're looking for (case-insensitive) with normalized output
  const HEADING_MAP = {
    'about the role': 'About the Role',
    'responsibilities': 'Responsibilities',
    'requirements': 'Requirements',
    'benefits': 'Benefits'
  };
  
  const sections = [];
  const lines = description.split('\n').map(l => l.trim());
  let currentSection = null;
  
  for (const line of lines) {
    // Skip empty lines
    if (!line) continue;
    
    const lowerLine = line.toLowerCase();
    
    // Check if this line matches one of our headings (case-insensitive)
    if (HEADING_MAP[lowerLine]) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Start new section with normalized capitalization
      currentSection = {
        header: HEADING_MAP[lowerLine],
        content: []
      };
    } else if (currentSection) {
      // Add content to current section (keep bullets as-is)
      currentSection.content.push(line);
    } else {
      // No header yet, create default "About the Role" section
      currentSection = {
        header: 'About the Role',
        content: [line]
      };
    }
  }
  
  // Add last section
  if (currentSection && currentSection.content.length > 0) {
    sections.push(currentSection);
  }
  
  // If no sections found, create default structure
  if (sections.length === 0) {
    return [{
      header: 'About the Role',
      content: [description]
    }];
  }
  
  return sections;
}

/**
 * Converts section objects back to formatted description string
 * 
 * @param {Array} sections - Array of section objects
 * @returns {string} Formatted description string
 */
export function sectionsToDescription(sections) {
  return sections
    .map(section => {
      const header = section.header;
      const content = section.content.filter(c => c.trim()).join('\n');
      return `${header}\n${content}`;
    })
    .join('\n\n');
}
