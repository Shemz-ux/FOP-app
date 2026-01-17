import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AdminSelect({ 
  value, 
  onValueChange, 
  placeholder = "Select an option",
  options = [],
  className = ""
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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between text-left"
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
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
