import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Home } from "lucide-react";
import { webinarDashboardCopy } from "./webinarDashboard.copy";
import WebinarStats from "./components/WebinarStats";
import WebinarSearchFilter from "./components/WebinarSearchFilter";
import WebinarTable from "./components/WebinarTable";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import Toast from "../../components/Ui/Toast";
import { 
  getAllWebinarsAdmin, 
  updateWebinar, 
  deleteWebinar,
  toggleFeatured
} from "../../services/Webinars/webinarsService";

export default function WebinarDashboard() {
  const [webinars, setWebinars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Fetch webinars on mount
  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const data = await getAllWebinarsAdmin({ limit: 100 });
      setWebinars(data.webinars || []);
    } catch (error) {
      console.error('Error fetching webinars:', error);
      setToast({
        message: 'Failed to load webinars. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleToggleStatus = async (id) => {
    try {
      const webinar = webinars.find(w => w.webinar_id === id);
      const updated = await updateWebinar(id, { is_published: !webinar.is_published });
      
      setWebinars(prev => 
        prev.map(w => w.webinar_id === id ? updated : w)
      );
      
      setToast({
        message: `Webinar ${updated.is_published ? 'published' : 'unpublished'} successfully`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      setToast({
        message: 'Failed to update webinar status',
        type: 'error'
      });
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const webinar = webinars.find(w => w.webinar_id === id);
      const updated = await toggleFeatured(id, !webinar.is_featured);
      
      setWebinars(prev => 
        prev.map(w => w.webinar_id === id ? updated : w)
      );
      
      setToast({
        message: `Webinar ${updated.is_featured ? 'featured' : 'unfeatured'} successfully`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error toggling featured:', error);
      setToast({
        message: 'Failed to update featured status',
        type: 'error'
      });
    }
  };

  const handleEdit = (webinar) => {
    // Navigation handled by Link in table
    console.log('Edit webinar:', webinar);
  };

  const handleDelete = async (id) => {
    try {
      await deleteWebinar(id);
      setWebinars(prev => prev.filter(w => w.webinar_id !== id));
      
      setToast({
        message: 'Webinar deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting webinar:', error);
      setToast({
        message: 'Failed to delete webinar',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
