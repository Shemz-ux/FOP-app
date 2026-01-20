import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Download, Trash2, Edit, Eye, BarChart, Home, CheckCircle, XCircle, FileText } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import { apiGet, apiDelete } from '../../services/api';

export default function ResourcesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/resources?include_inactive=true');
        setResources(data.resources || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setToast({
          message: 'Failed to load resources',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  const handleDeleteClick = (resource) => {
    setResourceToDelete(resource);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return;
    
    try {
      await apiDelete(`/resources/${resourceToDelete.resource_id}`);
      // Remove resource from list
      setResources(resources.filter(resource => resource.resource_id !== resourceToDelete.resource_id));
      setToast({
        message: 'Resource deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to delete resource';
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
    const matchesSearch = (resource.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.category?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'CV': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Cover Letters': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Interviews': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Assessment Centres': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'LinkedIn': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
      'Graduate Schemes': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      'Networking': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'Career Planning': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      'Industry Insights': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'Internship Guides': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      'Personal Branding': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      'Salary & Benefits': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'Skills Development': 'bg-lime-500/10 text-lime-500 border-lime-500/20',
      'First Job': 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20',
      'Remote Work': 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    };
    return colors[category] || 'bg-purple-500/10 text-purple-500 border-purple-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
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
        <span className="text-foreground">Resources</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">Resource Management</h1>
          <p className="text-muted-foreground">Manage all resources and downloads</p>
        </div>
        <Link
          to="/admin/resources/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Upload Resource
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
              <p className="text-3xl mb-1 text-foreground text-foreground">{resources.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Resources</p>
              <p className="text-3xl mb-1 text-foreground text-green-500">{resources.filter(r => r.is_active).length}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10">
              <CheckCircle className="w-8 h-8 text-green-500" />
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
              placeholder="Search resources by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <AdminSelect
            value={filterType}
            onValueChange={setFilterType}
            placeholder="All Categories"
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'cv', label: 'CV' },
              { value: 'cover letters', label: 'Cover Letters' },
              { value: 'interviews', label: 'Interviews' },
              { value: 'assessment centres', label: 'Assessment Centres' },
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'graduate schemes', label: 'Graduate Schemes' },
              { value: 'networking', label: 'Networking' },
              { value: 'career planning', label: 'Career Planning' }
            ]}
            className="w-full md:w-[200px]"
          />
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Title</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Category</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Downloads</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Uploaded</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResources.map(resource => (
                <tr key={resource.resource_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{resource.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs border ${getCategoryColor(resource.category)}`}>
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                      resource.is_active 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {resource.is_active ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{resource.download_count?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(resource.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/resources/${resource.resource_id}`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View details"
                      >
                        <BarChart className="w-4 h-4 text-foreground" />
                      </Link>
                      <Link
                        to={`/admin/resources/${resource.resource_id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit resource"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(resource)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete resource"
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
      </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resourceToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
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
