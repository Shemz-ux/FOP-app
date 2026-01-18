import React from 'react';

export default function CompanyLogo({ logo, color = '#0D7DFF', companyName }) {
  const getInitial = () => {
    if (companyName && typeof companyName === 'string' && companyName.length > 0) {
      return companyName.charAt(0).toUpperCase();
    }
    return 'C';
  };

  if (logo) {
    return (
      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-border flex-shrink-0">
        <img 
          src={logo} 
          alt="Company logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
          style={{ backgroundColor: color, display: 'none' }}
        >
          {getInitial()}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {getInitial()}
    </div>
  );
}
