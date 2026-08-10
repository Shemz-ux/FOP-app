import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Award, 
  Search, 
  CheckCircle2, 
  BarChart3,
  Zap,
  Shield,
  Clock,
  Globe,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Marquee from '../../components/Marquee/Marquee';
import ScrollReveal from '../../components/ScrollReveal';


const painPoints = [
  "High volume of low quality applicants",
  "Lack of Gender Diversity in talent pipeline",
  "Struggling to build employer brand with diverse talent pools",
  "Low Conversion from talent attraction initiatives",
  "Reneges on offers",
];

const outcomes = [
  "Better quality signal and fit from talent",
  "Higher engagement with female talent pools",
  "Build your online presence with diverse talent groups",
  "Better quality signal and fit from talent",
  "Better retention and development for incoming graduates",
];

export default function Employers() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-border overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 py-32 lg:py-50 relative text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>250+ companies worldwide</span>
              </div> */}

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                Attract Bespoke Talent <br/>
                <span className="text-primary">That Converts</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Helping employers build tailored early career talent pipelines that converts and improves hiring outcomes
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 text-center">
                <Link className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" to="/about">
                  Learn More
                </Link>
                <Link className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" to="/contact">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dpfkhymbc/image/upload/v1769166734/WhatsApp_Image_2026-01-19_at_00.55.56_1_v9klsq.jpg"
                  alt="Business team meeting"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating stat card */}
              {/* <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl border border-border shadow-lg">
                <div className="text-3xl text-primary mb-1">300+</div>
                <div className="text-sm text-muted-foreground">Successful Hires</div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Marquee */}
      <section className="bg-secondary/20 border-y pb-15">
        <ScrollReveal>
          <div className="container mx-auto px-6 pt-12">
            <h2 className="text-medium text-muted-foreground mb-8">
              Trusted by employers such as
            </h2>
          </div>
          <Marquee 
            speed={40}
            fullWidth={true}
            items={[
              <img key="barclays" src="https://cdn.worldvectorlogo.com/logos/barclays-logo-1.svg" alt="Barclays" className="h-8 w-auto object-contain" />,
              <img key="beazley" src="https://upload.wikimedia.org/wikipedia/commons/8/87/Beazley-logo-wiki.png" alt="Beazley" className="h-12 w-auto object-contain" />,
              <img key="accenture" src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Accenture_logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="Accenture" className="h-12 w-auto object-contain" />,
              <img key="capita" src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Capita_logo_%282019%29.svg/3840px-Capita_logo_%282019%29.svg.png" alt="Capita" className="h-12 w-auto object-contain" />,
              <img key="Q5" src="https://www.consultancy-me.com/profile/media/q5-logo-2025-11-24-013200816.png" alt="Q5" className="h-12 w-auto object-contain" />,
              <img key="Argentil" src="https://i0.wp.com/aiassetx.com/wp-content/uploads/2017/11/Argentil-Asset-Management3.png?fit=431%2C141&ssl=1" alt="Argentil" className="h-12 w-auto object-contain" />,
              <img key="AON" src="https://companieslogo.com/img/orig/AON-ef8e330a.png?t=1720244490" alt="AON" className="h-20 w-auto object-contain" />
            ]}
          />
        </ScrollReveal>
      </section>

      {/* How We Help You Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">How We Help You</h2>
          <p className="text-muted-foreground">
            Our approach is to go beyond attraction and build talent pipelines that converts
          </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-left">
          <ScrollReveal delay={0.1}>
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl text-foreground mb-3">Talent Attraction</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Reach and engage top talent through strategic university partnerships, insight days, and compelling employer branding initiatives.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl text-foreground mb-3">Application Readiness</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Prepare candidates for success with pre-application workshops, employability programs, and skill development initiatives.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl text-foreground mb-3">Employer Branding</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Build a powerful employer brand that resonates with candidates through authentic storytelling and social media presence.
              </p>
            </div>
          </ScrollReveal>

        </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary/20 border-b border-border">
        <div className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {[
            ["10,000+", "Members"],
            ["35+", "University Partners"],
            ["25,000+", "Network Reach"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-4xl lg:text-5xl mb-2 text-primary">
                {value}
              </div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
          </div>
        </ScrollReveal>
        </div>
      </section>

      {/* Pain points section */}
      <section className="py-24 relative">
      <div className="container mx-auto px-6 text-left">
        <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">
            Solving Your Biggest Talent Problems 
          </h2>
          <p className="text-muted-foreground">
            We help bridge the gap between student potential and employer expectations
          </p>
        </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ScrollReveal>
          {/* Pain Points Column */}
          <div className="bg-card/50 rounded-3xl p-8 md:p-10 border border-border/50 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/5 hover:border-red-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                Painpoints
              </h3>
            </div>

            <ul className="space-y-6">
              {painPoints.map((point, idx) => (
                <li
                key={idx}
                className="flex items-start gap-4 group"
                >
                  <div className="mt-1 min-w-5 min-h-5 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                    <div className="bg-primary/10 rounded-xl">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          </ScrollReveal>

          {/* Outcomes Column */}
          <ScrollReveal delay={0.2}>
          <div className="bg-card rounded-3xl p-8 md:p-10 border border-primary/20 relative overflow-hidden shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                Outcomes
              </h3>
            </div>

            <ul className="space-y-6">
              {outcomes.map((outcome, idx) => (
                <li
                key={idx}
                className="flex items-start gap-4 group"
                >
                  <div className="mt-1 min-w-5 min-h-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-foreground group-hover:text-foreground transition-colors">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>



      {/* Everything You Need To Attract Talent */}
      <section className="bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-6 py-20 text-left">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Everything You Need To Attract Talent</h2>
            <p className="text-muted-foreground">
              Our 360 approach to help you attract and recruit early career talent
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Insight Days</h3>
              <p className="text-muted-foreground text-sm">
                Build engaging and impactful insight events & programs to attract and convert high quality.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">University Engagement</h3>
              <p className="text-muted-foreground text-sm">
                Leverage our deep nationwide network of university partnerships to access talent at scale.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Social Media Marketing</h3>
              <p className="text-muted-foreground text-sm">
                Develop engaging employer content to demystify, cut through the noise and connect with your target audience.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Influencer Recruitment Marketing</h3>
              <p className="text-muted-foreground text-sm">
                Leverage trusted creators and our social media expertise to reach your desired talent at scale on emerging channels and platforms.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Pre-application workshops</h3>
              <p className="text-muted-foreground text-sm">
                Design insightful pre-application workshops to ensure high quality pipeline of applications that converts to successful hires.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Employability Programs</h3>
              <p className="text-muted-foreground text-sm">
                Leverage our flagship employability program to access career-ready talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-20 text-left">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Trusted by Industry Leaders</h2>
            <p className="text-muted-foreground">
              See what companies are saying about their hiring experience
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 fill-primary" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                "We filled 5 senior positions in just 2 weeks. The quality of candidates and the platform's ease of use is exceptional."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  JD
                </div>
                <div>
                  <div className="text-foreground text-sm">Jane Doe</div>
                  <div className="text-muted-foreground text-xs">HR Director, Tech Corp</div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 fill-primary" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                "The AI matching saved us countless hours. We found developers who perfectly matched our tech stack and culture."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  MS
                </div>
                <div>
                  <div className="text-foreground text-sm">Michael Smith</div>
                  <div className="text-muted-foreground text-xs">CTO, StartupXYZ</div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 fill-primary" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                "Outstanding platform! The analytics helped us refine our job descriptions and attract higher-quality candidates."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  SJ
                </div>
                <div>
                  <div className="text-foreground text-sm">Sarah Johnson</div>
                  <div className="text-muted-foreground text-xs">Talent Lead, Global Inc</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/20 border-b border-border">
        <div className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-12 lg:p-16 border border-primary/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">
              Ready to Build Your Talent Pipeline?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join inclusive companies attracting exceptional talent today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Contact Us
              </Link>
              <Link to="https://FOPERSPECTIVES.as.me/?appointmentType=76790602" className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                Schedule Meeting
              </Link>
            </div>
          </div>
          </div>
        </ScrollReveal>
        </div>
      </section>
    </div>
  );
}