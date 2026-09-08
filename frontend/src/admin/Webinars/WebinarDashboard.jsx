import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Home } from "lucide-react";
import { testWebinars } from "../../pages/Webinars/webinars.copy";
import { webinarDashboardCopy } from "./webinarDashboard.copy";
import WebinarStats from "./components/WebinarStats";
import WebinarSearchFilter from "./components/WebinarSearchFilter";
import WebinarTable from "./components/WebinarTable";

export default function WebinarDashboard() {
  const [webinars, setWebinars] = useState(testWebinars);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter webinars based on search and status
  const filteredWebinars = useMemo(() => {
    return webinars.filter(webinar => {
      const query = searchQuery.toLowerCase();
      const matchSearch = !query || 
        webinar.title.toLowerCase().includes(query) ||
        webinar.category.toLowerCase().includes(query);
      
      const matchStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'published' && webinar.is_published) ||
        (statusFilter === 'draft' && !webinar.is_published);
      
      return matchSearch && matchStatus;
    });
  }, [webinars, searchQuery, statusFilter]);

  const handleToggleStatus = (id) => {
    setWebinars(prev => 
      prev.map(w => 
        w.webinar_id === id 
          ? { ...w, is_published: !w.is_published } 
          : w
      )
    );
  };

  const handleToggleFeatured = (id) => {
    setWebinars(prev => 
      prev.map(w => 
        w.webinar_id === id 
          ? { ...w, is_featured: !w.is_featured } 
          : w
      )
    );
  };

  const handleEdit = (webinar) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit webinar:', webinar);
  };

  const handleDelete = (id) => {
    setWebinars(prev => prev.filter(w => w.webinar_id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground">Webinars</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl mb-2 text-foreground">
                {webinarDashboardCopy.header.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {webinarDashboardCopy.header.subtitle}
              </p>
            </div>
            <Link
              to="/admin/webinars/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 whitespace-nowrap w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="sm:inline">{webinarDashboardCopy.header.createButton}</span>
            </Link>
          </div>

          {/* Summary stats */}
          <WebinarStats 
            webinars={webinars} 
            copy={webinarDashboardCopy.stats} 
          />

          {/* Search + filter */}
          <WebinarSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            copy={webinarDashboardCopy.search}
          />

          {/* Table */}
          <WebinarTable
            webinars={filteredWebinars}
            onToggleStatus={handleToggleStatus}
            onToggleFeatured={handleToggleFeatured}
            onEdit={handleEdit}
            onDelete={handleDelete}
            copy={{
              ...webinarDashboardCopy.table,
              deleteMessage: webinarDashboardCopy.deleteConfirm.message,
              deleteWarning: webinarDashboardCopy.deleteConfirm.warning,
              deleteConfirm: webinarDashboardCopy.deleteConfirm.confirmButton,
              deleteCancel: webinarDashboardCopy.deleteConfirm.cancelButton,
            }}
          />
        </div>
      </div>
    </div>
  );
}
