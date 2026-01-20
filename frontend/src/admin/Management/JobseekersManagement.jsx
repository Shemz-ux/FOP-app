import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BarChart, Download, X, User, GraduationCap, MapPin, Eye, Home, CheckCircle, XCircle } from 'lucide-react';
import { ProfileView } from '../Components/ProfileView';
import AdminSelect from '../Components/AdminSelect';
import { apiGet } from '../../services/api';

export default function JobseekersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterEducation, setFilterEducation] = useState('all');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterFreeMeal, setFilterFreeMeal] = useState(false);
  const [filterFirstGen, setFilterFirstGen] = useState(false);
  const [selectedJobseekerId, setSelectedJobseekerId] = useState(null);
  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/jobseekers');
        setJobseekers(data.jobseekers || []);
      } catch (error) {
        console.error('Error fetching jobseekers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobseekers();
  }, []);

  const filteredJobseekers = jobseekers.filter(jobseeker => {
    const fullName = `${jobseeker.first_name || ''} ${jobseeker.last_name || ''}`.trim();
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (jobseeker.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (jobseeker.institution_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filterGender === 'all' || jobseeker.gender === filterGender;
    const matchesEducation = filterEducation === 'all' || jobseeker.education_level === filterEducation;
    const matchesUniversity = filterUniversity === 'all' || jobseeker.institution_name === filterUniversity;
    const matchesFreeMeal = !filterFreeMeal || jobseeker.school_meal_eligible === true;
    const matchesFirstGen = !filterFirstGen || jobseeker.first_gen_to_go_uni === true;
    
    return matchesSearch && matchesGender && matchesEducation && matchesUniversity && matchesFreeMeal && matchesFirstGen;
  });

  const universities = [...new Set(jobseekers.map(j => j.institution_name).filter(Boolean))];
  const years = [...new Set(jobseekers.map(j => j.uni_year).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobseekers...</p>
        </div>
      </div>
    );
  }

  if (selectedJobseekerId) {
    const jobseeker = jobseekers.find(j => j.jobseeker_id === selectedJobseekerId);
    // Transform jobseeker data to match profile format
    // Combine subject fields into a single string
    const subjects = [jobseeker?.subject_one, jobseeker?.subject_two, jobseeker?.subject_three, jobseeker?.subject_four]
      .filter(Boolean)
      .join(', ');
    
    const profile = jobseeker ? {
      jobseeker_id: jobseeker.jobseeker_id,
      name: `${jobseeker.first_name || ''} ${jobseeker.last_name || ''}`.trim(),
      email: jobseeker.email,
      phone: jobseeker.phone_number || 'N/A',
      linkedIn: jobseeker.linkedIn || 'N/A',
      university: jobseeker.institution_name,
      course: jobseeker.area_of_study,
      year: jobseeker.uni_year,
      education_level: jobseeker.education_level || 'undergraduate',
      degree_type: jobseeker.degree_type || 'bsc',
      area_of_study: jobseeker.area_of_study,
      subjects: subjects || null,
      role_interest_option_one: jobseeker.role_interest_option_one,
      role_interest_option_two: jobseeker.role_interest_option_two,
      society: jobseeker.society,
      graduationDate: jobseeker.graduationDate || 'N/A',
      cvUrl: jobseeker.cvUrl
    } : null;
    
    return <ProfileView profile={profile} onClose={() => setSelectedJobseekerId(null)} type="jobseeker" />;
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
            <span className="text-foreground">Jobseekers</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2 text-foreground">Jobseeker Management</h1>
              <p className="text-muted-foreground">View and manage all registered jobseekers</p>
            </div>
            {/* <button
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button> */}
          </div>

          {/* Search and Filters */}
          <div className="bg-card border border-border rounded-xl p-4">
        <div className="space-y-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filter by:</span>
            </div>
            {(filterGender !== 'all' || filterEducation !== 'all' || filterUniversity !== 'all' || filterFreeMeal || filterFirstGen || searchTerm) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterGender('all');
                  setFilterEducation('all');
                  setFilterUniversity('all');
                  setFilterFreeMeal(false);
                  setFilterFirstGen(false);
                }}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(filterGender !== 'all' || filterEducation !== 'all' || filterUniversity !== 'all' || filterFreeMeal || filterFirstGen || searchTerm) && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                  <Search className="w-3 h-3 text-primary" />
                  <span className="text-foreground">Search: <span className="font-medium">{searchTerm}</span></span>
                  <button onClick={() => setSearchTerm('')} className="text-primary hover:text-primary/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filterGender !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
                  <User className="w-3 h-3 text-blue-500" />
                  <span className="text-foreground">Gender: <span className="font-medium">{filterGender === 'male' ? 'Male' : filterGender === 'female' ? 'Female' : filterGender === 'non_binary' ? 'Non-Binary' : filterGender === 'prefer_not_to_say' ? 'Prefer Not to Say' : 'Other'}</span></span>
                  <button onClick={() => setFilterGender('all')} className="text-blue-500 hover:text-blue-500/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filterEducation !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm">
                  <GraduationCap className="w-3 h-3 text-purple-500" />
                  <span className="text-foreground">Education: <span className="font-medium">{filterEducation === 'gcse' ? 'GCSE' : filterEducation === 'a_level' ? 'A-Level' : filterEducation === 'btec' ? 'BTEC' : filterEducation === 'undergraduate' ? 'Undergraduate' : filterEducation === 'postgraduate' ? 'Postgraduate' : filterEducation === 'phd' ? 'PhD' : 'Other'}</span></span>
                  <button onClick={() => setFilterEducation('all')} className="text-purple-500 hover:text-purple-500/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filterUniversity !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-lg text-sm">
                  <MapPin className="w-3 h-3 text-teal-500" />
                  <span className="text-foreground">Institution: <span className="font-medium">{filterUniversity}</span></span>
                  <button onClick={() => setFilterUniversity('all')} className="text-teal-500 hover:text-teal-500/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filterFreeMeal && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-sm">
                  <span className="text-foreground font-medium">Free Meal Eligible</span>
                  <button onClick={() => setFilterFreeMeal(false)} className="text-green-500 hover:text-green-500/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filterFirstGen && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm">
                  <span className="text-foreground font-medium">First Generation</span>
                  <button onClick={() => setFilterFirstGen(false)} className="text-orange-500 hover:text-orange-500/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2 text-foreground">Gender</label>
              <AdminSelect
                value={filterGender}
                onValueChange={setFilterGender}
                placeholder="All Genders"
                options={[
                  { value: 'all', label: 'All Genders' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'non_binary', label: 'Non-Binary' },
                  { value: 'prefer_not_to_say', label: 'Prefer Not to Say' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">Education Level</label>
              <AdminSelect
                value={filterEducation}
                onValueChange={setFilterEducation}
                placeholder="All Levels"
                options={[
                  { value: 'all', label: 'All Levels' },
                  { value: 'gcse', label: 'GCSE' },
                  { value: 'a_level', label: 'A-Level' },
                  { value: 'btec', label: 'BTEC' },
                  { value: 'undergraduate', label: 'Undergraduate' },
                  { value: 'postgraduate', label: 'Postgraduate' },
                  { value: 'phd', label: 'PhD' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            </div>

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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-foreground">Special Filters</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilterFreeMeal(!filterFreeMeal)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    filterFreeMeal 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  Free Meal Eligible
                </button>
                <button 
                  onClick={() => setFilterFirstGen(!filterFirstGen)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    filterFirstGen 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  First Generation
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Jobseekers</p>
              <p className="text-2xl text-foreground">{jobseekers.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Filtered Results</p>
              <p className="text-2xl text-foreground">{filteredJobseekers.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Institutions</p>
              <p className="text-2xl text-foreground">{universities.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Free Meal Eligible</p>
              <p className="text-2xl text-foreground">
                {jobseekers.filter(j => j.school_meal_eligible === true).length}
              </p>
            </div>
          </div>

          {/* Jobseekers Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Name</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Email</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Institution</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Free School Meal</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">First Gen</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobseekers.map(jobseeker => (
                    <tr key={jobseeker.jobseeker_id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-foreground">{`${jobseeker.first_name || ''} ${jobseeker.last_name || ''}`.trim()}</td>
                      <td className="px-6 py-4 text-muted-foreground">{jobseeker.email}</td>
                      <td className="px-6 py-4 text-muted-foreground">{jobseeker.institution_name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {jobseeker.school_meal_eligible ? (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 w-fit">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-500">Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 w-fit">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-500">No</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {jobseeker.first_gen_to_go_uni ? (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 w-fit">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-500">Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 w-fit">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-500">No</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedJobseekerId(jobseeker.jobseeker_id)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="View profile"
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
