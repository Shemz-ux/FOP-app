import JobCard from '../../../components/JobCard/JobCard';

// A job record from the API shown as a JobCard with a save button
// compact drops the card's fixed minimum height so it is only as tall as its content
export default function ProfileJobCard({ job, isFavorite, onFavoriteClick, compact = false }) {
  return (
    <JobCard
      jobId={job.job_id}
      jobTitle={job.title}
      company={job.company}
      companyLogo={job.company_logo}
      companyColor={job.company_color}
      location={job.location}
      description={job.description}
      postedTime={job.job_created_at || job.created_at}
      deadline={job.deadline}
      tags={job.tags || []}
      isFavorite={isFavorite}
      onFavoriteClick={() => onFavoriteClick(job.job_id)}
      showSaveButton={true}
      compact={compact}
    />
  );
}
