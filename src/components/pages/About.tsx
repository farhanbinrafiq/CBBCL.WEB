import { useState, useEffect } from "react";
import { Compass, BookOpen, Target, Award, Anchor, ArrowRight, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { getPageContent } from "../../utils/cmsStorage";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

interface AboutProps {
  initialSection?: string;
}

export default function About({ initialSection = "overview" }: AboutProps) {
  const [activeTab, setActiveTab] = useState(initialSection);
  const [cms, setCms] = useState(getPageContent());

  useEffect(() => {
    setCms(getPageContent());
    if (initialSection) {
      setActiveTab(initialSection);
      const element = document.getElementById(initialSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [initialSection]);

  const tabs = [
    { id: "overview", label: "Club Introduction", icon: Compass },
    { id: "history", label: "History & Story", icon: BookOpen },
    { id: "vision", label: "Vision & Mission", icon: Target },
    { id: "objectives", label: "Key Objectives", icon: Award }
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Editorial Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 overflow-hidden">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extralight text-white tracking-tight break-words whitespace-normal leading-tight">
            About Our <span className="font-serif italic text-gold">Story & Core Heritage</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">About the Club</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Sidebar Tabs */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar Menu Panel */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-xs shadow-sm space-y-4">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] block border-b border-slate-100 pb-2">
                In This Section
              </span>
              <nav className="flex flex-col space-y-1">
                {tabs.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xs text-xs font-sans font-medium transition-all ${
                        isActive
                           ? "bg-navy text-gold"
                           : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isActive ? "text-gold" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Side Callout */}
            <div className="bg-navy text-white p-6 rounded-xs border border-gold/20 flex flex-col justify-between h-48">
              <div className="space-y-2">
                <Anchor className="w-5 h-5 text-gold" />
                <h4 className="font-display text-base text-gold-light">Need Assistance?</h4>
                <p className="font-sans text-[10px] text-slate-300 leading-relaxed font-light">
                  Our Registrar answers corporate membership nominations from Mon to Sat.
                </p>
              </div>
              <span className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold block">
                📞 +880 1711-223344
              </span>
            </div>
          </aside>

          {/* Dynamic Content Panel area */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* 1. CLUB INTRODUCTION */}
            <article id="overview" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Section 01
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  Cox’s Bazar Boat Club Limited — <span className="font-serif italic font-normal text-gold">The Introduction</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                <p>
                  Cox’s Bazar Boat Club Limited (CBBCL) has been established in 2026 as a premiere, non-profit private social club, 
                  incorporated under <strong>The Companies Act, 1994, Bangladesh</strong>. Designed as an elite sanctuary for 
                  companionship and maritime exploration, the Club offers its exclusive members a social harbor styled to compare 
                  favorably with historic clubs across South Asia.
                </p>
                <div className="text-slate-700 bg-slate-50/50 p-4 border border-slate-100 rounded-sm">
                  {cms.about.introductionText || cms.home.welcomeText}
                </div>
                
                <div className="my-6 p-4 bg-slate-50 border-l-[3px] border-gold flex items-start space-x-3.5">
                  <ShieldAlert className="w-5 h-5 text-gold-dark shrink-0" />
                  <p className="font-sans text-xs italic text-slate-600 leading-relaxed">
                    Note: To safeguard our high standards of safety and camaraderie, club membership is limited strictly and requires a rigorous 
                    nomination scrutiny process verified by our standing executive committees.
                  </p>
                </div>

                <p>
                  Built on a foundation of professional leadership, the club guarantees absolute compliance with financial audits and corporate transparency. 
                  This sustainable structure ensures CBBCL maintains its reputation as a premiere center of sportsmanship, environmental stewardship, and 
                  refined social life.
                </p>
              </div>
            </article>

            {/* 2. HISTORY & STORY */}
            <article id="history" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Section 02
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  Our Founding Story & <span className="font-serif italic font-normal text-gold">The Blueprints of 2026</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                <p>
                  The foundational conception of Cox’s Bazar Boat Club Limited was initiated in 2026 by our visionary Founding Board. 
                  They identified a significant gap: while Bangladesh is historically rich in maritime networks, its longest 
                  natural shoreline lacks a dedicated private club of elite stature.
                </p>
                <p className="font-sans text-xs sm:text-[13px] text-slate-700 leading-relaxed italic whitespace-pre-line">
                  {cms.about.storyText || cms.about.storyParagraphs?.join("\n\n")}
                </p>
                <p>
                  By June 2026, the club successfully completed its official registration, and structured its first reciprocal relationships. This was accompanied 
                  by a series of corporate social responsibility campaigns, cementing CBBCL's place as a cornerstone of coastal preservation and refined social 
                  culture.
                </p>
              </div>
            </article>

            {/* 3. VISION & MISSION */}
            <article id="vision" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Section 03
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  Vision statement & <span className="font-serif italic font-normal text-gold">Our Organizational Mission</span>
                </h2>
              </div>

              <div className="space-y-6">
                {/* Vision card */}
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                  <h4 className="font-display text-base text-text-dark font-bold uppercase tracking-wider">Our Core Vision</h4>
                  <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
                    "{cms.about.visionVision || cms.about.visionText}"
                  </p>
                </div>

                {/* Mission card */}
                <div className="p-6 bg-navy text-slate-200 border border-gold/25 rounded-sm space-y-2">
                  <h4 className="font-display text-base text-gold uppercase tracking-wider">Our Dynamic Mission</h4>
                  <p className="font-sans text-xs font-light tracking-wide leading-relaxed max-w-prose">
                    {cms.about.visionMission || cms.about.missionText}
                  </p>
                  <ul className="space-y-3.5 font-sans text-xs font-light tracking-wide leading-relaxed pt-2">
                    <li className="flex items-start space-x-2.5">
                      <span className="text-gold font-bold">1.</span>
                      <span><strong>Nautical Leisure Innovation:</strong> Build and operate international-standard marine facilities, slipways, and sailing equipment for yachts and sports boats.</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="text-gold font-bold">2.</span>
                      <span><strong>Exclusive Camaraderie:</strong> Curate deep and secure corporate, diplomatic, and executive social spaces and premium dining services.</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="text-gold font-bold">3.</span>
                      <span><strong>Ecological Integrity:</strong> Execute continuous beach preservation cleanup campaigns and lead environment-friendly coastal landscaping of our sites.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            {/* 4. KEY OBJECTIVES */}
            <article id="objectives" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Section 04
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  Key Strategic Objectives of <span className="font-serif italic font-normal text-gold">The Corporate Charter</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                <p>
                  As an officially registered company limited by guarantee, Cox’s Bazar Boat Club Limited operates strictly under specified 
                  objectives written in our Articles of Association:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    "Construct, execute, and operate fine recreational hubs, snooker chambers, tennis courts, and fitness centers.",
                    "Arranging reciprocal club affiliations with national elite clubs and global yachting networks to support touring members.",
                    "Organize yachting regattas, water skiing festivals, sailing cruises, and competitive billiards championships.",
                    "Initiate continuous environmental marine conservation research campaigns and clean beachfront patrols.",
                    "Host high-profile diplomatic assemblies, corporate annual roundtables, and coastal business forums.",
                    "Sustain transparent audit mechanisms by premier accounting firms to ensure immaculate financial health."
                  ].map((obj, idx) => (
                    <div key={idx} className="p-4 bg-bg-secondary rounded-xs border border-slate-150 flex items-start space-x-3">
                      <div className="bg-navy p-1 text-gold rounded-full text-[9px] font-bold shrink-0 w-5 h-5 flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="font-sans text-[11px] font-light leading-relaxed text-slate-700">
                        {obj}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>
    </div>
  );
}
