import React, { useState, useEffect } from "react";
import { ClubMember, RoutePath } from "../../types";
import { getClubMembers } from "../../utils/memberStorage";
import { motion } from "motion/react";
import { Search, Anchor, Calendar, Award, User, ArrowLeft, ShieldCheck, Mail, BookOpen } from "lucide-react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

interface MembersProps {
  navigate: (path: RoutePath) => void;
  selectedMemberId?: string | null;
}

export default function Members({ navigate, selectedMemberId = null }: MembersProps) {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("Founding Members");

  useEffect(() => {
    setMembers(getClubMembers().filter((m) => m.status === "Active"));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter based on search criteria and type filter
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.membershipType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.membershipCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.bio && m.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.achievements && m.achievements.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    const category = m.category || "General Member";

    if (activeTypeFilter === "Founding Members") {
      return category === "Founding Member";
    } else if (activeTypeFilter === "Executive Officers") {
      return category === "Executive Officer";
    } else {
      // Founding Members and Executive Officers are ROLE-BASED categories, not membership categories.
      // Therefore, they must be excluded from “All” and other membership tabs.
      if (category === "Founding Member" || category === "Executive Officer") {
        return false;
      }

      if (activeTypeFilter === "All") {
        return true;
      } else {
        return m.membershipType === activeTypeFilter;
      }
    }
  });

  const foundingMembers = filteredMembers.filter((m) => m.category === "Founding Member");
  const executiveOfficers = filteredMembers.filter((m) => m.category === "Executive Officer");
  const generalMembers = filteredMembers.filter((m) => !m.category || m.category === "General Member");

  // Extract unique membership types for a clean pill filter
  const membershipTypes = [
    "Founding Members",
    "All",
    "Life Member",
    "Permanent Member",
    "Associate Member",
    "Donor Member",
    "Honorary Member",
    "Executive Officers"
  ];

  // Styles for badges based on membership type
  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "Life Member":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/30";
      case "Permanent Member":
        return "bg-[#1a2744]/10 text-[#1a2744] border border-[#1a2744]/30";
      case "Honorary Member":
        return "bg-purple-500/10 text-purple-600 border border-purple-500/30";
      case "Donor Member":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30";
      default:
        return "bg-slate-500/10 text-slate-600 border border-slate-500/20";
    }
  };

  // --- SUBPAGE: INDIVIDUAL MEMBER PROFILE VIEW ---
  if (selectedMemberId) {
    const member = members.find((m) => m.id === selectedMemberId);

    if (!member) {
      return (
        <div className="bg-[#FAF9F6] py-24 px-4 font-sans text-center">
          <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 shadow-sm rounded-xs">
            <Anchor className="w-12 h-12 text-gold mx-auto mb-4 animate-spin-slow" />
            <h2 className="font-display font-light text-navy text-xl">Registry Under review</h2>
            <p className="text-xs text-slate-500 mt-2 font-light">
              This membership record is empty, pending admin authorization, or has shifted indices.
            </p>
            <button
              onClick={() => navigate("/members")}
              className="mt-6 inline-flex items-center space-x-2 text-xs font-sans font-semibold uppercase tracking-wider text-navy hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Registry</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16 px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb nav */}
          <button
            onClick={() => navigate("/members")}
            className="group flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#1a2744] hover:text-[#c9a84c] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back to Registry</span>
          </button>

          {/* Profile Card Block */}
          <div className="bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
            {/* Elegant accent border at top */}
            <div className="h-2 bg-gradient-to-r from-navy via-navy to-gold" />

            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                
                {/* Circular Profile Avatar */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FAF9F6] shadow-md overflow-hidden bg-slate-100">
                    <img
                      src={member.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300"}
                      className="w-full h-full object-cover transition-all duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
                      }}
                      alt={member.name}
                    />
                  </div>
                  <div className="absolute bottom-1 right-2 bg-[#1a2744] border border-gold p-1.5 rounded-full text-white shadow-sm">
                    <Anchor className="w-4 h-4" />
                  </div>
                </div>

                {/* Profile Key Metadata */}
                <div className="flex-grow space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${getBadgeStyles(member.membershipType)}`}>
                      {member.membershipType}
                    </span>
                    {member.category && member.category !== "General Member" && (
                      <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                        member.category === "Founding Member"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                      }`}>
                        {member.category}
                      </span>
                    )}
                    <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span>Verified Registry</span>
                    </span>
                  </div>

                  <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-navy">
                    {member.name}
                  </h1>

                  <p className="font-mono text-xs text-gold-dark font-semibold tracking-wider select-all uppercase">
                    Code Registry: {member.membershipCode}
                  </p>

                  <div className="flex items-center text-xs text-slate-500 font-light space-x-4 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>Admitted: {new Date(member.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </span>
                    {member.email && (
                      <span className="flex items-center space-x-1">
                        <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="truncate">{member.email}</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Dynamic biographical and professional specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-8 border-t border-slate-100">
                
                {/* Left column: narrative bio */}
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-navy text-sm uppercase tracking-wider flex items-center space-x-2">
                      <User className="w-4 h-4 text-gold shrink-0" />
                      <span>Biographical Narrative</span>
                    </h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
                      {member.bio || "No biographical specifications have been published for this member registry profile yet."}
                    </p>
                  </div>

                  {member.achievements && (
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-navy text-sm uppercase tracking-wider flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gold shrink-0" />
                        <span>Professional Honors & Achievements</span>
                      </h3>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {member.achievements}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right column: auxiliary stats and involvements */}
                <div className="bg-slate-50 p-5 rounded-xs border border-slate-200/60 divide-y divide-slate-200 space-y-4">
                  <div className="pb-3 text-center md:text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Institutional Status</span>
                    <span className="inline-flex items-center space-x-1.5 mt-1 font-sans text-xs font-bold text-[#1a2744]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
                      <span>Official Active Member</span>
                    </span>
                  </div>

                  {member.clubInvolvement && (
                    <div className="pt-3 space-y-2">
                      <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-wider block">Club Activities</span>
                      <p className="text-xs text-slate-600 font-light leading-snug">
                        {member.clubInvolvement}
                      </p>
                    </div>
                  )}

                  <div className="pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-navy uppercase tracking-wider block">Membership Protection</span>
                    <p className="text-[10px] text-slate-400 font-light leading-tight">
                      This is a verified certificate of Cox's Bazar Boat Club Limited credentials, manually handled and audited by the Club Secretariat database under lock.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN VIEW: SEARCHABLE DIRECTORY GRID ---
  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans">
      
      {/* Visual Header Banner */}
      <section className="bg-[#1a2744] text-white py-16 px-4 border-b border-gold relative overflow-hidden text-center">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        {/* Subtle decorative canvas graphic */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-radial-gradient">
          <Anchor className="w-96 h-96 absolute -bottom-16 -right-16 text-white" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Limited
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase leading-none">
            Registered Members Directory
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-slate-350 text-xs sm:text-sm font-light max-w-2xl mx-auto leading-relaxed">
            Authorized membership archive. Explore the respected maritime community, business leaders, 
            and visionaries of the Premier Yachting and Private Club of Cox's Bazar.
          </p>
        </div>
      </section>

      {/* Directory filtering workspace */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-8">
        
        {/* Search layout & input block */}
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 p-3 shadow-md rounded-sm relative focus-within:border-[#c9a84c] transition-all">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search registry by name, membership code, type, keywords..."
              className="w-full bg-transparent text-slate-800 text-sm font-sans focus:outline-none placeholder-slate-400 font-light"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-slate-400 hover:text-navy font-semibold px-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Membership tier filters */}
        <div id="membership-filters" className="flex flex-wrap justify-center gap-2">
          {membershipTypes.map((type) => {
            const isFounding = type === "Founding Members";
            const isActive = activeTypeFilter === type;
            
            let btnClass = "text-[10px] font-sans font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-sm border transition-all duration-300 flex items-center space-x-1.5 ";
            
            if (isFounding) {
              if (isActive) {
                // Gold active styling with beautiful prestige glow
                btnClass += "bg-gradient-to-r from-amber-500/15 to-amber-600/20 border-2 border-amber-500 text-amber-700 shadow-[0_0_12px_rgba(217,119,6,0.35)] scale-105 font-bold";
              } else {
                // Premium non-active styling
                btnClass += "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/30 text-amber-600 hover:border-amber-500 hover:text-amber-700";
              }
            } else {
              if (isActive) {
                // Standard active
                btnClass += "bg-[#1a2744] border-gold text-white shadow-sm";
              } else {
                // Standard inactive
                btnClass += "bg-white border-slate-200 text-slate-600 hover:border-gold hover:text-navy";
              }
            }

            return (
              <button
                id={`filter-${type.toLowerCase().replace(/\s+/g, '-')}`}
                key={type}
                onClick={() => setActiveTypeFilter(type)}
                className={btnClass}
              >
                {isFounding && <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                <span>{type}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic members display count */}
        <div className="flex justify-between items-center text-slate-500 text-[11px] font-mono border-b pb-2">
          <span>Official Registry Archive</span>
          <span>Matched Results: {filteredMembers.length} record{filteredMembers.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Dynamic Members Grid System */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-white border rounded-xs p-8 max-w-md mx-auto shadow-sm">
            <Anchor className="w-12 h-12 text-slate-300 mx-auto animate-pulse-slow mb-3" />
            <p className="font-display font-light text-navy text-base">No Matching Records Found</p>
            <p className="text-xs text-slate-450 mt-1.5 font-light">
              Try adjusting your query. Ensure proper spelling of names or lookup numbers.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* SECTION 1: FOUNDING MEMBERS (PRIORITY SECTION) */}
            {foundingMembers.length > 0 && (
              <div className="bg-[#FAF8F5] border border-gold/25 p-6 md:p-8 rounded-sm shadow-xs space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-gold shrink-0" />
                    <h2 className="font-display font-bold text-navy text-base sm:text-lg md:text-xl tracking-tight uppercase">
                      Founding Members Council
                    </h2>
                  </div>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-gold to-transparent" />
                  <p className="text-slate-500 text-[11px] sm:text-xs font-light max-w-2xl leading-relaxed">
                    Respected founders and initial pillars of Cox's Bazar Boat Club Limited whose foresight, leadership, and contributions established this elite corporate maritime alliance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {foundingMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => navigate(`/profile/${member.id}`)}
                      className="bg-white border-2 border-gold/40 p-5 rounded-sm hover:border-gold hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                    >
                      {/* Subtle premium gold badge */}
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-gold to-amber-500 text-white text-[7px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm shadow-xs tracking-wider">
                        FOUNDING MEMBER
                      </div>

                      <div className="flex items-start space-x-4 min-w-0">
                        <div className="w-16 h-16 rounded-full border-2 border-gold shadow-md shrink-0 overflow-hidden bg-slate-50 group-hover:scale-105 transition-all">
                          <img
                            src={member.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150"}
                            className="w-full h-full object-cover transition-all duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150";
                            }}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <h3 className="font-display font-bold text-navy text-sm sm:text-base tracking-tight truncate leading-tight group-hover:text-gold transition-colors">
                            {member.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-gold/10 text-gold-dark border border-gold/25">
                              {member.membershipType}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-500 block tracking-wider uppercase">
                            {member.membershipCode}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-gold transition-colors mt-auto">
                        <span className="flex items-center space-x-1 font-light">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Joined: {new Date(member.joinDate).getFullYear()}</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-1.5 transition-transform flex items-center space-x-0.5 text-gold-dark">
                          <span>View Profile</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: EXECUTIVE OFFICERS */}
            {executiveOfficers.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-navy shrink-0" />
                    <h2 className="font-display font-bold text-navy text-base sm:text-lg tracking-tight uppercase">
                      Executive Officers & Operations
                    </h2>
                  </div>
                  <div className="w-16 h-0.5 bg-[#1a2744]/40" />
                  <p className="text-slate-500 text-xs font-light max-w-2xl leading-relaxed">
                    Operational administrators and staff leading the daily execution, legal registry, and elite hospitality operations of the Boat Club.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {executiveOfficers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => navigate(`/profile/${member.id}`)}
                      className="bg-white border border-slate-200/80 p-5 rounded-xs hover:border-[#1a2744] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start space-x-4 min-w-0">
                        <div className="w-14 h-14 rounded-full border border-slate-200 shadow-sm shrink-0 overflow-hidden bg-slate-50 group-hover:border-[#1a2744] transition-all">
                          <img
                            src={member.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"}
                            className="w-full h-full object-cover transition-all duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";
                            }}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <h3 className="font-display font-bold text-navy text-sm tracking-tight truncate leading-tight group-hover:text-navy transition-colors">
                            {member.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#1a2744]/5 text-navy border border-navy/15">
                              Executive Officer
                            </span>
                            <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm shrink-0 ${getBadgeStyles(member.membershipType)}`}>
                              {member.membershipType}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-500 block tracking-wider uppercase">
                            {member.membershipCode}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-navy transition-colors mt-auto">
                        <span className="flex items-center space-x-1 font-light">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Joined: {new Date(member.joinDate).getFullYear()}</span>
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider group-hover:translate-x-1.5 transition-transform flex items-center space-x-0.5 text-navy">
                          <span>View Profile</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: GENERAL MEMBERS */}
            {generalMembers.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Anchor className="w-5 h-5 text-slate-500 shrink-0" />
                    <h2 className="font-display font-light text-navy text-base sm:text-lg tracking-tight uppercase">
                      Registered General Members
                    </h2>
                  </div>
                  <div className="w-16 h-0.5 bg-slate-300" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generalMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => navigate(`/profile/${member.id}`)}
                      className="bg-white border border-slate-200/80 p-5 rounded-xs hover:border-[#c9a84c] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start space-x-4 min-w-0">
                        <div className="w-14 h-14 rounded-full border border-slate-200 shadow-sm shrink-0 overflow-hidden bg-slate-50 group-hover:border-[#c9a84c] transition-all">
                          <img
                            src={member.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"}
                            className="w-full h-full object-cover transition-all duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";
                            }}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <h3 className="font-display font-bold text-navy text-sm tracking-tight truncate leading-tight group-hover:text-gold-dark transition-colors">
                            {member.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm shrink-0 ${getBadgeStyles(member.membershipType)}`}>
                              {member.membershipType}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-500 block tracking-wider uppercase">
                            {member.membershipCode}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-[#c9a84c] transition-colors mt-auto">
                        <span className="flex items-center space-x-1 font-light">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Joined: {new Date(member.joinDate).getFullYear()}</span>
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider group-hover:translate-x-1.5 transition-transform flex items-center space-x-0.5">
                          <span>View Profile</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </section>

    </div>
  );
}
