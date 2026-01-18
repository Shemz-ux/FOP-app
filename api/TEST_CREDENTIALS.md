# Test Database Credentials

## Admin Users
| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@fop.com | Admin123! | super_admin | Sarah Johnson |
| john.admin@fop.com | Admin123! | admin | John Smith |
| emma.admin@fop.com | Admin123! | admin | Emma Williams |

## Jobseekers

### University Students
| Email | Password | Name | University | Year | Degree |
|-------|----------|------|------------|------|--------|
| alex.chen@student.com | Student123! | Alex Chen | King's College London | 2nd | BSc Computer Science |
| maya.patel@student.com | Student123! | Maya Patel | Imperial College London | 3rd | BEng Mechanical Engineering |
| james.wilson@student.com | Student123! | James Wilson | University of Manchester | 1st | BA Economics |

### A-Level Students
| Email | Password | Name | School | Subjects |
|-------|----------|------|--------|----------|
| sophie.brown@student.com | Student123! | Sophie Brown | Harris Academy Barking | Maths, Physics, Chemistry, Further Maths |
| oliver.davis@student.com | Student123! | Oliver Davis | Newham Sixth Form College | English, History, Politics, Economics |

## Societies
| Name | Email | Password |
|------|-------|----------|
| Tech Society | tech@society.com | Society123! |
| Business Society | business@society.com | Society123! |
| Engineering Society | engineering@society.com | Society123! |

## Notes
- All passwords follow the same pattern for easy testing
- Admin backdoor token: `admin_backdoor_2024` (from env)
- Database includes realistic jobs (virtual & in-person), events (online & in-person), and resources
