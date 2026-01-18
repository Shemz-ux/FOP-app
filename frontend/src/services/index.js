// Central export file for all services
import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from './api';

// Import all services
import * as jobsService from './Jobs/jobsService';
import * as jobActionsService from './Jobs/jobActions';
import * as eventsService from './Events/eventsService';
import * as eventActionsService from './Events/eventActions';
import * as resourcesService from './Resources/resourcesService';
import * as jobseekersService from './Jobseekers/jobseekersService';
import * as societiesService from './Societies/societiesService';
import * as adminService from './Admin/adminService';
import * as authService from './Auth/authService';
import * as dashboardService from './Dashboard/dashboardService.js';
import * as profileService from './Profile/profileService.js';

// Export all services
export {
  jobsService,
  jobActionsService,
  eventsService,
  eventActionsService,
  resourcesService,
  jobseekersService,
  societiesService,
  profileService,
  adminService,
  authService,
  dashboardService
};
