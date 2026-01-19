import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Custom Dropdown Component with "Other" option support
 * Styled to match AdminSelect design
 */
const CustomDropdown = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  placeholder = 'Select an option',
  showVariantPreview = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(value === 'Other' || !options.some(opt => opt.value === value));
  const [customValue, setCustomValue] = useState(
    !options.some(opt => opt.value === value) && value !== 'Other' ? value : ''
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (selectedValue) => {
    if (selectedValue === 'Other') {
      setIsOtherSelected(true);
      setCustomValue('');
      onChange({ target: { name, value: '' } });
    } else {
      setIsOtherSelected(false);
      setCustomValue('');
      onChange({ target: { name, value: selectedValue } });
    }
    setIsOpen(false);
  };

  const handleCustomInputChange = (e) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange({ target: { name, value: newValue } });
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = isOtherSelected && customValue ? customValue : (selectedOption?.label || '');

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm mb-2 text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="space-y-2">
        {/* Main Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between text-left ${className.includes('font-bold') ? 'font-bold' : ''}`}
          >
            <span className={displayValue ? 'text-foreground' : 'text-muted-foreground'}>
              {displayValue || placeholder}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg max-h-80 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors ${
                    value === option.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Input (shown when "Other" is selected) */}
        {isOtherSelected && (
          <div className="space-y-2">
            <input
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              placeholder="Enter custom value..."
              required={required}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Custom entries will use default styling (gray variant)
            </p>
          </div>
        )}

        {/* Variant Preview */}
        {showVariantPreview && selectedOption && !isOtherSelected && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Preview:</span>
            <span className={`px-2 py-1 rounded text-xs bg-${selectedOption.variant}-100 text-${selectedOption.variant}-700 border border-${selectedOption.variant}-300`}>
              {selectedOption.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
