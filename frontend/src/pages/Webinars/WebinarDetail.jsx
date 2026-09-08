import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, ArrowLeft, ThumbsUp, Eye, Clock, Calendar } from "lucide-react";
import { testWebinars } from "./webinars.copy";
import { webinarDetailCopy } from "./webinarDetail.copy";
import { formatDuration, formatViewCount, formatDate } from "../../utils/webinarHelpers";
import RelatedWebinars from "../../admin/Webinars/components/RelatedWebinars";

export default function WebinarDetail() {
  const { webinarId } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Find the webinar by ID
  const webinar = testWebinars.find(w => w.webinar_id === parseInt(webinarId));

  // Get related webinars (same category, excluding current)
  const relatedWebinars = webinar 
    ? testWebinars
        .filter(w => w.category === webinar.category && w.webinar_id !== webinar.webinar_id && w.is_published)
        .slice(0, 5)
    : [];

  if (!webinar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h2 className="text-2xl text-foreground mb-2">{webinarDetailCopy.notFound.title}</h2>
          <p className="text-muted-foreground mb-6">{webinarDetailCopy.notFound.message}</p>
          <Link 
            to="/webinars" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {webinarDetailCopy.notFound.backButton}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Back link */}
        <div className="text-left mb-6">
          <Link
            to="/webinars"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {webinarDetailCopy.navigation.backLink}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video player */}
            <div className="rounded-2xl overflow-hidden bg-black border border-border shadow-2xl">
              {playing ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${webinar.youtube_video_id}?autoplay=1`}
                    title={webinar.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className="aspect-video relative cursor-pointer group"
                  onClick={() => setPlaying(true)}
                >
                  <img
                    src={webinar.thumbnail_url}
                    alt={webinar.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transform transition-transform duration-200 group-hover:scale-110">
                      <Play className="w-9 h-9 text-white fill-white ml-1" />
                    </div>
                  </div>
                  {/* Duration overlay */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/80 text-white text-sm font-mono flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDuration(webinar.duration)}
                  </div>
                  {/* Click to play hint */}
                  <div className="absolute bottom-4 left-4 text-white/70 text-sm">
                    {webinarDetailCopy.video.clickToPlay}
                  </div>
                </div>
              )}
            </div>

            {/* Title & meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {webinar.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl text-foreground mb-4 leading-tight text-left">
                {webinar.title}
              </h1>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-5">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {formatViewCount(webinar.view_count)} {webinarDetailCopy.stats.views}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDuration(webinar.duration)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(webinar.created_at)}
                </span>
              </div>

              {/* Like button */}
              <div className="flex flex-wrap gap-3 pb-6 border-b border-border">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    liked
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-primary' : ''}`} />
                  {formatViewCount(webinar.like_count + (liked ? 1 : 0))} {webinarDetailCopy.stats.likes}
                </button>
              </div>
            </div>

            {/* About This Webinar */}
            <div>
              <h2 className="text-foreground mb-4 text-left">{webinarDetailCopy.sections.aboutTitle}</h2>
              <div className="text-muted-foreground text-sm leading-relaxed text-left">
                <p>{webinar.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Webinars */}
          <div className="space-y-6">
            <RelatedWebinars
              webinars={relatedWebinars}
              currentWebinarId={webinar.webinar_id}
              copy={webinarDetailCopy.sections.relatedTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
