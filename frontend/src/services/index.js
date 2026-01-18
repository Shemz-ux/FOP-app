// Central export file for all services
import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from './api';

// Import all services
import * as jobsService from './Jobs/jobsService';
import * as eventsService from './Events/eventsService';
import * as resourcesService from './Resources/resourcesService';
import * as jobseekersService from './Jobseekers/jobseekersService';
import * as societiesService from './Societies/societiesService';
import * as adminService from './Admin/adminService';
import * as authService from './Auth/authService';

// Export all services
export {
  jobsService,
  eventsService,
  resourcesService,
  jobseekersService,
  societiesService,
  adminService,
  authService,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  buildQueryString
};
