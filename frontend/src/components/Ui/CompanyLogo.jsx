import React from 'react';

export default function CompanyLogo({ logo, color = '#0D7DFF', companyName, size = 'default' }) {
  const getInitial = () => {
    if (companyName && typeof companyName === 'string' && companyName.length > 0) {
      return companyName.charAt(0).toUpperCase();
    }
    return 'C';
  };

  // Size variants
  const sizeClasses = {
    small: 'w-10 h-10 text-lg',
    default: 'w-12 h-12 text-xl',
    large: 'w-16 h-16 text-2xl',
    xlarge: 'w-20 h-20 text-3xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.default;

  if (logo) {
    return (
      <div className={`${sizeClass} rounded-xl overflow-hidden flex-shrink-0 bg-white border border-border shadow-sm flex items-center justify-center p-2`}>
        <img 
          src={logo} 
          alt={`${companyName} logo`}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={`${sizeClass} rounded-xl flex items-center justify-center text-white font-bold shadow-inner`}
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
      className={`${sizeClass} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}
      style={{ 
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
      }}
    >
      {getInitial()}
    </div>
  );
}
