import {
  Target,
  Users,
  TrendingUp,
  Award,
  Building2,
  Heart,
  Zap,
  Shield,
  CircleCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../../components/ScrollReveal";

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

        <div className="container mx-auto px-6 py-32 lg:py-38 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Trusted by thousands of young talent worldwide</span>
              </div>

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                Connecting Talent with{" "}
                <span className="text-primary">Opportunity</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                We're on a mission to help young talent unlock their career 
                path and help employers attract and hire exceptional and diverse talent at scale.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img
                src="https://res.cloudinary.com/dpfkhymbc/image/upload/v1769033694/WhatsApp_Image_2026-01-19_at_00.55.56_gjoy4v.jpg"
                alt="Team collaboration"
                className="w-full h-full object-cover aspect-[6/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {[
            ["10,000+", "Students Impacted"],
            ["250+", "Success Stories"],
            ["20,000+", "Student Reach"],
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
      </section>

      {/* Mission & Values */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Our Mission & Our Values</h2>
            <p className="text-lg text-muted-foreground">
              Ensuring that talent no matter their backgrounds have the tools to kickstart their career.
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                icon: Target,
                title: "Accessibility",
                text:
                  "Widen access to careers for talent from all backgrounds",
              },
              {
                icon: Users,
                title: "Community",
                text:
                "A space for all talent to be supported and grow together",
              },
              {
                icon: Zap,
                title: "Empowerment",
                text:
                  "Support and guide talent to kickstart your career journey",
              },
              {
                icon: Award,
                title: "Excellence",
                text:
                  "Ensure the best outcomes for talent and employers",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <ScrollReveal key={title} delay={index * 0.1}>
                <div
                  className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all"
                >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div>
            <h2 className="text-3xl mb-6 text-foreground">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2022, our platform was founded on the back of a desire to fix what we believed was a disjointed hiring process. We've seen how fractured the early career scene has been for students and employers, where employers struggle to convert high quality underrepresented talent while young talent struggle to launch their careers
              </p>
              <p>
                We set out to change this by working with both sides, helping employers create more diverse and engaging talent pipelines while also educating the next generation of talent into the workforce.
              </p>
              <p>
                Today we are proud to say we’ve helped and guided thousands of students and young people across the globe kickstart and progress within their career.
              </p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border shadow-xl">
            <img
                src="https://res.cloudinary.com/dpfkhymbc/image/upload/c_auto,h_1300/c_crop,g_north_west,h_1050,w_957/WhatsApp_Image_2026-01-19_at_00.55.57_1_mcurfk.jpg"
                alt="University Auditorium"
                className="w-full h-auto"
              />
          </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Timeline */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Our Journey</h2>
            <p className="text-muted-foreground">
              Key milestones that shaped our growth and impact
            </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollReveal delay={0.1}>
                <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-500 group">
                  <div className="text-2xl mb-2 text-primary font-semibold group-hover:scale-105 transition-transform duration-500">2022</div>
                  <p className="text-muted-foreground">Founded our platform</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-500 group">
                  <div className="text-2xl mb-2 text-primary font-semibold group-hover:scale-105 transition-transform duration-500">2023</div>
                  <p className="text-muted-foreground">Secured our first employer partner and started our university partnership network</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-500 group">
                  <div className="text-2xl mb-2 text-primary font-semibold group-hover:scale-105 transition-transform duration-500">2024</div>
                  <p className="text-muted-foreground">3,000 young people supported and 150+ success stories</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-500 group">
                  <div className="text-2xl mb-2 text-primary font-semibold group-hover:scale-105 transition-transform duration-500">2025</div>
                  <p className="text-muted-foreground">Partnered with global employers and supported 5,000+ students</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-12 lg:p-16 border border-primary/20 text-center">
          <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">
            Unlock talent. Create opportunity.
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
              Join Our Community
            </Link>
            <Link
              to="/contact" // TODO: What should this link to?
              className="px-8 py-3 border border-border rounded-xl text-center hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              Partner With Us
            </Link>
          </div>

          {/* <div className="flex gap-6 mt-8 flex-wrap text-sm text-muted-foreground justify-center">
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
          </div> */}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
