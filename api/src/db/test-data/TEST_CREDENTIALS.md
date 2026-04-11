# Test Account Credentials

This document contains login credentials for all test accounts in the database. Use these credentials to test different user types and features.

---

## 🔐 Admin Accounts

All admin accounts use the password: **`Admin123!`**

| Name | Email | Role | Description |
|------|-------|------|-------------|
| Sarah Johnson | admin@fop.com | Super Admin | Full system access |
| John Smith | john.admin@fop.com | Admin | Standard admin access |
| Emma Williams | emma.admin@fop.com | Admin | Standard admin access |
| Michael Brown | michael.admin@fop.com | Admin | Standard admin access |

---

## 👨‍🎓 Jobseeker Accounts (University Students)

All jobseeker accounts use the password: **`Student123!`**

### Computer Science & Tech Students

| Name | Email | University | Year | Degree |
|------|-------|------------|------|--------|
| Alex Chen | alex.chen@student.com | King's College London | 2nd | BSc Computer Science |
| Fatima Ahmed | fatima.ahmed@student.com | University College London | 2nd | BSc Data Science |
| Yuki Tanaka | yuki.tanaka@student.com | Imperial College London | Masters | MSc Artificial Intelligence |
| Amir Hassan | amir.hassan@student.com | University of Birmingham | 2nd | BSc Cybersecurity |

### Engineering Students

| Name | Email | University | Year | Degree |
|------|-------|------------|------|--------|
| Maya Patel | maya.patel@student.com | Imperial College London | 3rd | BEng Mechanical Engineering |
| Marcus Thompson | marcus.thompson@student.com | University of Bristol | 1st | BEng Civil Engineering |
| Noah Kim | noah.kim@student.com | University of Southampton | 1st | BEng Electrical Engineering |

### Business & Finance Students

| Name | Email | University | Year | Degree |
|------|-------|------------|------|--------|
| James Wilson | james.wilson@student.com | University of Manchester | 1st | BA Economics |
| Priya Sharma | priya.sharma@student.com | London School of Economics | 2nd | BSc Finance |
| Sophie Martin | sophie.martin@student.com | University of Warwick | 3rd | BA Marketing |

### Law Students

| Name | Email | University | Year | Degree |
|------|-------|------------|------|--------|
| Liam O'Connor | liam.oconnor@student.com | University of Edinburgh | 3rd | LLB Law |

### Other Disciplines

| Name | Email | University | Year | Degree |
|------|-------|------------|------|--------|
| Olivia Davies | olivia.davies@student.com | University of Leeds | 1st | BA Psychology |
| Daniel Rodriguez | daniel.rodriguez@student.com | University of Oxford | 3rd | BSc Physics |
| Amara Okafor | amara.okafor@student.com | University of Cambridge | 2nd | BMed Medicine |
| Isabella Garcia | isabella.garcia@student.com | University of Manchester | PhD Year 2 | PhD Biotechnology |

---

## 🎓 Jobseeker Accounts (School Students)

All school student accounts use the password: **`Student123!`**

### GCSE Students

| Name | Email | School | Subjects |
|------|-------|--------|----------|
| Emily Taylor | emily.taylor@student.com | Eastbrook School | Maths, English, Science, History |
| Chloe Evans | chloe.evans@student.com | St. Mary's School | English, Art, Drama, Music |
| Mia Lewis | mia.lewis@student.com | Community School | English, Maths, Geography, French |

### A-Level Students

| Name | Email | School | Subjects |
|------|-------|--------|----------|
| Sophie Brown | sophie.brown@student.com | Harris Academy Barking | Maths, Physics, Chemistry, Further Maths |
| Ryan Murphy | ryan.murphy@student.com | Sixth Form College | Economics, Business, Maths, History |
| Zara Ali | zara.ali@student.com | London Academy | Biology, Chemistry, Psychology, Maths |
| Ethan Walker | ethan.walker@student.com | Grammar School | Computer Science, Maths, Physics, Further Maths |
| Aaliyah Mohammed | aaliyah.mohammed@student.com | City Academy | Law, Politics, History, English |

### BTEC Students

| Name | Email | School | Subjects |
|------|-------|--------|----------|
| Oliver Davis | oliver.davis@student.com | Newham Sixth Form College | Business, IT, Media, Law |
| Jack Robinson | jack.robinson@student.com | Technical College | Engineering, Design, Maths, Physics |

---

## 🏛️ Society Accounts

All society accounts use the password: **`Society123!`**

| Society Name | Email | University | Members |
|--------------|-------|------------|---------|
| Tech Society | tech@society.com | King's College London | 450 |
| Business Society | business@society.com | Imperial College London | 380 |
| Engineering Society | engineering@society.com | University of Manchester | 520 |
| Finance Society | finance@society.com | London School of Economics | 600 |
| Law Society | law@society.com | University of Oxford | 340 |
| Marketing Society | marketing@society.com | University of Warwick | 290 |
| AI & Data Science Society | ai@society.com | University College London | 410 |
| Cybersecurity Society | cybersec@society.com | University of Birmingham | 275 |
| Medical Society | medical@society.com | University of Cambridge | 480 |
| Entrepreneurs Society | entrepreneurs@society.com | University of Edinburgh | 320 |

---

## 📊 Database Statistics

- **Total Admins:** 4
- **Total Jobseekers:** 25 (15 university + 10 school students)
- **Total Societies:** 10
- **Total Jobs:** 30 diverse opportunities
- **Total Events:** 20 diverse events
- **Total Resources:** 20 career resources
- **Total Relationships:** Hundreds of saved/applied jobs and events

---

## 🧪 Testing Scenarios

### Test User Permissions

1. **Admin Testing**
   - Login: `admin@fop.com` / `Admin123!`
   - Test: Full dashboard access, user management, content moderation

2. **Jobseeker Testing**
   - Login: `alex.chen@student.com` / `Student123!`
   - Test: Apply to jobs, save jobs, register for events, download resources

3. **Society Testing**
   - Login: `tech@society.com` / `Society123!`
   - Test: Save jobs (no apply), register for events, access resources

### Test Different User Profiles

- **First-generation students:** `fatima.ahmed@student.com`, `marcus.thompson@student.com`
- **Free school meals eligible:** `james.wilson@student.com`, `amir.hassan@student.com`
- **Postgraduate students:** `yuki.tanaka@student.com`
- **PhD students:** `isabella.garcia@student.com`
- **School students:** `sophie.brown@student.com`, `oliver.davis@student.com`

### Test Application Workflows

1. Browse jobs as jobseeker
2. Save jobs for later
3. Apply to jobs
4. Register for events
5. Download career resources
6. View dashboard with saved/applied items

---

## 🔒 Security Notes

- These are **test credentials only** - never use in production
- All passwords are hashed using bcrypt with 10 salt rounds
- Change all passwords before deploying to production
- Consider implementing password reset functionality

---

## 🚀 Quick Start

To seed the database with this test data:

```bash
cd api
npm run reset // Reset database
npm run setup // Create tables
npm run seed // Seed data
```

Or manually:

```bash
node src/db/seed-db.js
```

---

**Last Updated:** April 2026
