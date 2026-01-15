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
// import { ImageWithFallback } from '../components/figma/ImageWithFallback';

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

        <div className="container mx-auto px-6 py-20 lg:py-32 relative text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Trusted by 5,000+ companies worldwide</span>
              </div>

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                Find Top Talent <br/>
                <span className="text-primary">Faster Than Ever</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Connect with qualified candidates, streamline your hiring process, and build exceptional teams with our intelligent recruitment platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                  Browse opportunities
                </Link>
                <Link className="px-8 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-colors">
                  Contact Us
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Cancel anytime</span>
                </div>
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
                <div className="text-3xl text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Successful Hires</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">1M+</div>
            <div className="text-muted-foreground">Active Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">5K+</div>
            <div className="text-muted-foreground">Companies Hiring</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">72hrs</div>
            <div className="text-muted-foreground">Avg. Time to Hire</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">95%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Everything You Need to Hire Smarter</h2>
            <p className="text-muted-foreground">
              Powerful tools and features designed to streamline your entire recruitment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Smart Candidate Search</h3>
              <p className="text-muted-foreground text-sm">
                Advanced AI-powered search to find candidates matching your exact requirements from millions of profiles.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">One-Click Job Posting</h3>
              <p className="text-muted-foreground text-sm">
                Post jobs across multiple platforms instantly and manage all applications from a single dashboard.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Analytics & Insights</h3>
              <p className="text-muted-foreground text-sm">
                Track hiring metrics, application trends, and recruitment ROI with comprehensive analytics tools.
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
              <h3 className="text-foreground mb-3">Faster Hiring Process</h3>
              <p className="text-muted-foreground text-sm">
                Reduce time-to-hire by 50% with automated screening, scheduling, and communication workflows.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Global Talent Pool</h3>
              <p className="text-muted-foreground text-sm">
                Access diverse candidates from 50+ countries with tools for remote hiring and visa support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl mb-4 text-foreground">How It Works</h2>
          <p className="text-muted-foreground">
            Get started in minutes and find your ideal candidates in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <div className="relative">
            <div className="bg-card p-8 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                1
              </div>
              <h3 className="text-foreground mb-3">Create Job Listing</h3>
              <p className="text-muted-foreground text-sm">
                Post your job with detailed requirements, budget, and company culture. Our AI helps optimize your listing for better reach.
              </p>
            </div>
            {/* Connector line - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
          </div>

          <div className="relative">
            <div className="bg-card p-8 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                2
              </div>
              <h3 className="text-foreground mb-3">Review Applications</h3>
              <p className="text-muted-foreground text-sm">
                AI ranks candidates by fit score. Review profiles, portfolios, and assessment results in one organized dashboard.
              </p>
            </div>
            {/* Connector line - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
          </div>

          <div>
            <div className="bg-card p-8 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                3
              </div>
              <h3 className="text-foreground mb-3">Hire the Best</h3>
              <p className="text-muted-foreground text-sm">
                Schedule interviews, communicate directly, and extend offers. Track everything from first contact to onboarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30 border-y border-border">
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

      {/* Pricing Preview */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl mb-4 text-foreground">Flexible Pricing Plans</h2>
          <p className="text-muted-foreground">
            Choose the plan that fits your hiring needs, from startups to enterprises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <h3 className="text-foreground mb-2">Starter</h3>
            <div className="mb-6">
              <span className="text-4xl text-foreground">$299</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Up to 5 active job postings</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Access to candidate database</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Email support</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-colors">
              Get Started
            </button>
          </div>

          <div className="bg-card p-8 rounded-2xl border-2 border-primary relative hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-xs">
              Most Popular
            </div>
            <h3 className="text-foreground mb-2">Professional</h3>
            <div className="mb-6">
              <span className="text-4xl text-foreground">$599</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Up to 20 active job postings</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>AI-powered candidate matching</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Advanced analytics & reporting</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Team collaboration tools</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <h3 className="text-foreground mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl text-foreground">Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Unlimited job postings</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>24/7 phone support</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>SLA guarantee</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
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
              <Link className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                Contact Us
              </Link>
              <Link className="px-8 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-colors"
              to="/about">
                Learn More
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}