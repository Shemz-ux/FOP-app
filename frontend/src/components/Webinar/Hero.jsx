import { Video } from "lucide-react";

export default function Hero({ copy }) {
  return (
    <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
      <div className="container mx-auto px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon and Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Video className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-foreground font-regular">
              {copy.title}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}


