import React from 'react';
import './Marquee.css';

export default function Marquee({ 
  items, 
  speed = 100, 
  title, 
  titleClassName = "text-center text-xl text-muted-foreground mb-12",
  background = false,
  fullWidth = false,
  className = ""
}) {
  const sectionClasses = background 
    ? "bg-secondary/30 border-y border-border" 
    : "";
  
  const content = (
    <>
      {title && (
        <h2 className={titleClassName}>
          {title}
        </h2>
      )}
      
      <div className="marquee-container">
        <div className="marquee-content" style={{ animationDuration: `${speed}s` }}>
          {/* First set */}
          <div className="marquee-items">
            {items.map((item, index) => (
              <div key={`first-${index}`} className="marquee-item">
                {React.cloneElement(item, { key: `item-first-${index}` })}
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="marquee-items">
            {items.map((item, index) => (
              <div key={`second-${index}`} className="marquee-item">
                {React.cloneElement(item, { key: `item-second-${index}` })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
  
  // If fullWidth is true, don't wrap in section/container (for backward compatibility)
  if (fullWidth) {
    return content;
  }
  
  // Otherwise, wrap in section with container
  return (
    <section className={sectionClasses}>
      <div className={`container mx-auto px-6 py-20 ${className}`}>
        {content}
      </div>
    </section>
  );
}
