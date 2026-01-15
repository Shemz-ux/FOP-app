export const mockJobs = [
  { id: 1, title: 'Software Engineer', company: 'Tech Corp', applicants: 45, posted: '2025-01-10', status: 'active' },
  { id: 2, title: 'Data Analyst', company: 'Data Inc', applicants: 32, posted: '2025-01-12', status: 'active' },
  { id: 3, title: 'Product Manager', company: 'Product Co', applicants: 28, posted: '2025-01-08', status: 'closed' },
  { id: 4, title: 'UX Designer', company: 'Design Studio', applicants: 21, posted: '2025-01-14', status: 'active' },
];

export const mockEvents = [
  { id: 1, title: 'Career Fair 2025', date: '2025-02-15', attendees: 150, organizer: 'Tech Society', status: 'upcoming' },
  { id: 2, title: 'Networking Night', date: '2025-01-28', attendees: 85, organizer: 'Business Society', status: 'upcoming' },
  { id: 3, title: 'Workshop: Resume Writing', date: '2025-01-05', attendees: 60, organizer: 'Career Services', status: 'completed' },
];

export const mockResources = [
  { id: 1, title: 'CV Template Pack', type: 'Document', downloads: 234, posted: '2025-01-01' },
  { id: 2, title: 'Interview Prep Guide', type: 'PDF', downloads: 189, posted: '2025-01-05' },
  { id: 3, title: 'Coding Interview Questions', type: 'Video', downloads: 156, posted: '2025-01-10' },
];

export const mockStudents = [
  { id: 1, name: 'John Doe', email: 'john@example.com', university: "King's College London", year: '2nd', course: 'Computer Science' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', university: 'Imperial College', year: '3rd', course: 'Engineering' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', university: 'UCL', year: '1st', course: 'Business' },
];

export const mockSocieties = [
  { id: 1, name: 'Tech Society', university: "King's College London", members: 250, contact: 'tech@kcl.ac.uk' },
  { id: 2, name: 'Business Society', university: 'Imperial College', members: 180, contact: 'business@imperial.ac.uk' },
  { id: 3, name: 'Engineering Society', university: 'UCL', members: 200, contact: 'eng@ucl.ac.uk' },
];

export const mockApplicants = [
  { id: 1, name: 'Alice Brown', email: 'alice@example.com', university: "King's College London", appliedDate: '2025-01-11', status: 'pending' },
  { id: 2, name: 'Bob Wilson', email: 'bob@example.com', university: 'Imperial College', appliedDate: '2025-01-12', status: 'reviewed' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', university: 'UCL', appliedDate: '2025-01-13', status: 'pending' },
  { id: 4, name: 'Diana Evans', email: 'diana@example.com', university: "King's College London", appliedDate: '2025-01-14', status: 'shortlisted' },
];

export const mockAttendees = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', university: "King's College London", registeredDate: '2025-01-20', status: 'confirmed' },
  { id: 2, name: 'Tom Wilson', email: 'tom@example.com', university: 'Imperial College', registeredDate: '2025-01-21', status: 'confirmed' },
  { id: 3, name: 'Emma Davis', email: 'emma@example.com', university: 'UCL', registeredDate: '2025-01-22', status: 'waitlist' },
  { id: 4, name: 'James Brown', email: 'james@example.com', university: "King's College London", registeredDate: '2025-01-23', status: 'confirmed' },
];

export const mockApplicantProfiles = {
  1: {
    id: 1,
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+44 7700 900123',
    university: "King's College London",
    course: 'Computer Science',
    year: '3rd Year',
    graduationDate: '2026-06',
    appliedDate: '2025-01-11',
    status: 'pending',
    cvUrl: '/cv/alice-brown.pdf',
    coverLetter: 'I am writing to express my strong interest in the Software Engineer position...',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    experience: [
      { title: 'Software Engineering Intern', company: 'StartupXYZ', period: 'Summer 2024', description: 'Developed full-stack web applications using React and Node.js' },
      { title: 'Teaching Assistant', company: "King's College London", period: '2024-Present', description: 'Assisted in teaching introductory programming courses' }
    ],
    education: [
      { degree: 'BSc Computer Science', institution: "King's College London", period: '2023-2026', grade: 'First Class Honours (Expected)' }
    ],
    linkedIn: 'linkedin.com/in/alicebrown',
    github: 'github.com/alicebrown',
    portfolio: 'alicebrown.dev'
  },
  2: {
    id: 2,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+44 7700 900456',
    university: 'Imperial College',
    course: 'Data Science',
    year: '2nd Year',
    graduationDate: '2027-06',
    appliedDate: '2025-01-12',
    status: 'reviewed',
    cvUrl: '/cv/bob-wilson.pdf',
    coverLetter: 'As a passionate data scientist with strong analytical skills...',
    skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau'],
    experience: [
      { title: 'Data Analytics Intern', company: 'FinTech Solutions', period: 'Summer 2024', description: 'Analyzed financial data and created predictive models' }
    ],
    education: [
      { degree: 'BSc Data Science', institution: 'Imperial College', period: '2025-2027', grade: '2:1 (Expected)' }
    ],
    linkedIn: 'linkedin.com/in/bobwilson',
    github: 'github.com/bobwilson',
    portfolio: null
  },
  3: {
    id: 3,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    phone: '+44 7700 900789',
    university: 'UCL',
    course: 'Business Management',
    year: '4th Year',
    graduationDate: '2025-06',
    appliedDate: '2025-01-13',
    status: 'pending',
    cvUrl: '/cv/charlie-davis.pdf',
    coverLetter: 'With my background in business management and product strategy...',
    skills: ['Product Management', 'Agile', 'Market Research', 'Data Analysis', 'Stakeholder Management'],
    experience: [
      { title: 'Product Management Intern', company: 'E-commerce Ltd', period: 'Summer 2024', description: 'Managed product roadmap and coordinated with development teams' },
      { title: 'Business Analyst', company: 'Consulting Group', period: '2023-2024', description: 'Conducted market research and business analysis for clients' }
    ],
    education: [
      { degree: 'BSc Business Management', institution: 'UCL', period: '2021-2025', grade: 'First Class Honours (Expected)' }
    ],
    linkedIn: 'linkedin.com/in/charliedavis',
    github: null,
    portfolio: null
  },
  4: {
    id: 4,
    name: 'Diana Evans',
    email: 'diana@example.com',
    phone: '+44 7700 900321',
    university: "King's College London",
    course: 'Design & Digital Media',
    year: '3rd Year',
    graduationDate: '2026-06',
    appliedDate: '2025-01-14',
    status: 'shortlisted',
    cvUrl: '/cv/diana-evans.pdf',
    coverLetter: 'I am excited to apply for the UX Designer position as someone who is passionate about creating user-centered designs...',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'UI/UX Design', 'HTML/CSS'],
    experience: [
      { title: 'UX Design Intern', company: 'Creative Agency', period: 'Summer 2024', description: 'Designed user interfaces and conducted usability testing' },
      { title: 'Freelance Designer', company: 'Self-employed', period: '2023-Present', description: 'Created brand identities and websites for small businesses' }
    ],
    education: [
      { degree: 'BA Design & Digital Media', institution: "King's College London", period: '2023-2026', grade: 'First Class Honours (Expected)' }
    ],
    linkedIn: 'linkedin.com/in/dianaevans',
    github: null,
    portfolio: 'dianaevans.design'
  }
};

export const mockAttendeeProfiles = {
  1: {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+44 7700 900111',
    university: "King's College London",
    course: 'Economics',
    year: '2nd Year',
    registeredDate: '2025-01-20',
    status: 'confirmed',
    dietaryRequirements: 'Vegetarian',
    accessibility: 'None',
    interests: ['Finance', 'Consulting', 'Investment Banking'],
    previousEvents: ['Career Fair 2024', 'Finance Workshop'],
    linkedIn: 'linkedin.com/in/sarahjohnson',
    questions: 'Will there be opportunities to speak with recruiters one-on-one?'
  },
  2: {
    id: 2,
    name: 'Tom Wilson',
    email: 'tom@example.com',
    phone: '+44 7700 900222',
    university: 'Imperial College',
    course: 'Mechanical Engineering',
    year: '4th Year',
    registeredDate: '2025-01-21',
    status: 'confirmed',
    dietaryRequirements: 'None',
    accessibility: 'None',
    interests: ['Engineering', 'Automotive', 'Renewable Energy'],
    previousEvents: ['Engineering Expo 2024'],
    linkedIn: 'linkedin.com/in/tomwilson',
    questions: null
  },
  3: {
    id: 3,
    name: 'Emma Davis',
    email: 'emma@example.com',
    phone: '+44 7700 900333',
    university: 'UCL',
    course: 'Marketing',
    year: '1st Year',
    registeredDate: '2025-01-22',
    status: 'waitlist',
    dietaryRequirements: 'Vegan',
    accessibility: 'Wheelchair access required',
    interests: ['Digital Marketing', 'Brand Strategy', 'Social Media'],
    previousEvents: [],
    linkedIn: 'linkedin.com/in/emmadavis',
    questions: 'Is there parking available at the venue?'
  },
  4: {
    id: 4,
    name: 'James Brown',
    email: 'james@example.com',
    phone: '+44 7700 900444',
    university: "King's College London",
    course: 'Law',
    year: '3rd Year',
    registeredDate: '2025-01-23',
    status: 'confirmed',
    dietaryRequirements: 'Halal',
    accessibility: 'None',
    interests: ['Corporate Law', 'Legal Tech', 'Human Rights'],
    previousEvents: ['Law Society Networking 2024', 'Legal Careers Fair'],
    linkedIn: 'linkedin.com/in/jamesbrown',
    questions: null
  }
};
