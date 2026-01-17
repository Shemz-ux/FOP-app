import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BarChart, Users, Download, Eye, ArrowLeft, Home } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import { mockSocieties } from '../../services/Admin/admin-analytics';

export default function SocietiesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterMemberCount, setFilterMemberCount] = useState('all');
  const [selectedSocietyId, setSelectedSocietyId] = useState(null);

  const filteredSocieties = mockSocieties.filter(society => {
    const matchesSearch = 
      society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.contact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUniversity = filterUniversity === 'all' || society.university.includes(filterUniversity);
    
    let matchesMemberCount = true;
    if (filterMemberCount === 'small') matchesMemberCount = society.members < 100;
    else if (filterMemberCount === 'medium') matchesMemberCount = society.members >= 100 && society.members < 200;
    else if (filterMemberCount === 'large') matchesMemberCount = society.members >= 200;
    
    return matchesSearch && matchesUniversity && matchesMemberCount;
  });

  const universities = [...new Set(mockSocieties.map(s => s.university))];
  const totalMembers = mockSocieties.reduce((sum, s) => sum + s.members, 0);

  if (selectedSocietyId) {
    const society = mockSocieties.find(s => s.id === selectedSocietyId);
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
            <p className="text-2xl text-foreground">{society.members}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">University</p>
            <p className="text-xl text-foreground">{society.university}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Contact</p>
            <p className="text-lg text-foreground">{society.contact}</p>
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
              <p className="text-sm text-muted-foreground">University</p>
              <p className="text-foreground">{society.university}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Count</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{society.members} members</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Email</p>
              <p className="text-foreground">{society.contact}</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary">
                <Download className="w-4 h-4 inline mr-2" />
                Export Members
              </button>
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
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Download className="w-4 h-4" />
          Export Data
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
              <label className="block text-sm mb-2 text-foreground">University</label>
              <AdminSelect
                value={filterUniversity}
                onValueChange={setFilterUniversity}
                placeholder="All Universities"
                options={[
                  { value: 'all', label: 'All Universities' },
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Societies</p>
          <p className="text-2xl text-foreground">{mockSocieties.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Filtered Results</p>
          <p className="text-2xl text-foreground">{filteredSocieties.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Members</p>
          <p className="text-2xl text-foreground">{totalMembers}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Members</p>
          <p className="text-2xl text-foreground">
            {Math.round(totalMembers / mockSocieties.length)}
          </p>
        </div>
      </div>

      {/* Societies Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Society Name</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">University</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Members</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Contact</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSocieties.map(society => (
                <tr key={society.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{society.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{society.university}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{society.members}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{society.contact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSocietyId(society.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View analytics"
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
