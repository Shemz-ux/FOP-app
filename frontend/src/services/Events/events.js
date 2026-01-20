export const mockEvents = [
  {
    id: 'tech-career-fair-2026',
    title: 'Tech Career Fair 2026',
    organiser: 'TechConnect',
    date: 'January 15, 2026',
    time: '10:00 AM - 4:00 PM',
    location: 'San Francisco Convention Center',
    attendees: 250,
    description: 'Meet with top tech companies hiring for engineering, design, and product roles. Network with industry professionals and learn about exciting opportunities.',
    tags: [
      { label: 'Career Fair', variant: 'purple' },
      { label: 'In-Person', variant: 'green' },
      { label: 'Tech', variant: 'blue' },
    ],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    id: 'ux-design-workshop',
    title: 'UX Design Workshop',
    organiser: 'Design Masters Inc',
    date: 'January 20, 2026',
    time: '2:00 PM - 5:00 PM',
    location: 'Virtual Event',
    attendees: 180,
    description: 'Learn advanced UX design techniques from industry experts. Hands-on workshop covering user research, wireframing, prototyping, and user testing.',
    tags: [
      { label: 'Workshop', variant: 'pink' },
      { label: 'Virtual', variant: 'orange' },
      { label: 'Design', variant: 'teal' },
    ],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  },
  {
    id: 'startup-networking-night',
    title: 'Startup Networking Night',
    organiser: 'StartupHub',
    date: 'January 25, 2026',
    time: '6:00 PM - 9:00 PM',
    location: 'Downtown Tech Hub',
    attendees: 120,
    description: 'Connect with startup founders, investors, and fellow entrepreneurs. Great opportunity to expand your network and discover new opportunities in the startup ecosystem.',
    tags: [
      { label: 'Networking', variant: 'purple' },
      { label: 'In-Person', variant: 'green' },
      { label: 'Startup', variant: 'blue' },
    ],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  },
  {
    title: 'Data Science Summit',
    organiser: 'DataPro Association',
    date: 'February 1, 2026',
    time: '9:00 AM - 6:00 PM',
    location: 'Boston Convention Center',
    attendees: 400,
    description: 'Full-day conference featuring talks from leading data scientists, hands-on workshops, and networking sessions. Learn about the latest trends in ML, AI, and data analytics.',
    tags: [
      { label: 'Conference', variant: 'pink' },
      { label: 'In-Person', variant: 'green' },
      { label: 'Data Science', variant: 'purple' },
    ],
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
  },
  {
    title: 'Product Management Bootcamp',
    organiser: 'PM Academy',
    date: 'February 5, 2026',
    time: '1:00 PM - 4:00 PM',
    location: 'Virtual Event',
    attendees: 200,
    description: 'Intensive bootcamp covering product strategy, roadmapping, stakeholder management, and metrics. Perfect for aspiring and current product managers.',
    tags: [
      { label: 'Bootcamp', variant: 'orange' },
      { label: 'Virtual', variant: 'orange' },
      { label: 'Product', variant: 'teal' },
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  },
  {
    title: 'Women in Tech Panel',
    organiser: 'WomenTech Global',
    date: 'February 10, 2026',
    time: '7:00 PM - 9:00 PM',
    location: 'Tech Campus Auditorium',
    attendees: 150,
    description: 'Inspiring panel discussion with successful women leaders in technology. Hear their stories, challenges, and advice for breaking into and advancing in tech careers.',
    tags: [
      { label: 'Panel', variant: 'pink' },
      { label: 'In-Person', variant: 'green' },
      { label: 'Diversity', variant: 'blue' },
    ],
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  },
];

export const mockEventDetails = [
  {
    id: 'tech-career-fair-2026',
    title: 'Tech Career Fair 2026',
    organiser: 'TechConnect',
    date: 'January 15, 2026',
    time: '10:00 AM - 4:00 PM',
    location: 'San Francisco Convention Center',
    address: '747 Howard St, San Francisco, CA 94103',
    attendees: 250,
    capacity: 500,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    description: `
      <h3>About This Event</h3>
      <p>Join us for the largest tech career fair of 2026! Meet with top tech companies hiring for engineering, design, and product roles. This is your opportunity to connect with recruiters, learn about exciting opportunities, and take your career to the next level.</p>
      
      <h3>What to Expect</h3>
      <ul>
        <li>50+ top tech companies with open positions</li>
        <li>On-site interviews and resume reviews</li>
        <li>Networking sessions with industry professionals</li>
        <li>Career development workshops and panels</li>
        <li>Free headshots and resume printing</li>
      </ul>
      
      <h3>Featured Companies</h3>
      <ul>
        <li>Google</li>
        <li>Meta</li>
        <li>Apple</li>
        <li>Amazon</li>
        <li>Microsoft</li>
        <li>And many more!</li>
      </ul>
      
      <h3>Schedule</h3>
      <ul>
        <li>10:00 AM - Registration & Networking</li>
        <li>11:00 AM - Opening Keynote</li>
        <li>12:00 PM - Career Fair Begins</li>
        <li>2:00 PM - Panel Discussion: Breaking into Tech</li>
        <li>3:00 PM - Speed Networking</li>
        <li>4:00 PM - Event Closes</li>
      </ul>
      
      <h3>Who Should Attend</h3>
      <ul>
        <li>Recent graduates and students</li>
        <li>Experienced professionals looking for new opportunities</li>
        <li>Career changers interested in tech</li>
        <li>Anyone passionate about technology</li>
      </ul>
    `,
    tags: [
      { label: 'Career Fair', variant: 'purple'},
      { label: 'In-Person', variant: 'green'},
      { label: 'Tech', variant: 'blue'},
    ],
  },
  {
    id: 'ux-design-workshop',
    title: 'UX Design Workshop',
    organiser: 'Design Masters Inc',
    date: 'January 20, 2026',
    time: '2:00 PM - 5:00 PM',
    location: 'Virtual Event',
    address: 'Online via Zoom',
    attendees: 180,
    capacity: 200,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    description: `
      <h3>Workshop Overview</h3>
      <p>Learn advanced UX design techniques from industry experts in this hands-on virtual workshop. Perfect for designers looking to level up their skills and learn the latest design methodologies.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>User research and persona development</li>
        <li>Information architecture and user flows</li>
        <li>Wireframing and prototyping best practices</li>
        <li>Usability testing methods</li>
        <li>Design system creation</li>
        <li>Accessibility in design</li>
      </ul>
      
      <h3>Workshop Format</h3>
      <ul>
        <li>Interactive presentations</li>
        <li>Hands-on design exercises</li>
        <li>Group discussions and critiques</li>
        <li>Q&A with expert instructors</li>
        <li>Take-home resources and templates</li>
      </ul>
      
      <h3>Instructors</h3>
      <p>Our workshop is led by senior designers from leading tech companies with over 15 years of combined experience in UX design.</p>
      
      <h3>Requirements</h3>
      <ul>
        <li>Basic understanding of design principles</li>
        <li>Figma or Sketch installed (free versions work)</li>
        <li>Stable internet connection</li>
        <li>Willingness to participate and share ideas</li>
      </ul>
    `,
    tags: [
      { label: 'Workshop', variant: 'pink'},
      { label: 'Virtual', variant: 'orange'},
      { label: 'Design', variant: 'teal'},
    ],
  },
  {
    id: 'startup-networking-night',
    title: 'Startup Networking Night',
    organiser: 'StartupHub',
    date: 'January 25, 2026',
    time: '6:00 PM - 9:00 PM',
    location: 'WeWork Market Street',
    address: '535 Mission St, San Francisco, CA 94105',
    attendees: 120,
    capacity: 150,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    description: `
      <h3>Event Description</h3>
      <p>Connect with founders, investors, and fellow startup enthusiasts at our monthly networking event. Whether you're looking for co-founders, investors, or just want to meet like-minded people, this is the place to be!</p>
      
      <h3>Agenda</h3>
      <ul>
        <li>6:00 PM - Registration & Welcome Drinks</li>
        <li>6:30 PM - Lightning Talks from Local Founders</li>
        <li>7:15 PM - Networking Sessions</li>
        <li>8:00 PM - Startup Pitch Competition</li>
        <li>8:30 PM - More Networking & Refreshments</li>
      </ul>
      
      <h3>Who You'll Meet</h3>
      <ul>
        <li>Startup founders and co-founders</li>
        <li>Angel investors and VCs</li>
        <li>Engineers and designers</li>
        <li>Product managers and marketers</li>
        <li>Anyone interested in the startup ecosystem</li>
      </ul>
    `,
    tags: [
      { label: 'Networking', variant: 'purple'},
      { label: 'In-Person', variant: 'green'},
      { label: 'Startup', variant: 'pink'},
    ],
  },
];