export default function Avatar({ src, alt, fallback, className = "" }) {
  return (
    <div className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground overflow-hidden ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className={`absolute inset-0 flex items-center justify-center text-sm font-medium ${src ? 'hidden' : 'flex'}`}
        style={{ display: src ? 'none' : 'flex' }}
      >
        {fallback}
      </div>
    </div>
  );
}
