import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BarChart, Users, Download, Eye, ArrowLeft, Home, X } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import { apiGet } from '../../services/api';

export default function SocietiesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterMemberCount, setFilterMemberCount] = useState('all');
  const [selectedSocietyId, setSelectedSocietyId] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/societies');
        setSocieties(data.societies || []);
      } catch (error) {
        console.error('Error fetching societies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSocieties();
  }, []);

  const filteredSocieties = societies.filter(society => {
    const matchesSearch = 
      (society.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (society.university || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (society.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUniversity = filterUniversity === 'all' || (society.university || '').includes(filterUniversity);
    
    let matchesMemberCount = true;
    const memberCount = society.member_count || 0;
    if (filterMemberCount === 'small') matchesMemberCount = memberCount < 100;
    else if (filterMemberCount === 'medium') matchesMemberCount = memberCount >= 100 && memberCount < 200;
    else if (filterMemberCount === 'large') matchesMemberCount = memberCount >= 200;
    
    return matchesSearch && matchesUniversity && matchesMemberCount;
  });

  const universities = [...new Set(societies.map(s => s.university).filter(Boolean))];
  const totalMembers = societies.reduce((sum, s) => sum + (s.member_count || 0), 0);

  const handleExportCSV = async () => {
    if (societies.length === 0) {
      return;
    }

    try {
      setIsExporting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/societies/export/csv`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'societies.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].trim();
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading societies...</p>
        </div>
      </div>
    );
  }

  if (selectedSocietyId) {
    const society = societies.find(s => s.society_id === selectedSocietyId);
    if (!society) return null;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6 text-left">
        <button
          onClick={() => setSelectedSocietyId(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div>
          <h1 className="text-3xl mb-2 text-foreground">{society.name}</h1>
          <p className="text-muted-foreground">{society.university}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Members</p>
            <p className="text-2xl text-foreground">{society.member_count || 0}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Institution</p>
            <p className="text-xl text-foreground">{society.university || 'N/A'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Contact</p>
            <p className="text-lg text-foreground">{society.email || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Society Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Society Name</p>
              <p className="text-foreground">{society.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Institution</p>
              <p className="text-foreground">{society.university || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-foreground">{society.description || 'No description provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Count</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{society.member_count || 0} members</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Email</p>
              <p className="text-foreground">{society.email || 'N/A'}</p>
            </div>
            <div className="flex gap-4">
              {/* <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary">
                <Download className="w-4 h-4 inline mr-2" />
                Export Members
              </button> */}
            </div>
          </div>
        </div>
          </div>
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
        <span className="text-foreground">Societies</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">Society Management</h1>
          <p className="text-muted-foreground">View and manage all registered societies</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={isExporting || societies.length === 0}
          className="group relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100 shadow-sm hover:shadow-md min-w-[44px]"
          title={isExporting ? 'Exporting...' : 'Export to CSV'}
        >
          <Download className={`w-4 h-4 flex-shrink-0 transition-transform ${isExporting ? 'animate-bounce' : 'group-hover:scale-110'}`} />
          <span className="hidden sm:inline font-medium">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="space-y-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by society name, university, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter by:</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-foreground">Institution</label>
              <AdminSelect
                value={filterUniversity}
                onValueChange={setFilterUniversity}
                placeholder="All Institutions"
                options={[
                  { value: 'all', label: 'All Institutions' },
                  ...universities.map(uni => ({ value: uni, label: uni }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">Member Count</label>
              <AdminSelect
                value={filterMemberCount}
                onValueChange={setFilterMemberCount}
                placeholder="All Sizes"
                options={[
                  { value: 'all', label: 'All Sizes' },
                  { value: 'small', label: 'Small (< 100)' },
                  { value: 'medium', label: 'Medium (100-199)' },
                  { value: 'large', label: 'Large (200+)' }
                ]}
              />
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterUniversity !== 'all' || filterMemberCount !== 'all') && (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchTerm && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                  <Search className="w-3 h-3 text-primary" />
                  <span className="text-foreground">Search: <span className="font-medium">{searchTerm}</span></span>
                  <button onClick={() => setSearchTerm('')} className="text-primary hover:text-primary/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filterUniversity !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-lg text-sm">
                  <Users className="w-3 h-3 text-teal-500" />
                  <span className="text-foreground">Institution: <span className="font-medium">{filterUniversity}</span></span>
                  <button onClick={() => setFilterUniversity('all')} className="text-teal-500 hover:text-teal-500/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filterMemberCount !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm">
                  <Users className="w-3 h-3 text-purple-500" />
                  <span className="text-foreground">Size: <span className="font-medium">{filterMemberCount === 'small' ? 'Small (< 100)' : filterMemberCount === 'medium' ? 'Medium (100-199)' : 'Large (200+)'}</span></span>
                  <button onClick={() => setFilterMemberCount('all')} className="text-purple-500 hover:text-purple-500/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-1">Total Societies</p>
        <p className="text-2xl text-foreground">{societies.length}</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-1">Filtered Results</p>
        <p className="text-2xl text-foreground">{filteredSocieties.length}</p>
      </div>
    </div>

    {/* Societies Table */}
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-foreground">Society Name</th>
              <th className="text-left px-6 py-4 text-sm text-foreground">Institution</th>
              <th className="text-left px-6 py-4 text-sm text-foreground">Members</th>
              <th className="text-left px-6 py-4 text-sm text-foreground">Contact</th>
              <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredSocieties.map(society => (
              <tr key={society.society_id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-foreground">{society.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{society.university || 'N/A'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{society.member_count || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{society.email || 'N/A'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSocietyId(society.society_id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-foreground" />
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
