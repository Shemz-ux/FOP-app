/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: 'hsl(222.2, 47.4%, 11.2%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        // Secondary colors
        secondary: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(222.2, 47.4%, 11.2%)',
        },
        // Card colors
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(222.2, 47.4%, 11.2%)',
        },
        // Muted colors
        muted: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(215.4, 16.3%, 46.9%)',
        },
        // Border colors
        border: 'hsl(214.3, 31.8%, 91.4%)',
        // Input colors
        input: 'hsl(214.3, 31.8%, 91.4%)',
        'input-background': 'hsl(0, 0%, 100%)',
        // Ring colors
        ring: 'hsl(222.2, 47.4%, 11.2%)',
        // Background colors
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222.2, 47.4%, 11.2%)',
        // Badge variants
        purple: {
          100: 'hsl(270, 100%, 96%)',
          800: 'hsl(271, 100%, 20%)',
        },
        green: {
          100: 'hsl(138, 76%, 97%)',
          800: 'hsl(120, 100%, 10%)',
        },
        orange: {
          100: 'hsl(34, 100%, 96%)',
          800: 'hsl(26, 100%, 20%)',
        },
        pink: {
          100: 'hsl(330, 100%, 96%)',
          800: 'hsl(330, 100%, 20%)',
        },
        teal: {
          100: 'hsl(180, 100%, 96%)',
          800: 'hsl(180, 100%, 15%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
