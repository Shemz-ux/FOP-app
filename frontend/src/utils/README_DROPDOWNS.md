# Dropdown Options & Custom Entries Guide

## Overview

This system provides predefined dropdown options for admin forms with automatic color variants and icon mappings. Admins can select from predefined options OR choose "Other" to enter custom values.

## Usage in Admin Forms

### Basic Example

```jsx
import CustomDropdown from '@/components/Admin/CustomDropdown';
import { JOB_INDUSTRIES, JOB_ROLE_TYPES, JOB_WORK_TYPES } from '@/utils/dropdownOptions';

const CreateJobForm = () => {
  const [formData, setFormData] = useState({
    industry: '',
    role_type: '',
    work_type: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form>
      <CustomDropdown
        label="Industry"
        name="industry"
        options={JOB_INDUSTRIES}
        value={formData.industry}
        onChange={handleChange}
        required
        showVariantPreview
      />

      <CustomDropdown
        label="Role Type"
        name="role_type"
        options={JOB_ROLE_TYPES}
        value={formData.role_type}
        onChange={handleChange}
        required
      />

      <CustomDropdown
        label="Work Type"
        name="work_type"
        options={JOB_WORK_TYPES}
        value={formData.work_type}
        onChange={handleChange}
        required
      />
    </form>
  );
};
```

### Event Form Example

```jsx
import { EVENT_INDUSTRIES, EVENT_TYPES, EVENT_LOCATION_TYPES } from '@/utils/dropdownOptions';

<CustomDropdown
  label="Industry"
  name="industry"
  options={EVENT_INDUSTRIES}
  value={formData.industry}
  onChange={handleChange}
/>

<CustomDropdown
  label="Event Type"
  name="event_type"
  options={EVENT_TYPES}
  value={formData.event_type}
  onChange={handleChange}
/>

<CustomDropdown
  label="Location Type"
  name="location_type"
  options={EVENT_LOCATION_TYPES}
  value={formData.location_type}
  onChange={handleChange}
/>
```

### Resource Form Example

```jsx
import { RESOURCE_CATEGORIES, RESOURCE_FILE_TYPES } from '@/utils/dropdownOptions';

<CustomDropdown
  label="Category"
  name="category"
  options={RESOURCE_CATEGORIES}
  value={formData.category}
  onChange={handleChange}
/>

<CustomDropdown
  label="File Type"
  name="file_type"
  options={RESOURCE_FILE_TYPES}
  value={formData.file_type}
  onChange={handleChange}
/>
```

## How Custom Entries Work

1. **Admin selects "Other"** from dropdown
2. **Input field appears** for custom entry
3. **Admin types custom value** (e.g., "Biotechnology")
4. **Default styling applied** (gray variant, default icon)
5. **Value saved to database** as entered

### Example Flow

```
Dropdown: [Technology, Finance, Engineering, ... Other]
         ↓
Admin selects "Other"
         ↓
Input field appears: [Enter custom value...]
         ↓
Admin types: "Biotechnology"
         ↓
Saved to DB: industry = "Biotechnology"
         ↓
Frontend displays with: variant = "gray", icon = "default"
```

## Available Dropdown Options

### Jobs
- `JOB_INDUSTRIES` - Technology, Finance, Engineering, etc.
- `JOB_ROLE_TYPES` - Internship, Graduate Scheme, Full-time, etc.
- `JOB_WORK_TYPES` - Remote, Hybrid, On-site
- `JOB_EXPERIENCE_LEVELS` - Entry level, Mid level, Senior level

### Events
- `EVENT_INDUSTRIES` - Same as job industries
- `EVENT_TYPES` - Career Fair, Networking, Workshop, etc.
- `EVENT_LOCATION_TYPES` - Online, In-person, Hybrid

### Resources
- `RESOURCE_CATEGORIES` - CV & Cover Letters, Interview Prep, etc.
- `RESOURCE_FILE_TYPES` - PDF, DOCX, XLSX, etc.

## Helper Functions

```javascript
import { 
  getVariantFromOptions,
  getIconFromOptions,
  isCustomEntry,
  normalizeFieldValue 
} from '@/utils/dropdownOptions';

// Get variant for a value
const variant = getVariantFromOptions(JOB_INDUSTRIES, 'Technology'); // 'blue'
const customVariant = getVariantFromOptions(JOB_INDUSTRIES, 'Biotechnology'); // 'gray'

// Get icon for a value
const icon = getIconFromOptions(RESOURCE_CATEGORIES, 'CV & Cover Letters'); // 'FileText'

// Check if custom entry
const isCustom = isCustomEntry(JOB_INDUSTRIES, 'Biotechnology'); // true

// Normalize value (handles "Other" selection)
const value = normalizeFieldValue('Other', 'Biotechnology'); // 'Biotechnology'
```

## Validation

The system automatically:
- ✅ Validates predefined options
- ✅ Allows custom entries via "Other"
- ✅ Applies default styling to custom entries
- ✅ Preserves custom values in database
- ✅ Displays custom values with default styling

## Benefits

1. **Consistency** - Predefined options ensure consistent data
2. **Flexibility** - "Other" option allows custom entries
3. **Automatic Styling** - Colors and icons applied automatically
4. **Type Safety** - All options defined in one place
5. **Easy Maintenance** - Add new options in one file
6. **Graceful Degradation** - Custom entries get sensible defaults

## Adding New Options

To add a new predefined option:

```javascript
// In dropdownOptions.js
export const JOB_INDUSTRIES = [
  // ... existing options
  { value: 'Biotechnology', label: 'Biotechnology', variant: 'lime' },
  { value: 'Other', label: 'Other (Custom)', variant: 'gray' }
];
```

The option will automatically:
- Appear in all dropdowns using `JOB_INDUSTRIES`
- Get the specified color variant
- Be recognized as a valid (non-custom) entry
