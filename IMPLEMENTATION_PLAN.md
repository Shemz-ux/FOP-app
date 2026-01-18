# Final Implementation Phase - Authentication & User Management

## Overview
This document outlines the implementation plan for the final phase of the FOP application, focusing on authentication, user type management, and protected features.

## Requirements Summary

### 1. Authentication System
- ✅ Backend auth already exists (`/api/tokens`)
- ⬜ Create AuthContext for frontend state management
- ⬜ Implement login/logout functionality
- ⬜ Store auth token in localStorage
- ⬜ Decode JWT to get user type and ID

### 2. User Types & Permissions
**Three user types:**
- **Jobseeker**: Full access (apply, save jobs/events, access resources)
- **Society**: Limited access (save jobs/events only, NO apply)
- **Admin**: Dashboard access with admin indicator

### 3. Protected Features

#### Resources Page
- ⬜ Blur entire page when not logged in
- ⬜ Show login/signup prompt overlay
- ⬜ Only accessible to authenticated users

#### Job Actions
- ⬜ Apply button: Jobseekers only
- ⬜ Save button: Jobseekers + Societies
- ⬜ Show login modal if not authenticated

#### Event Actions
- ⬜ Register button: All authenticated users
- ⬜ Save button: All authenticated users
- ⬜ Show login modal if not authenticated

### 4. Dashboard Updates
- ⬜ Connect to real API data
- ⬜ Society dashboard: Only "Saved Jobs" and "Saved Events" tabs
- ⬜ Jobseeker dashboard: Full tabs (Applied Jobs, Saved Jobs, Registered Events, Saved Events)
- ⬜ Admin: Show admin dashboard icon in Navbar

### 5. UI Components Needed
- ⬜ AuthModal (Login/Signup combined)
- ⬜ ProtectedRoute component
- ⬜ AuthGuard for actions (HOC or hook)
- ⬜ Update Navbar with user menu

### 6. Bug Fixes
- ⬜ Fix CompanyLogo styling on JobCard when logo exists

## Implementation Order

### Phase 1: Authentication Foundation (Priority 1)
1. Create AuthContext
2. Create authService methods (login, logout, getCurrentUser)
3. Update App.jsx to wrap with AuthProvider
4. Create useAuth hook

### Phase 2: Login/Signup Modal (Priority 1)
1. Create AuthModal component
2. Implement login form
3. Implement signup form (jobseeker/society selection)
4. Handle authentication errors

### Phase 3: Navbar Updates (Priority 1)
1. Show user menu when logged in
2. Display user type
3. Add logout functionality
4. Show admin dashboard link for admins

### Phase 4: Protected Resources (Priority 2)
1. Create ResourcesGuard component
2. Blur Resources page when not authenticated
3. Show login prompt overlay

### Phase 5: Save/Unsave Functionality (Priority 2)
1. Create save/unsave API services
2. Update JobDetails with save button
3. Update EventDetails with save button
4. Show login modal if not authenticated

### Phase 6: Apply/Register Guards (Priority 2)
1. Update Apply button to check auth + user type
2. Update Register button to check auth
3. Prevent societies from applying to jobs

### Phase 7: Dashboard API Integration (Priority 3)
1. Create dashboard API services
2. Fetch user's saved/applied jobs
3. Fetch user's saved/registered events
4. Create society-specific dashboard view

### Phase 8: Polish & Testing (Priority 3)
1. Fix CompanyLogo styling
2. Test all auth flows
3. Test user type restrictions
4. Verify all protected actions

## API Endpoints Available

### Authentication
- `POST /api/tokens` - Login (returns token, user_id, user_type, role)

### Jobs
- `GET /api/jobs/:job_id/saved` - Check if job is saved
- `POST /api/jobs/:job_id/save` - Save job
- `DELETE /api/jobs/:job_id/save` - Unsave job
- `POST /api/jobs/:job_id/apply` - Apply to job

### Events
- `GET /api/events/:event_id/saved` - Check if event is saved
- `POST /api/events/:event_id/save` - Save event
- `DELETE /api/events/:event_id/save` - Unsave event
- `POST /api/events/:event_id/register` - Register for event

### User Data
- `GET /api/jobseekers/:id/jobs/applied` - Get applied jobs
- `GET /api/jobseekers/:id/jobs/saved` - Get saved jobs
- `GET /api/jobseekers/:id/events/registered` - Get registered events
- `GET /api/jobseekers/:id/events/saved` - Get saved events
- Similar endpoints for societies

## Token Structure
JWT contains:
- `user_id`: ID of the user
- `user_type`: 'jobseeker' | 'society' | 'admin'
- `role`: 'admin' | 'super_admin' (for admin users only)

## Next Steps
Start with Phase 1: Authentication Foundation
