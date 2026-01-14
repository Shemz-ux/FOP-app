import {
  Target,
  Users,
  TrendingUp,
  Award,
  Building2,
  Heart,
  Zap,
  Shield,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border overflow-hidden text-left">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Trusted by 1M+ professionals worldwide</span>
              </div>

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                Connecting Talent with{" "}
                <span className="text-primary">Opportunity</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                We're on a mission to help professionals find meaningful careers
                and companies discover exceptional talent through innovative
                technology and human-centric design.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl text-primary mb-1">2020</div>
                  <div className="text-muted-foreground text-sm">Founded</div>
                </div>
                <div>
                  <div className="text-3xl text-primary mb-1">50+</div>
                  <div className="text-muted-foreground text-sm">Countries</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover aspect-[6/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["10K+", "Active Jobs"],
            ["5K+", "Partner Companies"],
            ["1M+", "Job Seekers"],
            ["50K+", "Success Stories"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-4xl lg:text-5xl mb-2 text-primary">
                {value}
              </div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              To revolutionize the way people find careers and companies build
              teams, making the job search process more transparent, efficient,
              and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                icon: Target,
                title: "Purpose-Driven",
                text:
                  "Connecting people with roles that align with their values and goals",
              },
              {
                icon: Users,
                title: "Community-First",
                text:
                  "Building a supportive network where professionals grow together",
              },
              {
                icon: Zap,
                title: "Innovation",
                text:
                  "Leveraging technology to create smarter job matching",
              },
              {
                icon: Award,
                title: "Excellence",
                text:
                  "Delivering the highest quality experience for all users",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div>
            <h2 className="text-3xl mb-6 text-foreground">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2020, our platform was born from a simple observation: the traditional job search process was broken. Job seekers struggled to find roles that matched their skills and aspirations, while companies faced challenges in discovering truly qualified candidates.
              </p>
              <p>
                We set out to change that. By combining advanced matching algorithms with human-centric design, we created a platform that makes career discovery intuitive, transparent, and rewarding.
              </p>
              <p>
                Today, we're proud to serve millions of professionals and thousands of companies worldwide, facilitating connections that lead to fulfilling careers and successful teams.
              </p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border shadow-xl">
            <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY4MzAxNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern workspace"
                className="w-full h-auto"
              />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl mb-4 text-foreground">Our Journey</h2>
            <p className="text-muted-foreground">
              Key milestones that shaped our growth and impact
            </p>
          </div>

          <div className="max-w-4xl mx-auto text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="text-2xl mb-2 text-primary">2020</div>
                <p className="text-muted-foreground">Platform launched with 100 job listings and our first partner companies</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="text-2xl mb-2 text-primary">2022</div>
                <p className="text-muted-foreground">Reached 1 million registered users and expanded to 20 countries</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="text-2xl mb-2 text-primary">2024</div>
                <p className="text-muted-foreground">Expanded to 50+ countries globally with AI-powered matching</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="text-2xl mb-2 text-primary">2026</div>
                <p className="text-muted-foreground">Serving 5,000+ partner companies and 1M+ active job seekers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl mb-4 text-foreground">What Sets Us Apart</h2>
          <p className="text-muted-foreground">
            Features and values that make us different
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
          {[
            {
              icon: Shield,
              title: "Verified Opportunities",
              text: "Every job listing is verified for authenticity",
            },
            {
              icon: Heart,
              title: "Culture Matching",
              text: "Find companies aligned with your values",
            },
            {
              icon: Building2,
              title: "Company Insights",
              text:
                "Access reviews, salaries, and detailed company profiles",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-foreground mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
