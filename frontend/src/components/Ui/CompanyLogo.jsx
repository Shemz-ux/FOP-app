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
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <img 
          src={logo} 
          alt={`${companyName} logo`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner"
          style={{ 
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            display: 'none' 
          }}
        >
          {getInitial()}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm"
      style={{ 
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
      }}
    >
      {getInitial()}
    </div>
  );
}
