import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const ADD_NEW_VALUE = '__add_new__';

/**
 * A select dropdown that also lets the user add a value not already in `options` —
 * picking "+ {addNewLabel}" swaps the dropdown for a free-text input, with a link back
 * to the option list. Extracted from the webinar category field so any admin form that
 * needs "pick from an existing list, or add a new one" (categories, locations, etc.) can
 * reuse the same component instead of re-implementing the pattern.
 */
export default function SelectWithAddNew({
  label,
  name,
  options = [],
  value,
  onValueChange,
  required = false,
  placeholder = 'Select an option',
  addNewLabel = 'Add new',
  customPlaceholder = 'Enter a new value',
  backLabel,
  className = ''
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // If the current value isn't one of the known options (e.g. editing an existing
  // record whose value was itself custom-added, or `options` arrives asynchronously
  // after `value` is already set), start in "add new" mode showing it. Adjusted during
  // render rather than in an effect, per https://react.dev/learn/you-might-not-need-an-effect
  const [checkedOptionsKey, setCheckedOptionsKey] = useState(null);
  const optionsKey = options.length > 0 ? `${value}|${options.length}` : null;
  if (optionsKey !== null && optionsKey !== checkedOptionsKey) {
    setCheckedOptionsKey(optionsKey);
    if (!isAdding && value && !options.some((opt) => opt.value === value)) {
      setIsAdding(true);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    if (selectedValue === ADD_NEW_VALUE) {
      setIsAdding(true);
      onValueChange('');
    } else {
      onValueChange(selectedValue);
    }
    setIsOpen(false);
  };

  const handleBack = () => {
    setIsAdding(false);
    onValueChange('');
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm mb-2 text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!isAdding ? (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id={name}
            onClick={() => setIsOpen((prev) => !prev)}
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
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors ${
                    value === option.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleSelect(ADD_NEW_VALUE)}
                className="w-full px-4 py-3 text-left text-primary hover:bg-secondary transition-colors border-t border-border"
              >
                + {addNewLabel}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            id={name}
            type="text"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={customPlaceholder}
            className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {backLabel || '← Back to options'}
          </button>
        </div>
      )}
    </div>
  );
}
