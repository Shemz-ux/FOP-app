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
| `jobseeker/JobseekerProfile.jsx` | Jobseekers | Education and CV cards, plus section tabs: Saved and Applications, each with a Jobs / Events toggle. Saved is the default; the other is `?tab=applications`. |
| `institution/InstitutionProfile.jsx` | Societies | Section tabs: Members, Saved (jobs and events) and Resources. Members is the default; the others are kept in the URL as `?tab=saved` / `?tab=resources`. |

## Data and text

| File | Holds |
|---|---|
| `utils/profileOptions.js` | Shared settings: cards per page (6, or 3 for events), section validation, and the header's greeting, term, counting and date helpers. |
| `profile.copy.js` | Text shared by both profiles (`profileSharedCopy`). |
| `utils/useSavedItems.js` | Loads saved jobs and events for either account type, with save and unsave. |
| `utils/useLoadOnVisible.js` | Loads data on open and again when the user returns to the browser tab. |
| `utils/useToast.js` | Holds the error message shown by `ProfileToast`. |
| `jobseeker/jobseekerOptions.js` | Education labels and the helpers that shape jobseeker data. |
| `jobseeker/jobseekerProfile.copy.js` | Text for the jobseeker profile. |
| `institution/institutionProfile.copy.js` | Text for the institution profile. |
| `institution/institutionOptions.js` | Sections, saved toggle options, and the member stages with their colours. |
| `institution/useSocietyResources.js` | Loads society-only resources (audience `society`) and their total. |
| `institution/useSocietyMembers.js` | Loads the society's own members from `GET /societies/me/members`. |

## Shared components

| File | Purpose |
|---|---|
| `ProfileHeader.jsx` | The banner: identity, greeting, welcome message, an optional highlight pill and action, and the snapshot grid. |
| `SectionTabs.jsx` | Tab bar under the header. Each section supplies its own icon and count. |
| `ToggleSwitch.jsx` | Two-option sliding toggle. |
| `TogglePanel.jsx` | A titled section whose content is one of two lists, chosen with the toggle. |
| `PaginatedGrid.jsx` | Card grid with pagination, a spinner while loading and an empty message. |
| `ProfileJobCard.jsx` | Maps a job record to `JobCard`. |
| `ProfileEventCard.jsx` | Maps an event record to `EventCard`. |
| `ProfileToast.jsx` | Error message in the top corner. |

## Institution components

In `institution/components/`.

| File | Purpose |
|---|---|
| `ResourcesPanel.jsx` | "Resources for your students": society-only resources in a paginated grid with download. Chips appear for the categories in use, once there is more than one. |
| `CategoryChips.jsx` | Filter chips, used by the resources section. |
| `SocietyResourceCard.jsx` | Resource card with Download (or Watch) and a link to the detail page. |
| `MembersPanel.jsx` | "Your members": stage filter, search and a paginated table. |
| `MembersTable.jsx` | The members table, with a card layout on mobile. Rows expand for email, engagement and interests. |
| `MemberStageFilter.jsx` | Stage chips with a colour dot and a count each. |

## Members

A society sees the students who chose it at signup. The link is `jobseekers.society_id`, a real foreign key; the older `jobseekers.society` text column is kept only as a label for students whose society is not on the platform, and those students appear in nobody's member list.

- The endpoint is `GET /societies/me/members`. **There is no id in the path** — the society is taken from its token by `api/src/middleware/societyChecker.js`, so there is no parameter to tamper with.
- Societies see less than admins do: name, email, course, stage, year, institution, join date, job applications, event registrations and career interests. Not phone, LinkedIn, CV or the demographic answers.
- "Applications" counts rows in `jobseekers_jobs_applied`; events count `jobseekers_events_applied`. Both use `COUNT(DISTINCT ...)` because joining the two at once multiplies the rows.
- Stage is derived from `education_level`, except that `uni_year = 'graduated'` always shows as Graduate. Stages and their colours live in `MEMBER_STAGES`.

## The banner

`ProfileHeader` is shared, so both profiles get the same layout with content that suits them. Each supplies its own `heading`, `description`, optional `highlight` pill, optional `action` button and up to four snapshot stats.

Everything in it is derived from data already loaded — nothing is hardcoded or faked:

- the greeting comes from the time of day, and the term label from the month;
- "+N this month" counts members by `created_at`, or applications by `applied_at`;
- "Next: 15 January" is the soonest event still to come, or "None coming up";
- a stat shows a dash until its number arrives, so a failed request never reads as zero.

The highlight pill only appears when there is something to report, and links to the section it refers to.

## Common changes

- **Change what societies see:** an admin sets a resource's audience to Society in the admin resource form. Nothing in this folder needs editing.
- **Change wording:** edit the copy files. Pages and components hold no text.
- **Add a header stat:** add `{ label, value, loading }` to the page's `stats` list. It shows a dash while `loading` is true.
- **Report an error:** call `showToast(message)` from `useToast`. Hooks take it as their `onError` argument. The education card is the exception: it shows its own messages, so `handleSaveEducation` throws to it.
- **Add a society section:** add it to `INSTITUTION_SECTIONS` and `INSTITUTION_SECTION_ICONS`, add its label to the copy file, and add an entry to `sections` and its content in `InstitutionProfile.jsx`.
- **Add a jobseeker section:** add it to `JOBSEEKER_SECTIONS` and `JOBSEEKER_SECTION_ICONS`, add its label to the copy file, and add an entry to `sections` and its content in `JobseekerProfile.jsx`.
- **Change a list's page size:** pass `itemsPerPage` on that `TogglePanel` option. Events use `PROFILE_EVENTS_PER_PAGE` because their cards are twice the height.
- **Add a member stage:** add it to `MEMBER_STAGES` with its `educationLevels`, `dot` and `badge` colours. The filter and the table badge both read from there.

## Related pages

- A society resource's eye button opens `pages/Resources/ResourceDetail.jsx`. For a society viewing a society-only resource, its back link returns to `/profile?tab=resources`.

## Known limits

- Both profiles use the same chrome: `SectionTabs` for sections, `TogglePanel` for paired lists, and the same cards. Members and Resources stay society-only; Education and CV stay jobseeker-only.

- The Resources tab loads at most 100 resources (`SOCIETY_RESOURCES_LIMIT`) and filters and paginates in the browser. The Members tab loads every member at once and does the same.
- The design's Status, Last active and Invite are not built: no column or invite system exists behind them.
- Light theme works but cannot be reached: the theme toggle is switched off in the navbar.
