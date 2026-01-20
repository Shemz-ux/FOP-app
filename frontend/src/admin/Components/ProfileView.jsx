import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Calendar } from 'lucide-react';
import { CVViewCard } from './CVViewCard';
import { apiGet } from '../../services/api';

export function ProfileView({ profile, onClose, type = 'applicant' }) {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch applied jobs and events for jobseekers
    if (type === 'jobseeker' && profile.jobseeker_id) {
      console.log('Fetching jobs/events for jobseeker:', profile.jobseeker_id);
      setLoading(true);
      Promise.all([
        apiGet(`/jobseekers/${profile.jobseeker_id}/applied-jobs`).catch((err) => {
          console.error('Error fetching applied jobs:', err);
          return { applied_jobs: [] };
        }),
        apiGet(`/jobseekers/${profile.jobseeker_id}/applied-events`).catch((err) => {
          console.error('Error fetching applied events:', err);
          return { applied_events: [] };
        })
      ]).then(([jobsData, eventsData]) => {
        console.log('Jobs data received:', jobsData);
        console.log('Events data received:', eventsData);
        setAppliedJobs(jobsData.applied_jobs || []);
        setAppliedEvents(eventsData.applied_events || []);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [type, profile.jobseeker_id]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div>
            <h1 className="text-3xl mb-2 text-foreground">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.course} at {profile.university}</p>
          </div>

          {/* Profile Details */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-foreground border-b border-border pb-2">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm text-foreground break-all">{profile.email}</p>
                </div>
                {profile.phone && profile.phone !== 'N/A' && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm text-foreground">{profile.phone}</p>
                  </div>
                )}
                {profile.linkedIn && profile.linkedIn !== 'N/A' && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">LinkedIn</p>
                    <a href={profile.linkedIn.startsWith('http') ? profile.linkedIn : `https://${profile.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                      {profile.linkedIn.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-foreground border-b border-border pb-2">Academic Information</h2>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                {profile.education_level && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Education Level</p>
                    <p className="text-sm text-foreground">
                      {profile.education_level === 'btec' ? 'BTEC' : 
                       profile.education_level === 'a_level' ? 'A-Level' :
                       profile.education_level === 'gcse' ? 'GCSE' :
                       profile.education_level === 'phd' ? 'PhD' :
                       profile.education_level.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </p>
                  </div>
                )}
                {profile.university && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Institution</p>
                    <p className="text-sm text-foreground">{profile.university}</p>
                  </div>
                )}
                {profile.year && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Year</p>
                    <p className="text-sm text-foreground">{profile.year}</p>
                  </div>
                )}
                {profile.degree_type && (profile.education_level === 'undergraduate' || profile.education_level === 'postgraduate' || profile.education_level === 'doctorate' || profile.education_level === 'phd') && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Degree</p>
                    <p className="text-sm text-foreground uppercase">{profile.degree_type}</p>
                  </div>
                )}
                
                {/* Show subjects for GCSE/A-Level/BTEC students */}
                {profile.subjects && ['gcse', 'a_level', 'btec'].includes(profile.education_level) && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Subjects</p>
                    <p className="text-sm text-foreground">{profile.subjects}</p>
                  </div>
                )}
                
                {/* Show Area of Study for undergraduate+ or when subjects is not available */}
                {(profile.course || profile.area_of_study) && (!['gcse', 'a_level', 'btec'].includes(profile.education_level) || !profile.subjects) && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Area of Study</p>
                    <p className="text-sm text-foreground">{profile.course || profile.area_of_study}</p>
                  </div>
                )}
                
                {profile.graduationDate && profile.graduationDate !== 'N/A' && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Expected Graduation</p>
                    <p className="text-sm text-foreground">{profile.graduationDate}</p>
                  </div>
                )}
                {profile.society && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Society</p>
                    <p className="text-sm text-foreground">{profile.society}</p>
                  </div>
                )}
                
                {/* Career Interests */}
                {(profile.role_interest_option_one || profile.role_interest_option_two) && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Career Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.role_interest_option_one && (
                        <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                          {profile.role_interest_option_one}
                        </span>
                      )}
                      {profile.role_interest_option_two && (
                        <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                          {profile.role_interest_option_two}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info Grid - Status & CV */}
          {((type === 'applicant' || type === 'attendee') || profile.cvUrl) && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Application/Registration Status */}
              {(type === 'applicant' || type === 'attendee') && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-4 text-foreground border-b border-border pb-2">
                    {type === 'applicant' ? 'Application Status' : 'Registration Status'}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        {type === 'applicant' ? 'Applied Date' : 'Registered Date'}
                      </p>
                      <p className="text-sm text-foreground">{profile.appliedDate || profile.registeredDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
                        profile.status === 'shortlisted' || profile.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-500'
                          : profile.status === 'reviewed' || profile.status === 'waitlist'
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {profile.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CV Section */}
              {profile.cvUrl && (
                <div className="shadow-sm">
                  <CVViewCard 
                    cvData={{
                      name: profile.cvUrl.split('/').pop().replace(/-/g, ' '),
                      size: '245 KB',
                      uploadedDate: type === 'applicant' ? profile.appliedDate : type === 'attendee' ? profile.registeredDate : 'January 2, 2026'
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Jobs Applied & Events Registered - Only for Jobseekers */}
          {type === 'jobseeker' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Jobs Applied */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Jobs Applied</h2>
                  <span className="ml-auto text-sm font-medium text-muted-foreground">({appliedJobs.length})</span>
                </div>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : appliedJobs.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {appliedJobs.map((job) => (
                      <div key={job.job_id} className="p-3 bg-secondary/50 rounded-lg border border-border">
                        <h3 className="text-sm font-medium text-foreground mb-1">{job.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{job.company}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{job.location}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(job.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No jobs applied yet</p>
                )}
              </div>

              {/* Events Registered */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Events Registered</h2>
                  <span className="ml-auto text-sm font-medium text-muted-foreground">({appliedEvents.length})</span>
                </div>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : appliedEvents.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {appliedEvents.map((event) => (
                      <div key={event.event_id} className="p-3 bg-secondary/50 rounded-lg border border-border">
                        <h3 className="text-sm font-medium text-foreground mb-1">{event.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{event.organiser}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{event.location}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No events registered yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
