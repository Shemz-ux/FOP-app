import { Play, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDuration, formatViewCount } from "../../utils/webinarHelpers";

export default function Hero({ totalWebinars, totalViews, featuredWebinar, copy }) {
  return (
    <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[740px]">
          
          {/* Left — text */}
          <div className="flex flex-col justify-center py-16 lg:py-20 lg:pr-16 border-b lg:border-b-0 lg:border-r border-border">
            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-10 h-10 text-primary" />
              <h1 className="text-4xl text-foreground">
                {copy.title}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground mb-15 text-left">
              {copy.subtitle}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-left">
                <p className="text-2xl text-foreground">{totalWebinars}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{copy.statsLabels.sessions}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-left">
                <p className="text-2xl text-foreground">{totalViews}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{copy.statsLabels.views}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-left">
                <p className="text-2xl text-foreground">{copy.statsLabels.free}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{copy.statsLabels.freeSubtext}</p>
              </div>
            </div>
          </div>

          {/* Right — featured video preview */}
          {featuredWebinar && (
            <div className="hidden lg:flex items-center justify-center py-10 pl-16">
              <Link
                to={`/webinars/${featuredWebinar.webinar_id}`}
                className="group relative w-full max-w-md rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 shadow-xl"
              >
                <div className="relative aspect-video">
                  <img
                    src={featuredWebinar.thumbnail_url}
                    alt={featuredWebinar.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:bg-white/20 transition-all duration-200">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-mono">
                    {formatDuration(featuredWebinar.duration)}
                  </div>
                </div>
                
                {/* Caption bar */}
                <div className="bg-[#111827] px-4 py-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 mt-0.5">
                    {featuredWebinar.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-snug truncate">
                      {featuredWebinar.title}
                    </p>
                    <p className="text-white/50 text-xs mt-0.5">
                      {formatViewCount(featuredWebinar.view_count)} views
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


