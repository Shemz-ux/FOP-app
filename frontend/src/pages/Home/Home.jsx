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
  Users,
  Quote,
  BookOpen,
  Megaphone,
} from "lucide-react";
import landingVideo from "../../assets/landing_video.MP4";

const FopLogo2 = () => (
  <img 
    src="https://res.cloudinary.com/dpfkhymbc/image/upload/v1769274499/FOP_logo_hazkv0.svg" 
    alt="FOP Logo" 
    className="h-36 w-58 object-contain opacity-50"
  />
)

// TODO: Add bbc and jll, fgf global, publicist group (media), Morgan stanley

const companyLogos = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/65/BBC_logo_%281997-2021%29.svg", alt: "BBC" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/JLL_logo.svg/1280px-JLL_logo.svg.png", alt: "JLL" },
  { src: "https://cdn.worldvectorlogo.com/logos/barclays-logo-1.svg", alt: "Barclays" },
  { src: "https://companieslogo.com/img/orig/MS_BIG.D-4755c76c.png?t=1720244493", alt: "Morgan Stanley" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Aon_Corporation_logo.svg/1280px-Aon_Corporation_logo.svg.png", alt: "Aon" },
  { src: "https://upload.wikimedia.org/wikipedia/fr/thumb/2/23/PublicisGroupe_logo.svg/1280px-PublicisGroupe_logo.svg.png", alt: "Publicis group" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1280px-MasterCard_Logo.svg.png", alt: "Mastercard" },
  { src: "https://cdn.worldvectorlogo.com/logos/jp-morgan.svg", alt: "JP Morgan" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/State-street-logo-final.svg/3840px-State-street-logo-final.svg.png", alt: "State Street" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/1280px-Capgemini_201x_logo.svg.png", alt: "Capgemini" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Lazard_wordmark.svg/1280px-Lazard_wordmark.svg.png", alt: "Lazard" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/BlackRock_wordmark.svg/1280px-BlackRock_wordmark.svg.png", alt: "BlackRock" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/1280px-Accenture.svg.png", alt: "accenture" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EY_Parthenon_logo.svg/3840px-EY_Parthenon_logo.svg.png", alt: "EY" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg", alt: "PWC"}
];

const testimonials = [
  {
    name: "Deniz Ayrancioglu",
    role: "Management Consultant Analyst",
    company: "Accenture",
    testimonial: "Thank you for your support and guidance throughout the process. Your CV support was crucial to helping me secure multiple interviews and your interview prep and resources helped me land offers!",
    avatar: "DA"
  },
  {
    name: "Fola Omotoso",
    role: "Investment Banking Analyst",
    company: "Lazard & BlackRock",
    testimonial: "Thank you for your support during the application process. Your CV support for investment banking and advice on interview prep was really insightful. I would recommend you to any student looking to break into Investment Banking!",
    avatar: "FO"
  },
  {
    name: "Sumaiya Yasmin",
    role: "PR & Comms Graduate",
    company: "FGS Global",
    testimonial: "I wanted to thank you again for the support across interview prep and CV Preparation. I was pretty much rejected from every single job, and I’ve been applying since August, so your support in landing this offer was really life-changing!",
    avatar: "ER"
  },
  {
    name: "Lisa Ntamoah",
    role: "Customer success",
    company: "Bloomberg",
    testimonial: "FO Perspectives supported me through their free resources. These helped resources helped me build a high quality CV and perfrom company research. Having resources consolidated on one platform helped me feel less overwhelmed as well.",
    avatar: "LN"
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
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-border overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-100"
          >
            <source src={landingVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
          {/* Logo Overlay */}
          {/* <div className="absolute top-0 left-0">
            <FopLogo2 />
          </div> */}
        </div>

        <div className="container mx-auto px-6 py-60 lg:py-70 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Professionals finding their dream careers</span>
            </div> */}

            <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
              Creating Talent Pipelines<br />
              <span className="text-primary">That Converts</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with leading employers, discover opportunities, upskill and take the next step in your career
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
                className="px-8 py-3 border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <Building2 className="w-5 h-5" />
                For Employers
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Company logo marquee */}
      <section className="bg-secondary/20 border-y pb-15">
        <ScrollReveal>
          <div className="container mx-auto px-6 pt-12">
            <h2 className="text-medium text-muted-foreground mb-8 max-w-xl mx-auto">We've helped hundreds of students secure roles at</h2>
          </div>
          <Marquee
            items={companyLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto object-contain"
              />
            ))}
            speed={50}
            fullWidth={true}
          />
        </ScrollReveal>
      </section>


      {/* Kickstart your career */}
      <section>
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Kickstart Your Career Journey</h2>
              <p className="text-muted-foreground">
                Our platform provides support and resources to accelerate your career
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <ScrollReveal delay={0.1}>
              <Link to="/jobs">
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Job Opportunities</h3>
              <p className="text-muted-foreground text-sm">
                Access a wide variety of opportunities from employers across all sectors
              </p>
              </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Link to="/employers">
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Employability Programs</h3>
              <p className="text-muted-foreground text-sm">
                Take part in our structured and interactive programs to upskill you and kickstart your career
              </p>
              </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Link to="/events">
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Career Events</h3>
              <p className="text-muted-foreground text-sm">
                Attend exclusive employer events, workshops, and career fairs to expand your opportunities
              </p>
              </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Link to="/resources">
              <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-foreground mb-2">Expert Resources</h3>
              <p className="text-muted-foreground text-sm">
                Download templates, guides, and tools created by industry experts to boost your success
              </p>
              </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-24 border-y bg-secondary/20 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2"></div>
        </div>
          
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">How We Help Employers</h2>
              <p className="text-muted-foreground">
                We help you attract and engage applicant ready talent that converts
              </p>
            </div>
            </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1: Talent Attraction */}
            <ScrollReveal delay={0.1}>
            <div className="group relative bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/5 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                <Users className="w-7 h-7" />
              </div>
              
              <h3 className="mb-4 text-foreground group-hover:text-blue-500 transition-colors">
                Talent Attraction
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                We help you build the right early career talent pipeline for you that converts high-potential candidates into long-term employees.
              </p>
              
              {/* Decorative gradient blob */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
              </div>
              </ScrollReveal>

            {/* Card 2: Application Readiness */}
            <ScrollReveal delay={0.2}>
            <div className="group relative bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/5 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                <BookOpen className="w-7 h-7" />
              </div>
              
              <h3 className="mb-4 text-foreground group-hover:text-purple-500 transition-colors">
                Application Readiness
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                We upskill and develop early career talent, ensuring you reach talent that is ready to convert into hires from day one.
              </p>

              {/* Decorative gradient blob */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
            </div>
            </ScrollReveal>

            {/* Card 3: Employer Branding */}
            <ScrollReveal delay={0.3}>
            <div className="group relative bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/5 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300 border border-orange-500/20">
                <Megaphone className="w-7 h-7" />
              </div>
              
              <h3 className="mb-4 text-foreground group-hover:text-orange-500 transition-colors">
                Employer Branding
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                Help you cut through the noise and reach early career talent through emerging platforms & influencer marketing.
              </p>

              {/* Decorative gradient blob */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors"></div>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-border border-b">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl mb-4 text-foreground">Success Stories</h2>
              <p className="text-muted-foreground">
                Hear from members who have kickstarted their careers through our platform
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
              <div
                key={index}
                className={`p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col relative overflow-hidden ${
                  index % 2 === 0 ? 'bg-card' : 'bg-secondary/20'
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
      <section className="bg-secondary/20">
        <div className="container mx-auto px-6 py-20">
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
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/20">
        <div className="container mx-auto px-6 py-20">
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
                Get Started
              </Link>
              <Link
                to="/jobs"
                className="px-8 py-3 border border-border rounded-xl text-center hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Job Opportunities
              </Link>
            </div>

            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
