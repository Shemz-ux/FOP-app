import React from 'react';
import { Hash } from 'lucide-react';

/**
 * Styled Number Input Component
 * Matches admin form design with proper theming
 */
const NumberInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  step = 1,
  placeholder,
  icon: Icon = Hash,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm mb-2 text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
        />
        <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};

export default NumberInput;
