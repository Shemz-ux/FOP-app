// Central export file for all services
// Import and re-export all service functions

export * from './api';
export * from './Auth/authService';
export * from './Jobs/jobsService';
export * from './Events/eventsService';
export * from './Jobseekers/jobseekersService';
export * from './Societies/societiesService';
export * from './Resources/resourcesService';
export * from './Admin/adminService';

// You can now import any service function like:
// import { getJobs, loginJobseeker, getResources } from '@/services';
