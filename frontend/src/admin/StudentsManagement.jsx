import { useState } from 'react';
import { Search, Filter, Eye, Mail, Download, X, User, GraduationCap, MapPin } from 'lucide-react';
import { mockStudents } from '../services/Admin/admin-analytics';

export default function StudentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterEducation, setFilterEducation] = useState('all');
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filterGender === 'all' || student.gender === filterGender;
    const matchesEducation = filterEducation === 'all' || student.year === filterEducation;
    const matchesUniversity = filterUniversity === 'all' || student.university.includes(filterUniversity);
    
    return matchesSearch && matchesGender && matchesEducation && matchesUniversity;
  });

  const universities = [...new Set(mockStudents.map(s => s.university))];
  const years = [...new Set(mockStudents.map(s => s.year))];

  if (selectedStudentId) {
    const student = mockStudents.find(s => s.id === selectedStudentId);
    if (!student) return null;

    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedStudentId(null)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl mb-2 text-foreground">{student.name}</h1>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">University</p>
            <p className="text-lg text-foreground">{student.university}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Course</p>
            <p className="text-lg text-foreground">{student.course}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Year</p>
            <p className="text-lg text-foreground">{student.year}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Student Profile</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{student.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-foreground">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="text-foreground capitalize">{student.gender ? student.gender.replace('_', ' ') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Education Level</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{student.year}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">University</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{student.university}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Course</p>
                <p className="text-foreground">{student.course}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                <Mail className="w-4 h-4 inline mr-2" />
                Send Email
              </button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary">
                <Download className="w-4 h-4 inline mr-2" />
                Export Profile
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
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter by:</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2 text-foreground">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-Binary</option>
                <option value="prefer_not_to_say">Prefer Not to Say</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">Education Level</label>
              <select
                value={filterEducation}
                onChange={(e) => setFilterEducation(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Levels</option>
                <option value="a_level_or_btec">A-Level/BTEC</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">University</label>
              <select
                value={filterUniversity}
                onChange={(e) => setFilterUniversity(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Universities</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-foreground">Special Filters</label>
              <div className="flex gap-2">
                <button className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors">
                  Free Meal Eligible
                </button>
                <button className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors">
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
          <p className="text-2xl text-foreground">{mockStudents.length}</p>
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
            {[...new Set(mockStudents.map(s => s.course))].length}
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
                <tr key={student.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{student.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{student.university}</td>
                  <td className="px-6 py-4 text-muted-foreground">{student.year}</td>
                  <td className="px-6 py-4 text-muted-foreground">{student.course}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStudentId(student.id)}
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
  );
}
