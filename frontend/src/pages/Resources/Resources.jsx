import {useState} from "react";
import { FileText, BookOpen, File } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import ResourceCard from "../../components/ResourceCard/ResourceCard";
import Pagination from "../../components/Pagination/Pagination";
import { mockResources } from "../../services/Resources/resources";

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  File: File,
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 6;

  const handleSearch = (filters) => {
    setSearchQuery(filters.query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Filter resources by search query and category
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' ||
      resource.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      resource.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const startIndex = (currentPage - 1) * resourcesPerPage;
  const endIndex = startIndex + resourcesPerPage;
  const currentResources = filteredResources.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: "all", label: "All Resources", count: mockResources.length },
    { id: "resume", label: "Resume", count: 3 },
    { id: "interview", label: "Interview", count: 4 },
    { id: "career-tips", label: "Career Tips", count: 2 },
    { id: "portfolio", label: "Portfolio", count: 1 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="text-4xl text-foreground">
                Career Resources
              </h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8">
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
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-xl border transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {category.label}
              <span className="ml-2 opacity-70">
                ({category.count})
              </span>
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentResources.map((resource, index) => (
            <ResourceCard
              key={index}
              {...resource}
              onDownload={() =>
                console.log("Download:", resource.title)
              }
              onPreview={() =>
                console.log("Preview:", resource.title)
              }
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Popular Downloads */}
        <div className="bg-secondary/30 rounded-2xl p-8 border border-border mt-8">
          <h3 className="text-foreground mb-6">
            Most Popular Downloads
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockResources
              .slice()
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 3)
              .map((resource, index) => {
                const IconComponent = iconMap[resource.iconType] || FileText;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground mb-1 text-sm truncate text-left">
                        {resource.title}
                      </h4>
                      <p className="text-muted-foreground text-xs text-left">
                        {resource.downloads.toLocaleString()} downloads
                      </p>
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
