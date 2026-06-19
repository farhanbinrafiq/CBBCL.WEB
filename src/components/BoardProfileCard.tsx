import React from "react";
import { Director, RoutePath } from "../types";
import { getDirectorPortrait } from "../utils/storage";
import { ArrowRight } from "lucide-react";

interface BoardProfileCardProps {
  key?: React.Key | string | number;
  director: Director;
  navigate: (path: any) => void;
  variant?: "main" | "compact" | "president";
}

export default function BoardProfileCard({ director, navigate, variant = "main" }: BoardProfileCardProps) {
  const isCompact = variant === "compact";
  const isPresident = variant === "president";

  const handleCardClick = () => {
    navigate(`/profile/${director.id}.html` as RoutePath);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = e.currentTarget;
    const currentSrc = imgElement.src;
    if (currentSrc.includes("raw.githubusercontent.com")) {
      const match = currentSrc.match(/https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/);
      if (match) {
        const [, user, repo, version, filePath] = match;
        imgElement.src = `https://cdn.jsdelivr.net/gh/${user}/${repo}@${version}/${filePath}`;
        return;
      }
    }
    // Fallback if jsDelivr fails or is what failed:
    imgElement.src = isPresident 
      ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600";
  };

  if (isCompact) {
    return (
      <div
        onClick={handleCardClick}
        className="bg-white p-5 border border-slate-200/80 hover:border-gold/50 rounded-sm w-full max-w-[240px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group flex flex-col justify-between min-h-[260px]"
      >
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-full border border-gold/30 p-[2px] bg-white overflow-hidden mx-auto shadow-xs">
            <img
              src={getDirectorPortrait(director)}
              alt={director.name}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={handleImageError}
            />
          </div>
          <h5 className="font-display text-sm font-bold text-slate-800 tracking-tight group-hover:text-gold transition-colors">
            {director.name}
          </h5>
          <p className="font-sans text-[8px] text-text-gold uppercase tracking-[0.15em] font-semibold">
            {director.designation}
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center space-x-1 text-gold-dark group-hover:text-gold transition-colors">
          <span className="font-sans text-[8px] uppercase tracking-wider font-semibold">View Full Profile</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    );
  }

  if (isPresident) {
    return (
      <div
        onClick={handleCardClick}
        className="inline-block bg-white p-7 sm:p-8 border border-slate-200/80 hover:border-gold/60 rounded-sm w-[320px] sm:w-[360px] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-center group"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-gold/45 p-[3.5px] bg-white overflow-hidden mx-auto shadow-sm">
          <img
            src={getDirectorPortrait(director)}
            alt={director.name}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        </div>
        <h4 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 tracking-tight group-hover:text-gold transition-colors mt-4">
          {director.name}
        </h4>
        <p className="font-sans text-[10px] sm:text-[11px] text-text-gold uppercase tracking-[0.15em] font-semibold mt-1.5">
          {director.designation}
        </p>
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-gold-dark group-hover:text-gold transition-colors">
          <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-wider font-semibold">View Full Profile</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="inline-block bg-white p-6 border border-slate-200/80 hover:border-gold/60 rounded-sm w-[290px] sm:w-[320px] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-center group"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-2 border-gold/45 p-[3px] bg-white overflow-hidden mx-auto shadow-sm">
        <img
          src={getDirectorPortrait(director)}
          alt={director.name}
          className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
      </div>
      <h4 className="font-display text-base sm:text-lg font-bold text-slate-800 tracking-tight group-hover:text-gold transition-colors mt-3">
        {director.name}
      </h4>
      <p className="font-sans text-[9px] sm:text-[10px] text-text-gold uppercase tracking-[0.15em] font-semibold mt-1">
        {director.designation}
      </p>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-gold-dark group-hover:text-gold transition-colors">
        <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-wider font-semibold">View Full Profile</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
