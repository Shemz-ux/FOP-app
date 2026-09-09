export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  // Add "All" option to the beginning
  const allCategories = ['All', ...categories.map(cat => cat.category)];

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {allCategories.map((category) => {
        const isActive = activeCategory === category;
        const categoryData = categories.find(cat => cat.category === category);
        const count = categoryData?.count;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
            }`}
          >
            {category}
            {count !== undefined && (
              <span className={`ml-1.5 ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
