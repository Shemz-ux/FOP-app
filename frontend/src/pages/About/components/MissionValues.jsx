import ScrollReveal from "../../../components/ScrollReveal";
import { missionValuesSection } from "./missionValues.copy";

export default function MissionValues() {
  return (
    <section className="bg-secondary/20 border-y border-border">
      <div className="container mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl mb-4 text-foreground">
              {missionValuesSection.heading}
            </h2>
            <p className="text-muted-foreground">
              {missionValuesSection.subheading}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-14 gap-x-10 lg:gap-x-16 text-left">
          {missionValuesSection.values.map(({ title, text, image, icon: Icon }, index) => (
            <ScrollReveal key={title} delay={index * 0.1}>
              <div className="group h-full">
                {image ? (
                  <div className="aspect-video rounded-xl overflow-hidden mb-7">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-secondary/60 border border-border/50 mb-7" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  {Icon && (
                    <Icon className="w-5 h-5 text-primary shrink-0" />
                  )}
                  <h3 className="text-foreground">{title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
