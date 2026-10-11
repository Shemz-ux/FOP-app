import { RESOURCE_AUDIENCES, AUDIENCE_STYLES, AUDIENCE_ICONS, getValidAudience } from '../resourceOptions';

// Coloured badge naming who can see a resource
export default function AudienceBadge({ audience }) {
  const value = getValidAudience(audience);
  const styles = AUDIENCE_STYLES[value];
  const Icon = AUDIENCE_ICONS[value];
  const label = RESOURCE_AUDIENCES.find(option => option.value === value).label;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${styles.border} ${styles.banner}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
