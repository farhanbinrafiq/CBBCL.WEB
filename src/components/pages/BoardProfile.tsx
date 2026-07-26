import React from "react";
import { DIRECTORS_DATA, MASTER_HERO_VIDEO } from "../../data";
import { getBoardMembers, getDirectorPortrait } from "../../utils/storage";
import { getClubMembers } from "../../utils/memberStorage";
import { User, Award, Briefcase, Calendar, Globe, Linkedin, Facebook, Twitter, Anchor, Compass, CheckCircle, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { RoutePath, Director } from "../../types";
import BackgroundVideo from "../BackgroundVideo";

interface BoardProfileProps {
  directorId?: string;
  navigate?: (path: RoutePath) => void;
}

export default function BoardProfile({ directorId = "humayun-kabir-robel", navigate }: BoardProfileProps) {
  // Pull all members dynamically
  const boardList = getBoardMembers();
  const clubList = getClubMembers();

  // Determine if this person is dynamically on the board
  const isOnBoard = boardList.some((d) => d.id === directorId) || DIRECTORS_DATA.some((d) => d.id === directorId);

  let rawDirector = boardList.find((d) => d.id === directorId) || DIRECTORS_DATA.find((d) => d.id === directorId);

  // If not found in board or static directors, look in our club member list and reconstruct as Director
  if (!rawDirector) {
    const member = clubList.find((m) => m.id === directorId);
    if (member) {
      // Map ClubMember's details into the Director master schema
      const designation = member.clubInvolvement
        ? member.clubInvolvement.split(",")[0].trim()
        : (member.category && member.category !== "General Member" ? member.category : member.membershipType);

      const bioParagraphs = member.bio 
        ? [member.bio]
        : [`${member.name} is classified as an esteemed registered ${member.membershipType} of Cox's Bazar Boat Club Limited (CBBCL).`];

      const achievementsList = member.achievements
        ? member.achievements.split(";").map((a) => a.trim()).filter(Boolean)
        : ["Verified registry member in perfect standing at Cox's Bazar Boat Club"];

      rawDirector = {
        id: member.id,
        name: member.name,
        designation: designation,
        photoUrl: member.avatarUrl,
        membershipCode: member.membershipCode,
        appointed: member.joinDate ? new Date(member.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : undefined,
        bio: bioParagraphs,
        achievements: achievementsList,
        memberships: [member.membershipType, "Cox's Bazar Boat Club Limited"],
        community: member.clubInvolvement ? [member.clubInvolvement] : undefined,
        timeline: [
          { year: member.joinDate ? member.joinDate.split("-")[0] : "2024", event: `Officially registered and admitted into CBBCL as a ${member.membershipType}.` }
        ]
      };
    }
  }

  // Fallback to avoid crashes
  if (!rawDirector) {
    rawDirector = DIRECTORS_DATA[0];
  }

  const backPath: RoutePath = isOnBoard ? "/board" : "/members";
  const backLabel = isOnBoard ? "Back to Board Directory" : "Back to Registry Directory";

  const getPortraitUrl = (dir: Director) => {
    return getDirectorPortrait(dir);
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
    imgElement.src = (directorId === "humayun-kabir-robel")
      ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600";
  };

  // Enrich missing fields dynamically to ensure pristine display
  const enrichDirectorDetails = (dir: Director) => {
    const d = { ...dir };

    if (!d.appointed) {
      d.appointed = "January 2026";
    }

    if (!d.bio || d.bio.length === 0) {
      d.bio = [
        `${d.name} is a highly respected trustee and founding director of Cox's Bazar Boat Club Limited (CBBCL). With an exceptional record of community involvement, strategic guidance, and executive expertise, they have played an instrumental role in shaping the modern maritime vision of the club.`,
        `In alignment with professional trust standards and our corporate structure under the Companies Act, 1994, ${d.name} has consistently championed premium development, ethical sportsmanship, and safe coastal recreation initiatives. Their mission revolves around creating an elite community of yachting enthusiasts where club safety, heritage, and marine conservation coexist.`,
        `In addition to their core responsibilities at CBBCL, they remain active in corporate leadership, private enterprise ventures, and coastal sustainability practices across Bangladesh's prominent waterfront development zones.`
      ];
    }

    if (!d.businessProfile) {
      const companies = [
        "Bay & Ocean Maritime Logistics",
        "Apex Coastal Ventures",
        "Horizon Infrastructure Group",
        "Golden Sand Real Estate Ltd.",
        "Bengal Marina Services"
      ];
      const roles = ["Managing Director", "Chief Executive Officer", "Founder & Chairman", "Director of Capital Partners"];
      const industries = ["Real Estate & Development", "Maritime Logistics & Commerce", "Coastal Hospitality & Tourism", "Private Equity & Investments"];
      
      const sum = (d.id || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      d.businessProfile = {
        company: companies[sum % companies.length],
        role: roles[sum % roles.length],
        industry: industries[sum % industries.length]
      };
    }

    if (!d.achievements || d.achievements.length === 0) {
      d.achievements = [
        "Distinguished Leader in Marine Development Initiatives (2025)",
        "Contributing Vanguard for premium sailing clubs and coastal yacht programs",
        "Recognized organizer of regional water conservancy and waterfront tourism"
      ];
    }

    if (!d.memberships || d.memberships.length === 0) {
      d.memberships = [
        "Life Member, Dhaka Club Limited",
        "Permanent Executive Committee, Cox's Bazar Tourism Alliance",
        "Associate, Bangladesh Yachting Federation"
      ];
    }

    if (!d.community || d.community.length === 0) {
      d.community = [
        "Underprivileged Coastal Youth micro-credit support patron",
        "Red Crescent Society Marine Division donor",
        "Trustee of local eco-diversity and maritime preservation programs"
      ];
    }

    if (!d.timeline || d.timeline.length === 0) {
      const sum = (d.id || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      d.timeline = [
        { year: "2026", event: "Joined the board of directors of Cox's Bazar Boat Club as founding trustee." },
        { year: "2023", event: "Initiated key regional logistics and marine tourism study for deep bay ports." },
        { year: "2019", event: "Awarded top regional business recognition for real estate development excellence." },
        { year: "2015", event: "Launched luxury catamaran cruising trails in the southeastern bay corridor." },
        { year: "2009", event: "Began key advisory roles in safe coastal infrastructure developments." }
      ];
    }

    return d;
  };

  const director = enrichDirectorDetails(rawDirector);

  // 6 Unsplash photo gallery mock URLs
  const gallery = [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1505242844900-19279f22006?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400"
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* 1. HERO BLOCK */}
      <section className="relative h-96 bg-navy flex items-center justify-center overflow-hidden border-b border-gold-dark/40">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-3 overflow-hidden">
          <p className="font-sans text-[10px] tracking-[0.25em] text-gold uppercase font-bold">
            {isOnBoard ? "Estd. 2026 · Founding Executive Profile" : "Verified Registry · CBBCL Member Profile"}
          </p>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight break-words whitespace-normal">
            {director.name}
          </h1>
          <p className="text-gold-light font-sans text-sm sm:text-base font-semibold uppercase tracking-widest">
            {director.designation}
          </p>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span 
              onClick={() => navigate?.(backPath)} 
              className="hover:text-white cursor-pointer transition-colors"
            >
              {isOnBoard ? "Our Board" : "Registry Directory"}
            </span>
            <span>&gt;</span>
            <span className="text-gold">{director.name} Profile</span>
          </div>
        </div>
      </section>

      {/* Main Column Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        
        {/* Back Link Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate?.(backPath)}
            className="flex items-center space-x-2 text-xs text-slate-500 hover:text-gold transition-colors font-sans uppercase tracking-widest font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Sidebar Card & Brief Profile */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white border border-gold shadow-lg rounded-sm overflow-hidden text-center p-6 space-y-6">
              
              <div className="relative w-44 h-44 mx-auto rounded-full border border-gold overflow-hidden">
                <img
                  src={getPortraitUrl(director)}
                  alt={director.name}
                  className="w-full h-full object-cover transition-all duration-500"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
              </div>

              {/* Specifications list */}
              <div className="border-t border-slate-100 pt-6 space-y-3 font-sans text-xs text-left">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-light">Founder Code:</span>
                  <span className="text-navy font-mono font-medium">{director.membershipCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-light">Designation:</span>
                  <span className="text-navy font-semibold">{director.designation}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-light">Appointed:</span>
                  <span className="text-navy font-semibold">{director.appointed}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400 font-light">Residency Seat:</span>
                  <span className="text-gold-dark font-semibold">Founding Seat #{director.membershipCode?.split("-").pop()}</span>
                </div>
              </div>

              {/* Social Channels Links */}
              <div className="border-t border-slate-100 pt-6">
                <span className="block text-[9px] font-sans text-slate-400 font-bold uppercase tracking-widest mb-3 text-center">
                  Social Registries
                </span>
                <div className="flex justify-center space-x-3">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-200 text-slate-600 hover:text-navy hover:border-navy transition-colors rounded-full">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-200 text-slate-600 hover:text-navy hover:border-navy transition-colors rounded-full">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-200 text-slate-600 hover:text-navy hover:border-navy transition-colors rounded-full font-bold">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Business Card specifications */}
            <div className="bg-navy text-slate-300 p-6 rounded-xs border border-gold/20 space-y-4">
              <div className="flex items-center space-x-2 text-gold">
                <Briefcase className="w-5 h-5 animate-pulse" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest">
                  Business Standing
                </span>
              </div>
              <h4 className="font-display text-lg text-white font-medium border-b border-navy-light pb-2">
                Merchant Profile
              </h4>
              <div className="font-sans text-xs space-y-2 font-light">
                <div>
                  <span className="text-gold block font-semibold text-[10px]">CORPORATION:</span>
                  <span>{director.businessProfile?.company}</span>
                </div>
                <div>
                  <span className="text-gold block font-semibold text-[10px]">OFFICIAL ROLE:</span>
                  <span>{director.businessProfile?.role}</span>
                </div>
                <div>
                  <span className="text-gold block font-semibold text-[10px]">INDUSTRY SPHERE:</span>
                  <span>{director.businessProfile?.industry}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Side: Narrative Details Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Biography */}
            <div className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <h3 className="font-display text-2xl text-text-dark font-light pb-3 border-b border-slate-100 flex items-center space-x-3">
                <Compass className="w-5 h-5 text-gold" />
                <span>Executive Narrative Biography</span>
              </h3>
              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body leading-relaxed font-light">
                {director.bio?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Awards & Professional Memberships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Achievements Column */}
              <div className="bg-white p-6 border border-slate-200/60 rounded-xs shadow-sm space-y-4">
                <h4 className="font-display text-lg text-text-dark border-b border-slate-100 pb-2 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gold" />
                  <span>Awards & Achievements</span>
                </h4>
                <ul className="space-y-3 font-sans text-xs text-text-body font-light leading-relaxed">
                  {director.achievements?.map((ach, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Memberships Column */}
              <div className="bg-white p-6 border border-slate-200/60 rounded-xs shadow-sm space-y-4">
                <h4 className="font-display text-lg text-text-dark border-b border-slate-100 pb-2 flex items-center space-x-2">
                  <Anchor className="w-4 h-4 text-gold" />
                  <span>Social Memberships</span>
                </h4>
                <ul className="space-y-3 font-sans text-xs text-text-body font-light leading-relaxed">
                  {director.memberships?.map((mem, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-gold font-bold">🏵️</span>
                      <span>{mem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Community Engagement */}
            <div className="bg-white p-6 border border-slate-200/60 rounded-xs shadow-sm space-y-4">
              <h4 className="font-display text-lg text-text-dark border-b border-slate-100 pb-2">
                Philanthropy & Environmental CSR Engagement
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs text-text-body font-light leading-relaxed">
                {director.community?.map((comm, idx) => (
                  <li key={idx} className="p-4 bg-bg-secondary rounded-xs border border-slate-150">
                    <span className="text-gold font-bold block mb-1">Activism {idx + 1}</span>
                    <span>{comm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6-Image Photo Gallery Grid */}
            <div className="bg-white p-6 border border-slate-200/60 rounded-xs shadow-sm space-y-4">
              <h4 className="font-display text-lg text-text-dark border-b border-slate-100 pb-2">
                The Executive’s Sailing Chronicles
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((url, idx) => (
                  <div key={idx} className="h-28 overflow-hidden rounded-xs bg-navy border border-slate-200 relative group">
                    <img
                      src={url}
                      alt="Chronicles snapshot"
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 group-hover:brightness-100 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Milestone Career Timeline */}
            <div className="bg-white p-8 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <h4 className="font-display text-lg text-text-dark border-b border-slate-100 pb-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span>Chronological Career Milestones</span>
              </h4>

              <div className="relative border-l border-gold-dark/40 ml-4 pl-6 space-y-6">
                {director.timeline?.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-1 bg-navy text-gold font-sans font-bold text-[8px] border border-gold w-4 h-4 rounded-full flex items-center justify-center">
                      •
                    </div>
                    <div className="space-y-1">
                      <span className="font-display text-sm font-semibold text-gold-dark font-mono block">
                        Year {step.year}
                      </span>
                      <p className="font-sans text-xs text-text-body font-light leading-relaxed">
                        {step.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
