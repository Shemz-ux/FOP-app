import React from 'react';
import { parseDescription, formatContent } from '../../utils/descriptionFormatter';

/**
 * Renders a structured description with consistent heading styles
 * Supports sections with headings, paragraphs, and bullet lists
 */
export default function StructuredDescription({ description, className = '' }) {
  if (!description) return null;

  const sections = parseDescription(description);
  console.log('Parsed sections:', sections);

  return (
    <div className={`structured-description ${className}`}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-6 last:mb-0">
          {section.heading && (
            <h3 className="text-foreground font-semibold text-lg mb-3">
              {section.heading}
            </h3>
          )}
          
          <div className="space-y-3">
            {formatContent(section.content).map((block, blockIndex) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={blockIndex} className="text-muted-foreground leading-relaxed">
                    {block.content}
                  </p>
                );
              }
              
              if (block.type === 'list') {
                return (
                  <ul key={blockIndex} className="list-disc ml-6 space-y-1.5 text-muted-foreground">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
