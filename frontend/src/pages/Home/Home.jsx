import { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard/JobCard";
import Marquee from "../../components/Marquee/Marquee";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  TrendingUp,
  Award,
  Target,
  CircleCheck,
  GraduationCap,
  Building2,
} from "lucide-react";

const featuredJobs = [
  {
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
    salary: "$250/hr",
    postedTime: "12 days ago",
    jobId: "meta-product-designer",
  },
  {
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
    salary: "$195/hr",
    postedTime: "5 days ago",
    jobId: "netflix-sr-ux-designer",
  },
  {
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
    salary: "$260/hr",
    postedTime: "5 days ago",
    jobId: "google-backend-dev",
  },
];

const companyLogos = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", alt: "Meta" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", alt: "Netflix" },
  { src: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", alt: "Google" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", alt: "Amazon" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png", alt: "Microsoft" },
];

export default function HomePage() {
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Join 1M+ professionals finding their dream careers</span>
            </div>

            <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
              Accelerate Your Career <br />
              <span className="text-primary">Journey Today</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with leading companies, discover opportunities tailored to
              your skills, and take the next step in your professional growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/student"
                className="px-8 py-3 border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <GraduationCap className="w-5 h-5" />
                For Students
              </Link>
              <Link
                to="/employer"
                className="px-8 py-3 border bg-primary/10 border-border rounded-xl flex items-center justify-center gap-2 text-primary hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <Building2 className="w-5 h-5" />
                For Employers
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                ["10K+", "Active Jobs"],
                ["5K+", "Companies"],
                ["1M+", "Job Seekers"],
                ["50K+", "Success Stories"],
              ].map(([value, label]) => (
                <div key={label} className="text-center">
                  <div className="text-3xl lg:text-4xl mb-1 text-foreground">
                    {value}
                  </div>
                  <div className="text-muted-foreground text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

       {/* Featured Company Marquee */}
      <section className="border-b border-border bg-secondary/20">
        <div className="py-12">
          <h2 className="text-center text-muted-foreground text-base mb-8">Trusted by leading companies worldwide</h2>
          <Marquee
            items={companyLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
            speed={40}
          />
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8 text-left">
          <div>
            <h2 className="text-3xl mb-2 text-foreground">
              Featured Opportunities
            </h2>
            <p className="text-muted-foreground">
              Handpicked positions from top-tier companies
            </p>
          </div>

          <Link
            to="/jobs"
            className="hidden md:flex items-center gap-2 text-primary hover:opacity-80"
          >
            View all jobs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredJobs.map((job, index) => (
            <JobCard
              key={job.jobId}
              {...job}
              isFavorite={favorites.has(index)}
              onFavoriteClick={() => toggleFavorite(index)}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Why Professionals Choose Us</h2>
            <p className="text-muted-foreground">
              Our platform provides comprehensive tools and resources to accelerate your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Premium Job Listings</h3>
              <p className="text-muted-foreground text-sm">
                Access thousands of verified opportunities from industry-leading companies across all sectors
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Smart Matching</h3>
              <p className="text-muted-foreground text-sm">
                Our AI-powered system matches you with roles that align with your skills and career goals
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Career Events</h3>
              <p className="text-muted-foreground text-sm">
                Attend exclusive networking events, workshops, and career fairs to expand your opportunities
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Expert Resources</h3>
              <p className="text-muted-foreground text-sm">
                Download templates, guides, and tools created by industry experts to boost your success
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Path to success*/}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl mb-4 text-foreground">Your Path to Success</h2>
          <p className="text-muted-foreground">
            Getting started is simple. Follow these steps to land your dream role
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
              1
            </div>
            <h3 className="text-foreground mb-2">Create Your Profile</h3>
            <p className="text-muted-foreground text-sm">
              Build a comprehensive profile showcasing your skills, experience, and career aspirations
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
              2
            </div>
            <h3 className="text-foreground mb-2">Discover Opportunities</h3>
            <p className="text-muted-foreground text-sm">
              Browse curated job listings and receive personalized recommendations based on your profile
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
              3
            </div>
            <h3 className="text-foreground mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground text-sm">
              Apply with one click, track your applications, and connect with hiring managers directly
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-12 lg:p-16 border border-primary/20">
          <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">
            Ready to Transform Your Career?
          </h2>

          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of professionals who have found their dream careers
            through our platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-center"
            >
              Get Started Free
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3 border border-border rounded-xl text-center"
            >
              Browse Jobs
            </Link>
          </div>

          <div className="flex gap-6 mt-8 flex-wrap text-sm text-muted-foreground">
            {[
              "No credit card required",
              "Free forever plan",
              "Cancel anytime",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CircleCheck className="w-5 h-5 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
