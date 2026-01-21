# Media Upload System - Simplified Architecture

## Overview
Simple Cloudinary upload system with automatic folder routing. No database metadata storage - just upload to Cloudinary, get URL, store in your event/job records.

## Folder Structure

| Purpose | Cloudinary Folder | Use Case |
|---------|------------------|----------|
| `event_image` | `event-images/` | Event promotional images |
| `company_logo` | `company-logos/` | Company/employer logos for jobs |
| `organiser_logo` | `organiser-logos/` | Event organiser logos |
| `other` | `misc/` | Miscellaneous media |

## Setup

### 1. Configure Cloudinary

Add your credentials to `/api/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these from your [Cloudinary Dashboard](https://cloudinary.com/console).

### 2. Start Server

```bash
cd api
npm run dev
```

## API Endpoints

### Upload Media
**POST** `/api/media/upload`

**Authentication:** Required (Bearer token)

**Body (multipart/form-data):**
- `media` (file): The image or video file
- `purpose` (string): `event_image`, `company_logo`, `organiser_logo`, or `other`

**Response:**
```json
{
  "msg": "Media uploaded successfully",
  "url": "https://res.cloudinary.com/.../event-images/photo.jpg",
  "public_id": "event-images/photo",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "resource_type": "image"
}
```

### Delete Media
**DELETE** `/api/media/delete`

**Authentication:** Required

**Body:**
```json
{
  "public_id": "event-images/photo"
}
```

## File Validation

**Allowed Types:**
- Images: JPEG, JPG, PNG, WebP, GIF
- Videos: MP4, MPEG, QuickTime, WebM

**Size Limits:**
- Images: 10MB max
- Videos: 100MB max

## Frontend Integration

### Upload Event Image

```javascript
const uploadEventImage = async (file) => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('purpose', 'event_image');
  
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5001/api/media/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const data = await response.json();
  return data.url; // Store this in event_image field
};
```

### Complete EventForm Example

```javascript
import { useState } from 'react';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    organiser: '',
    event_image: '',
    // ... other fields
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setImageFile(file);
    } else {
      alert('Image must be less than 10MB');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append('media', imageFile);
    formData.append('purpose', 'event_image');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Upload image first
    let imageUrl = formData.event_image;
    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        alert('Image upload failed');
        return;
      }
    }

    // Create event with image URL
    const eventData = {
      ...formData,
      event_image: imageUrl
    };

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5001/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (response.ok) {
      console.log('Event created!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Event Title"
        required
      />
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
      />
      
      {uploading && <p>Uploading...</p>}
      
      <button type="submit" disabled={uploading}>
        Create Event
      </button>
    </form>
  );
};
```

### Upload Company Logo

```javascript
const uploadCompanyLogo = async (file) => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('purpose', 'company_logo');
  
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5001/api/media/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  const data = await response.json();
  return data.url; // Store in company_logo field
};
```

## Workflow

1. **User selects image** in EventForm/JobForm
2. **Upload to Cloudinary** via `/api/media/upload`
3. **Get URL back** from response
4. **Store URL** in `event_image` or `company_logo` field
5. **Submit event/job** with URL to `/api/events` or `/api/jobs`
6. **Render image** in frontend: `<img src={event.event_image} />`

## Database Schema

Your existing tables already support this:

```sql
-- events table
event_image TEXT  -- Stores Cloudinary URL

-- jobs table
company_logo TEXT  -- Stores Cloudinary URL
```

No additional tables needed!

## Error Handling

```javascript
try {
  const url = await uploadImage(file);
  // Use url
} catch (error) {
  if (error.status === 400) {
    console.error('Invalid file:', error.errors);
  } else if (error.status === 401) {
    console.error('Not authenticated');
  } else {
    console.error('Upload failed:', error.msg);
  }
}
```

## Common Errors

**"No file provided"**
- Ensure file is attached to FormData with key `media`

**"Media purpose is required"**
- Add `purpose` field to FormData

**"File validation failed"**
- Check file type and size limits

**401 Unauthorized**
- Ensure valid JWT token in Authorization header

## File Structure

```
api/
├── src/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary configuration
│   ├── services/
│   │   └── mediaUploadService.js  # Upload logic + validation
│   ├── controllers/
│   │   └── mediaUpload.js         # Upload & delete handlers
│   ├── middleware/
│   │   └── uploadMiddleware.js    # Multer configuration
│   └── routes/
│       └── mediaUpload.js         # /api/media routes
└── .env                           # Cloudinary credentials
```

## Next Steps

1. **Add Cloudinary credentials** to `.env`
2. **Update EventForm** to upload images before creating events
3. **Update JobForm** to upload logos before creating jobs
4. **Test uploads** and verify images appear in Cloudinary folders
5. **Render images** in your frontend components

## Benefits of This Approach

✅ Simple architecture - no extra database tables
✅ Automatic folder organization in Cloudinary
✅ Direct URL storage in event/job records
✅ Easy to render images in frontend
✅ File validation and size limits
✅ Secure authenticated uploads
