import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Home, Eye } from 'lucide-react';
import { ProfileView } from '../Components/ProfileView';
import { apiGet } from '../../services/api';

export default function SocietyDetail() {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    const fetchSocietyAndMembers = async () => {
      try {
        setLoading(true);
        const societyResponse = await apiGet(`/societies/${id}`);
        const societyData = societyResponse.society || societyResponse;
        setSociety(societyData);

        if (societyData?.name) {
          const membersResponse = await apiGet(`/admin/jobseekers/society/${encodeURIComponent(societyData.name)}`);
          setMembers(membersResponse.students || []);
        }
      } catch (error) {
        console.error('Error fetching society details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocietyAndMembers();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading society details...</p>
        </div>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Society not found</p>
          <Link to="/admin/societies" className="text-primary hover:underline">Back to Societies</Link>
        </div>
      </div>
    );
  }

  if (selectedMemberId) {
    const member = members.find(m => m.jobseeker_id === selectedMemberId);
    const subjects = [member?.subject_one, member?.subject_two, member?.subject_three, member?.subject_four]
      .filter(Boolean)
      .join(', ');

    const profile = member ? {
      jobseeker_id: member.jobseeker_id,
      name: `${member.first_name || ''} ${member.last_name || ''}`.trim(),
      email: member.email,
      phone: member.phone_number || null,
      linkedIn: member.linkedin || null,
      university: member.institution_name,
      course: member.area_of_study,
      year: member.uni_year,
      education_level: member.education_level || 'undergraduate',
      degree_type: member.degree_type || 'bsc',
      area_of_study: member.area_of_study,
      subjects: subjects || null,
      role_interest_option_one: member.role_interest_option_one,
      role_interest_option_two: member.role_interest_option_two,
      society: member.society,
      has_right_to_work_uk: member.has_right_to_work_uk,
      requires_sponsorship: member.requires_sponsorship,
      school_meal_eligible: member.school_meal_eligible,
      first_gen_to_go_uni: member.first_gen_to_go_uni,
      cvData: member.cv_storage_key ? {
        cv_file_name: member.cv_file_name,
        cv_file_size: member.cv_file_size,
        cv_storage_key: member.cv_storage_key,
        cv_storage_url: member.cv_storage_url,
        cv_uploaded_at: member.cv_uploaded_at
      } : null
    } : null;

    return <ProfileView profile={profile} onClose={() => setSelectedMemberId(null)} type="jobseeker" />;
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
            <Link to="/admin/societies" className="hover:text-foreground transition-colors">Societies</Link>
            <span>/</span>
            <span className="text-foreground">{society.name}</span>
          </div>

          <Link
            to="/admin/societies"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>

          <div>
            <h1 className="text-3xl mb-2 text-foreground">{society.name}</h1>
            <p className="text-muted-foreground">{society.university}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Members</p>
              <p className="text-2xl text-foreground">{members.length}</p>
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

          {/* Members Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl text-foreground">Members</h2>
              <span className="ml-auto text-sm text-muted-foreground">{members.length} student{members.length === 1 ? '' : 's'}</span>
            </div>
            {members.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No students have chosen this society yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm text-foreground">Name</th>
                      <th className="text-left px-6 py-4 text-sm text-foreground">Email</th>
                      <th className="text-left px-6 py-4 text-sm text-foreground">Institution</th>
                      <th className="text-left px-6 py-4 text-sm text-foreground">Joined</th>
                      <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.map(member => (
                      <tr key={member.jobseeker_id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4 text-foreground">{`${member.first_name || ''} ${member.last_name || ''}`.trim()}</td>
                        <td className="px-6 py-4 text-muted-foreground">{member.email || 'N/A'}</td>
                        <td className="px-6 py-4 text-muted-foreground">{member.institution_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {member.created_at ? new Date(member.created_at).toLocaleDateString('en-GB') : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedMemberId(member.jobseeker_id)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="View profile"
                          >
                            <Eye className="w-4 h-4 text-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
