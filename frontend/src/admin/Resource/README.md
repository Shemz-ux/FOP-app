# Admin Resource

Admin screens for managing resources (files and video links). Each resource has an audience: **public** (everyone) or **society** (society accounts only). API rules are in `api/docs/SOCIETY_RESOURCES.md`.

## Pages

| File | Route | Purpose |
|---|---|---|
| `ResourceManagement.jsx` | `/admin/resources` | List with a Public / Society switch, search, category filter and delete. The Society tab is `?audience=society`. |
| `ResourceDetail.jsx` | `/admin/resources/:id` | Read-only view of one resource, with view, download, edit and delete. Imported in `App.jsx` as `AdminResourceDetail`. |
| `ResourceForm.jsx` | `/admin/resources/new`, `/admin/resources/:id/edit` | One form for create and edit. Edit mode is when the route has an `id`. |

## Data and text

| File | Holds |
|---|---|
| `resourceOptions.js` | Categories (source of truth, also used by `src/pages/Resources/`), audiences with their colours and icons, upload rules, and helpers. |
| `resource.copy.js` | All on-screen text, one export per page. |

## Components

| File | Used by | Purpose |
|---|---|---|
| `AudienceSwitch.jsx` | List, Form | Public / Society selector. Shows counts when given them. |
| `AudienceBanner.jsx` | List | Coloured strip naming the audience being viewed. |
| `AudienceBadge.jsx` | Detail | Coloured audience badge. |
| `CategoryBadge.jsx` | List | Category badge. |
| `StatusBadge.jsx` | List, Detail | Active / Inactive badge. |
| `FileUploadField.jsx` | Form | File picker with drag and drop. |
| `VideoLinkField.jsx` | Form | Video URL input. |
| `WhatsIncludedField.jsx` | Form | Editable "What's Included" list. |
| `LoadingState.jsx` | All pages | Full-page spinner. |

## Audience behaviour

- The list loads both audiences on open, so switching tabs is instant.
- A new resource defaults to Public. Editing loads the saved audience; changing it moves the resource between tabs without re-uploading.
- After saving a new resource, and from the detail page's back link and delete, the admin returns to that resource's tab.
- Colours: sky for public, violet for society (`AUDIENCE_STYLES`).

## Common changes

- **Add a category:** add an entry to `RESOURCE_CATEGORIES`. Never change an existing `value`; it is stored on each resource.
- **Change wording:** edit `resource.copy.js`. Pages and components hold no text.
- **Change file types or size limit:** update `RESOURCE_FILE_EXTENSIONS` and `RESOURCE_MAX_FILE_SIZE_MB`, and the matching rules in `api/src/lib/r2Storage.js` and `api/src/controllers/resources.js`.
- **Add a form field:** add it to `getInitialFormData` and to `resourceData` in `handleSubmit`, add its label to `resourceFormCopy`, and allow it in the API (the update endpoint rejects unknown fields).

## Saving

- With a file selected, the form sends multipart `FormData`; otherwise JSON.
- "Created By" is sent as `uploaded_by` and stored in `created_by`.
- Required before sending: a category; a link for video resources; a file on create, or on edit when switching a video link to a file; an allowed file type and size.

## Known limits

- The list loads at most 100 resources per audience and filters in the browser. To be replaced in a later refactor.
