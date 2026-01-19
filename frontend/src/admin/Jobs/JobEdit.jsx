import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EditJobForm } from './EditJobForm';
import { apiGet } from '../../services/api';
import { parseDescriptionToSections } from '../../utils/jobDescriptionParser';

export default function JobEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/jobs/${id}`);
        const jobData = response.job || response;
        console.log('Edit job data:', jobData);
        
        // Parse description into sections if not already structured
        if (jobData.description && !jobData.description_sections) {
          jobData.description_sections = parseDescriptionToSections(jobData.description);
          console.log('Parsed description sections:', jobData.description_sections);
        }
        
        setJob(jobData);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job...</p>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-foreground mb-2">Job Not Found</h2>
        <p className="text-muted-foreground">The job you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return <EditJobForm job={job} onCancel={() => navigate(`/admin/jobs/${job.job_id}`)} />;
}
