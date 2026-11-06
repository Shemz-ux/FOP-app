import { Video } from "lucide-react";
import SearchBar from "../../../components/SearchBar/SearchBar";

export default function Hero({ copy, searchPlaceholder, onSearch, onQueryChange }) {
  return (
    <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-10 h-10 text-primary" />
            <h1 className="text-4xl text-foreground text-left">
              {copy.title}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 text-left">
            {copy.subtitle}
          </p>

          <SearchBar
            queryPlaceholder={searchPlaceholder}
            showLocation={false}
            onSearch={onSearch}
            onQueryChange={onQueryChange}
          />
        </div>
      </div>
    </section>
  );
}
