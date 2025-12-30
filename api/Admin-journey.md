# Admin Backdoor Endpoints Documentation

## Authentication

All admin endpoints require authentication using one of two methods:

### Method 1: Admin Backdoor Token (Recommended for backdoor access)
```
Authorization: Bearer admin_backdoor_2024
```

### Method 2: JWT Token with Admin Role
```
Authorization: Bearer <jwt_token_with_admin_role>
```

The backdoor token can be configured via the `ADMIN_BACKDOOR_TOKEN` environment variable.

## Base URL
All admin endpoints are prefixed with `/api/admin`

## Available Endpoints

### 1. Analytics Summary
**GET** `/api/admin/summary`

Returns overall analytics summary including total counts.

**Response:**
```json
{
  "analytics_summary": {
    "total_students": 150,
    "total_jobs": 45,
    "total_events": 23,
    "total_job_applications": 320,
    "total_event_applications": 180,
    "free_meal_eligible_count": 45,
    "first_gen_count": 67
  }
}
```

### 2. Job Application Analytics

#### Get Job Application Statistics
**GET** `/api/admin/jobs/applications`

Returns statistics showing how many people applied for each job.

**Response:**
```json
{
  "job_application_stats": [
    {
      "job_id": 1,
      "title": "Software Engineer",
      "company": "Tech Corp",
      "application_count": "25"
    }
  ]
}
```

#### Get Applications for Specific Job
**GET** `/api/admin/jobs/{job_id}/applications`

Returns list of all applicants for a specific job.

**Response:**
```json
{
  "job_applications": [
    {
      "jobseeker_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "institution_name": "University College London",
      "education_level": "undergraduate",
      "applied_at": "2024-12-30T10:15:30.000Z"
    }
  ]
}
```

### 3. Event Application Analytics

#### Get Event Application Statistics
**GET** `/api/admin/events/applications`

Returns statistics showing how many people applied for each event.

**Response:**
```json
{
  "event_application_stats": [
    {
      "event_id": 1,
      "title": "Career Fair 2024",
      "company": "University Careers",
      "event_date": "2024-12-15",
      "application_count": "45"
    }
  ]
}
```

#### Get Applications for Specific Event
**GET** `/api/admin/events/{event_id}/applications`

Returns list of all applicants for a specific event.

**Response:**
```json
{
  "event_applications": [
    {
      "jobseeker_id": 1,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com",
      "institution_name": "Imperial College London",
      "education_level": "postgraduate",
      "applied_at": "2024-12-28T14:20:15.000Z"
    }
  ]
}
```

### 4. Student Filtering Endpoints

#### Get Students by Gender
**GET** `/api/admin/students/gender/{gender}`

Valid gender values: `male`, `female`, `non_binary`, `prefer_not_to_say`, `other`

**Response:**
```json
{
  "students": [
    {
      "jobseeker_id": 1,
      "first_name": "Alex",
      "last_name": "Johnson",
      "email": "alex@example.com",
      "gender": "non_binary",
      "institution_name": "King's College London",
      "education_level": "undergraduate",
      "created_at": "2024-12-20T09:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Students by University
**GET** `/api/admin/students/university/{university}`

Searches for students by university name (partial match supported).

**Example:** `/api/admin/students/university/London`

**Response:**
```json
{
  "students": [
    {
      "jobseeker_id": 1,
      "first_name": "Sarah",
      "last_name": "Wilson",
      "email": "sarah@example.com",
      "institution_name": "University College London",
      "education_level": "undergraduate",
      "uni_year": "2nd",
      "degree_type": "bsc",
      "area_of_study": "Computer Science",
      "created_at": "2024-12-15T11:45:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Students by Society
**GET** `/api/admin/students/society/{society}`

Searches for students by society affiliation (partial match supported).

**Example:** `/api/admin/students/society/Engineering`

**Response:**
```json
{
  "students": [
    {
      "jobseeker_id": 1,
      "first_name": "Mike",
      "last_name": "Brown",
      "email": "mike@example.com",
      "society": "Engineering Society",
      "institution_name": "Imperial College London",
      "education_level": "undergraduate",
      "created_at": "2024-12-10T16:20:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Students Eligible for Free School Meals
**GET** `/api/admin/students/free-meals`

Returns all students who are eligible for free school meals.

**Response:**
```json
{
  "students": [
    {
      "jobseeker_id": 1,
      "first_name": "Emma",
      "last_name": "Davis",
      "email": "emma@example.com",
      "school_meal_eligible": true,
      "institution_name": "University of Manchester",
      "education_level": "undergraduate",
      "created_at": "2024-12-05T13:15:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get First Generation University Students
**GET** `/api/admin/students/first-gen`

Returns all students who are first generation to attend university.

**Response:**
```json
{
  "students": [
    {
      "jobseeker_id": 1,
      "first_name": "David",
      "last_name": "Miller",
      "email": "david@example.com",
      "first_gen_to_go_uni": true,
      "institution_name": "University of Birmingham",
      "education_level": "undergraduate",
      "created_at": "2024-11-30T08:45:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Students by Education Status
**GET** `/api/admin/students/education/{education_level}`

Valid education levels: `a_level_or_btec`, `undergraduate`, `postgraduate`, `phd`, `other`

**Example:** `/api/admin/students/education/undergraduate`

**Response:**
```json
{
  "students": [
    {
      "jobseeker_id": 1,
      "first_name": "Lisa",
      "last_name": "Taylor",
      "email": "lisa@example.com",
      "education_level": "undergraduate",
      "institution_name": "University of Edinburgh",
      "uni_year": "3rd",
      "degree_type": "ba",
      "area_of_study": "Psychology",
      "created_at": "2024-11-25T12:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Users by Name
**GET** `/api/admin/users/name/{name}`

Searches for users by first name, last name, or full name (partial match supported).

**Example:** `/api/admin/users/name/John`

**Response:**
```json
{
  "users": [
    {
      "jobseeker_id": 1,
      "first_name": "John",
      "last_name": "Anderson",
      "email": "john.anderson@example.com",
      "phone_number": "+44 7123 456789",
      "institution_name": "University of Oxford",
      "education_level": "postgraduate",
      "society": "Computer Science Society",
      "created_at": "2024-11-20T14:15:00.000Z"
    }
  ],
  "count": 1
}
```

## Error Responses

### Authentication Error
```json
{
  "message": "Admin authentication required"
}
```
Status Code: 401

### Authorization Error
```json
{
  "message": "Admin access required"
}
```
Status Code: 403

### Invalid Parameter Error
```json
{
  "msg": "Invalid gender parameter"
}
```
Status Code: 400

## Usage Examples

### Using curl with backdoor token:
```bash
curl -H "Authorization: Bearer admin_backdoor_2024" \
     http://localhost:3000/api/admin/summary
```

### Using curl to get job applications:
```bash
curl -H "Authorization: Bearer admin_backdoor_2024" \
     http://localhost:3000/api/admin/jobs/applications
```

### Using curl to get students by gender:
```bash
curl -H "Authorization: Bearer admin_backdoor_2024" \
     http://localhost:3000/api/admin/students/gender/female
```

## Security Notes

- The backdoor token should be kept secure and only shared with authorized administrators
- Consider rotating the backdoor token periodically
- Monitor access logs for admin endpoint usage
- These endpoints bypass normal user authentication and should be used responsibly
