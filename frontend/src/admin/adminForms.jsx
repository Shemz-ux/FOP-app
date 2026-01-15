import React from 'react';
import { X, Upload } from 'lucide-react';

// interface CreateJobFormProps {
//   onCancel: () => void;
// }

export function CreateJobForm({ onCancel }) {
  const [formData, setFormData] = React.useState({
    title: '',
    company: '',
    description: '',
    industry: '',
    location: '',
    job_level: '',
    role_type: '',
    work_mode: '',
    contact_email: '',
    job_link: '',
    salary: '',
    deadline: '',
    is_active: true,
  });
  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Create Job:', formData);
    console.log('Company Logo:', logoFile);
    onCancel();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Create New Job Posting</h1>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-left">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="job-title" className="block text-sm mb-2 text-foreground">
                Job Title *
              </label>
              <input
                id="job-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm mb-2 text-foreground">
                Company *
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm mb-2 text-foreground">
                Industry *
              </label>
              <input
                id="industry"
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Technology, Finance, Healthcare"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm mb-2 text-foreground">
                Location *
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. London, Manchester"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
{/* TODO: might need a drop down for industry*/}
            <div>
              <label htmlFor="job-level" className="block text-sm mb-2 text-foreground">
                Job Level *
              </label>
              <select
                id="job-level"
                value={formData.job_level}
                onChange={(e) => setFormData({ ...formData, job_level: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select level</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div>
              <label htmlFor="role-type" className="block text-sm mb-2 text-foreground">
                Role Type *
              </label>
              <select
                id="role-type"
                value={formData.role_type}
                onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label htmlFor="work-mode" className="block text-sm mb-2 text-foreground">
                Work Mode *
              </label>
              <select
                id="work-mode"
                value={formData.work_mode}
                onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select mode</option>
                <option value="Remote">Remote</option>
                <option value="In-person">In-person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm mb-2 text-foreground">
                Contact Email *
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="hr@company.com"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="job-link" className="block text-sm mb-2 text-foreground">
                Job Link
              </label>
              <input
                id="job-link"
                type="url"
                value={formData.job_link}
                onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                placeholder="https://company.com/jobs/123"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm mb-2 text-foreground">
                Salary Range
              </label>
              <input
                id="salary"
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g. £40,000 - £60,000"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm mb-2 text-foreground">
                Application Deadline
              </label>
              <input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                Company Logo
              </label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                )}
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {logoFile ? logoFile.name : 'Upload company logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm mb-2 text-foreground">
                Job Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground">Set job posting as active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90"
            >
              Create Job Posting
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-border rounded-xl hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// interface CreateEventFormProps {
//   onCancel: () => void;
// }

export function CreateEventForm({ onCancel }) {
  const [formData, setFormData] = React.useState({
    title: '',
    company: '',
    description: '',
    industry: '',
    location: '',
    event_link: '',
    contact_email: '',
    event_date: '',
    event_time: '',
    event_type: 'in-person',
    is_active: true,
  });
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Create Event:', formData);
    console.log('Event Image:', imageFile);
    onCancel();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Create New Event</h1>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="event-title" className="block text-sm mb-2 text-foreground">
                Event Title *
              </label>
              <input
                id="event-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm mb-2 text-foreground">
                Company/Organisation *
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm mb-2 text-foreground">
                Industry *
              </label>
              <input
                id="industry"
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="event-type" className="block text-sm mb-2 text-foreground">
                Event Type *
              </label>
              <select
                id="event-type"
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="event-location" className="block text-sm mb-2 text-foreground">
                Location *
              </label>
              <input
                id="event-location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={formData.event_type === 'virtual' ? 'Online/Virtual' : 'Physical address'}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="event-date" className="block text-sm mb-2 text-foreground">
                Event Date *
              </label>
              <input
                id="event-date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="event-time" className="block text-sm mb-2 text-foreground">
                Event Time *
              </label>
              <input
                id="event-time"
                type="time"
                value={formData.event_time}
                onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm mb-2 text-foreground">
                Contact Email *
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@example.com"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="event-link" className="block text-sm mb-2 text-foreground">
                Event Link
              </label>
              <input
                id="event-link"
                type="url"
                value={formData.event_link}
                onChange={(e) => setFormData({ ...formData, event_link: e.target.value })}
                placeholder="https://example.com/event"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                Event Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                )}
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {imageFile ? imageFile.name : 'Upload event image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="event-description" className="block text-sm mb-2 text-foreground">
                Event Description *
              </label>
              <textarea
                id="event-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground">Set event as active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-border rounded-xl hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// interface CreateResourceFormProps {
//   onCancel: () => void;
// }

export function CreateResourceForm({ onCancel }) {
  const [formData, setFormData] = React.useState({
    title: '',
    category: '',
    description: '',
    file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Create Resource:', formData);
    onCancel();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Upload New Resource</h1>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="resource-title" className="block text-sm mb-2 text-foreground">
              Resource Title *
            </label>
            <input
              id="resource-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="resource-category" className="block text-sm mb-2 text-foreground">
              Category *
            </label>
            <select
              id="resource-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select category</option>
              <option value="career-guides">Career Guides</option>
              <option value="cv-templates">CV Templates</option>
              <option value="interview-prep">Interview Prep</option>
              <option value="skill-development">Skill Development</option>
              <option value="industry-insights">Industry Insights</option>
              <option value="networking">Networking</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="resource-description" className="block text-sm mb-2 text-foreground">
              Description *
            </label>
            <textarea
              id="resource-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              Upload File *
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PDF, DOC, Video files up to 5MB</p>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, file });
                }}
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer"
              >
                Select File
              </label>
              {formData.file && (
                <p className="mt-4 text-sm text-foreground">Selected: {formData.file.name}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90"
            >
              Upload Resource
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-border rounded-xl hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Job Form
export function EditJobForm({ job, onCancel }) {
  const [formData, setFormData] = React.useState({
    title: job?.title || '',
    company: job?.company || '',
    description: job?.description || '',
    industry: job?.industry || '',
    location: job?.location || '',
    job_level: job?.job_level || '',
    role_type: job?.role_type || '',
    work_mode: job?.work_mode || '',
    contact_email: job?.contact_email || '',
    job_link: job?.job_link || '',
    salary: job?.salary || '',
    deadline: job?.deadline || '',
    is_active: job?.status === 'active',
  });
  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Update Job:', { id: job.id, ...formData });
    console.log('Company Logo:', logoFile);
    onCancel();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Edit Job Posting</h1>
        <button onClick={onCancel} className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 text-left">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-job-title" className="block text-sm mb-2 text-foreground">Job Title *</label>
              <input id="edit-job-title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-company" className="block text-sm mb-2 text-foreground">Company *</label>
              <input id="edit-company" type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-industry" className="block text-sm mb-2 text-foreground">Industry *</label>
              <input id="edit-industry" type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} placeholder="e.g. Technology, Finance, Healthcare" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-location" className="block text-sm mb-2 text-foreground">Location *</label>
              <input id="edit-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. London, Manchester" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-job-level" className="block text-sm mb-2 text-foreground">Job Level *</label>
              <select id="edit-job-level" value={formData.job_level} onChange={(e) => setFormData({ ...formData, job_level: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required>
                <option value="">Select level</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-role-type" className="block text-sm mb-2 text-foreground">Role Type *</label>
              <select id="edit-role-type" value={formData.role_type} onChange={(e) => setFormData({ ...formData, role_type: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required>
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-work-mode" className="block text-sm mb-2 text-foreground">Work Mode *</label>
              <select id="edit-work-mode" value={formData.work_mode} onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required>
                <option value="">Select mode</option>
                <option value="Remote">Remote</option>
                <option value="In-person">In-person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-contact-email" className="block text-sm mb-2 text-foreground">Contact Email *</label>
              <input id="edit-contact-email" type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} placeholder="hr@company.com" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-job-link" className="block text-sm mb-2 text-foreground">Job Link</label>
              <input id="edit-job-link" type="url" value={formData.job_link} onChange={(e) => setFormData({ ...formData, job_link: e.target.value })} placeholder="https://company.com/jobs/123" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="edit-salary" className="block text-sm mb-2 text-foreground">Salary Range</label>
              <input id="edit-salary" type="text" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="e.g. £40,000 - £60,000" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="edit-deadline" className="block text-sm mb-2 text-foreground">Application Deadline</label>
              <input id="edit-deadline" type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground">Company Logo</label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-cover rounded-lg border border-border" />
                )}
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{logoFile ? logoFile.name : 'Upload new logo'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="edit-description" className="block text-sm mb-2 text-foreground">Job Description *</label>
              <textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={8} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary" />
                <span className="text-sm text-foreground">Set job posting as active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90">Update Job Posting</button>
            <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-xl hover:bg-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Event Form
export function EditEventForm({ event, onCancel }) {
  const [formData, setFormData] = React.useState({
    title: event?.title || '',
    company: event?.organizer || '',
    description: event?.description || '',
    industry: event?.industry || '',
    location: event?.location || '',
    event_link: event?.event_link || '',
    contact_email: event?.contact_email || '',
    event_date: event?.date || '',
    event_time: event?.event_time || '',
    event_type: event?.event_type || 'in-person',
    is_active: event?.status === 'upcoming',
  });
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Update Event:', { id: event.id, ...formData });
    console.log('Event Image:', imageFile);
    onCancel();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Edit Event</h1>
        <button onClick={onCancel} className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="edit-event-title" className="block text-sm mb-2 text-foreground">Event Title *</label>
              <input id="edit-event-title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-event-company" className="block text-sm mb-2 text-foreground">Company/Organisation *</label>
              <input id="edit-event-company" type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-event-industry" className="block text-sm mb-2 text-foreground">Industry *</label>
              <input id="edit-event-industry" type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-event-type" className="block text-sm mb-2 text-foreground">Event Type *</label>
              <select id="edit-event-type" value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required>
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-event-location" className="block text-sm mb-2 text-foreground">Location *</label>
              <input id="edit-event-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder={formData.event_type === 'virtual' ? 'Online/Virtual' : 'Physical address'} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-event-date" className="block text-sm mb-2 text-foreground">Event Date *</label>
              <input id="edit-event-date" type="date" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-event-time" className="block text-sm mb-2 text-foreground">Event Time *</label>
              <input id="edit-event-time" type="time" value={formData.event_time} onChange={(e) => setFormData({ ...formData, event_time: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-contact-email" className="block text-sm mb-2 text-foreground">Contact Email *</label>
              <input id="edit-contact-email" type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} placeholder="contact@example.com" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="edit-event-link" className="block text-sm mb-2 text-foreground">Event Link</label>
              <input id="edit-event-link" type="url" value={formData.event_link} onChange={(e) => setFormData({ ...formData, event_link: e.target.value })} placeholder="https://example.com/event" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground">Event Image</label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Event preview" className="w-16 h-16 object-cover rounded-lg border border-border" />
                )}
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : 'Upload new image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="edit-event-description" className="block text-sm mb-2 text-foreground">Event Description *</label>
              <textarea id="edit-event-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary" />
                <span className="text-sm text-foreground">Set event as active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90">Update Event</button>
            <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-xl hover:bg-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Resource Form
export function EditResourceForm({ resource, onCancel }) {
  const [formData, setFormData] = React.useState({
    title: resource?.title || '',
    category: resource?.type || '',
    description: resource?.description || '',
    file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Update Resource:', { id: resource.id, ...formData });
    onCancel();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Edit Resource</h1>
        <button onClick={onCancel} className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="edit-resource-title" className="block text-sm mb-2 text-foreground">Resource Title *</label>
            <input id="edit-resource-title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label htmlFor="edit-resource-category" className="block text-sm mb-2 text-foreground">Category *</label>
            <select id="edit-resource-category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required>
              <option value="">Select category</option>
              <option value="career-guides">Career Guides</option>
              <option value="cv-templates">CV Templates</option>
              <option value="interview-prep">Interview Prep</option>
              <option value="skill-development">Skill Development</option>
              <option value="industry-insights">Industry Insights</option>
              <option value="networking">Networking</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="edit-resource-description" className="block text-sm mb-2 text-foreground">Description *</label>
            <textarea id="edit-resource-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" required />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground">Replace File (Optional)</label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{formData.file ? formData.file.name : 'Upload new file'}</span>
              <input type="file" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} className="hidden" />
            </label>
            {formData.file && (
              <p className="mt-4 text-sm text-foreground">Selected: {formData.file.name}</p>
            )}
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90">Update Resource</button>
            <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-xl hover:bg-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
