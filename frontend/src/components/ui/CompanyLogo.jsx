import React from 'react';

export default function CompanyLogo({ logo, color = '#0D7DFF' }) {
  if (logo) {
    return (
      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-border">
        <img 
          src={logo} 
          alt="Company logo" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          style={{ backgroundColor: color, display: 'none' }}
        >
          {logo.split('/').pop().charAt(0).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
      style={{ backgroundColor: color }}
    >
      {color ? 'C' : '?'}
    </div>
  );
}
