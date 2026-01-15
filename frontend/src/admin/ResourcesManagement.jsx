import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Download, X } from 'lucide-react';
import { CreateResourceForm, EditResourceForm } from './adminForms';
import { mockResources } from '../services/Admin/admin-analytics';

export default function ResourcesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (showCreateForm) {
    return <CreateResourceForm onCancel={() => setShowCreateForm(false)} />;
  }

  if (editingResourceId) {
    const resourceToEdit = mockResources.find(r => r.id === editingResourceId);
    return <EditResourceForm resource={resourceToEdit} onCancel={() => setEditingResourceId(null)} />;
  }

  if (selectedResourceId) {
    const resource = mockResources.find(r => r.id === selectedResourceId);
    if (!resource) return null;

    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedResourceId(null)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-3xl mb-2 text-foreground">{resource.title}</h1>
              <p className="text-muted-foreground">{resource.type}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
            <p className="text-2xl text-foreground">{resource.downloads}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Type</p>
            <p className="text-2xl text-foreground">{resource.type}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Posted</p>
            <p className="text-2xl text-foreground">{resource.posted}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Resource Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="text-foreground">{resource.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500">
                {resource.type}
              </span>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                <Download className="w-4 h-4 inline mr-2" />
                Download Resource
              </button>
              <button
                onClick={() => {
                  setSelectedResourceId(null);
                  setEditingResourceId(resource.id);
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-secondary"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Resource
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">Resource Management</h1>
          <p className="text-muted-foreground">Manage all resources and downloads</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Upload Resource
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="document">Document</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
          <p className="text-xl text-foreground">{mockResources.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
          <p className="text-xl text-foreground">
            {mockResources.reduce((sum, r) => sum + r.downloads, 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Most Popular</p>
          <p className="text-xl text-foreground truncate">
            {mockResources.sort((a, b) => b.downloads - a.downloads)[0]?.title}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Downloads</p>
          <p className="text-xl text-foreground">
            {Math.round(mockResources.reduce((sum, r) => sum + r.downloads, 0) / mockResources.length)}
          </p>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Resource Title</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Type</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Downloads</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Posted</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResources.map(resource => (
                <tr key={resource.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{resource.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500">
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{resource.downloads}</td>
                  <td className="px-6 py-4 text-muted-foreground">{resource.posted}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedResourceId(resource.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View resource"
                      >
                        <Eye className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        onClick={() => setEditingResourceId(resource.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit resource"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
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
  );
}
