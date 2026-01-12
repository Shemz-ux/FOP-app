import React from "react";

export default function BrowseCategory({ 
  title = "Browse by Category", 
  categories = [],
  onCategoryClick,
  selectedCategory = null
}) {
  return (
    <div className="bg-secondary/30 rounded-2xl p-8 border border-border mb-9">
      <h3 className="text-foreground mb-6">
        {title}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.label;
          return (
            <button
              key={index}
              onClick={() => onCategoryClick?.(category)}
              className={`p-4 bg-card rounded-xl border transition-all text-left hover:shadow-md active:scale-95 ${
                isSelected 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`mb-1 text-left ${isSelected ? 'text-primary font-semibold' : 'text-foreground'}`}>
                {category.label}
              </div>
              <div className="text-muted-foreground text-sm text-left">
                {category.count} events
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
