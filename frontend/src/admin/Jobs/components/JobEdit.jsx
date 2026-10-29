import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JobForm } from './JobForm';
import { apiGet, apiPatch } from '../../../services/api';
import { parseDescriptionToSections } from '../../../utils/jobDescriptionParser';

/**
 * Edit-mode configuration for JobForm: loads the job, owns persistence and navigation.
 * Replaces the former JobEdit + EditJobForm pair.
 */
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

        // The API stores one flat description string, so rebuild the editable sections.
        if (jobData.description && !jobData.description_sections) {
          jobData.description_sections = parseDescriptionToSections(jobData.description);
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

  // Rejections propagate to JobForm, which renders the error toast and keeps the entered
  // values, because we only navigate away on success.
  const handleSubmit = async (jobData) => {
    await apiPatch(`/jobs/${id}`, jobData);
    // JobForm shows the success toast; delay so it is visible before we navigate away.
    setTimeout(() => navigate(`/admin/jobs/${id}`), 2000);
  };

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

  return (
    <JobForm
      job={job}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/admin/jobs/${job.job_id}`)}
      isEdit={true}
    />
  );
}
