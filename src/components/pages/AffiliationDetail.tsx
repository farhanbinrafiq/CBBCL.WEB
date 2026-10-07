import React, { useState, useEffect } from "react";
import { getCMSAffiliations } from "../../utils/cmsStorage";
import { RoutePath } from "../../types";
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Compass, 
  CheckCircle, 
  Calendar, 
  FileText, 
  Users,
  Award,
  CircleDot,
  Loader2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

interface AffiliationDetailProps {
  clubId: string;
  navigate: (path: RoutePath) => void;
}

export default function AffiliationDetail({ clubId, navigate }: AffiliationDetailProps) {
  const affiliations = getCMSAffiliations();
  
  // Find current club by slug matching or ID
  const club = affiliations.find(aff => {
    const affSlug = aff.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return affSlug === clubId || aff.id === clubId;
  });

  // Pre-configured rich metadata based on club names to make pages highly authentic and institutional
  const getExtendedData = (name: string) => {
    // Generic fallback for any newly added clubs via CMS admin
    return {
      prestige: `Eminent ${club.partnershipType} network signature.`,
      overview: `${club.name} is a distinguished partner of Cox's Bazar Boat Club Limited, offering our members rich privileges and exceptional amenities. This alliance represents a strong mutual commitment to quality recreation, fellowship, and strategic support.`,
      purpose: `To expand our members' elite social registry and physical comforts beyond our coastal limits into premium reciprocal clubs.`,
      benefits: [
        `Exclusive member entry privileges to ${club.name} physical clubhouses and recreation complexes.`,
        `Access to standard dining halls, sport centers, and networking business lounges.`,
        `Special member rates for private event spaces, conference rooms, or accommodation blocks.`,
        `Priority invitations to competitive tournaments, seasonal banquets, and elite social gatherings.`
      ],
      eligibility: "Open to active verified CBBCL members. Direct identification barcode representation required upon landing.",
      restrictions: "Subject to partner club's private occupancy limits and reservation periods.",
      validity: "Continuous year-round active reciprocal status. Re-validated on a quarterly cycle of verification.",
      conduct: "Members must comport themselves with institutional dignity and comply fully with the host partner's guidelines."
    };
  };

  if (!club) {
    return (
      <div className="bg-bg-primary min-h-screen py-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 max-w-md border border-slate-200 rounded-sm shadow-xl space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="font-display text-xl font-bold text-text-dark">Affiliation Club Not Found</h2>
          <p className="font-sans text-xs text-text-body font-light">
            The requested reciprocal partner signature could not be verified or is temporarily unlisted or draft in the CMS registry.
          </p>
          <button
            onClick={() => navigate("/affiliations")}
            className="px-6 py-2 bg-[#1a2744] text-white hover:bg-gold hover:text-[#1a2744] text-[10px] font-sans font-bold uppercase tracking-widest inline-flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Networks</span>
          </button>
        </div>
      </div>
    );
  }

  const isEz = club.id === "ezbooking" || club.name.toLowerCase() === "ezbooking";

  if (isEz) {
    return (
      <div className="bg-[#fcfbfc] min-h-screen pb-20">
        {/* 🏛 HERO SECTION */}
        <section className="relative bg-[#0d1629] text-white py-20 px-6 border-b border-gold/20 overflow-hidden">
          <div className="absolute inset-0 w-full h-full opacity-10">
            <BackgroundVideo
              src={MASTER_HERO_VIDEO}
            />
          </div>
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-4 overflow-hidden">
            
            <button
              onClick={() => navigate("/affiliations")}
              className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-gold text-[10px] font-sans uppercase tracking-widest transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Reciprocal Networks</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gold/15 text-gold border border-gold/30 text-[9px] font-sans font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                ⭐ Premium Partner
              </span>
              <span className="bg-[#1a2744] text-slate-300 border border-slate-700/50 text-[9px] font-sans font-semibold uppercase tracking-widest px-3 py-1 rounded">
                Official OTA Partner
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4.5xl font-light text-white tracking-tight leading-tight break-words whitespace-normal">
              EZBOOKING OTA Partnership
            </h1>

            <p className="font-sans text-xs sm:text-sm text-slate-300 font-light max-w-3xl leading-relaxed italic">
              " Exclusive travel & booking benefits for Club Members "
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-gold" />
                <span>Status: Connected Gateway</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-slate-400" />
                <a href="https://ezbooking.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold underline">
                  ezbooking.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid Content */}
        <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
          
          {/* Left Column - Detailed Breakdown */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* ✈️ SECTION 1 — OVERVIEW */}
            <div className="bg-white p-8 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <div className="w-1.5 h-6 bg-gold"></div>
                <h2 className="font-display text-sm font-bold text-navy uppercase tracking-wider">
                  1. Overview & Collaboration Context
                </h2>
              </div>
              
              <div className="space-y-3 font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
                <p>
                  <strong>EZBOOKING</strong> is a professional premium Online Travel Agency (OTA) partnered with <strong>Cox’s Bazar Boat Club Limited (CBBCL)</strong> to integrate digital hospitality inventories into our member ledger.
                </p>
                <p>
                  This dynamic alliance simplifies trip planning for our traveling executives, shipping managers, and families, providing full-suite coverage for air travel tickets, seaside hotels, and exclusive holiday cruises inside coastal hubs.
                </p>
              </div>
            </div>

            {/* 💰 SECTION 2 — MEMBER BENEFITS */}
            <div className="bg-white p-8 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <div className="w-1.5 h-6 bg-gold"></div>
                <h2 className="font-display text-sm font-bold text-navy uppercase tracking-wider">
                  2. Exclusive Member Benefits
                </h2>
              </div>
              <p className="font-sans text-xs text-text-body font-light">
                All club members in verified active standing acquire unparalleled access to special discounted tariffs directly applied inside the EZBOOKING network:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-2.5 p-3.5 bg-[#fdfcf7] rounded-sm border border-gold/15">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                  <span className="font-sans text-[11px] text-text-dark leading-snug font-light">
                    <strong>Discounted hotel room rates</strong> - Redeem absolute base-rate advantages on global waterfront hotels and premium beach lodge structures.
                  </span>
                </div>
                <div className="flex items-start space-x-2.5 p-3.5 bg-[#fdfcf7] rounded-sm border border-gold/15">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                  <span className="font-sans text-[11px] text-text-dark leading-snug font-light">
                    <strong>Special member-only travel deals</strong> - Unlock bespoke coastal cruise pathways and family sunset yacht bookings.
                  </span>
                </div>
                <div className="flex items-start space-x-2.5 p-3.5 bg-[#fdfcf7] rounded-sm border border-gold/15">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                  <span className="font-sans text-[11px] text-text-dark leading-snug font-light">
                    <strong>Reduced ticket pricing</strong> - Subsidized rates across commercial airfares, luxury buses, and waterfront cruises.
                  </span>
                </div>
                <div className="flex items-start space-x-2.5 p-3.5 bg-[#fdfcf7] rounded-sm border border-gold/15">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                  <span className="font-sans text-[11px] text-text-dark leading-snug font-light">
                    <strong>Priority peak booking</strong> - Access guaranteed seat allocations and resort rooms even during high-congested seasonal tourism spikes.
                  </span>
                </div>
                <div className="flex items-start space-x-2.5 p-3.5 bg-[#fdfcf7] rounded-sm border border-gold/15 sm:col-span-2">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                  <span className="font-sans text-[11px] text-text-dark leading-snug font-light">
                    <strong>Exclusive promotional offers</strong> - Seasonal flash voucher tokens and complimentary VIP lounge access passes at major transport terminals.
                  </span>
                </div>
              </div>
            </div>

            {/* 🧭 SECTION 3 — HOW TO AVAIL BENEFITS */}
            <div className="bg-white p-8 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <div className="w-1.5 h-6 bg-gold"></div>
                <h2 className="font-display text-sm font-bold text-navy uppercase tracking-wider">
                  3. How To Avail Member Benefits
                </h2>
              </div>
              <p className="font-sans text-xs text-text-head font-medium">
                Please follow this step-by-step workflow to verify your credentials:
              </p>

              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                <div className="relative flex items-start space-x-4">
                  <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-display text-xs font-bold text-navy uppercase">Club member logs into account</h4>
                    <p className="font-sans text-[11px] text-text-body font-light font-sans">
                      Start by signing securely into your official Cox’s Bazar Boat Club member dashboard.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4">
                  <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-display text-xs font-bold text-navy uppercase">Select EZBOOKING partner section</h4>
                    <p className="font-sans text-[11px] text-text-body font-light font-sans">
                      Navigate to the Reciprocal Grid page and select the verified EZBOOKING segment.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4">
                  <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-display text-xs font-bold text-navy uppercase">Verify membership ID</h4>
                    <p className="font-sans text-[11px] text-text-body font-light font-sans">
                      Provide your valid CBBCL identification number on the custom gateway input panel.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4">
                  <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                    4
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-display text-xs font-bold text-navy uppercase">Access discount portal</h4>
                    <p className="font-sans text-[11px] text-text-body font-light font-sans">
                      Enter the live active discount workspace where our partner pricing schedules are unlocked.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4">
                  <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                    5
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-display text-xs font-bold text-navy uppercase">Book services with applied benefits</h4>
                    <p className="font-sans text-[11px] text-text-body font-light font-sans">
                      Finalize the booking safely. Your exclusive 30% CBBCL partner rate is automatically processed at the safe checkout step.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Rules, Terms & CTA */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ⏳ SECTION 4 — AVAILABILITY RULES */}
            <div className="bg-white p-6 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center space-x-1.5 text-navy border-b border-slate-100 pb-2">
                <Award className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider">
                  4. Availability Rules
                </h3>
              </div>
              
              <ul className="text-[11px] font-sans text-slate-600 font-light space-y-3 leading-relaxed pl-1 list-disc list-inside">
                <li>Available only for verified members of Cox’s Bazar Boat Club Limited.</li>
                <li>Bookings are subject strictly to partner and airline seat availability.</li>
                <li>Seasonal peak-season promotions may apply at checkout.</li>
                <li>Discounts may vary by category (e.g., hotel room tier vs ticket class vs dynamic cruise event).</li>
              </ul>
            </div>

            {/* 🔐 SECTION 5 — TERMS */}
            <div className="bg-white p-6 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center space-x-1.5 text-navy border-b border-slate-100 pb-2">
                <FileText className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider">
                  5. Terms & Conditions
                </h3>
              </div>
              
              <ul className="text-[11px] font-sans text-slate-600 font-light space-y-3 leading-relaxed pl-1 list-disc list-inside">
                <li>Dynamic discounts cannot be combined with other ongoing public promotional deals.</li>
                <li>Bookings are subject entirely to EZBOOKING customer policies, refunds, and rescheduling rules.</li>
                <li>Club membership verification code matches are required at Checkout stages.</li>
              </ul>
            </div>

            {/* 📌 SECTION 6 — CALL TO ACTION */}
            <div className="p-6 bg-navy text-center border-2 border-gold rounded-sm space-y-4 relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-[#0d1629] opacity-30"></div>
              
              <div className="relative z-10 space-y-3">
                <h4 className="font-display text-xs font-extrabold uppercase text-gold tracking-widest animate-pulse">
                  Exclusive Member Desk
                </h4>
                <p className="font-sans text-[10.5px] text-slate-300 font-light leading-relaxed">
                  Enter the verified CBBCL-EZBOOKING alliance travel desk now to check flight availability or reserve beachfront suites.
                </p>
                
                <div className="pt-2">
                  <button
                    onClick={() => navigate("/ezbooking-portal")}
                    className="w-full py-3 bg-gold text-navy hover:bg-white hover:text-navy text-[10.5px] font-sans font-extrabold uppercase tracking-widest transition-all duration-200 cursor-pointer"
                  >
                    👉 Access EZBOOKING Member Portal
                  </button>
                </div>
              </div>
            </div>

          </div>

        </section>
      </div>
    );
  }

  const extended = getExtendedData(club.name);

  return (
    <div className="bg-[#fcfbfc] min-h-screen pb-20">
      {/* 🏛 HERO SECTION */}
      <section className="relative bg-[#0d1629] text-white py-16 px-6 border-b border-gold/20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-10">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-4 overflow-hidden">
          
          <button
            onClick={() => navigate("/affiliations")}
            className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-gold text-[10px] font-sans uppercase tracking-widest transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Reciprocal Networks</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-gold/15 text-gold border border-gold/30 text-[9px] font-sans font-extrabold uppercase tracking-widest px-3 py-1 rounded">
              🏛 Affiliation Partner
            </span>
            <span className="bg-[#1a2744] text-slate-300 border border-slate-700/50 text-[9px] font-sans font-semibold uppercase tracking-widest px-3 py-1 rounded">
              {club.partnershipType}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4.5xl font-light text-white tracking-tight leading-tight break-words whitespace-normal">
            {club.name}
          </h1>

          <p className="font-sans text-xs sm:text-sm text-slate-300 font-light max-w-3xl leading-relaxed italic">
            " {extended.prestige} "
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-gold" />
              <span>Status: Active Signature</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-slate-400" />
              <a href={club.website} target="_blank" rel="noopener noreferrer" className="hover:text-gold underline">
                {club.website.replace("https://", "")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
        
        {/* Left Column - Detailed Breakdown */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 📌 SECTION 1 — OVERVIEW */}
          <div className="bg-white p-8 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <div className="w-1.5 h-6 bg-gold"></div>
              <h2 className="font-display text-lg font-extrabold text-navy uppercase tracking-wider">
                1. Overview & Alliance Context
              </h2>
            </div>
            
            <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
              {extended.overview}
            </p>

            <div className="p-4 bg-slate-50 border-l-2 border-gold space-y-2">
              <h4 className="font-sans text-[11px] font-bold text-navy uppercase tracking-wider">
                Mutual Purpose of Affiliation:
              </h4>
              <p className="font-sans text-[11px] text-slate-600 font-light leading-relaxed">
                {extended.purpose}
              </p>
            </div>
          </div>

          {/* 📌 SECTION 2 — AVAILABLE BENEFITS */}
          <div className="bg-white p-8 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <div className="w-1.5 h-6 bg-gold"></div>
              <h2 className="font-display text-lg font-extrabold text-navy uppercase tracking-wider">
                2. Available Reciprocal Benefits
              </h2>
            </div>
            <p className="font-sans text-xs text-text-body font-light">
              Cox's Bazar Boat Club Limited members hold absolute priority access to the following recreational, sports, and dining spaces inside the host institution:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {extended.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3.5 bg-slate-50 rounded-sm border border-slate-150">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                  <span className="font-sans text-[11px] text-text-dark leading-snug font-light">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 📌 SECTION 3 — HOW TO AVAIL */}
          <div className="bg-white p-8 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <div className="w-1.5 h-6 bg-gold"></div>
              <h2 className="font-display text-lg font-extrabold text-navy uppercase tracking-wider">
                3. Step-by-Step Access Protocol
              </h2>
            </div>
            <p className="font-sans text-xs text-text-head font-medium">
              In order to guarantee clearance through host security checkpoints, visiting members must follow this formalized CBBCL protocol:
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
              
              <div className="relative flex items-start space-x-4">
                <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xs font-bold text-navy uppercase">Member Status Verification</h4>
                  <p className="font-sans text-[11px] text-text-body font-light">
                    The member must verify that their CBBCL account holds active, verified, non-suspended administrative standing.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start space-x-4">
                <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xs font-bold text-navy uppercase">Submit Intention Request</h4>
                  <p className="font-sans text-[11px] text-text-body font-light">
                    Apply through the Boat Club online portal or file a physical reciprocal request form with the registry deck.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start space-x-4">
                <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xs font-bold text-navy uppercase">Partner Endorsement Dispatch</h4>
                  <p className="font-sans text-[11px] text-text-body font-light">
                    Once verified, CBBCL Club administration releases an official signed Introduction Card to the partner club.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start space-x-4">
                <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xs font-bold text-navy uppercase">Credentials Issued</h4>
                  <p className="font-sans text-[11px] text-text-body font-light">
                    Digital confirmation or an encrypted QR-enabled travel pass is generated and delivered to the member.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start space-x-4">
                <div className="absolute left-[-21px] rounded-full bg-navy text-gold border border-gold font-mono text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                  5
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xs font-bold text-navy uppercase">Access & Privileges Granted</h4>
                  <p className="font-sans text-[11px] text-text-body font-light">
                    Present the issued Introduction credentials at the host reception desk to clear security gates and collect host visitor card tokens.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column - Rules, Validity & CTA */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 📌 SECTION 4 — ELIGIBILITY RULES */}
          <div className="bg-white p-6 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center space-x-1.5 text-navy border-b border-slate-100 pb-2">
              <Award className="w-5 h-5 text-gold" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider">
                4. Eligibility Rules
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="text-[11px] font-sans">
                <span className="font-bold text-navy block uppercase mb-1">Eligible Tiers:</span>
                <span className="text-text-body font-light leading-relaxed">
                  {extended.eligibility}
                </span>
              </div>

              <div className="bg-amber-50/50 p-2.5 border border-amber-200 rounded text-[10px] space-y-1.5 font-sans">
                <div className="flex items-center space-x-1 font-bold text-amber-800 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Credentials Only</span>
                </div>
                <p className="text-amber-700 font-light leading-relaxed">
                  Under strict reciprocal safety codes, only members with verified active standing are allowed entry. No un-verified or guest-only admissions allowed.
                </p>
              </div>

              <div className="text-[11px] font-sans border-t border-slate-100 pt-2">
                <span className="font-bold text-navy block uppercase mb-1">Restrictions:</span>
                <span className="text-text-body font-light font-sans text-[10px] leading-relaxed">
                  {extended.restrictions}
                </span>
              </div>
            </div>
          </div>

          {/* 📌 SECTION 5 — DURATION & VALIDITY */}
          <div className="bg-white p-6 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center space-x-1.5 text-navy border-b border-slate-100 pb-2">
              <Clock className="w-5 h-5 text-gold" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider">
                5. Duration & Validity
              </h3>
            </div>
            
            <div className="space-y-1 font-sans text-[11px]">
              <span className="text-navy font-bold uppercase block">Access Duration:</span>
              <p className="text-[#3b4154] font-light leading-relaxed">
                {extended.validity}
              </p>
            </div>
          </div>

          {/* 📌 SECTION 6 — TERMS & CONDITIONS */}
          <div className="bg-white p-6 border border-slate-200/80 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center space-x-1.5 text-navy border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 text-gold" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider">
                6. Terms & Regulations
              </h3>
            </div>
            
            <ul className="space-y-2.5 font-sans text-[10.5px] font-light text-slate-600 leading-relaxed list-disc list-inside">
              <li>Guest policy is determined strictly by the host club's local executive bylaws.</li>
              <li>Members must maintain exemplary code of conduct representing Cox's Bazar Boat Club.</li>
              <li>{extended.conduct}</li>
              <li>Failure to comply with Host regulations is subject to immediate CBBCL disciplinary board suspension.</li>
            </ul>
          </div>

          {/* 📌 SECTION 7 — APPLICATION CTA (IMPORTANT) */}
          <div className="p-6 bg-[#0d1629] border border-gold/40 text-center rounded-sm space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600')] bg-cover opacity-5"></div>
            
            <div className="relative z-10 space-y-2">
              <h4 className="font-display text-xs font-extrabold uppercase text-gold tracking-widest">
                Avail Reciprocal Access
              </h4>
              <p className="font-sans text-[10.5px] text-slate-300 font-light leading-relaxed">
                Traveling soon? File a formal request to release a verified digital introduction card directly with the Host.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => navigate(`/affiliation-request?club=${encodeURIComponent(club.name)}`)}
                  className="w-full py-3 bg-gold text-navy hover:bg-white hover:text-navy text-[10px] font-sans font-extrabold uppercase tracking-widest rounded-none transition-all duration-200 shadow-md cursor-pointer"
                >
                  Request Affiliation Access
                </button>
              </div>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
