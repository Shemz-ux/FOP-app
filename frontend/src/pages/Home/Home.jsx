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
import {
  hero_section,
  company_section,
  kickstart_section,
  employers_section,
  testimonials_section,
  path_section,
  cta_section,
} from './home.copy';

const iconMap = {
  Briefcase,
  Calendar,
  Award,
  Target,
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  Megaphone,
};

const colorClasses = {
  blue: {
    iconWrap: "from-blue-500/20 to-blue-600/5 text-blue-500 border-blue-500/20",
    title: "group-hover:text-blue-500",
    blob: "bg-blue-500/10 group-hover:bg-blue-500/20",
  },
  purple: {
    iconWrap: "from-purple-500/20 to-purple-600/5 text-purple-500 border-purple-500/20",
    title: "group-hover:text-purple-500",
    blob: "bg-purple-500/10 group-hover:bg-purple-500/20",
  },
  orange: {
    iconWrap: "from-orange-500/20 to-orange-600/5 text-orange-500 border-orange-500/20",
    title: "group-hover:text-orange-500",
    blob: "bg-orange-500/10 group-hover:bg-orange-500/20",
  },
};

const FopLogo2 = () => (
  <img 
    src="https://res.cloudinary.com/dpfkhymbc/image/upload/v1769274499/FOP_logo_hazkv0.svg" 
    alt="FOP Logo" 
    className="h-36 w-58 object-contain opacity-50"
  />
)

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
              {hero_section.title}<br />
              <span className="text-primary">{hero_section.titleHighlight}</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {hero_section.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={hero_section.cta.primary.link}
                className="px-8 py-3 border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                {(() => {
                  const Icon = iconMap[hero_section.cta.primary.icon];
                  return <Icon className="w-5 h-5" />;
                })()}
                {hero_section.cta.primary.text}
              </Link>
              <Link
                to={hero_section.cta.secondary.link}
                className="px-8 py-3 border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                {(() => {
                  const Icon = iconMap[hero_section.cta.secondary.icon];
                  return <Icon className="w-5 h-5" />;
                })()}
                {hero_section.cta.secondary.text}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Company logo marquee */}
      <section className="bg-secondary/20 border-y pb-15">
        <ScrollReveal>
          <div className="container mx-auto px-6 pt-12">
            <h2 className="text-medium text-muted-foreground mb-8 max-w-xl mx-auto">{company_section.title}</h2>
          </div>
          <Marquee
            items={company_section.logos.map((logo) => (
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
              <h2 className="text-3xl mb-4 text-foreground">{kickstart_section.title}</h2>
              <p className="text-muted-foreground">
                {kickstart_section.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {kickstart_section.features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <ScrollReveal key={feature.title} delay={(index + 1) * 0.1}>
                  <Link to={feature.link}>
                    <div className="bg-card p-6 rounded-2xl border border-border group hover:border-primary/50 transition-all">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How we Help Employers section */}
      <section className="py-24 border-y bg-secondary/20 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2"></div>
        </div>
          
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl mb-4 text-foreground">{employers_section.title}</h2>
              <p className="text-muted-foreground">
                {employers_section.description}
              </p>
            </div>
            </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {employers_section.cards.map((card, index) => {
              const Icon = iconMap[card.icon];
              const colors = colorClasses[card.color];
              return (
                <ScrollReveal key={card.title} delay={(index + 1) * 0.1}>
                  <div className="group relative bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <div className={`w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${colors.iconWrap}`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className={`mb-4 text-foreground transition-colors ${colors.title}`}>
                      {card.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                      {card.description}
                    </p>

                    {/* Decorative gradient blob */}
                    <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-2xl transition-colors ${colors.blob}`}></div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-border border-b">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl mb-4 text-foreground">{testimonials_section.title}</h2>
              <p className="text-muted-foreground">
                {testimonials_section.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {testimonials_section.testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
              <div
                key={index}
                className={`p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col relative overflow-hidden min-h-[575px] ${
                  index % 2 === 0 ? 'bg-card' : 'bg-secondary/20'
                }`}
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                
                <div className="flex flex-col items-center text-center mb-4">
                  {/* Profile Image */}
                  <div className="w-48 h-48 rounded-full mb-6 overflow-hidden ring-2 ring-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
                    {testimonial.image ? (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-4xl">
                        {testimonial.avatar}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-foreground font-semibold text-lg mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary font-semibold">
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
              <h2 className="text-3xl mb-4 text-foreground">{path_section.title}</h2>
              <p className="text-muted-foreground">
                {path_section.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {path_section.steps.map((step) => (
              <ScrollReveal key={step.number} delay={step.number * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                    {step.number}
                  </div>
                  <h3 className="text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/20">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-12 lg:p-16 border border-primary/20 text-center">
            <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">
              {cta_section.title}
            </h2>

            <p className="text-muted-foreground text-lg mb-8">
              {cta_section.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={cta_section.cta.primary.link}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-center hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {cta_section.cta.primary.text}
              </Link>
              <Link
                to={cta_section.cta.secondary.link}
                className="px-8 py-3 border border-border rounded-xl text-center hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {cta_section.cta.secondary.text}
              </Link>
            </div>

            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
