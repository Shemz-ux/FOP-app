import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BarChart, Download, X, User, GraduationCap, MapPin, Eye, Home } from 'lucide-react';
import { ProfileView } from '../Components/ProfileView';
import AdminSelect from '../Components/AdminSelect';
import { apiGet } from '../../services/api';

export default function StudentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterEducation, setFilterEducation] = useState('all');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterFreeMeal, setFilterFreeMeal] = useState(false);
  const [filterFirstGen, setFilterFirstGen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/jobseekers');
        setStudents(data.jobseekers || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.institution_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filterGender === 'all' || student.gender === filterGender;
    const matchesEducation = filterEducation === 'all' || student.uni_year === filterEducation;
    const matchesUniversity = filterUniversity === 'all' || (student.institution_name || '').includes(filterUniversity);
    const matchesFreeMeal = !filterFreeMeal || student.school_meal_eligible === true;
    const matchesFirstGen = !filterFirstGen || student.first_gen_to_go_uni === true;
    
    return matchesSearch && matchesGender && matchesEducation && matchesUniversity && matchesFreeMeal && matchesFirstGen;
  });

  const universities = [...new Set(students.map(s => s.institution_name).filter(Boolean))];
  const years = [...new Set(students.map(s => s.uni_year).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  if (selectedStudentId) {
    const student = students.find(s => s.jobseeker_id === selectedStudentId);
    // Transform student data to match profile format
    const profile = student ? {
      name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
      email: student.email,
      phone: student.phone_number || 'N/A',
      linkedIn: student.linkedIn || 'N/A',
      university: student.institution_name,
      course: student.area_of_study,
      year: student.uni_year,
      education_level: student.education_level || 'undergraduate',
      degree_type: student.degree_type || 'bsc',
      area_of_study: student.area_of_study,
      role_interest_option_one: student.role_interest_option_one,
      role_interest_option_two: student.role_interest_option_two,
      society: student.society,
      graduationDate: student.graduationDate || 'N/A',
      cvUrl: student.cvUrl
    } : null;
    
    return <ProfileView profile={profile} onClose={() => setSelectedStudentId(null)} type="student" />;
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
            <span className="text-foreground">Students</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2 text-foreground">Student Management</h1>
              <p className="text-muted-foreground">View and manage all registered students</p>
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
              placeholder="Search by name, email, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter by:</span>
          </div>

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
                  { value: 'a_level_or_btec', label: 'A-Level/BTEC' },
                  { value: 'undergraduate', label: 'Undergraduate' },
                  { value: 'postgraduate', label: 'Postgraduate' },
                  { value: 'phd', label: 'PhD' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            </div>

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
              <p className="text-sm text-muted-foreground mb-1">Total Students</p>
              <p className="text-2xl text-foreground">{students.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Filtered Results</p>
              <p className="text-2xl text-foreground">{filteredStudents.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Universities</p>
              <p className="text-2xl text-foreground">{universities.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Courses</p>
              <p className="text-2xl text-foreground">
                {[...new Set(students.map(s => s.area_of_study).filter(Boolean))].length}
              </p>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Name</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Email</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">University</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Year</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Course</th>
                    <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map(student => (
                    <tr key={student.jobseeker_id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-foreground">{`${student.first_name || ''} ${student.last_name || ''}`.trim()}</td>
                      <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                      <td className="px-6 py-4 text-muted-foreground">{student.institution_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{student.uni_year || 'N/A'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{student.area_of_study || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedStudentId(student.jobseeker_id)}
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
