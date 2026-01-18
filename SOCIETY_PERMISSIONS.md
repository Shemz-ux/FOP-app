# Society User Permissions

## ✅ WHAT SOCIETIES CAN DO

### Jobs
- ✅ **SAVE** jobs for their members
- ✅ **UNSAVE** jobs
- ✅ **VIEW** saved jobs in dashboard

### Events
- ✅ **SAVE** events for their members
- ✅ **UNSAVE** events
- ✅ **VIEW** saved events in dashboard

### Other
- ✅ View all jobs and events
- ✅ Access resources
- ✅ Manage society profile

## ❌ WHAT SOCIETIES CANNOT DO

### Jobs
- ❌ **APPLY** to jobs (only jobseekers can apply)
- ❌ View "Applied Jobs" tab (doesn't exist for societies)

### Events
- ❌ **REGISTER** for events (only jobseekers can register)
- ❌ View "Registered Events" tab (doesn't exist for societies)

## 🔧 IMPLEMENTATION

### Backend
- **Routes:** No `/societies/:id/apply-*` endpoints exist
- **Database:** No `society_events_applied` or `society_jobs_applied` tables
- **Models:** No apply/register functions for societies

### Frontend
- **Services:** 
  - `registerForEvent()` throws error if userType !== 'jobseeker'
  - `checkEventRegistered()` returns false for societies
  - `getRegisteredEvents()` returns empty array for societies
- **UI Guards:**
  - JobDetails: Alert shown if society tries to apply
  - EventDetails: Alert shown if society tries to register
- **Dashboard:** Societies only see "Saved Jobs" and "Saved Events" tabs

## 📝 USER MESSAGES

When a society attempts to apply/register:
- **Jobs:** "Societies cannot apply to jobs. You can save jobs for your members."
- **Events:** "Societies cannot register for events. You can save events for your members."
