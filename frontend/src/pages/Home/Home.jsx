import { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard/JobCard";
import Marquee from "../../components/Marquee/Marquee";
import ScrollReveal from "../../components/ScrollReveal";
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
  User,
  Quote,
} from "lucide-react";
import landingVideo from "../../assets/landing_video.MP4";

const companyLogos = [
  { src: "https://cdn.worldvectorlogo.com/logos/jp-morgan-chase.svg", alt: "JP Morgan" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Lazard_wordmark.svg/1280px-Lazard_wordmark.svg.png", alt: "Lazard" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/BlackRock_wordmark.svg/1280px-BlackRock_wordmark.svg.png", alt: "BlackRock" },
  { src: "https://cdn.worldvectorlogo.com/logos/barclays-logo-1.svg", alt: "Barclays" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Aon_Corporation_logo.svg/1280px-Aon_Corporation_logo.svg.png", alt: "Aon" },
  { src: "https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png", alt: "Mastercard" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/State-street-logo-final.svg/3840px-State-street-logo-final.svg.png", alt: "State Street" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/1280px-Accenture.svg.png", alt: "accenture" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/1280px-Capgemini_201x_logo.svg.png", alt: "Capgemini" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EY_Parthenon_logo.svg/3840px-EY_Parthenon_logo.svg.png", alt: "EY" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg", alt: "PWC"}
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Investment Banking Analyst",
    company: "JP Morgan",
    testimonial: "This platform transformed my job search. Within weeks, I landed my dream role at JP Morgan. The resources and networking events were invaluable.",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    company: "Accenture",
    testimonial: "The career guidance and CV templates helped me stand out. I went from dozens of rejections to multiple offers. Couldn't be happier!",
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Management Consultant",
    company: "EY",
    testimonial: "The networking events connected me directly with hiring managers. The personalized job recommendations saved me hours of searching.",
    avatar: "ER"
  },
  {
    name: "James Williams",
    role: "Data Analyst",
    company: "Barclays",
    testimonial: "From student to professional in 3 months. The platform's resources and mentorship program gave me the confidence to succeed.",
    avatar: "JW"
  }
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
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={landingVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        </div>

        <div className="container mx-auto px-6 py-34 lg:py-48 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Join 1M+ professionals finding their dream careers</span>
            </div>

            <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
              Empowering Young Talent<br />
              <span className="text-primary">Kickstarting Careers</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with leading employers, discover opportunities, upskill and take the next step in your career.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/students"
                className="px-8 py-3 border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <GraduationCap className="w-5 h-5" />
                For Students
              </Link>
              <Link
                to="/employers"
                className="px-8 py-3 border bg-primary/10 border-border rounded-xl flex items-center justify-center gap-2 text-primary hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <Building2 className="w-5 h-5" />
                For Employers
              </Link>
            </div>
          </div>

        </div>

        {/* Featured Company Marquee - Full Width at Bottom */}
        <div className="mt-16 mb-10">
          {/* <h2 className="text-center text-foreground text-sm mb-10 font-semibold">We've helped students and grads land roles at</h2> */}
          <Marquee
            items={companyLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto opacity-100 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
            speed={40}
            fullWidth={true}
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Kickstart your career journey</h2>
              <p className="text-muted-foreground">
                Our platform provides comprehensive tools and resources to accelerate your career journey
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <ScrollReveal delay={0.1}>
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Job Opportunities</h3>
              <p className="text-muted-foreground text-sm">
                Access thousands of verified opportunities from industry-leading companies across all sectors
              </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Employability Programs</h3>
              <p className="text-muted-foreground text-sm">
                Our AI-powered system matches you with roles that align with your skills and career goals
              </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Career Events</h3>
              <p className="text-muted-foreground text-sm">
                Attend exclusive networking events, workshops, and career fairs to expand your opportunities
              </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Expert Resources</h3>
              <p className="text-muted-foreground text-sm">
                Download templates, guides, and tools created by industry experts to boost your success
              </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl mb-4 text-foreground">Success Stories</h2>
              <p className="text-muted-foreground">
                Hear from professionals who transformed their careers through our platform
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
              <div
                key={index}
                className={`p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col relative overflow-hidden ${
                  index % 2 === 0 ? 'bg-card' : 'bg-secondary/30'
                }`}
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
                
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-semibold text-lg mb-3 ring-2 ring-primary/20">
                    {testimonial.avatar}
                  </div>
                  <h3 className="text-foreground font-semibold mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-primary font-semibold">
                    {testimonial.company}
                  </p>
                </div>

                <div className="flex-1 flex items-start">
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{testimonial.testimonial}"
                  </p>
                </div>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Path to success*/}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Your Path to Success</h2>
            <p className="text-muted-foreground">
              Getting started is simple. Follow these steps to land your dream role
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ScrollReveal delay={0.1}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                1
              </div>
              <h3 className="text-foreground mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground text-sm">
                Build a comprehensive profile showcasing your skills, experience, and career aspirations
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                2
              </div>
              <h3 className="text-foreground mb-2">Discover Opportunities</h3>
              <p className="text-muted-foreground text-sm">
                Browse curated job listings and receive personalized recommendations based on your profile
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                3
              </div>
              <h3 className="text-foreground mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground text-sm">
                Apply with one click, track your applications, and connect with hiring managers directly
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-12 lg:p-16 border border-primary/20 text-center">
          <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">
            Ready to Transform Your Career?
          </h2>

          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of professionals who have found their dream careers
            through our platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-center hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3 border border-border rounded-xl text-center hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse Jobs
            </Link>
          </div>

          <div className="flex gap-6 mt-8 flex-wrap text-sm text-muted-foreground justify-center">
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
        </ScrollReveal>
      </section>
    </div>
  );
}
