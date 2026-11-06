// Dummy webinars for local development.
//
// Categories match the options in the admin webinar form
// (frontend/src/admin/Webinars/components/webinarForm.copy.js) so the public
// category filter and the form agree.
//
// Notes on the fake fields:
//   youtube_video_id  synthetic 11-character ids, so nothing here points at a
//                     real creator's video. The embedded player will not play
//                     in dev - swap in real ids if you need playback.
//   thumbnail_url     picsum.photos with a fixed seed, so the grid renders
//                     real, stable images instead of broken ones.
//   duration          seconds (the UI formats it as mm:ss).
//
// Shape of the set: 22 published + 2 drafts, which is 3 pages at 9 per page,
// 4 featured, every category represented, and one row with a null description
// to keep the "nullable description" path exercised.

const thumb = (seed) => `https://picsum.photos/seed/fop-webinar-${seed}/640/360`;

export const webinars = [
  {
    youtube_video_id: 'fopwbnr0001',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0001',
    title: 'Spring Week Applications: What Actually Gets You Through',
    description:
      'A walkthrough of the spring week application cycle, from choosing firms to the online tests, with a line-by-line look at two answers that made it to assessment centre.',
    category: 'CV & Applications',
    thumbnail_url: thumb('0001'),
    duration: 2730,
    published_at: '2026-10-02 18:00:00',
    created_at: '2026-10-02 18:00:00',
    view_count: 4820,
    like_count: 311,
    is_published: true,
    is_featured: true
  },
  {
    youtube_video_id: 'fopwbnr0002',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0002',
    title: 'The STAR Method, Properly: Competency Answers That Land',
    description:
      'Most candidates know STAR and still lose marks on the Result. We rebuild three weak answers live and show what interviewers are actually scoring.',
    category: 'Interview Prep',
    thumbnail_url: thumb('0002'),
    duration: 3180,
    published_at: '2026-09-24 18:30:00',
    created_at: '2026-09-24 18:30:00',
    view_count: 6140,
    like_count: 512,
    is_published: true,
    is_featured: true
  },
  {
    youtube_video_id: 'fopwbnr0003',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0003',
    title: 'Employer Insight: A Day in Investment Banking',
    description:
      'Three analysts talk through a real working day, the hours nobody advertises, and what they wish they had asked before accepting an offer.',
    category: 'Employer Insight Events',
    thumbnail_url: thumb('0003'),
    duration: 3540,
    published_at: '2026-09-11 17:00:00',
    created_at: '2026-09-11 17:00:00',
    view_count: 8930,
    like_count: 744,
    is_published: true,
    is_featured: true
  },
  {
    youtube_video_id: 'fopwbnr0004',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0004',
    title: 'One-Page CV Clinic: Five Real CVs Reviewed Live',
    description:
      'Five students submit their CVs and we edit them on screen. Covers ordering, the personal statement question, and how to write bullet points that show impact.',
    category: 'CV & Applications',
    thumbnail_url: thumb('0004'),
    duration: 2940,
    published_at: '2026-08-28 18:00:00',
    created_at: '2026-08-28 18:00:00',
    view_count: 5275,
    like_count: 402,
    is_published: true,
    is_featured: true
  },
  {
    youtube_video_id: 'fopwbnr0005',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0005',
    title: 'LinkedIn Without the Cringe: Building a Profile That Works',
    description:
      'How to write a headline and About section that sound like you, what recruiters actually search for, and a realistic weekly routine that takes ten minutes.',
    category: 'Linkedin & Networking',
    thumbnail_url: thumb('0005'),
    duration: 2280,
    published_at: '2026-08-14 18:00:00',
    created_at: '2026-08-14 18:00:00',
    view_count: 3610,
    like_count: 288,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0006',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0006',
    title: 'Cold Outreach That Gets Replies',
    description:
      'Templates are obvious and get ignored. We cover how to find the right person, what to put in the first two lines, and when to follow up.',
    category: 'Linkedin & Networking',
    thumbnail_url: thumb('0006'),
    duration: 1980,
    published_at: '2026-07-30 18:00:00',
    created_at: '2026-07-30 18:00:00',
    view_count: 2940,
    like_count: 201,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0007',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0007',
    title: 'Assessment Centres: The Group Exercise Decoded',
    description:
      'What assessors write on their scoresheets during the group task, how to contribute without dominating, and how to recover a group that has gone quiet.',
    category: 'Interview Prep',
    thumbnail_url: thumb('0007'),
    duration: 3300,
    published_at: '2026-07-16 18:30:00',
    created_at: '2026-07-16 18:30:00',
    view_count: 4455,
    like_count: 367,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0008',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0008',
    title: 'Commercial Awareness in 20 Minutes a Week',
    description:
      'A repeatable routine for keeping up with the news, plus how to turn what you read into an answer when they ask what story you have been following.',
    category: 'Career & Commercial Skills',
    thumbnail_url: thumb('0008'),
    duration: 1860,
    published_at: '2026-07-02 18:00:00',
    created_at: '2026-07-02 18:00:00',
    view_count: 7210,
    like_count: 598,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0009',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0009',
    title: 'Industry Insight: Careers in Renewable Energy',
    description:
      'Where the graduate roles actually sit in the energy transition, which degrees are relevant, and the routes in for non-STEM students.',
    category: 'Industry Insight Events',
    thumbnail_url: thumb('0009'),
    duration: 3120,
    published_at: '2026-06-18 17:30:00',
    created_at: '2026-06-18 17:30:00',
    view_count: 2180,
    like_count: 164,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0010',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0010',
    title: 'Apprenticeship or University? Making the Choice',
    description:
      'For school leavers weighing a degree apprenticeship against a traditional degree. Covers earnings, progression, and what employers say about both routes.',
    category: 'Job Search Strategy',
    thumbnail_url: thumb('0010'),
    duration: 2640,
    published_at: '2026-06-04 17:00:00',
    created_at: '2026-06-04 17:00:00',
    view_count: 5890,
    like_count: 487,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0011',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0011',
    title: 'Video Interviews: HireVue and Pre-Recorded Rounds',
    description:
      'Practical setup advice, how to use the preparation time, and why the first fifteen seconds of each answer matter more than the rest.',
    category: 'Interview Prep',
    thumbnail_url: thumb('0011'),
    duration: 2100,
    published_at: '2026-05-21 18:00:00',
    created_at: '2026-05-21 18:00:00',
    view_count: 4015,
    like_count: 322,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0012',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0012',
    title: 'Employer Insight: Inside a Big Four Graduate Scheme',
    // Intentionally null: description is nullable in the schema, and this keeps
    // the "webinar with no description" path covered in dev.
    description: null,
    category: 'Employer Insight Events',
    thumbnail_url: thumb('0012'),
    duration: 3420,
    published_at: '2026-05-07 17:30:00',
    created_at: '2026-05-07 17:30:00',
    view_count: 6680,
    like_count: 521,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0013',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0013',
    title: 'Numerical and Logical Tests: Practice That Transfers',
    description:
      'The question types that come up again and again, how to pace yourself, and which free practice banks are worth your time.',
    category: 'Interview Prep',
    thumbnail_url: thumb('0013'),
    duration: 2820,
    published_at: '2026-04-23 18:00:00',
    created_at: '2026-04-23 18:00:00',
    view_count: 3340,
    like_count: 245,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0014',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0014',
    title: 'Industry Insight: Breaking Into Tech Without a CS Degree',
    description:
      'Product, data, delivery and support roles that hire from any discipline, and the portfolio evidence that gets a non-technical applicant taken seriously.',
    category: 'Industry Insight Events',
    thumbnail_url: thumb('0014'),
    duration: 3000,
    published_at: '2026-04-09 18:00:00',
    created_at: '2026-04-09 18:00:00',
    view_count: 7540,
    like_count: 663,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0015',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0015',
    title: 'Negotiating Your First Offer',
    description:
      'What is and is not negotiable on a graduate offer, how to ask without damaging the relationship, and when to simply accept.',
    category: 'Career & Commercial Skills',
    thumbnail_url: thumb('0015'),
    duration: 1740,
    published_at: '2026-03-26 18:00:00',
    created_at: '2026-03-26 18:00:00',
    view_count: 2760,
    like_count: 229,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0016',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0016',
    title: 'Handling Rejection and the Second Application Cycle',
    description:
      'What to do with a rejection email, how to ask for feedback that is actually useful, and how to rebuild an application list without burning out.',
    category: 'Job Search Strategy',
    thumbnail_url: thumb('0016'),
    duration: 2460,
    published_at: '2026-03-12 18:00:00',
    created_at: '2026-03-12 18:00:00',
    view_count: 3980,
    like_count: 401,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0017',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0017',
    title: 'Cover Letters for People Who Hate Writing Them',
    description:
      'A three-paragraph structure that works for most graduate applications, with the research step that makes the middle paragraph write itself.',
    category: 'CV & Applications',
    thumbnail_url: thumb('0017'),
    duration: 2220,
    published_at: '2026-02-26 18:00:00',
    created_at: '2026-02-26 18:00:00',
    view_count: 4610,
    like_count: 356,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0018',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0018',
    title: 'Industry Insight: Law Without the Training Contract Panic',
    description:
      'Vacation schemes, the SQE, and the realistic timeline for a training contract, including what to do if you are applying in your final year.',
    category: 'Industry Insight Events',
    thumbnail_url: thumb('0018'),
    duration: 3360,
    published_at: '2026-02-12 17:30:00',
    created_at: '2026-02-12 17:30:00',
    view_count: 5120,
    like_count: 428,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0019',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0019',
    title: 'Making the Most of a Careers Fair',
    description:
      'Who to speak to, the two questions worth asking at a stand, and the follow-up message that turns a conversation into a contact.',
    category: 'Linkedin & Networking',
    thumbnail_url: thumb('0019'),
    duration: 1620,
    published_at: '2026-01-29 18:00:00',
    created_at: '2026-01-29 18:00:00',
    view_count: 1890,
    like_count: 132,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0020',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0020',
    title: 'Presenting With Confidence When You Are Nervous',
    description:
      'Structure, pacing and the preparation that does the heavy lifting, for assessment centre presentations and first weeks on the job.',
    category: 'Career & Commercial Skills',
    thumbnail_url: thumb('0020'),
    duration: 2580,
    published_at: '2026-01-15 18:00:00',
    created_at: '2026-01-15 18:00:00',
    view_count: 2430,
    like_count: 187,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0021',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0021',
    title: 'Building an Application Shortlist That Fits Your Life',
    description:
      'How many applications is realistic alongside a degree, how to rank firms honestly, and how to track it all without a spreadsheet you abandon in week two.',
    category: 'Job Search Strategy',
    thumbnail_url: thumb('0021'),
    duration: 2160,
    published_at: '2025-12-11 18:00:00',
    created_at: '2025-12-11 18:00:00',
    view_count: 3105,
    like_count: 254,
    is_published: true,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0022',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0022',
    title: 'First 90 Days in a Graduate Role',
    description:
      'What good looks like early on, how to ask for help without seeming lost, and the habits that get you trusted with real work sooner.',
    category: 'Career & Commercial Skills',
    thumbnail_url: thumb('0022'),
    duration: 2880,
    published_at: '2025-11-27 18:00:00',
    created_at: '2025-11-27 18:00:00',
    view_count: 1540,
    like_count: 118,
    is_published: true,
    is_featured: false
  },

  // Drafts: should never appear on the public page, only in the admin dashboard.
  {
    youtube_video_id: 'fopwbnr0023',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0023',
    title: '[Draft] Assessment Centre Case Study Masterclass',
    description: 'Unpublished draft used to check that the public page filters unpublished webinars out.',
    category: 'Interview Prep',
    thumbnail_url: thumb('0023'),
    duration: 3600,
    published_at: null,
    created_at: '2026-10-20 12:00:00',
    view_count: 0,
    like_count: 0,
    is_published: false,
    is_featured: false
  },
  {
    youtube_video_id: 'fopwbnr0024',
    youtube_url: 'https://www.youtube.com/watch?v=fopwbnr0024',
    title: '[Draft] Employer Insight: Retail and FMCG Grad Schemes',
    description: 'Unpublished draft, awaiting the recording from the employer partner.',
    category: 'Employer Insight Events',
    thumbnail_url: thumb('0024'),
    duration: 2700,
    published_at: null,
    created_at: '2026-10-28 12:00:00',
    view_count: 0,
    like_count: 0,
    is_published: false,
    is_featured: false
  }
];
