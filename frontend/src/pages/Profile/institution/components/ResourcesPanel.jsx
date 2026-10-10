import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import PaginatedGrid from '../../components/PaginatedGrid';
import CategoryChips from './CategoryChips';
import SocietyResourceCard from './SocietyResourceCard';
import { resourcesService } from '../../../../services';
import { RESOURCE_CATEGORIES } from '../../../../admin/Resource/resourceOptions';
import { ALL_RESOURCE_CATEGORIES } from '../institutionOptions';
import { institutionProfileCopy } from '../institutionProfile.copy';

const copy = institutionProfileCopy.resources;

// Chips for the categories that have at least one resource, in the order of RESOURCE_CATEGORIES
const getCategoryOptions = (resources) => {
  const used = new Set(resources.map(resource => resource.category));

  return [
    { value: ALL_RESOURCE_CATEGORIES, label: copy.allCategories },
    ...RESOURCE_CATEGORIES.filter(category => used.has(category.value)).map(({ value, label }) => ({ value, label })),
  ];
};

// Society-only resources, filtered by category, with download.
// societyResources is the value returned by useSocietyResources.
// onError receives a message to show.
export default function ResourcesPanel({ societyResources, onError }) {
  const [category, setCategory] = useState(ALL_RESOURCE_CATEGORIES);

  const { resources, total, loading } = societyResources;
  const categoryOptions = getCategoryOptions(resources);
  // Fall back to all resources if the chosen category no longer has any after a refresh
  const activeCategory = categoryOptions.some(option => option.value === category) ? category : ALL_RESOURCE_CATEGORIES;
  const visibleResources = activeCategory === ALL_RESOURCE_CATEGORIES
    ? resources
    : resources.filter(resource => resource.category === activeCategory);

  const handleDownload = async (resource) => {
    try {
      const downloadUrl = await resourcesService.downloadResource(resource.resource_id);
      window.open(downloadUrl, '_blank', 'noopener');
    } catch (error) {
      console.error('Error downloading resource:', error);
      onError?.(copy.downloadError);
    }
  };


  return (
    <section className="text-left">
      <h2 className="text-xl text-foreground mb-2">{copy.title}</h2>
      <p className="text-muted-foreground mb-1">{copy.description}</p>
      {/* Chips are only useful when there is more than one category to choose from */}
      <div className="my-6">
        {categoryOptions.length > 2 && (
          <CategoryChips options={categoryOptions} value={activeCategory} onChange={setCategory} label={copy.filterLabel} />
        )}
      </div>

      {/* The key resets the grid to page 1 when the category changes */}
      <PaginatedGrid
        key={activeCategory}
        items={visibleResources}
        loading={loading}
        empty={{ icon: BookOpen, ...copy.empty }}
        renderItem={(resource) => (
          <SocietyResourceCard key={resource.resource_id} resource={resource} onDownload={handleDownload} />
        )}
      />
    </section>
  );
}
