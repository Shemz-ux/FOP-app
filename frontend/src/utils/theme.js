// Theme utility functions
export const toggleTheme = () => {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

export const initializeTheme = () => {
  // Force dark mode permanently - ignore system preferences
  // const savedTheme = localStorage.getItem('theme');
  // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  //   document.documentElement.classList.add('dark');
  // } else {
  //   document.documentElement.classList.remove('dark');
  // }
  
  // Always apply dark mode
  document.documentElement.classList.add('dark');
};

export const getCurrentTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};
