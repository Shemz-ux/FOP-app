import React from 'react';

/**
 * Renders a structured description with consistent heading styles
 * 
 * Logic:
 * - If line matches exact heading (About the Role, Responsibilities, Requirements, Benefits) -> make it bold
 * - Content under "About the Role" -> paragraph text
 * - Content under other headings -> bullet points
 */
export default function StructuredDescription({ description, className = '' }) {
  if (!description) return null;

  const VALID_HEADINGS = ['About the role', 'Responsibilities', 'Requirements', 'Benefits'];
  
  // Split description into lines
  const lines = description.split('\n').map(l => l.trim()).filter(l => l);
  
  const sections = [];
  let currentSection = null;
  
  for (const line of lines) {
    // Check if this line is exactly one of our headings
    if (VALID_HEADINGS.includes(line)) {
      // Save previous section
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
      // No heading yet, create default "About the role" section
      currentSection = {
        heading: 'About the role',
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
          <h3 className="text-foreground font-bold text-lg mb-3">
            {section.heading}
          </h3>
          
          {/* Content: paragraph for "About the role", bullets for others */}
          {section.heading === 'About the role' ? (
            <div className="space-y-2">
              {section.content.map((line, lineIndex) => (
                <p key={lineIndex} className="text-muted-foreground leading-relaxed">
                  {line}
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
