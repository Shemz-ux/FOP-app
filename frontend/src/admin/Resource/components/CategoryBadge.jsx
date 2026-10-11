import { getResourceCategory, DEFAULT_CATEGORY_BADGE_CLASS } from '../resourceOptions';

export default function CategoryBadge({ category, className = 'px-3 py-1' }) {
  const badgeClass = getResourceCategory(category)?.badgeClass || DEFAULT_CATEGORY_BADGE_CLASS;

  return (
    <span className={`rounded-lg text-xs border ${className} ${badgeClass}`}>
      {category}
    </span>
  );
}
