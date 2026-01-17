import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Download, Trash2, Edit, Eye, BarChart, Home } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import { mockResources } from '../../services/Admin/admin-analytics';

export default function ResourcesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.type?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const categoryColors = {
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    teal: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
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
            placeholder="All Types"
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'pdf', label: 'PDF' },
              { value: 'doc', label: 'Document' },
              { value: 'template', label: 'Template' }
            ]}
            className="w-full md:w-[180px]"
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
                <th className="text-left px-6 py-4 text-sm text-foreground">File Size</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Downloads</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Uploaded</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResources.map(resource => (
                <tr key={resource.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{resource.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs border ${categoryColors[resource.categoryVariant] || categoryColors.purple}`}>
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{resource.fileSize}</td>
                  <td className="px-6 py-4 text-muted-foreground">{resource.downloads?.toLocaleString() || resource.downloads}</td>
                  <td className="px-6 py-4 text-muted-foreground">{resource.uploadedDate || resource.posted}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/resources/${resource.id}`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View details"
                      >
                        <BarChart className="w-4 h-4 text-foreground" />
                      </Link>
                      <Link
                        to={`/admin/resources/${resource.id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit resource"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </Link>
                      <button
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-foreground" />
                      </button>
                      <button
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
    </div>
  );
}
