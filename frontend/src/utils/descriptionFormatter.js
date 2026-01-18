/**
 * Parses a structured job/event/resource description and returns formatted sections
 * 
 * Expected format:
 * Section Heading
 * Content line 1
 * Content line 2
 * 
 * Another Section Heading
 * More content
 * 
 * Headings are detected as:
 * - Lines that don't end with punctuation (. ! ?)
 * - Lines followed by content
 * - Common section headings like "About the Role", "Responsibilities", etc.
 */

const COMMON_HEADINGS = [
  'About the Role',
  'About the Position',
  'Job Description',
  'Responsibilities',
  'Requirements',
  'Qualifications',
  'Required Qualifications',
  'Preferred Qualifications',
  'Benefits',
  'What We Offer',
  'What You\'ll Do',
  'What You\'ll Bring',
  'Who You Are',
  'About Us',
  'About the Company',
  'About the Event',
  'Event Details',
  'What to Expect',
  'Key Takeaways',
  'Topics Covered',
  'Agenda',
  'Schedule',
  'Prerequisites',
  'Target Audience',
  'How to Apply',
  'Application Process',
  'Next Steps'
];

/**
 * Parse description text into structured sections
 * @param {string} description - Raw description text
 * @returns {Array} Array of section objects with heading and content
 */
export const parseDescription = (description) => {
  if (!description) return [];

  const lines = description.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const sections = [];
  let currentSection = null;

  lines.forEach((line, index) => {
    // Check if line starts with a bullet point
    const isBulletPoint = /^[-–—•*]\s/.test(line) || /^\d+\.\s/.test(line);
    
    const isHeading = 
      !isBulletPoint && (
        COMMON_HEADINGS.includes(line) ||
        (line.length < 50 && !line.match(/[.!?]$/) && index < lines.length - 1)
      );

    if (isHeading) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      // Start new section
      currentSection = {
        heading: line,
        content: []
      };
    } else if (currentSection) {
      // Add content to current section
      currentSection.content.push(line);
    } else {
      // No heading yet, treat as intro content
      if (sections.length === 0) {
        sections.push({
          heading: null,
          content: [line]
        });
      } else {
        sections[0].content.push(line);
      }
    }
  });

  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

/**
 * Format content lines into paragraphs and lists
 * @param {Array} contentLines - Array of content strings
 * @returns {Array} Array of formatted content blocks
 */
export const formatContent = (contentLines) => {
  const blocks = [];
  
  // Check if ANY line in this section starts with a bullet
  const hasAnyBullets = contentLines.some(line => /^[-–—•*]\s/.test(line) || /^\d+\.\s/.test(line));
  
  // If section has bullets, treat ALL lines as list items
  if (hasAnyBullets) {
    const items = contentLines.map(line => {
      // Remove bullet if present, otherwise use line as-is
      return line.replace(/^[-–—•*]\s/, '').replace(/^\d+\.\s/, '');
    });
    
    blocks.push({
      type: 'list',
      items: items
    });
  } else {
    // No bullets, treat as paragraph
    blocks.push({
      type: 'paragraph',
      content: contentLines.join(' ')
    });
  }

  return blocks;
};

/**
 * Convert plain text to structured format with bullet points
 * Useful for converting existing descriptions
 */
export const convertToStructuredFormat = (text) => {
  const sections = parseDescription(text);
  return sections.map(section => {
    const formattedContent = formatContent(section.content);
    return {
      ...section,
      formattedContent
    };
  });
};
