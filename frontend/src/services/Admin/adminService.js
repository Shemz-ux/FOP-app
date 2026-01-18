import { apiGet, apiPost, apiPatch, apiDelete } from './api';

// ==================== ADMIN USERS ====================

// Get all admin users
export const getAdminUsers = async (adminToken) => {
  const data = await apiGet('/admin/users', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.admin_users;
};

// Get single admin user by ID
export const getAdminUserById = async (adminId, adminToken) => {
  const data = await apiGet(`/admin/users/${adminId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.admin_user;
};

// Create new admin user
export const createAdminUser = async (adminData, adminToken) => {
  const data = await apiPost('/admin/users', adminData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.newAdminUser;
};

// Update admin user
export const updateAdminUser = async (adminId, adminData, adminToken) => {
  const data = await apiPatch(`/admin/users/${adminId}`, adminData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.admin_user;
};

// Delete admin user
export const deleteAdminUser = async (adminId, adminToken) => {
  const data = await apiDelete(`/admin/users/${adminId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.msg;
};

// ==================== ANALYTICS ====================

// Get job application statistics
export const getJobApplicationStats = async (adminToken) => {
  const data = await apiGet('/admin/analytics/job-applications', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.job_application_stats;
};

// Get job applications by job ID
export const getJobApplicationsByJobId = async (jobId, adminToken) => {
  const data = await apiGet(`/admin/analytics/job-applications/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.job_applications;
};

// Get event application statistics
export const getEventApplicationStats = async (adminToken) => {
  const data = await apiGet('/admin/analytics/event-applications', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.event_application_stats;
};

// Get event applications by event ID
export const getEventApplicationsByEventId = async (eventId, adminToken) => {
  const data = await apiGet(`/admin/analytics/event-applications/${eventId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.event_applications;
};

// Get students by gender
export const getStudentsByGender = async (gender, adminToken) => {
  const data = await apiGet(`/admin/analytics/students/gender/${gender}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.students;
};

// Get students by university
export const getStudentsByUniversity = async (university, adminToken) => {
  const data = await apiGet(`/admin/analytics/students/university/${encodeURIComponent(university)}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.students;
};

// Get students by society
export const getStudentsBySociety = async (society, adminToken) => {
  const data = await apiGet(`/admin/analytics/students/society/${encodeURIComponent(society)}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.students;
};

// Get students eligible for free meals
export const getStudentsEligibleForFreeMeals = async (adminToken) => {
  const data = await apiGet('/admin/analytics/students/free-meals', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.students;
};

// Get first generation students
export const getFirstGenStudents = async (adminToken) => {
  const data = await apiGet('/admin/analytics/students/first-gen', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.students;
};

// Get students by education status
export const getStudentsByEducationStatus = async (educationLevel, adminToken) => {
  const data = await apiGet(`/admin/analytics/students/education/${educationLevel}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.students;
};

// Get user by name (search)
export const getUserByName = async (name, adminToken) => {
  const data = await apiGet(`/admin/analytics/users/search/${encodeURIComponent(name)}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.users;
};

// Get analytics summary
export const getAnalyticsSummary = async (adminToken) => {
  const data = await apiGet('/admin/analytics/summary', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.analytics_summary;
};
