import React from 'react';

/**
 * Renders a structured description with consistent heading styles
 * 
 * Logic:
 * - Detects headings (lines ending with : or matching specific patterns)
 * - First section or sections with specific headers -> paragraph text
 * - Other sections -> bullet points
 */
export default function StructuredDescription({ description, className = '' }) {
  if (!description) return null;

  // Split description into lines
  const lines = description.split('\n').map(l => l.trim()).filter(l => l);
  
  const sections = [];
  let currentSection = null;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if this line is a heading (ends with : or is a known header pattern - case insensitive)
    const isHeading = line.endsWith(':') || 
                      lowerLine === 'about the role' || 
                      lowerLine === 'about the event' ||
                      lowerLine === 'responsibilities' || 
                      lowerLine === 'requirements' || 
                      lowerLine === 'benefits' ||
                      lowerLine === 'what to expect' ||
                      lowerLine === 'who should attend';
    
    if (isHeading) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }
      // Start new section
      currentSection = {
        heading: line.replace(':', ''),
        content: []
      };
    } else if (currentSection) {
      // Add content to current section
      currentSection.content.push(line);
    } else {
      // No heading yet, start first section without a heading
      currentSection = {
        heading: '',
        content: [line]
      };
    }
  }
  
  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return (
    <div className={`structured-description ${className}`}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-6 last:mb-0">
          {/* Bold heading */}
          {section.heading && (
            <h3 className="text-foreground font-bold text-lg mb-3">
              {section.heading}
            </h3>
          )}
          
          {/* Content: paragraph for first section or "About" sections, bullets for others */}
          {(sectionIndex === 0 || section.heading.includes('About')) ? (
            <div className="space-y-2">
              {section.content.map((line, lineIndex) => (
                <p key={lineIndex} className="text-muted-foreground leading-relaxed">
                  {line.replace(/^[-•*]\s*/, '')}
                </p>
              ))}
            </div>
          ) : (
            <ul className="list-disc ml-6 space-y-1.5">
              {section.content.map((line, lineIndex) => (
                <li key={lineIndex} className="text-muted-foreground">
                  {line.replace(/^[-•*]\s*/, '')}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
