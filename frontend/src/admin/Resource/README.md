# Admin Resource

The admin screens for managing resources (downloadable files and video links): list, view, create, edit and delete.

## Files

```
Resource/
  ResourceManagement.jsx    list page
  ResourceDetail.jsx        single resource page
  ResourceForm.jsx          create and edit page
  resource.copy.js          all on-screen text
  resourceOptions.js        category list and upload rules
  components/               smaller pieces used by the pages
```

### Pages

| File | Route | What it does |
|---|---|---|
| `ResourceManagement.jsx` | `/admin/resources` | Lists resources with summary cards, title search, category filter and pagination. Links to view and edit, and deletes after a confirmation. Table on desktop, cards on mobile. |
| `ResourceDetail.jsx` | `/admin/resources/:id` | Read-only view of one resource: file info, status, descriptions, and buttons to view or download the file (or watch the video). Also has edit and delete. Imported in `App.jsx` as `AdminResourceDetail` because the public page has the same name. |
| `ResourceForm.jsx` | `/admin/resources/new` and `/admin/resources/:id/edit` | The one form for both creating and editing. It is in edit mode when the route has an `id`: it loads the resource, fills the fields, and saves with `PATCH`. Without an `id` it saves with `POST`. After saving, create returns to the list and edit returns to the detail page. |

### Data and text

| File | What it holds |
|---|---|
| `resourceOptions.js` | **Source of truth for resource categories.** Each category has its stored `value`, its `label`, the badge colour and icon used on the public Resources pages (`variant`, `icon`), and the badge colour used in the admin (`badgeClass`). Also holds the allowed file extensions, the upload size limit, the upload types (`file`, `link`), and two helpers: `getResourceCategory` and `isVideoResource`. The public pages in `src/pages/Resources/` import the category list from here. |
| `resource.copy.js` | Every piece of text shown on these screens, with one export per page: `resourceManagementCopy`, `resourceDetailCopy`, `resourceFormCopy`. The Active/Inactive labels and the delete confirmation text are defined once and shared. |

### Components

| File | Used by | What it does |
|---|---|---|
| `FileUploadField.jsx` | Form | File picker with drag and drop. Shows the current file when editing. Only offers the allowed file types. |
| `VideoLinkField.jsx` | Form | URL input for a video resource. Shows the current link when editing. |
| `WhatsIncludedField.jsx` | Form | The "What's Included" list: add, edit and remove lines. |
| `CategoryBadge.jsx` | List | Coloured category badge. Colour comes from `resourceOptions.js`, with a default for unknown categories. |
| `StatusBadge.jsx` | List, Detail | Active / Inactive badge. `compact` gives the smaller mobile size. |
| `LoadingState.jsx` | All pages | Full-page spinner with a message. |

## Common changes

**Add a category.** Add one entry to `RESOURCE_CATEGORIES` in `resourceOptions.js`. It then appears in the form dropdown, the admin list filter, and as a filter chip on the public Resources page once a resource uses it. Do not change the `value` of an existing category: it is stored on every resource in the database.

**Change wording.** Edit `resource.copy.js`. No text should be written directly in the page or component files.

**Change allowed file types or the size limit.** Update `RESOURCE_FILE_EXTENSIONS` and `RESOURCE_MAX_FILE_SIZE_MB` in `resourceOptions.js`. The hint text, the file picker filter and the form's checks all read from these. The API enforces its own copy of these rules in `api/src/lib/r2Storage.js` and `api/src/controllers/resources.js`, so change both sides together.

**Add a form field.** Add it to `getInitialFormData` and to the `resourceData` object in `handleSubmit` in `ResourceForm.jsx`, add its label to `resourceFormCopy`, and make sure the API accepts it (the update endpoint rejects unknown fields).

## How saving works

`ResourceForm.jsx` checks the form, then sends one request:

- With a file selected, the fields and file go as multipart `FormData`.
- Without a file (a video link, or an edit that keeps the existing file), the fields go as JSON.

The "Created By" input is sent as `uploaded_by`, which the API stores in the `created_by` column. When editing, the form reads it back from `created_by`.

Rules the form enforces before sending:

- A category must be selected.
- A video link resource must have a link.
- A file resource must have a file on create, and on edit when switching a video link resource to a file. Editing a file resource without choosing a new file keeps the existing one.
- The file must be an allowed type and within the size limit.

The submit button is disabled while saving and until the redirect, so a resource cannot be submitted twice.

## Known limits

- The list loads a single page of results from the API and filters in the browser, so it shows at most the API's default page size (20). This is scheduled to be fixed in a later refactor.
- The list shows public resources only. Society-only resources (see `api/docs/SOCIETY_RESOURCES.md`) are not yet manageable here.
