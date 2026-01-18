import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/**
 * Custom Select component with styled dropdown options
 * Matches AdminSelect design with custom dropdown menu
 */
export default function CustomSelect({ 
  id, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
  className = "",
  required = false,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (selectedValue) => {
    // Create a synthetic event to match native select onChange
    const syntheticEvent = {
      target: {
        value: selectedValue,
        id: id
      }
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden native select for form validation */}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom styled button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between text-left ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
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
  );
}
