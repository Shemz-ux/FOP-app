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
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ScrollReveal from "../../components/ScrollReveal";
import Timeline from "./components/Timeline";
import { meet_founder_section } from "./about.copy";

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === meet_founder_section.slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? meet_founder_section.slides.length - 1 : prev - 1
    );
  };
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
                We're on a mission to close the gap between student potential and employers expectations, improving hiring outcomes for all.
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
      <section className="bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl mb-4 text-foreground">Our Mission & Our Values</h2>
            <p className="text-muted-foreground">
              Where early career potential meets real-world readiness
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 text-left">
            {[
              {
                icon: Target,
                title: "Accessibility",
                text:
                  "Widen access and opportunity to careers for talent from all backgrounds",
              },
              {
                icon: Users,
                title: "Readiness",
                text:
                "Upskill talent to close the gap between student potential and employers expectations",
              },
              {
                icon: Award,
                title: "Excellence",
                text:
                  "Ensure our employers attract applicant ready talent that converts to successful hires",
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
                Founded in 2022, our platform was founded on the back of a desire to fix what we believed was a disjointed hiring process. We saw that students were motivated but underprepared lacking the skills and understanding to get hired.
              </p>
              <p>
                Meanwhile employers are being flooded with applications, but too many are generic, poorly structured and misaligned to their roles. This has created fatigue and poor conversion in their talent pipelines.
              </p>
              <p>
                We set out to change this by helping employers attract students who are application ready and convert into successful hires. Unlike traditional platforms, we invest heavily in preparing our student network with the skills and insights to submit high quality applications - so employers spend less time filtering and more time hiring.
              </p>
              <p>
                Because early-career talent isn’t lacking ambition - they’re lacking guidance-and when you fix that, everyone wins.
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


      {/* Our Journey Timeline */}
      <section className="bg-secondary/20 py-20 border-y border-border overflow-hidden">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl mb-4 text-foreground">Our Journey</h2>
              <p className="text-muted-foreground">
                Key milestones that shaped our growth and impact
              </p>
            </div>
          </ScrollReveal>
        </div>
        
        {/* Timeline without horizontal padding to maximize width */}
        <Timeline />
      </section>

      {/* Meet the Founder */}
      <section className="bg-background border-border">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal>
            <h2 className="text-3xl mb-20 text-foreground">Meet Our Founder</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left side - Image placeholder */}
            <ScrollReveal>
              <div className="bg-card/50 rounded-[40px] h-full min-h-[400px] lg:min-h-[660px] border border-border overflow-hidden">
                <img
                  src={meet_founder_section.image}
                  alt={meet_founder_section.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>

            {/* Right side - Testimonial card with carousel */}
            <ScrollReveal delay={0.2}>
              <div className="bg-card border border-border rounded-[40px] p-8 lg:p-12 h-full min-h-[400px] lg:min-h-[660px] flex flex-col justify-between">
                {/* Quote icon */}
                <div className="mb-8">
                  <Quote className="w-16 h-16 text-primary/30" strokeWidth={1.5} />
                </div>

                {/* Slide content */}
                <div className="flex-1 flex items-center">
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {meet_founder_section.slides[currentSlide].text}
                  </p>
                </div>

                {/* Footer with name and navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-">
                    <p className="text-primary text-xl lg:text-2xl mb-1">
                      {meet_founder_section.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {meet_founder_section.role}
                    </p>
                  </div>

                  {/* Navigation arrows */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
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

          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
