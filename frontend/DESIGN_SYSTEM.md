# Design System Documentation

## Overview

Your design system has been successfully integrated with Tailwind CSS v4. It provides a comprehensive set of design tokens, color schemes, and utilities for building consistent UI components.

## Features

- ✅ **Dark/Light Mode Support** - Automatic theme switching with system preference detection
- ✅ **Custom CSS Properties** - All design tokens available as CSS variables
- ✅ **Tailwind Integration** - Seamless integration with Tailwind CSS v4
- ✅ **Job Board Specific Colors** - Brand colors for major companies
- ✅ **Badge System** - Predefined badge colors with light/dark variants
- ✅ **Typography Scale** - Consistent font sizing system
- ✅ **Spacing System** - Standardized spacing values

## Usage

### Theme Switching

```javascript
import { toggleTheme, initializeTheme, getCurrentTheme } from './utils/theme.js';

// Initialize theme on app load
useEffect(() => {
  initializeTheme();
}, []);

// Toggle between light/dark mode
const handleToggle = () => {
  toggleTheme();
};
```

### Using Design Tokens with Tailwind

#### Colors
```jsx
// Primary colors
<div className="bg-primary text-primary-foreground">Primary Button</div>
<div className="bg-secondary text-secondary-foreground">Secondary Button</div>

// Card backgrounds
<div className="bg-card text-card-foreground border border-border">Card Content</div>

// Muted content
<div className="bg-muted text-muted-foreground">Less prominent content</div>
```

#### Company Brand Colors (CSS Variables)
```jsx
// Use with inline styles for company-specific elements
<div style={{backgroundColor: 'var(--color-netflix)'}}>Netflix</div>
<div style={{backgroundColor: 'var(--color-google)'}}>Google</div>
<div style={{backgroundColor: 'var(--color-microsoft)'}}>Microsoft</div>
```

#### Badge System
```jsx
// Using CSS variables for badges
<span style={{
  color: 'var(--badge-purple)',
  backgroundColor: 'var(--badge-purple-bg)'
}} className="px-3 py-1 rounded-full text-sm font-medium">
  Purple Badge
</span>
```

#### Typography
```jsx
// Typography classes work automatically
<h1>Heading 1 (24px, medium weight)</h1>
<h2>Heading 2 (20px, medium weight)</h2>
<p>Body text (16px, normal weight)</p>
```

#### Form Elements
```jsx
<input 
  type="text" 
  className="bg-input-background border border-input focus:ring-2 focus:ring-ring"
/>
```

### Available Design Tokens

#### Color Tokens (Tailwind Classes)
- `bg-background` / `text-foreground` - Main background/text
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-secondary` / `text-secondary-foreground` - Secondary actions
- `bg-card` / `text-card-foreground` - Card backgrounds
- `bg-muted` / `text-muted-foreground` - Muted content
- `bg-accent` / `text-accent-foreground` - Accent elements
- `bg-destructive` / `text-destructive-foreground` - Error states
- `border-border` - Standard borders
- `bg-input` / `bg-input-background` - Form inputs

#### Company Colors (CSS Variables)
- `--color-netflix` - #E50914
- `--color-microsoft` - #00A4EF
- `--color-google` - #4285F4
- `--color-reddit` - #FF4500
- `--color-spotify` - #1DB954
- `--color-meta` - #0084FF

#### Badge Colors (CSS Variables)
- `--badge-purple` / `--badge-purple-bg`
- `--badge-green` / `--badge-green-bg`
- `--badge-orange` / `--badge-orange-bg`
- `--badge-pink` / `--badge-pink-bg`
- `--badge-teal` / `--badge-teal-bg`
- `--badge-blue` / `--badge-blue-bg`

#### Typography Scale
- `text-xs` (12px)
- `text-sm` (14px)
- `text-base` (16px)
- `text-lg` (18px)
- `text-xl` (20px)
- `text-2xl` (24px)
- `text-3xl` (30px)
- `text-4xl` (36px)
- `text-5xl` (48px)

#### Spacing Scale
- `--spacing-1` through `--spacing-24` (0.25rem to 6rem)

## Demo

Visit `/design-system` in your app to see all design tokens in action with interactive examples.

## Dark Mode Implementation

The design system automatically:
1. Detects system color scheme preference
2. Remembers user's manual theme selection
3. Applies appropriate CSS variables for light/dark themes
4. Provides smooth transitions between themes

## Notes

- The lint warnings for `@custom-variant`, `@theme`, and `@apply` are expected with Tailwind CSS v4 and will work correctly at runtime
- All design tokens are reactive to theme changes
- The system is fully compatible with your existing Tailwind setup
