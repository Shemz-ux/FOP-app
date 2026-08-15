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
import { 
  hero_section, 
  company_section, 
  benefits_section, 
  stats_section, 
  student_success_section, 
  journey_section, 
  cta_section 
} from './student.copy';

const iconMap = {
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  Target,
  MessageSquare,
  Rocket
};

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
                <span>{hero_section.badge.text}</span>
              </div>

              <h1 className="text-4xl lg:text-6xl mb-6 text-foreground">
                {hero_section.title} <br/>
                <span className="text-primary">{hero_section.titleHighlight}</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {hero_section.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={hero_section.cta.primary.link}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
                >
                  {hero_section.cta.primary.text}
                </Link>
                <Link
                  to={hero_section.cta.secondary.link}
                  className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center"
                >
                  {hero_section.cta.secondary.text}
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 flex-wrap">
                {hero_section.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
                <img
                  src={hero_section.image}
                  alt="Student studying"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating stat card */}
              {/* <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl border border-border shadow-lg">
                <div className="text-3xl text-primary mb-1">89%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-medium mb-4 text-foreground">{company_section.title}</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-16 items-center justify-items-center max-w-6xl mx-auto">
            {company_section.companies.map((logo, index) => (
              <img 
                key={index} 
                src={logo} 
                alt={`Company ${index + 1}`} 
                className="h-12 w-auto transition-opacity hover:opacity-70" 
                style={index === 3 ? {height: '68px'} : undefined}
              />
            ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-6 py-20 text-left">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">{benefits_section.title}</h2>
            <p className="text-muted-foreground">
              {benefits_section.description}
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits_section.benefits.map((benefit, index) => {
              const Icon = iconMap[benefit.icon];
              return (
                <div key={index} className="bg-card p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats_section.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl mb-2 text-primary">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Student Success Stories */}
      <section className="bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl mb-4 text-foreground">{student_success_section.title}</h2>
          <p className="text-muted-foreground">
            {student_success_section.description}
          </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          {student_success_section.testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 fill-primary" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-foreground text-sm">{testimonial.name}</div>
                  <div className="text-muted-foreground text-xs">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">{journey_section.title}</h2>
            <p className="text-muted-foreground">
              {journey_section.description}
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
            {journey_section.steps.map((step, index) => (
              <div key={index} className={index < 3 ? "relative" : ""}>
                <div className="bg-card p-6 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/20 border-y">
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
              {cta_section.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {cta_section.description}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={cta_section.cta.primary.link}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                {cta_section.cta.primary.text}
              </Link>
              <Link
                to={cta_section.cta.secondary.link}
                className="px-8 py-3 border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                {cta_section.cta.secondary.text}
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