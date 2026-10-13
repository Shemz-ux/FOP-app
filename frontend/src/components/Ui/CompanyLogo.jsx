import React, { useState } from 'react';

// Used when a job has no brand colour, or has one the browser cannot read
const DEFAULT_COLOR = '#0D7DFF';

const SIX_DIGIT_HEX = /^#[0-9a-f]{6}$/i;

// company_color is null for plenty of jobs, so anything unusable falls back
const resolveColor = (value) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed === '' ? DEFAULT_COLOR : trimmed;
};

// Only a 6-digit hex can take an "dd" alpha suffix; anything else keeps one flat
// colour rather than producing CSS the browser drops, leaving an invisible tile
const buildGradient = (color) => {
  const end = SIX_DIGIT_HEX.test(color) ? `${color}dd` : color;
  return `linear-gradient(135deg, ${color} 0%, ${end} 100%)`;
};

// Size variants: tile size and the initial's type scale
const SIZE_CLASSES = {
  small: 'w-10 h-10 text-lg',
  default: 'w-12 h-12 text-xl',
  large: 'w-16 h-16 text-2xl',
  xlarge: 'w-20 h-20 text-3xl',
};

// Padding scales with the tile, so a logo keeps the same proportions at every
// size. It stays a sixth of the tile, which is what the logo cropper frames
// against, so an uploaded logo lands in the tile exactly as it was positioned.
const PADDING_CLASSES = {
  small: 'p-1.5',
  default: 'p-2',
  large: 'p-2.5',
  xlarge: 'p-3.5',
};

export default function CompanyLogo({ logo, color, companyName, size = 'default' }) {
  // The logo URL that failed to load, so a 404 falls back to the initial tile.
  // Storing the URL rather than a flag means a card recycled for another job
  // retries that job's own logo instead of inheriting the failure.
  const [failedSrc, setFailedSrc] = useState(null);

  const src = typeof logo === 'string' ? logo.trim() : '';

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.default;
  const paddingClass = PADDING_CLASSES[size] || PADDING_CLASSES.default;
  const tileClass = `${sizeClass} rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center`;

  const initial =
    companyName && typeof companyName === 'string' && companyName.trim().length > 0
      ? companyName.trim().charAt(0).toUpperCase()
      : 'C';

  if (src && src !== failedSrc) {
    return (
      <div className={`${tileClass} bg-white border border-border shadow-sm ${paddingClass}`}>
        <img
          src={src}
          alt={`${companyName || 'Company'} logo`}
          className="w-full h-full object-contain"
          loading="lazy"
          // Logo CDNs commonly reject requests that carry a referrer
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
        />
      </div>
    );
  }

  const brandColor = resolveColor(color);

  return (
    <div
      className={`${tileClass} text-white font-bold shadow-md`}
      style={{ background: buildGradient(brandColor) }}
      aria-label={`${companyName || 'Company'} logo`}
      role="img"
    >
      {initial}
    </div>
  );
}
