export const mockJobs = [
  {
    id: "meta-product-designer",
    company: "Meta",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    companyColor: "#0084FF",
    jobTitle: "Product designer",
    applicants: 29,
    description:
      "Doing the right thing for investors is what we're all about at Vanguard, and that includes...",
    tags: [
      { label: "Entry level", variant: "purple" },
      { label: "Full-Time", variant: "green" },
      { label: "Remote", variant: "orange" },
    ],
    postedTime: "12 days ago",
  },
  {
    id: "netflix-sr-ux-designer",
    company: "Netflix",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    companyColor: "#E50914",
    jobTitle: "Sr. UX Designer",
    applicants: 52,
    description:
      "Netflix is one of the world's leading streaming entertainment service with over 200 million...",
    tags: [
      { label: "Expert", variant: "pink" },
      { label: "Part-Time", variant: "teal" },
      { label: "Remote", variant: "orange" },
    ],
    postedTime: "5 days ago",
  },
  {
    id: "microsoft-product-designer",
    company: "Microsoft",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    companyColor: "#00A4EF",
    jobTitle: "Product designer",
    applicants: 58,
    description:
      "Welcome to Lightspeed LA, the first U.S.-based, AAA game development studio founded...",
    tags: [
      { label: "Intermediate", variant: "purple" },
      { label: "Full-Time", variant: "green" },
    ],
    postedTime: "4 days ago",
  },
  {
    id: "reddit-product-designer",
    company: "Reddit",
    companyLogo:
      "https://www.redditinc.com/assets/images/site/reddit-logo.png",
    companyColor: "#FF4500",
    jobTitle: "Product designer",
    applicants: 39,
    description:
      "Preqin is how banks onboard their customers and manage risk on a platform that gives...",
    tags: [
      { label: "Expert", variant: "pink" },
      { label: "Part-Time", variant: "teal" },
    ],
    postedTime: "22 days ago",
  },
  {
    id: "google-backend-dev",
    company: "Google",
    companyLogo:
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    companyColor: "#4285F4",
    jobTitle: "Backend Dev.",
    applicants: 41,
    description:
      "Join the team at Google to build innovative solutions that impact billions of users...",
    tags: [
      { label: "Intermediate", variant: "purple" },
      { label: "Full-Time", variant: "green" },
    ],
    postedTime: "5 days ago",
  },
  {
    id: "spotify-smm-manager",
    company: "Spotify",
    companyLogo:
      "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png",
    companyColor: "#1DB954",
    jobTitle: "SMM Manager",
    applicants: 73,
    description:
      "Join us as we increase access to banking and financial services, helping banks and...",
    tags: [
      { label: "Intermediate", variant: "purple" },
      { label: "Full-Time", variant: "green" },
      { label: "Remote", variant: "orange" },
    ],
    postedTime: "8 days ago",
  },
];

// TODO: Find a way to implement description formatting and tags
export const mockJobDetails = [
   {
    id: 'meta-product-designer',
    company: 'Meta',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    companyColor: '#0084FF',
    jobTitle: 'Product Designer',
    location: 'Menlo Park, CA',
    salary: '$250/hr',
    employmentType: 'Full-Time',
    experienceLevel: 'Entry level',
    workType: 'Remote',
    applicants: 29,
    postedDate: '12 days ago',
    description: `
      <h3>About the Role</h3>
      <p>We're looking for a talented Product Designer to join our team at Meta. You'll be working on cutting-edge products that impact billions of users worldwide.</p>
      
      <h3>Responsibilities</h3>
      <ul>
        <li>Design innovative user experiences for Meta's family of apps</li>
        <li>Collaborate with cross-functional teams including engineers, product managers, and researchers</li>
        <li>Create high-fidelity mockups, prototypes, and design specifications</li>
        <li>Conduct user research and usability testing</li>
        <li>Present design concepts to stakeholders</li>
      </ul>
      
      <h3>Requirements</h3>
      <ul>
        <li>Bachelor's degree in Design, HCI, or related field</li>
        <li>2+ years of experience in product design</li>
        <li>Proficiency in Figma, Sketch, or similar design tools</li>
        <li>Strong portfolio demonstrating design thinking and execution</li>
        <li>Excellent communication and collaboration skills</li>
      </ul>
      
      <h3>Benefits</h3>
      <ul>
        <li>Competitive salary and equity package</li>
        <li>Comprehensive health, dental, and vision insurance</li>
        <li>Flexible work arrangements</li>
        <li>Professional development opportunities</li>
        <li>Free meals and wellness programs</li>
      </ul>
    `,
    tags: [
      { label: 'Entry level', variant: 'purple'},
      { label: 'Full-Time', variant: 'green'},
      { label: 'Remote', variant: 'orange'},
    ],
  },
  {
    id: 'netflix-sr-ux-designer',
    company: 'Netflix',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    companyColor: '#E50914',
    jobTitle: 'Sr. UX Designer',
    location: 'Los Angeles, CA',
    salary: '$195/hr',
    employmentType: 'Part-Time',
    experienceLevel: 'Expert',
    workType: 'Remote',
    applicants: 52,
    postedDate: '5 days ago',
    description: `
      <h3>About Netflix</h3>
      <p>Netflix is one of the world's leading streaming entertainment service with over 200 million paid memberships in over 190 countries.</p>
      
      <h3>The Role</h3>
      <p>We're seeking a Senior UX Designer to help shape the future of entertainment. You'll work on products that delight millions of users every day.</p>
      
      <h3>What You'll Do</h3>
      <ul>
        <li>Lead design initiatives for key Netflix products</li>
        <li>Mentor junior designers and provide design leadership</li>
        <li>Define and evolve design systems and patterns</li>
        <li>Partner with product and engineering to deliver exceptional experiences</li>
        <li>Conduct design critiques and workshops</li>
      </ul>
      
      <h3>What We're Looking For</h3>
      <ul>
        <li>7+ years of UX design experience</li>
        <li>Expert knowledge of design tools and methodologies</li>
        <li>Strong portfolio showcasing complex design problems solved</li>
        <li>Experience with A/B testing and data-driven design</li>
        <li>Passion for creating delightful user experiences</li>
      </ul>
    `,
    tags: [
      { label: 'Expert', variant: 'pink'},
      { label: 'Part-Time', variant: 'teal'},
      { label: 'Remote', variant: 'orange'},
    ],
  },
  {
    id: 'google-backend-dev',
    company: 'Google',
    companyLogo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    companyColor: '#4285F4',
    jobTitle: 'Backend Developer',
    location: 'Mountain View, CA',
    salary: '$260/hr',
    employmentType: 'Full-Time',
    experienceLevel: 'Intermediate',
    workType: 'Hybrid',
    applicants: 41,
    postedDate: '5 days ago',
    description: `
      <h3>About the Team</h3>
      <p>Join the team at Google to build innovative solutions that impact billions of users worldwide. Our backend systems power some of the most widely-used products on the planet.</p>
      
      <h3>What You'll Be Doing</h3>
      <ul>
        <li>Design and implement scalable backend services</li>
        <li>Write clean, maintainable, and efficient code</li>
        <li>Optimize application performance and reliability</li>
        <li>Collaborate with frontend engineers and product teams</li>
        <li>Participate in code reviews and technical discussions</li>
      </ul>
      
      <h3>Qualifications</h3>
      <ul>
        <li>Bachelor's degree in Computer Science or equivalent experience</li>
        <li>3+ years of backend development experience</li>
        <li>Proficiency in Java, Python, or Go</li>
        <li>Experience with distributed systems and microservices</li>
        <li>Strong understanding of databases and data structures</li>
      </ul>
      
      <h3>Preferred Qualifications</h3>
      <ul>
        <li>Experience with cloud platforms (GCP, AWS, or Azure)</li>
        <li>Knowledge of containerization (Docker, Kubernetes)</li>
        <li>Contributions to open source projects</li>
      </ul>
    `,
    tags: [
      { label: 'Intermediate', variant: 'purple'},
      { label: 'Full-Time', variant: 'green'},
    ],
  },
];