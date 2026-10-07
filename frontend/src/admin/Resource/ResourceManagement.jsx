import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, Download, Trash2, Edit, BarChart, Home, CheckCircle, FileText } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import Pagination from '../../components/Ui/Pagination';
import { apiGet, apiDelete } from '../../services/api';
import CategoryBadge from './components/CategoryBadge';
import StatusBadge from './components/StatusBadge';
import LoadingState from './components/LoadingState';
import AudienceSwitch from './components/AudienceSwitch';
import AudienceBanner from './components/AudienceBanner';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_AUDIENCES,
  AUDIENCE_STYLES,
  DEFAULT_RESOURCE_AUDIENCE,
  getValidAudience
} from './resourceOptions';
import { resourceManagementCopy as copy } from './resource.copy';

const categoryFilterOptions = [
  { value: 'all', label: copy.search.filterAll },
  ...RESOURCE_CATEGORIES.map(category => ({ value: category.value, label: category.label }))
];

export default function ResourceManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  // The selected audience lives in the URL so it survives refresh and returning from other pages
  const audience = getValidAudience(searchParams.get('audience'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  // Resources for every audience are loaded once, so switching is instant
  const [resourcesByAudience, setResourcesByAudience] = useState({});
  const resources = resourcesByAudience[audience] || [];
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          RESOURCE_AUDIENCES.map(option =>
            apiGet(`/resources?include_inactive=true&limit=100&audience=${option.value}`)
          )
        );

        const loaded = {};
        RESOURCE_AUDIENCES.forEach((option, index) => {
          loaded[option.value] = results[index].resources || [];
        });
        setResourcesByAudience(loaded);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setToast({
          message: copy.toasts.loadError,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  const handleAudienceChange = (nextAudience) => {
    // Keep the URL clean for the default audience
    setSearchParams(
      nextAudience === DEFAULT_RESOURCE_AUDIENCE ? {} : { audience: nextAudience },
      { replace: true }
    );
  };

  const audienceCounts = {};
  RESOURCE_AUDIENCES.forEach(option => {
    audienceCounts[option.value] = (resourcesByAudience[option.value] || []).length;
  });

  const createPath = audience === DEFAULT_RESOURCE_AUDIENCE
    ? '/admin/resources/new'
    : `/admin/resources/new?audience=${audience}`;

  const handleDeleteClick = (resource) => {
    setResourceToDelete(resource);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return;
    
    try {
      await apiDelete(`/resources/${resourceToDelete.resource_id}`);
      // Remove resource from list
      setResourcesByAudience({
        ...resourcesByAudience,
        [audience]: resources.filter(resource => resource.resource_id !== resourceToDelete.resource_id)
      });
      setToast({
        message: copy.toasts.deleteSuccess,
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      const errorMessage = error.response?.data?.msg || error.message || copy.toasts.deleteError;
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setShowDeleteModal(false);
      setResourceToDelete(null);
    }
  };

  const filteredResources = resources.filter(resource => {
    // Search filter - only apply if searchTerm is not empty
    const matchesSearch = !searchTerm.trim() || 
                         (resource.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.category === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  // Stay on a valid page when the last resource on a page is deleted
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const indexOfLastResource = activePage * itemsPerPage;
  const indexOfFirstResource = indexOfLastResource - itemsPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, audience]);

  const audienceStyles = AUDIENCE_STYLES[audience];
  const hasActiveFilters =Boolean(searchTerm.trim()) || filterType !== 'all';
  const emptyMessage = hasActiveFilters ? copy.empty.noMatches : copy.empty.noResources[audience];

  if (loading) {
    return <LoadingState message={copy.loading} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          {copy.breadcrumb.dashboard}
        </Link>
        <span>/</span>
        <span className="text-foreground">{copy.breadcrumb.current}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-foreground">{copy.header.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{copy.header.subtitle}</p>
        </div>
        <Link
          to={createPath}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span className="sm:inline">{copy.header.createButton}</span>
        </Link>
      </div>

      {/* Audience Switch */}
      <AudienceSwitch
        value={audience}
        onChange={handleAudienceChange}
        counts={audienceCounts}
        label={copy.audienceSwitchLabel}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">{copy.stats.total}</p>
              <p className="text-2xl sm:text-3xl mb-1 text-foreground">{resources.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">{copy.stats.active}</p>
              <p className="text-2xl sm:text-3xl mb-1 text-green-500">{resources.filter(r => r.is_active).length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-green-500/10">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={copy.search.placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <AdminSelect
            value={filterType}
            onValueChange={setFilterType}
            placeholder={copy.search.filterAll}
            options={categoryFilterOptions}
            className="w-full md:w-[200px]"
          />
        </div>
      </div>

      {/* Audience Banner */}
      <AudienceBanner
        audience={audience}
        title={copy.audienceBanner[audience].title}
        description={copy.audienceBanner[audience].description}
      />

      {/* Resources Table - Desktop */}
      <div className={`hidden md:block bg-card border ${audienceStyles.border} rounded-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">{copy.table.headers.title}</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">{copy.table.headers.category}</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">{copy.table.headers.status}</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">{copy.table.headers.downloads}</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">{copy.table.headers.uploaded}</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">{copy.table.headers.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentResources.map(resource => (
                <tr key={resource.resource_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{resource.title}</td>
                  <td className="px-6 py-4">
                    <CategoryBadge category={resource.category} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge isActive={resource.is_active} labels={copy.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{resource.download_count?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(resource.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/resources/${resource.resource_id}`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title={copy.table.tooltips.view}
                      >
                        <BarChart className="w-4 h-4 text-foreground" />
                      </Link>
                      <Link
                        to={`/admin/resources/${resource.resource_id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title={copy.table.tooltips.edit}
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(resource)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title={copy.table.tooltips.delete}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentResources.length === 0 && (
          <p className="px-6 py-12 text-center text-muted-foreground">{emptyMessage}</p>
        )}

        {/* Pagination */}
        {filteredResources.length > 0 && (
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredResources.length}
          />
        )}
      </div>

      {/* Resources Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {currentResources.length === 0 && (
          <p className={`bg-card border ${audienceStyles.border} rounded-xl px-4 py-12 text-center text-muted-foreground`}>{emptyMessage}</p>
        )}
        {currentResources.map(resource => (
          <div key={resource.resource_id} className={`bg-card border ${audienceStyles.border} rounded-xl p-4 space-y-3`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-foreground mb-1 truncate">{resource.title}</h3>
                <CategoryBadge category={resource.category} className="inline-block px-2.5 py-1" />
              </div>
              <StatusBadge isActive={resource.is_active} labels={copy.status} compact />
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>{resource.download_count?.toLocaleString() || 0} {copy.mobile.downloads}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Link
                to={`/admin/resources/${resource.resource_id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <BarChart className="w-4 h-4" />
                {copy.mobile.view}
              </Link>
              <Link
                to={`/admin/resources/${resource.resource_id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                {copy.mobile.edit}
              </Link>
              <button
                onClick={() => handleDeleteClick(resource)}
                className="px-3 py-2 border border-red-500/20 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Pagination */}
        {filteredResources.length > 0 && (
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredResources.length}
          />
        )}
      </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={copy.deleteModal.title}
        message={copy.deleteModal.message(resourceToDelete?.title)}
        confirmText={copy.deleteModal.confirm}
        cancelText={copy.deleteModal.cancel}
      />

      {/* Toast Notification */}
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
