export default function VideoLinkField({ value, onChange, currentLink, copy }) {
  return (
    <div>
      {currentLink && (
        <div className="mb-4 p-4 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">{copy.currentLabel}</p>
          <a href={currentLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
            {currentLink}
          </a>
        </div>
      )}
      <label htmlFor="video-link" className="block text-sm mb-2 text-foreground">
        {copy.label} <span className="text-red-500">*</span>
      </label>
      <input
        id="video-link"
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={copy.placeholder}
        className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <p className="text-xs text-muted-foreground mt-2">
        {copy.helper}
      </p>
    </div>
  );
}
