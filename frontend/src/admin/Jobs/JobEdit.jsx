import { useNavigate, useParams } from 'react-router-dom';
import { EditJobForm } from './EditJobForm';
import { mockJobs } from '../../services/Admin/admin-analytics';

export default function JobEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const job = mockJobs.find(j => j.id === parseInt(id));

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-foreground mb-2">Job Not Found</h2>
        <p className="text-muted-foreground">The job you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return <EditJobForm job={job} onCancel={() => navigate(`/admin/jobs/${id}`)} />;
}
