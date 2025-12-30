

---

# 📚 **Complete API Response Examples**

## **🔐 Authentication**

### **Login Success**
**Request:**
```http
POST /api/tokens
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6ImpvYnNlZWtlciIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDM4NjQ0MDAsImV4cCI6MTcwMzk1MDgwMH0.abc123def456ghi789",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "type": "jobseeker"
  }
}
```

### **Login Failed**
**Response (401 Unauthorized):**
```json
{
  "msg": "Invalid credentials"
}
```

---

## **👥 Jobseekers**

### **Create Jobseeker**
**Request:**
```http
POST /api/jobseekers
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "phone_number": "+1234567890",
  "education_level": "undergraduate",
  "institution_name": "University College London",
  "uni_year": "3rd",
  "degree_type": "bsc",
  "area_of_study": "Computer Science",
  "role_interest_option_one": "Software Developer",
  "role_interest_option_two": "Data Scientist"
}
```

**Response (201 Created):**
```json
{
  "newJobseeker": {
    "jobseeker_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "education_level": "undergraduate",
    "institution_name": "University College London",
    "uni_year": "3rd",
    "degree_type": "bsc",
    "area_of_study": "Computer Science",
    "role_interest_option_one": "Software Developer",
    "role_interest_option_two": "Data Scientist",
    "created_at": "2025-01-10T18:00:00.000Z"
  }
}
```

### **Get All Jobseekers**
**Request:**
```http
GET /api/jobseekers
```

**Response (200 OK):**
```json
{
  "jobseekers": [
    {
      "jobseeker_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone_number": "+1234567890",
      "education_level": "undergraduate",
      "institution_name": "University College London",
      "created_at": "2025-01-10T18:00:00.000Z"
    },
    {
      "jobseeker_id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "phone_number": "+0987654321",
      "education_level": "postgraduate",
      "institution_name": "Imperial College London",
      "created_at": "2025-01-11T09:30:00.000Z"
    }
  ]
}
```

---

## **🏛️ Societies**

### **Create Society**
**Request:**
```http
POST /api/societies
Content-Type: application/json

{
  "name": "Tech Society",
  "university": "University College London",
  "description": "A community for technology enthusiasts",
  "email": "tech@ucl.ac.uk",
  "password": "SocietyPassword123"
}
```

**Response (201 Created):**
```json
{
  "newSociety": {
    "society_id": 1,
    "name": "Tech Society",
    "university": "University College London",
    "description": "A community for technology enthusiasts",
    "email": "tech@ucl.ac.uk",
    "created_at": "2025-01-10T18:00:00.000Z"
  }
}
```

### **Society Dashboard**
**Request:**
```http
GET /api/societies/1/dashboard
```

**Response (200 OK):**
```json
{
  "dashboard": {
    "saved_jobs": [
      {
        "job_id": 1,
        "title": "Software Engineer",
        "company": "TechCorp",
        "location": "London",
        "salary": "£35,000 - £45,000",
        "deadline": "2025-02-15T00:00:00.000Z",
        "is_active": true,
        "saved_at": "2025-01-08T14:30:00.000Z"
      }
    ],
    "saved_events": [
      {
        "event_id": 2,
        "title": "Career Fair 2025",
        "company": "Business Society",
        "location": "Manchester",
        "event_date": "2025-03-15T00:00:00.000Z",
        "event_time": "10:00:00",
        "is_active": true,
        "saved_at": "2025-01-09T16:20:00.000Z"
      }
    ],
    "stats": {
      "total_saved_jobs": 1,
      "total_saved_events": 1,
      "active_saved_jobs": 1,
      "active_saved_events": 1
    }
  }
}
```

---

## **💼 Jobs**

### **Get All Jobs**
**Request:**
```http
GET /api/jobs
```

**Response (200 OK):**
```json
{
  "jobs": [
    {
      "job_id": 1,
      "title": "Software Engineer",
      "company": "TechCorp",
      "description": "Join our innovative team to build cutting-edge applications...",
      "industry": "Technology",
      "location": "London",
      "job_level": "Junior",
      "role_type": "Full-time",
      "salary": "£35,000 - £45,000",
      "deadline": "2025-02-15T00:00:00.000Z",
      "is_active": true,
      "applicant_count": 25,
      "created_at": "2025-01-10T18:00:00.000Z"
    }
  ]
}
```

### **Advanced Job Search**
**Request:**
```http
GET /api/jobs/search?company=TechCorp&industry=Technology&location=London&sort=newest&limit=10&page=1
```

**Response (200 OK):**
```json
{
  "jobs": [
    {
      "job_id": 1,
      "title": "Software Engineer",
      "company": "TechCorp",
      "description": "Join our innovative team...",
      "industry": "Technology",
      "location": "London",
      "job_level": "Junior",
      "role_type": "Full-time",
      "salary": "£35,000 - £45,000",
      "deadline": "2025-02-15T00:00:00.000Z",
      "is_active": true,
      "applicant_count": 25,
      "created_at": "2025-01-10T18:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1,
    "limit": 10,
    "offset": 0
  },
  "filters_applied": {
    "company": "TechCorp",
    "industry": "Technology",
    "location": "London",
    "sort": "newest"
  }
}
```

### **Job Filter Options**
**Request:**
```http
GET /api/jobs/filters
```

**Response (200 OK):**
```json
{
  "filters": {
    "companies": ["TechCorp", "DataCorp", "FinanceCorp"],
    "industries": ["Technology", "Finance", "Healthcare", "Education"],
    "locations": ["London", "Manchester", "Birmingham", "Edinburgh"],
    "job_levels": ["Internship", "Junior", "Mid-level", "Senior", "Executive"],
    "role_types": ["Full-time", "Part-time", "Contract", "Freelance"]
  }
}
```

---

## **🎯 Events**

### **Get All Events**
**Request:**
```http
GET /api/events
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "event_id": 1,
      "title": "Tech Networking Event",
      "company": "Tech Society",
      "description": "Connect with industry professionals and expand your network...",
      "industry": "Technology",
      "location": "London",
      "event_date": "2025-02-20T00:00:00.000Z",
      "event_time": "18:00:00",
      "is_active": true,
      "applicant_count": 45,
      "created_at": "2025-01-10T18:00:00.000Z"
    }
  ]
}
```

### **Advanced Event Search**
**Request:**
```http
GET /api/events/search?industry=Technology&location=London&date_from=2025-02-01&date_to=2025-02-28&sort=date_asc&limit=5&page=1
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "event_id": 1,
      "title": "Tech Networking Event",
      "company": "Tech Society",
      "description": "Connect with industry professionals...",
      "industry": "Technology",
      "location": "London",
      "event_date": "2025-02-20T00:00:00.000Z",
      "event_time": "18:00:00",
      "is_active": true,
      "applicant_count": 45,
      "created_at": "2025-01-10T18:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1,
    "limit": 5,
    "offset": 0
  },
  "filters_applied": {
    "industry": "Technology",
    "location": "London",
    "date_from": "2025-02-01",
    "date_to": "2025-02-28",
    "sort": "date_asc"
  }
}
```

---

## **📊 Jobseeker Dashboard (Enhanced)**

### **Full Dashboard with Jobs and Events**
**Request:**
```http
GET /api/jobseekers/1/full-dashboard
```

**Response (200 OK):**
```json
{
  "dashboard": {
    "appliedJobs": [
      {
        "job_id": 1,
        "title": "Software Engineer",
        "company": "TechCorp",
        "location": "London",
        "salary": "£35,000 - £45,000",
        "deadline": "2025-02-15T00:00:00.000Z",
        "applied_at": "2025-01-08T10:30:00.000Z"
      }
    ],
    "savedJobs": [
      {
        "job_id": 2,
        "title": "Data Analyst",
        "company": "DataCorp",
        "location": "Manchester",
        "salary": "£30,000 - £40,000",
        "deadline": "2025-02-20T00:00:00.000Z",
        "saved_at": "2025-01-09T14:20:00.000Z"
      }
    ],
    "appliedEvents": [
      {
        "event_id": 1,
        "title": "Tech Networking Event",
        "company": "Tech Society",
        "location": "London",
        "event_date": "2025-02-20T00:00:00.000Z",
        "event_time": "18:00:00",
        "applied_at": "2025-01-08T15:45:00.000Z"
      }
    ],
    "savedEvents": [
      {
        "event_id": 2,
        "title": "Career Fair 2025",
        "company": "Business Society",
        "location": "Manchester",
        "event_date": "2025-03-15T00:00:00.000Z",
        "event_time": "10:00:00",
        "saved_at": "2025-01-09T11:30:00.000Z"
      }
    ],
    "totalAppliedJobs": 1,
    "totalSavedJobs": 1,
    "totalAppliedEvents": 1,
    "totalSavedEvents": 1,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 4
    }
  }
}
```

### **Apply for Job**
**Request:**
```http
POST /api/jobseekers/1/apply/123
```

**Response (201 Created):**
```json
{
  "message": "Successfully applied for job",
  "application": {
    "jobseeker_id": 1,
    "job_id": 123,
    "applied_at": "2025-01-10T15:00:00.000Z"
  }
}
```

### **Save Event**
**Request:**
```http
POST /api/jobseekers/1/save-event/456
```

**Response (201 Created):**
```json
{
  "message": "Event saved successfully",
  "saved_event": {
    "jobseeker_id": 1,
    "event_id": 456,
    "saved_at": "2025-01-10T15:05:00.000Z"
  }
}
```

---

## **❌ Error Responses**

### **Validation Error**
**Response (400 Bad Request):**
```json
{
  "message": "Password must be at least 8 characters long"
}
```

### **Duplicate Email**
**Response (409 Conflict):**
```json
{
  "msg": "Email already exists"
}
```

### **Not Found**
**Response (404 Not Found):**
```json
{
  "msg": "Jobseeker not found"
}
```

### **Already Applied**
**Response (409 Conflict):**
```json
{
  "msg": "Already applied for this job"
}
```

### **Server Error**
**Response (500 Internal Server Error):**
```json
{
  "msg": "Internal server error"
}
```

---

## **🔍 Query Parameters**

### **Pagination**
- `limit` - Number of items per page (default: 10, max: 100)
- `page` - Page number (default: 1)
- `offset` - Number of items to skip

### **Job/Event Filtering**
- `company` - Filter by company name
- `industry` - Filter by industry
- `location` - Filter by location
- `job_level` - Filter by job level (jobs only)
- `role_type` - Filter by role type (jobs only)
- `date_from` - Filter events from date (YYYY-MM-DD)
- `date_to` - Filter events to date (YYYY-MM-DD)

### **Sorting**
- `sort` - Sort order:
  - Jobs: `newest`, `oldest`, `popular`, `company`, `title`
  - Events: `date_asc`, `date_desc`, `popular`, `newest`, `oldest`

### **Example Usage**
```http
GET /api/jobs/search?industry=Technology&location=London&job_level=Junior&sort=newest&limit=20&page=1
GET /api/events/search?date_from=2025-02-01&date_to=2025-02-28&industry=Technology&sort=date_asc
```

This comprehensive documentation provides developers with complete examples of all API responses, making integration straightforward and efficient! 🚀