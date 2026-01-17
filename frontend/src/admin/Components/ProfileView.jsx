import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CVViewCard } from './CVViewCard';

export function ProfileView({ profile, onClose, type = 'applicant' }) {
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
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl mb-4 text-foreground">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground">{profile.phone || 'N/A'}</p>
                </div>
                {profile.linkedIn && profile.linkedIn !== 'N/A' && (
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a href={`https://${profile.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80">
                      {profile.linkedIn}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl mb-4 text-foreground">Academic Information</h2>
              <div className="space-y-3">
                {profile.education_level && (
                  <div>
                    <p className="text-sm text-muted-foreground">Education Level</p>
                    <p className="text-foreground capitalize">{profile.education_level}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">University</p>
                  <p className="text-foreground">{profile.university}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="text-foreground">{profile.year}</p>
                  </div>
                  {profile.degree_type && (
                    <div>
                      <p className="text-sm text-muted-foreground">Degree</p>
                      <p className="text-foreground uppercase">{profile.degree_type}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Area of Study</p>
                  <p className="text-foreground">{profile.course || profile.area_of_study}</p>
                </div>
                {profile.graduationDate && profile.graduationDate !== 'N/A' && (
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Graduation</p>
                    <p className="text-foreground">{profile.graduationDate}</p>
                  </div>
                )}
                {profile.society && (
                  <div>
                    <p className="text-sm text-muted-foreground">Society</p>
                    <p className="text-foreground">{profile.society}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info Grid - Status on Left, Career & CV on Right */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Status */}
            <div className="space-y-6">
              {/* Application/Registration Status */}
              {(type === 'applicant' || type === 'attendee') && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl mb-4 text-foreground">
                    {type === 'applicant' ? 'Application Status' : 'Registration Status'}
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {type === 'applicant' ? 'Applied Date' : 'Registered Date'}
                      </p>
                      <p className="text-foreground">{profile.appliedDate || profile.registeredDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs ${
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
            </div>

            {/* Right Column - Career Interests & CV */}
            <div className="space-y-6">
              {/* Career Interests */}
              {(profile.role_interest_option_one || profile.role_interest_option_two) && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl mb-4 text-foreground">Career Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.role_interest_option_one && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                        {profile.role_interest_option_one}
                      </span>
                    )}
                    {profile.role_interest_option_two && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                        {profile.role_interest_option_two}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* CV Section */}
              {profile.cvUrl && (
                <CVViewCard 
                  cvData={{
                    name: profile.cvUrl.split('/').pop().replace(/-/g, ' '),
                    size: '245 KB',
                    uploadedDate: type === 'applicant' ? profile.appliedDate : type === 'attendee' ? profile.registeredDate : 'January 2, 2026'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
