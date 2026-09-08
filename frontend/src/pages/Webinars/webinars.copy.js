const testWebinars = [
  {
    webinar_id: 1,
    youtube_video_id: 'dQw4w9WgXcQ',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Cracking the Tech Interview: From CV to Offer',
    description: 'Walk through the full technical interview process — resume screening, coding rounds, system design, and salary negotiation — with a senior Google engineer who has conducted 200+ interviews.',
    category: 'Technology',
    thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: 3504, // 58:24 in seconds
    view_count: 14820,
    like_count: 1243,
    is_published: true,
    is_featured: true,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    webinar_id: 2,
    youtube_video_id: 'jNQXAC9IVRw',
    youtube_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    title: 'Graduate Scheme Secrets: What Recruiters Really Look For',
    description: 'Hear from recruitment leads at three FTSE 100 companies as they reveal exactly what elevates a candidate above the crowd during graduate scheme applications.',
    category: 'Business',
    thumbnail_url: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    duration: 2650, // 44:10 in seconds
    view_count: 9341,
    like_count: 782,
    is_published: true,
    is_featured: true,
    created_at: '2026-01-19T10:00:00Z',
    updated_at: '2026-01-19T10:00:00Z',
  },
  {
    webinar_id: 3,
    youtube_video_id: 'kJQP7kiw5Fk',
    youtube_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    title: 'Building a LinkedIn Profile That Gets You Noticed',
    description: 'A step-by-step walkthrough of turning a blank LinkedIn into a recruiter magnet — keyword optimisation, portfolio sections, and the content strategy that generates inbound opportunities.',
    category: 'Career Development',
    thumbnail_url: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    duration: 2207, // 36:47 in seconds
    view_count: 21503,
    like_count: 1876,
    is_published: true,
    is_featured: false,
    created_at: '2025-12-10T10:00:00Z',
    updated_at: '2025-12-10T10:00:00Z',
  },
  {
    webinar_id: 4,
    youtube_video_id: 'L_jWHffIx5E',
    youtube_url: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    title: 'Navigating Finance: Investment Banking vs. Big 4 vs. FinTech',
    description: 'Three panellists from different corners of finance compare culture, progression, pay, and how to decide which path is right for you as a graduate.',
    category: 'Finance',
    thumbnail_url: 'https://i.ytimg.com/vi/L_jWHffIx5E/maxresdefault.jpg',
    duration: 3725, // 1:02:05 in seconds
    view_count: 7688,
    like_count: 634,
    is_published: true,
    is_featured: true,
    created_at: '2025-12-03T10:00:00Z',
    updated_at: '2025-12-03T10:00:00Z',
  },
  {
    webinar_id: 5,
    youtube_video_id: '9bZkp7q19f0',
    youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    title: 'UX Portfolio Masterclass: Case Studies That Land Roles',
    description: 'A principal designer at Spotify tears apart and rebuilds a real graduate portfolio live, showing exactly what hiring managers want to see — and what kills applications instantly.',
    category: 'Design',
    thumbnail_url: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    duration: 3093, // 51:33 in seconds
    view_count: 11247,
    like_count: 923,
    is_published: true,
    is_featured: true,
    created_at: '2025-11-21T10:00:00Z',
    updated_at: '2025-11-21T10:00:00Z',
  },
  {
    webinar_id: 6,
    youtube_video_id: 'oHg5SJYRHA0',
    youtube_url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
    title: 'Negotiating Your First Salary Without Feeling Awkward',
    description: 'The scripts, frameworks, and psychology behind salary negotiation — including how to handle competing offers, delay tactics, and graceful counter-offers when you have no experience.',
    category: 'Career Development',
    thumbnail_url: 'https://i.ytimg.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
    duration: 2418, // 40:18 in seconds
    view_count: 18932,
    like_count: 1567,
    is_published: true,
    is_featured: true,
    created_at: '2025-11-07T10:00:00Z',
    updated_at: '2025-11-07T10:00:00Z',
  },
  {
    webinar_id: 7,
    youtube_video_id: 'RBSGKlAvoiM',
    youtube_url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
    title: 'Breaking Into Data Science: Roadmap for Non-CS Graduates',
    description: 'Actionable steps for humanities, social science, and business graduates who want to pivot into data science — covering tools, projects, certifications, and portfolio building.',
    category: 'Technology',
    thumbnail_url: 'https://i.ytimg.com/vi/RBSGKlAvoiM/maxresdefault.jpg',
    duration: 3341, // 55:41 in seconds
    view_count: 13105,
    like_count: 1089,
    is_published: true,
    is_featured: false,
    created_at: '2025-10-30T10:00:00Z',
    updated_at: '2025-10-30T10:00:00Z',
  },
  {
    webinar_id: 8,
    youtube_video_id: 'y8Kyi0WNg40',
    youtube_url: 'https://www.youtube.com/watch?v=y8Kyi0WNg40',
    title: 'Assessment Centre Survival Guide',
    description: 'From group exercises to in-tray tasks to partner interviews — this session gives you an insider breakdown of every assessment centre format and how to perform at your peak.',
    category: 'Career Development',
    thumbnail_url: 'https://i.ytimg.com/vi/y8Kyi0WNg40/maxresdefault.jpg',
    duration: 2889, // 48:09 in seconds
    view_count: 8563,
    like_count: 712,
    is_published: true,
    is_featured: false,
    created_at: '2025-10-15T10:00:00Z',
    updated_at: '2025-10-15T10:00:00Z',
  },
  {
    webinar_id: 9,
    youtube_video_id: 'hY14Er6JX2s',
    youtube_url: 'https://www.youtube.com/watch?v=hY14Er6JX2s',
    title: 'Startup vs. Corporate: Choosing Your First Job Wisely',
    description: 'Two founders and two corporate executives debate the real trade-offs — learning speed, stability, equity, mentorship, and what each environment actually teaches you in years one and two.',
    category: 'Business',
    thumbnail_url: 'https://i.ytimg.com/vi/hY14Er6JX2s/maxresdefault.jpg',
    duration: 3922, // 1:05:22 in seconds
    view_count: 6274,
    like_count: 521,
    is_published: true,
    is_featured: false,
    created_at: '2025-09-28T10:00:00Z',
    updated_at: '2025-09-28T10:00:00Z',
  },
];

const testCategories = [
  { category: 'Technology', count: 2 },
  { category: 'Business', count: 2 },
  { category: 'Career Development', count: 3 },
  { category: 'Finance', count: 1 },
  { category: 'Design', count: 1 },
];

// All copywriting text for the webinars page
const webinarsCopy = {
  hero: {
    title: 'Career Webinars',
    subtitle: 'Learn from industry professionals through on-demand recorded sessions covering interviews, career development, and industry insights',
    statsLabels: {
      sessions: 'sessions',
      views: 'total views',
      free: 'Free',
      freeSubtext: 'always'
    }
  },
  featured: {
    title: 'Featured Webinars',
    subtitle: 'Top picks this month'
  },
  search: {
    placeholder: 'Search by title, description, or category...'
  },
  grid: {
    allWebinarsTitle: 'All Webinars',
    resultsTitle: 'Results',
    filterLabel: 'video',
    filterLabelPlural: 'videos',
    emptyState: {
      title: 'No webinars found',
      message: 'Try adjusting your search or category filter'
    }
  }
};

export { testWebinars, testCategories, webinarsCopy };
