import { useState, useEffect } from 'react';
import { toggleTheme, getCurrentTheme } from '../../utils/theme.js';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getCurrentTheme() === 'dark');
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
    </button>
  );
};

export default ThemeToggle;
