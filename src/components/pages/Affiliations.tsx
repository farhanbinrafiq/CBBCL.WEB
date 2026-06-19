import React, { useState } from "react";
import { getCMSAffiliations } from "../../utils/cmsStorage";
import { Anchor, Compass, Globe, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { RoutePath } from "../../types";
import { MASTER_HERO_VIDEO } from "../../data";

interface AffiliationsProps {
  navigate: (path: RoutePath) => void;
}

export default function Affiliations({ navigate }: AffiliationsProps) {
  const [affiliations] = useState(getCMSAffiliations());
  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extralight text-white tracking-tight">
            Reciprocal Bonds & <span className="font-serif italic text-gold">Affiliated Clubs</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span className="cursor-pointer hover:text-gold" onClick={() => navigate("/")}>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Reciprocal Networks</span>
          </div>
        </div>
      </section>

      {/* Intro Context */}
      <section className="py-12 bg-white border-b border-slate-100 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#c9a84c] font-semibold">
            The Reciprocal Grid
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-text-dark tracking-tight">
            Privileged Access Beyond Cox's Bazar Shorelines
          </h2>
          <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
            In keeping with our vision to deliver exceptional value to our elite members, Cox's Bazar Boat Club Limited 
            maintains direct reciprocal ties with leading private recreational entities. CBBCL members can enjoy 
            exclusive access to sports lounges, private pools, tennis courts, and guest lodges while travelling in Dhaka, 
            Chittagong, and other regional hubs.
          </p>
        </div>
      </section>

      {/* Reciprocal Clubs Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="font-sans text-[10px] text-gold uppercase tracking-[0.2em] font-semibold block">
            The Partner Ledger
          </span>
          <h3 className="font-display text-xl md:text-3xl font-light text-text-dark">
            Our Active Reciprocal <span className="font-serif italic text-gold font-normal">Signatures & Partners</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {affiliations.map((aff) => {
            const isEz = aff.id === "ezbooking" || aff.name.toLowerCase() === "ezbooking";
            return (
              <div
                key={aff.id}
                className={`bg-white p-6 rounded-sm flex flex-col justify-between hover:shadow-xl hover:border-gold transition-all duration-300 group relative ${
                  isEz 
                    ? "border-2 border-gold md:scale-[1.02] shadow-md shadow-gold/10 min-h-[410px] z-10" 
                    : "border border-slate-200/80 min-h-[350px]"
                }`}
              >
                {isEz && (
                  <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white font-sans text-[7.5px] font-extrabold uppercase tracking-widest px-3 py-1 rounded shadow-md border border-amber-600 inline-block whitespace-nowrap z-20">
                    ⭐ TOP OTA PARTNER
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                      isEz ? "bg-amber-100 text-amber-700 border border-amber-300/30" : "bg-[#1a2744] text-gold"
                    }`}>
                      <Anchor className="w-5 h-5" />
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <span className="bg-slate-100 text-slate-700 text-[8px] font-sans uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
                        {aff.partnershipType}
                      </span>
                      {isEz && (
                        <span className="bg-yellow-50 text-amber-800 text-[7.5px] font-sans font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-yellow-200">
                          🎫 Member Discounts Available
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-display text-base font-bold text-text-dark leading-tight group-hover:text-gold transition-colors">
                    {aff.name}
                  </h4>

                  <p className="font-sans text-[11px] text-text-body font-light leading-relaxed">
                    {aff.description}
                  </p>

                  {isEz && (
                    <div className="space-y-1.5 border-t border-dashed border-slate-200 pt-3 mt-1">
                      <p className="text-[9px] font-bold text-navy uppercase tracking-wider">Exclusive OTA Perks:</p>
                      <ul className="text-[10px] font-sans font-light text-slate-600 space-y-1 pl-1">
                        <li className="flex items-center space-x-1.5">
                          <span className="text-gold font-bold text-[11px]">✓</span>
                          <span>Discounted hotel bookings</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span className="text-gold font-bold text-[11px]">✓</span>
                          <span>Reduced flight ticket fares</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span className="text-gold font-bold text-[11px]">✓</span>
                          <span>Special event booking offers</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span className="text-gold font-bold text-[11px]">✓</span>
                          <span>Exclusive member-only travel deals</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-[10px] text-green-700 font-sans font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Privileges Valid</span>
                    </span>
                    <a
                      href={aff.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 font-sans text-[9px] font-semibold tracking-widest text-[#1a2744] hover:text-gold uppercase"
                    >
                      <span>Official Site</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      const slug = aff.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      navigate(`/affiliations/${slug}.html`);
                    }}
                    className={`w-full py-2.5 text-[9px] font-sans font-bold uppercase tracking-widest transition-all duration-205 flex items-center justify-center space-x-1.5 border cursor-pointer ${
                      isEz
                        ? "bg-gold text-navy border-gold hover:bg-navy hover:text-white"
                        : "bg-[#1a2744] text-white border-[#1a2744] hover:bg-gold hover:text-[#1a2744] hover:border-gold hover:bg-white"
                    }`}
                  >
                    <span>Read Full Details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reciprocal protocol guidance block */}
      <section className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto p-8 bg-slate-50 border border-slate-200 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <h4 className="font-display text-lg text-text-dark font-semibold">Are You Travelling in Reciprocal Hubs?</h4>
            <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
              Before visiting our affiliate locations, you must request an official CBBCL Introduction Card from the Club Registrar. This guarantees smooth clearance at affiliate security rails.
            </p>
          </div>
          <div className="md:col-span-4 text-center md:text-right">
            <a
              href="mailto:registry@cbbcl.org"
              className="py-3 px-5 bg-[#1a2744] text-white hover:bg-gold hover:text-navy text-[10px] font-sans font-semibold uppercase tracking-widest inline-block transition-colors"
            >
              Email Registrar Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
