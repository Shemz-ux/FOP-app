import React from 'react';
import { X, Upload } from 'lucide-react';

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
    is_active: job?.is_active !== undefined ? job.is_active : true,
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
                    {logoFile ? logoFile.name : 'Upload new logo'}
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
              Update Job Posting
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
