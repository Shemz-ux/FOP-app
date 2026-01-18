import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Styled Time Input Component
 * Matches admin form design with proper theming
 */
const TimeInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  min,
  max,
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
          type="time"
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          className="w-full px-4 py-3 pr-12 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          style={{ colorScheme: 'dark' }}
        />
        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};

export default TimeInput;
