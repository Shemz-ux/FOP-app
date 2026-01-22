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
  HeadphonesIcon
} from 'lucide-react';
import Marquee from '../../components/Marquee/Marquee';

export default function Employers() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 py-32 lg:py-50 relative text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Trusted by 250+ companies worldwide</span>
              </div>

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                Attract & Recruit <br/>
                <span className="text-primary">High Quality Talent</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Develop talent pipelines to Attract, engage and hire high quality diverse talent anywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 text-center">
                <Link className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  Browse opportunities
                </Link>
                <Link className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc2ODM3NzYwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Business team meeting"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl border border-border shadow-lg">
                <div className="text-3xl text-primary mb-1">300+</div>
                <div className="text-sm text-muted-foreground">Successful Hires</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Marquee */}
      <section className="bg-secondary/30 border-y border-border pb-15">
        <div className="container mx-auto px-6 pt-12">
          <p className="text-center text-medium text-muted-foreground mb-12">
            Trusted by employers such as
          </p>
        </div>
        <Marquee 
          speed={30}
          fullWidth={true}
          items={[
            <img src="https://cdn.worldvectorlogo.com/logos/jp-morgan-chase.svg" alt="JP Morgan" className="h-12 transition-opacity" />,
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/BlackRock_wordmark.svg/1280px-BlackRock_wordmark.svg.png" alt="BlackRock" className="h-12 transition-opacity" />,
            <img src="https://cdn.worldvectorlogo.com/logos/barclays-logo-1.svg" alt="Barclays" className="h-12 transition-opacity" />,
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Aon_Corporation_logo.svg/1280px-Aon_Corporation_logo.svg.png" alt="Aon" className="h-12 transition-opacity" />,
            <img src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png" alt="Mastercard" className="h-12 transition-opacity" />,
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/State-street-logo-final.svg/3840px-State-street-logo-final.svg.png" alt="State Street" className="h-12 transition-opacity" />,
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/1280px-Accenture.svg.png" alt="accenture" className="h-12 transition-opacity" />,
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/1280px-Capgemini_201x_logo.svg.png" alt="Capgemini" className="h-12 transition-opacity" />,
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EY_Parthenon_logo.svg/3840px-EY_Parthenon_logo.svg.png" alt="EY" className="h-12 transition-opacity" />,
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg" alt="PWC" className="h-12 transition-opacity" />
          ]}
        />
      </section>

      {/* How We Help You Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">How We Help You</h2>
          <p className="text-muted-foreground">
            Our comprehensive approach to building your talent pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-left">
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl text-foreground mb-3">Talent Attraction</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Reach and engage top talent through strategic university partnerships, targeted campaigns, and compelling employer branding initiatives.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl text-foreground mb-3">Employer Branding</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Build a powerful employer brand that resonates with candidates through authentic storytelling, social media presence, and insight events.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl text-foreground mb-3">Application Readiness</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Prepare candidates for success with pre-application workshops, employability programs, and skills development initiatives.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["20,000+", "Students"],
            ["30", "University Partners"],
            ["100", "Top Employers"],
            ["20,000+", "Social Media"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-4xl lg:text-5xl mb-2 text-primary">
                {value}
              </div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-20 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Everything You Need To Attract Talent</h2>
            <p className="text-muted-foreground">
              Powerful tools and features designed to streamline your entire recruitment process
            </p>
          </div>

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
                Leverage emerging platforms to reach talent where they are at.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Verified Candidates</h3>
              <p className="text-muted-foreground text-sm">
                Access pre-screened, verified candidates with background checks and skills assessments completed.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Pre-appplciation workshops</h3>
              <p className="text-muted-foreground text-sm">
                Design insightful pre-applicaiton preparation workshops to ensure high quality pipeline of applications.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Employability programs</h3>
              <p className="text-muted-foreground text-sm">
                Leverage our flagship employability program to access career-ready talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-6 py-20 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Trusted by Industry Leaders</h2>
            <p className="text-muted-foreground">
              See what companies are saying about their hiring experience
            </p>
          </div>

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
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-12 lg:p-16 border border-primary/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">
              Ready to Build Your Dream Team?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of companies finding exceptional talent today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Contact Us
              </Link>
              <Link className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              to="/about">
                Learn More
              </Link>
            </div>

            {/* <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Cancel Anytime</span>
              </div>
            </div> */}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}