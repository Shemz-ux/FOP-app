# Profile

The logged-in user's own page at `/profile`. Jobseekers and societies ("institutions") see different pages at the same URL.

## Structure

```
Profile.jsx        the /profile route
components/        components shared by both profiles
utils/             settings, helpers and hooks shared by both profiles
jobseeker/         jobseeker page, its text and helpers
institution/       society page and its text
```

Anything used by only one profile goes in that profile's folder (with its own `components/` when needed). Anything used by both stays at this level: text in `profile.copy.js`, the rest in `components/` or `utils/`.

## Pages

| File | Shown to | Purpose |
|---|---|---|
| `Profile.jsx` | Everyone | Picks the page for the account type. Logged-out visitors go to `/login`, admins to `/admin`. |
| `jobseeker/JobseekerProfile.jsx` | Jobseekers | Education and CV cards, plus saved jobs, applied jobs, saved events and registered events. |
| `institution/InstitutionProfile.jsx` | Societies | Saved jobs and saved events, with a count of the resources available to societies. |

## Data and text

| File | Holds |
|---|---|
| `utils/profileOptions.js` | Shared settings: tab values, cards per page, event date formatting. |
| `profile.copy.js` | Text shared by both profiles (`profileSharedCopy`). |
| `utils/useSavedItems.js` | Loads saved jobs and events for either account type, with save and unsave. |
| `utils/useLoadOnVisible.js` | Loads data on open and again when the user returns to the browser tab. |
| `utils/useToast.js` | Holds the error message shown by `ProfileToast`. |
| `jobseeker/jobseekerOptions.js` | Education labels and the helpers that shape jobseeker data. |
| `jobseeker/jobseekerProfile.copy.js` | Text for the jobseeker profile. |
| `institution/institutionProfile.copy.js` | Text for the institution profile. |
| `institution/institutionOptions.js` | Settings for the institution profile. |
| `institution/useSocietyResources.js` | Loads society-audience resources and their total. |

## Shared components

| File | Purpose |
|---|---|
| `ProfileHeader.jsx` | Name, subtitle, settings link and stats. |
| `ProfileTabs.jsx` | Tab bar on desktop, dropdown on mobile. |
| `PaginatedGrid.jsx` | Card grid with pagination, a spinner while loading and an empty message. |
| `ProfileJobCard.jsx` | Maps a job record to `JobCard`. |
| `ProfileEventCard.jsx` | Maps an event record to `EventCard`. |
| `ProfileToast.jsx` | Error message in the top corner. |

## Common changes

- **Change wording:** edit the copy files. Pages and components hold no text.
- **Add a header stat:** add `{ label, value, loading }` to the page's `stats` list. It shows a dash while `loading` is true.
- **Report an error:** call `showToast(message)` from `useToast`. Hooks take it as their `onError` argument.
- **Add a tab:** add a value to `PROFILE_TABS`, a label to the copy file, and an entry to the page's `tabs` list.
