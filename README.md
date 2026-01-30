# FOP App - Setup Guide

A full-stack web application for First Opportunity Perspectives connecting students with job opportunities and career resources.

## Tech Stack

**Frontend:** React + Vite + TailwindCSS  
**Backend:** Node.js + Express + PostgreSQL  
**File Storage:** Cloudinary (images) + Cloudflare R2 (documents)  
**Email:** NodeMailer (SMTP)

---

## Quick Start

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v14+)
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd FOP-app

# Install backend dependencies
cd api
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

**Create PostgreSQL Database:**

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fop_test;

# Exit psql
\q
```

**Run Database Migrations:**

```bash
cd api
npm run setup
```

This creates all tables and seeds initial data.

### 3. Environment Configuration

#### Backend Setup (`/api/.env`)

Copy the example file and configure:

```bash
cd api
cp .env.example .env
```

**Edit `/api/.env`** - See `.env.example` for all options. Key configurations:

**Database (Required):**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fop_test"
```

**Server (Required):**
```env
PORT=5001
NODE_ENV=development
```

**JWT Secrets (Required):**
```env
JWT_SECRET=your_generated_secret_here
ADMIN_BACKDOOR_TOKEN=your_generated_token_here
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Email (Required for password reset):**

Option 1 - Mailtrap (Recommended for Development):
1. Sign up at https://mailtrap.io (free)
2. Go to Email Testing → Inboxes → SMTP Settings
3. Copy credentials:

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```

Option 2 - Gmail:
1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
```

**File Storage (Optional for testing, required for uploads):**

Cloudinary (Images):
1. Sign up at https://cloudinary.com (free tier)
2. Get credentials from Dashboard → Account Details:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Cloudflare R2 (Documents):
1. Sign up at https://cloudflare.com
2. Create R2 bucket
3. Generate API tokens:

```env
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
```

**Frontend URL:**
```env
FRONTEND_URL=http://localhost:5173
CONTACT_RECEIVER_EMAIL=your-email@example.com
```

#### Frontend Setup (`/frontend/.env`)

Create environment file:

```bash
cd frontend
touch .env
```

**Add to `/frontend/.env`:**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd api
npm run dev
```
Backend runs on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

---

## Create Admin Account

After setting up the database, create an admin user:

```bash
cd api
npm run create-admin <firstName> <lastName> <email> <password> [role]
```

**Examples:**

Create a regular admin:
```bash
npm run create-admin John Doe admin@fop.com SecurePassword123
```

Create a super admin:
```bash
npm run create-admin Jane Smith super@fop.com SecurePassword123 super_admin
```

**Roles:**
- `admin` - Regular admin (default)
- `super_admin` - Super admin with elevated privileges

**⚠️ Important:**
- Use a strong password (minimum 8 characters)
- Save credentials securely
- Change password after first login in production

---

## Testing

### Backend Tests
```bash
cd api
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## Common Issues

### Database Connection Failed
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL credentials match your PostgreSQL setup
- Verify database exists: `psql -U postgres -l`

### Email Not Sending
- For development, use Mailtrap (no real emails sent)
- Gmail may block login - use App Password, not regular password
- Check SMTP credentials are correct

### File Upload Errors
- Cloudinary/R2 credentials must be valid
- Check API keys haven't expired
- Verify bucket/cloud names are correct

### Port Already in Use
```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Default: `http://localhost:5173`

---

## Project Structure

```
FOP-app/
├── api/                    # Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database queries
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── db/            # Database setup
│   ├── .env               # Backend environment variables
│   └── package.json
│
├── frontend/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Helper functions
│   ├── .env              # Frontend environment variables
│   └── package.json
│
└── README.md             # This file
```

Proprietary - First Opportunity Perspectives
