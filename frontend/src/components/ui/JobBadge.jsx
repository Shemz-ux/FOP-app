import React from 'react';

export default function JobBadge({ children, variant = 'purple' }) {
  // Map variant to the corresponding CSS class
  const getVariantClass = (variant) => {
    const variantMap = {
      purple: 'badge-purple',
      green: 'badge-green',
      orange: 'badge-orange',
      pink: 'badge-pink',
      teal: 'badge-teal',
    };
    
    return variantMap[variant] || 'badge-purple';
  };

  return (
    <span className={`badge ${getVariantClass(variant)}`}>
      {children}
    </span>
  );
}
