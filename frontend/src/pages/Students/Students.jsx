import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2,
  Rocket,
  Target,
  Coffee,
  Lightbulb,
  MessageSquare,
  FileText
} from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function Students() {
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

        <div className="container mx-auto px-6 py-20 lg:py-50 relative text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <GraduationCap className="w-4 h-4" />
                <span>Join thousands of students already on board!</span>
              </div>

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                Launch Your Career <br/>
                <span className="text-primary">Unlock Opportunities</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find internships, entry level and graduate  opportunities at leading employers. Get tailored career support and build your network.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
                >
                  Join Now!
                </Link>
                <Link
                  to="/jobs"
                  className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center"
                >
                  Browse Opportunities
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Career resources</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Job opportunities</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Exclusive events</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1514369118554-e20d93546b30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzY4MzA1NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Student studying"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl border border-border shadow-lg">
                <div className="text-3xl text-primary mb-1">89%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Partnerships */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Trusted by Top Institutions</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-16 items-center justify-items-center max-w-6xl mx-auto">
            <img src="https://cdn.worldvectorlogo.com/logos/jp-morgan.svg" alt="JP Morgan" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://cdn.worldvectorlogo.com/logos/barclays-logo-1.svg" alt="Barclays" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Aon_Corporation_logo.svg/1280px-Aon_Corporation_logo.svg.png" alt="Aon" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png" alt="Mastercard" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/State-street-logo-final.svg/3840px-State-street-logo-final.svg.png" alt="State Street" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/1280px-Capgemini_201x_logo.svg.png" alt="Capgemini" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EY_Parthenon_logo.svg/3840px-EY_Parthenon_logo.svg.png" alt="EY" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/KPMG.svg/3840px-KPMG.svg.png" alt="KPMG" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://companieslogo.com/img/orig/GS_BIG.D-64570a1b.png?t=1740321324" alt="Goldman Sachs" className="h-12 w-auto transition-opacity hover:opacity-70" />
            <img src="https://cdn.worldvectorlogo.com/logos/citibank-5.svg" alt="Citibank" className="h-12 w-auto transition-opacity hover:opacity-70" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20 text-left">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Everything Students Need to Succeed</h2>
            <p className="text-muted-foreground">
              From your first internship to your graduate role, we're with you every step of the way
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Internship Opportunities</h3>
              <p className="text-muted-foreground text-sm">
                Access thousands of paid internships at top companies designed specifically for students and recent graduates.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Career Resources</h3>
              <p className="text-muted-foreground text-sm">
                Free resume templates, interview guides, and career development resources created by industry experts.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Networking Events</h3>
              <p className="text-muted-foreground text-sm">
                Connect with industry professionals and leading employers across a variety of industries.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Employability Programs</h3>
              <p className="text-muted-foreground text-sm">
                Structured job search and training programs to help you land your.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">Masterclass Events</h3>
              <p className="text-muted-foreground text-sm">
                Exclusive industry insight events and career development masterclasses to bring you insights and guidance into different careers.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">1-1 Career Coaching</h3>
              <p className="text-muted-foreground text-sm">
                Gain 1-1 career coaching support to turbocharge your career development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">10,000+</div>
            <div className="text-muted-foreground">Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">250+</div>
            <div className="text-muted-foreground">Jobs Secured</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">5000+</div>
            <div className="text-muted-foreground">Students Supported</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl mb-2 text-primary">50+</div>
            <div className="text-muted-foreground">Campus Partners</div>
          </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Student Success Stories */}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Student Success Stories</h2>
          <p className="text-muted-foreground">
            Hear from students who launched their careers with CareerHub
          </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 fill-primary" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              "Found my dream internship at Google through CareerHub! The platform made it so easy to connect with recruiters and showcase my projects."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                EW
              </div>
              <div>
                <div className="text-foreground text-sm">Emily Watson</div>
                <div className="text-muted-foreground text-xs">Computer Science, Oxford</div>
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
              "The career resources and mentorship program were invaluable. Landed a graduate role before even finishing my degree!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                RP
              </div>
              <div>
                <div className="text-foreground text-sm">Ravi Patel</div>
                <div className="text-muted-foreground text-xs">Engineering, Imperial</div>
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
              "Attended amazing networking events and got connected with industry leaders. Now working at my dream startup!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                SK
              </div>
              <div>
                <div className="text-foreground text-sm">Sophie Kim</div>
                <div className="text-muted-foreground text-xs">Business, LSE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Your Journey Starts Here</h2>
            <p className="text-muted-foreground">
              Four simple steps to kickstart your professional career
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
            <div className="relative">
              <div className="bg-card p-6 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                  1
                </div>
                <h3 className="text-foreground mb-2">Sign Up Free</h3>
                <p className="text-muted-foreground text-sm">
                  Create your profile and get set up!
                </p>
              </div>
              {/* Connector line - hidden on mobile/tablet */}
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border"></div>
            </div>

            <div className="relative">
              <div className="bg-card p-6 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                  2
                </div>
                <h3 className="text-foreground mb-2">Build Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Upload your CV, highlight your skills and career interests.
                </p>
              </div>
              {/* Connector line - hidden on mobile/tablet */}
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border"></div>
            </div>

            <div className="relative">
              <div className="bg-card p-6 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                  3
                </div>
                <h3 className="text-foreground mb-2">Explore & Apply</h3>
                <p className="text-muted-foreground text-sm">
                  Browse events, career resources and job opportunities..
                </p>
              </div>
              {/* Connector line - hidden on mobile/tablet */}
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border"></div>
            </div>

            <div>
              <div className="bg-card p-6 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                  4
                </div>
                <h3 className="text-foreground mb-2">Launch Your Career</h3>
                <p className="text-muted-foreground text-sm">
                  Apply for roles and kickstart your career.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/30 border-y border-border">
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
              Ready to Launch Your Career?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of students finding internships and graduate opportunities. Start building your future today!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                Create An Account
              </Link>
              <Link
                to="/jobs"
                className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                Explore Opportunities
              </Link>
            </div>

            {/* <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Hassle Free</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>No Experience Required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Student Verified</span>
              </div>
            </div> */}
          </div>
          </div>
        </ScrollReveal>
        </div>
      </section>
    </div>
  );
}