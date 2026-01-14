import React from 'react';
import './Marquee.css';

export default function Marquee({ items, speed = 100 }) {
  return (
    <div className="marquee-container">
      <div className="marquee-content" style={{ animationDuration: `${speed}s` }}>
        {/* First set */}
        <div className="marquee-items">
          {items.map((item, index) => (
            <div key={`first-${index}`} className="marquee-item">
              {item}
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="marquee-items">
          {items.map((item, index) => (
            <div key={`second-${index}`} className="marquee-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
