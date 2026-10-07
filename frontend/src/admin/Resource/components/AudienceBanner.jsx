import { AUDIENCE_STYLES, AUDIENCE_ICONS } from '../resourceOptions';

// Coloured strip that names the audience currently being viewed
export default function AudienceBanner({ audience, title, description }) {
  const styles = AUDIENCE_STYLES[audience];
  const Icon = AUDIENCE_ICONS[audience];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${styles.border} ${styles.banner}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground"> · {description}</span>
      </p>
    </div>
  );
}
