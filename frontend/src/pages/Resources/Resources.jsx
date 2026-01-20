import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, File } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import ResourceCard from "../../components/ResourceCard/ResourceCard";
import Pagination from "../../components/Pagination/Pagination";
import JobBadge from "../../components/Ui/JobBadge";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorMessage from "../../components/Ui/ErrorMessage";
import EmptyState from "../../components/Ui/EmptyState";
import { resourcesService } from "../../services";
import { RESOURCE_CATEGORIES } from "../../utils/dropdownOptions";
import { useAuth } from "../../contexts/AuthContext";

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  File: File,
};

export default function Resources() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [categories, setCategories] = useState([]);
  const [popularResources, setPopularResources] = useState([]);
  const resourcesPerPage = 9;

  const handleSearch = (filters) => {
    setSearchQuery(filters.query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Fetch resources from API
  useEffect(() => {
    fetchResources();
  }, [currentPage, searchQuery, selectedCategory, sortBy]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: currentPage,
        limit: resourcesPerPage
      };

      if (searchQuery) filters.search = searchQuery;
      if (selectedCategory && selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }

      const sortMap = {
        'recent': { sort_by: 'created_at', sort_order: 'desc' },
        'relevant': { sort_by: 'download_count', sort_order: 'desc' },
        'title': { sort_by: 'title', sort_order: 'asc' }
      };
      
      const sortConfig = sortMap[sortBy] || sortMap['recent'];
      filters.sort_by = sortConfig.sort_by;
      filters.sort_order = sortConfig.sort_order;

      const response = await resourcesService.getResources(filters);
      console.log('Resources API response:', response);
      console.log('Pagination data:', response.pagination);
      setResources(response.resources || []);
      setTotalResources(response.pagination?.totalCount || response.total || 0);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const stats = await resourcesService.getResourceStats();
        const cats = [
          { id: 'all', label: 'All Resources', count: stats.total_resources || 0 }
        ];
        
        if (stats.by_category) {
          Object.entries(stats.by_category).forEach(([category, count]) => {
            cats.push({ id: category, label: category, count });
          });
        }
        
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([{ id: 'all', label: 'All Resources', count: 0 }]);
      }
    };
    loadCategories();
  }, []);

  // Fetch popular resources
  useEffect(() => {
    const loadPopular = async () => {
      try {
        const response = await resourcesService.getResources({ 
          limit: 3, 
          sort_by: 'download_count',
          sort_order: 'desc'
        });
        setPopularResources(response.resources || []);
      } catch (err) {
        console.error('Error loading popular resources:', err);
      }
    };
    loadPopular();
  }, []);

  const totalPages = Math.ceil(totalResources / resourcesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = async (resourceId) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    try {
      const downloadUrl = await resourcesService.downloadResource(resourceId);
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Error downloading resource:', err);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="text-4xl text-foreground text-left">
                Career Resources
              </h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8 text-left">
              Download free templates, guides, and tools to supercharge your job search
            </p>

            <SearchBar 
              queryPlaceholder="Resource name or topic" 
              showLocation={false}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Resources Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-foreground mb-1 text-left">
              All Resources
            </h2>
            <p className="text-muted-foreground text-sm text-left">
              {totalResources} resources available
            </p>
          </div>

          <SortDropdown
            value={sortBy}
            onValueChange={setSortBy}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`transition-all ${
              selectedCategory === 'all' ? '' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <JobBadge variant={selectedCategory === 'all' ? 'blue' : 'gray'}>
              All Resources
            </JobBadge>
          </button>
          {RESOURCE_CATEGORIES.filter(category => 
            categories.some(cat => cat.id === category.value && cat.count > 0)
          ).map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`transition-all ${
                selectedCategory === category.value ? '' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <JobBadge variant={selectedCategory === category.value ? category.variant : 'gray'}>
                {category.label}
              </JobBadge>
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchResources} />
        ) : resources.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No resources found"
            message="Try adjusting your search or category filter"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.resource_id}
                  resourceId={resource.resource_id}
                  title={resource.title}
                  description={resource.description}
                  category={resource.category}
                  fileSize={resource.file_size}
                  fileType={resource.file_type}
                  downloads={resource.download_count}
                  iconType={RESOURCE_CATEGORIES.find(c => c.value === resource.category)?.icon || 'FileText'}
                  categoryVariant={RESOURCE_CATEGORIES.find(c => c.value === resource.category)?.variant || 'gray'}
                  onDownload={() => handleDownload(resource.resource_id)}
                  createdAt={resource.created_at}
                  storageUrl={resource.storage_url}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Popular Downloads */}
        <div className="bg-secondary/30 rounded-2xl p-8 border border-border mt-8">
          <h3 className="text-foreground mb-6">
            Most Popular Downloads
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {popularResources.map((resource) => {
              const IconComponent = iconMap[resource.icon_type] || FileText;
              return (
                <div
                  key={resource.resource_id}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => navigate(`/resources/${resource.resource_id}`)}
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground text-sm mb-1">{resource.title}</h4>
                    <p className="text-muted-foreground text-xs">{resource.file_type} • {resource.file_size}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
