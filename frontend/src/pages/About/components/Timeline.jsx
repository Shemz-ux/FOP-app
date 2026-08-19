import { timelineData } from "./timeline.copy";

export default function Timeline() {
  return (
    <div className="relative w-full">
      {/* Desktop Timeline - Horizontal */}
      <div className="hidden lg:block w-full px-6">
        <div className="relative" style={{ height: '550px' }}>
          
          {/* Horizontal Line - Spans full width */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-border/20 via-border to-border/20" />
          
          {/* Timeline Items */}
          <div className="absolute inset-0 flex justify-between items-center px-20">
            {timelineData.milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="relative flex-1 flex flex-col items-center group cursor-pointer max-w-xs"
              >
                {/* Description - Alternating Above/Below the line */}
                {index % 2 === 0 ? (
                  // Below the line (2023, 2025)
                  <div className="absolute top-[calc(50%+70px)] left-1/2 -translate-x-1/2 w-full px-2">
                    <p className="text-left text-sm leading-relaxed text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-500">
                      {milestone.description}
                    </p>
                  </div>
                ) : (
                  // Above the line (2024, 2026)
                  <div className="absolute bottom-[calc(50%+70px)] left-1/2 -translate-x-1/2 w-full px-2">
                    <p className="text-left text-sm leading-relaxed text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-500">
                      {milestone.description}
                    </p>
                  </div>
                )}

                {/* Timeline Dot - ON the line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  {/* Outer glow ring on hover */}
                  <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/20 blur-md scale-150 transition-all duration-500" />
                  
                  {/* Main dot - muted white */}
                  <div className="relative w-5 h-5 rounded-full border-2 bg-foreground/80 border-foreground/80 transition-all duration-500 ease-out group-hover:bg-primary group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/40" />
                </div>

                {/* Year Label - muted white */}
                <div className={`absolute left-1/2 -translate-x-1/2 ${
                  index % 2 === 0 ? 'top-[calc(50%+30px)]' : 'bottom-[calc(50%+30px)]'
                }`}>
                  <p className="text-base font-semibold whitespace-nowrap text-foreground/80 transition-all duration-500 group-hover:text-primary">
                    {milestone.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Timeline - Vertical */}
      <div className="lg:hidden w-full px-6 max-w-2xl mx-auto">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-border/20 via-border to-border/20" />
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="relative pl-16 group cursor-pointer"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[13px] top-0 z-10">
                  {/* Outer glow ring on hover */}
                  <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/20 blur-md scale-150 transition-all duration-500" />
                  
                  {/* Main dot */}
                  <div className="relative w-5 h-5 rounded-full border-2 bg-foreground/80 border-foreground/80 transition-all duration-500 ease-out group-hover:bg-primary group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/40" />
                </div>

                {/* Year */}
                <p className="text-left text-base font-semibold text-foreground/80 mb-3 transition-all duration-500 group-hover:text-primary">
                  {milestone.year}
                </p>

                {/* Description */}
                <p className="text-left text-sm leading-relaxed text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-500">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
