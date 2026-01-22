import React from 'react';

export default function JobBadge({ children, variant = 'purple' }) {
  // Map variant to the corresponding CSS class
  const getVariantClass = (variant) => {
    const variantMap = {
      // Purple shades
      purple: 'badge-purple',
      violet: 'badge-violet',
      fuchsia: 'badge-fuchsia',
      
      // Green shades
      green: 'badge-green',
      emerald: 'badge-emerald',
      lime: 'badge-lime',
      
      // Blue shades
      blue: 'badge-blue',
      sky: 'badge-sky',
      cyan: 'badge-cyan',
      indigo: 'badge-indigo',
      teal: 'badge-teal',
      
      // Warm colors
      orange: 'badge-orange',
      amber: 'badge-amber',
      yellow: 'badge-yellow',
      red: 'badge-red',
      
      // Pink/Rose
      pink: 'badge-pink',
      rose: 'badge-rose',
      
      // Neutral colors
      gray: 'badge-gray',
      slate: 'badge-slate',
      stone: 'badge-stone',
      zinc: 'badge-zinc',
    };
    
    return variantMap[variant] || 'badge-gray';
  };

  return (
    <span className={`badge ${getVariantClass(variant)}`}>
      {children}
    </span>
  );
}
